import { getDataSource } from '../../config/database.js';
import PersonSchema from '../entities/person.entity.js';
import CopySchema from '../entities/copy.entity.js';
import LoanSchema from '../entities/loan.entity.js';
import DebtSchema from '../entities/debt.entity.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../core/errors/AppError.js';
import { getData, getMemberOrThrow, getLibrarianOrThrow, getCopyOrThrow } from '../../shared/utils/helpers.js';
import { Messages } from '../../shared/messages.js';

// Registrar un Prestamo
export async function loanBook({ memberId, librarianId, copyId, dateFrom, dateTo } = {}) {
    if (!dateFrom || !dateTo) throw new BadRequestError('dateFrom y dateTo son obligatorios.');
    const ds = await getDataSource();

    try {
        const result = await ds.transaction(async (manager) => {
        const personRepo = manager.getRepository('Person');
        const copyRepo   = manager.getRepository('Copy');
        const loanRepo   = manager.getRepository('Loan');

        // Buscar entidades dentro de la MISMA transacción
        const member = await personRepo.findOne({ where: { id: Number(memberId) } });
        if (!member) throw new NotFoundError('Socio');
        if (member.role_id !== 1) throw new BadRequestError('La persona no es socio.');

        const librarian = await personRepo.findOne({ where: { id: Number(librarianId) } });
        if (!librarian) throw new NotFoundError('Bibliotecario');
        if (librarian.role_id !== 2) throw new BadRequestError('La persona no es bibliotecario.');

        const copy = await copyRepo.findOne({ where: { id: Number(copyId) }, relations: ['book'] });
        if (!copy) throw new NotFoundError('Ejemplar (Copia)');

        // Verificar préstamo activo de esta copia
        const activeExists = await loanRepo
            .createQueryBuilder('l')
            .select('1')
            .where('l.copy_id = :copyId', { copyId: Number(copy.id) })
            .andWhere('l.returned_at IS NULL')
            .getExists();

        if (activeExists) throw new ConflictError('El ejemplar ya está prestado.');

        // Crear préstamo (todas las entidades pertenecen al mismo manager)
        const loan = loanRepo.create({
            date_from: new Date(dateFrom),
            date_to:   new Date(dateTo),
            returned_at: null,
            member,
            librarian,
            copy
        });
        await loanRepo.save(loan);

        // Devolver con relaciones (todavía dentro de la tx está ok)
        return await loanRepo.findOne({
            where: { id: loan.id },
            relations: ['member', 'librarian', 'copy', 'copy.book']
        });
        });

        return result;
    } catch (e) {
        // Si el índice único parcial saltó, normalizamos el mensaje
        if (String(e.message || '').includes('ux_loan_copy_active')) {
            throw new ConflictError('El ejemplar ya fue prestado por otra operación.');
        }
        throw e;
    }
}

// Registrar una Devolucion
// damaged: boolean, si está dañado se crea deuda por amount (si no lo pasan, default 0 no crea deuda)
export async function returnBook({ loanId, damaged = false, damageAmount = 0 } = {}) {
    const ds = await getDataSource();

    const id = Number(loanId);
    if (!id) throw new BadRequestError('loanId inválido');

    try {
        const result = await ds.transaction(async (manager) => {
            const loanRepo = manager.getRepository('Loan');
            const debtRepo = manager.getRepository('Debt');

            // Traemos el préstamo con lo necesario para devolver payload
            const loan = await loanRepo.findOne({
                where: { id },
                relations: ['member', 'copy', 'copy.book'],
            });
            if (!loan) throw new NotFoundError('Préstamo no encontrado');
            if (loan.returned_at) throw new ConflictError('El préstamo ya fue devuelto.');

            // marcar devolución
            loan.returned_at = new Date();
            await loanRepo.save(loan);

            // crear deuda si corresponde
            let createdDebt = null;
            if (damaged === true && Number(damageAmount) > 0) {
                const debt = debtRepo.create({
                    amount: Number(damageAmount),
                    paid: false,
                    member: { id: loan.member.id },
                    loan:   { id: loan.id },
                });
                const saved = await debtRepo.save(debt);

                createdDebt = await debtRepo.findOne({
                    where: { id: saved.id },
                    relations: ['member', 'loan'],
                });
            }

            const freshLoan = await loanRepo.findOne({
                where: { id: loan.id },
                relations: ['member', 'copy', 'copy.book'],
            });

            return { loan: freshLoan, createdDebt };
        });

        return result;
    } catch (e) {
        throw e;
    }
}

// Pagar deuda de socio
export async function payDebtId(debtId) {
    const debtRepo = await getData(DebtSchema);
    const debt = await debtRepo.findOne({ where: { id: debtId } });
    if (!debt) throw new NotFoundError(Messages.ERROR.NOT_FOUND('Deuda'));
    if (debt.paid) return debt;
    debt.paid = true;
    return debtRepo.save(debt);
};

export async function listActiveLoans({ memberId, librarianId, limit = 50, offset = 0 } = {}) {
    const loanRepo = await getData(LoanSchema);

    const qb = loanRepo
        .createQueryBuilder('l')
        .leftJoinAndSelect('l.member', 'm')
        .leftJoinAndSelect('l.librarian', 'lib')
        .leftJoinAndSelect('l.copy', 'c')
        .leftJoinAndSelect('c.book', 'b')
        .where('l.returned_at IS NULL');

    if (memberId) qb.andWhere('m.id = :memberId', { memberId: Number(memberId) });
    if (librarianId) qb.andWhere('lib.id = :librarianId', { librarianId: Number(librarianId) });

    qb.orderBy('l.date_from', 'DESC')
        .take(limit)
        .skip(offset);

    return qb.getMany();
};