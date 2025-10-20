import LoanSchema from '../entities/loan.entity.js';
import DebtSchema from '../entities/debt.entity.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../core/errors/AppError.js';
import { getData, getMemberOrThrow, getLibrarianOrThrow, getCopyOrThrow } from '../../shared/utils/helpers.js';
import { Messages } from '../../shared/messages.js';

// Registrar un Prestamo
export async function loanBook({ memberId, librarianId, copyId, dateFrom, dateTo } = {}) {
    const ds = await getDataSource();
    const member = await getMemberOrThrow(memberId);
    const librarian = await getLibrarianOrThrow(librarianId);
    const copy = await getCopyOrThrow(copyId);

    if (!dateFrom || !dateTo) throw new BadRequestError('dateFrom y dateTo son obligatorios.');

    // Transacción + bloqueo optimista (vía índice único parcial en BD)
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
        const loanRepo = qr.manager.getRepository(LoanSchema);

        // Verificar que no haya préstamo activo de esta copia
        const active = await loanRepo.findOne({
            where: { copy: { id: copy.id }, returned_at: null }
        });
        if (active) throw new ConflictError('El ejemplar ya está prestado.');

        const loan = loanRepo.create({
            date_from: new Date(dateFrom),
            date_to: new Date(dateTo),
            returned_at: null,
            member, librarian, copy
        });

        await loanRepo.save(loan);
        await qr.commitTransaction();

        return await ds.getRepository(LoanSchema).findOne({
            where: { id: loan.id },
            relations: ['member', 'librarian', 'copy', 'copy.book']
        });
    } catch (e) {
        await qr.rollbackTransaction();
        if (String(e.message || '').includes('ux_loan_copy_active')) {
            throw new ConflictError('El ejemplar ya fue prestado por otra operación.');
        }
        throw e;
    } finally {
        await qr.release();
    }
};

// Registrar una Devolucion
// damaged: boolean, si está dañado se crea deuda por amount (si no lo pasan, default 0 no crea deuda)
export async function returnBook({ loanId, damaged, damageAmount } = {}) {
    const ds = await getDataSource();

    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
        const loanRepo = qr.manager.getRepository(LoanSchema);
        const debtRepo = qr.manager.getRepository(DebtSchema);
            
        const loan = await loanRepo.findOne({
            where: { id: loanId },
            relations: ['member', 'copy', 'copy.book']
        });

        if (!loan) throw new NotFoundError(Messages.ERROR.NOT_FOUND('Prestamo'));
        if (loan.returned_at) throw new ConflictError('El préstamo ya fue devuelto.');

        loan.returned_at = new Date();
        await loanRepo.save(loan);

        let debt = null;
        if (damaged && damageAmount > 0) {
            debt = debtRepo.create({
                amount: damageAmount,
                paid: false,
                member: loan.member,
                loan: loan
            });
            await debtRepo.save(debt);
        }

        await qr.commitTransaction();

        const freshLoan = await ds.getRepository(LoanSchema).findOne({
            where: { id: loan.id },
            relations: ['member', 'copy', 'copy.book']
        });

        const freshDebt = debt
        ? await ds.getRepository(DebtSchema).findOne({ where: { id: debt.id }, relations: ['member', 'loan'] })
        : null;

        return { loan: freshLoan, createdDebt: freshDebt };
    } catch (e) {
        await qr.rollbackTransaction();
        throw e;
    } finally {
        await qr.release();
    }
};

// Pagar deuda de socio
export async function payDebtId(debtId) {
    const debtRepo = await getData(DebtSchema);
    const debt = await debtRepo.findOne({ where: { id: debtId } });
    if (!debt) throw new NotFoundError(Messages.ERROR.NOT_FOUND('Deuda'));
    if (debt.paid) return debt;
    debt.paid = true;
    return debtRepo.save(debt);
};