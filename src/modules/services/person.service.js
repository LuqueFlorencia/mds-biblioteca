import crypto from 'crypto';
import PersonSchema from '../entities/person.entity.js';
import DebtSchema from '../entities/debt.entity.js';
import { ConflictError, BadRequestError } from '../../core/errors/AppError.js';
import { Messages } from '../../shared/messages.js';
import { getData } from '../../shared/utils/helpers.js';

function generateNumber(dni, role) {
	const rand = crypto.randomInt(1000, 9999);
	if (role === 1) return `S-${dni}-${rand}`;
	else if (role === 2) return `B-${dni}-${rand}`;
	else throw new BadRequestError("El role proporcionado no es válido.");
};

export async function registerMember({ name, lastname, dni } = {}) {
    const repo = await getData(PersonSchema);
    const exists = await repo.findOne({ where: { dni } });
    const member_id = generateNumber(dni, 1);
    if (exists) throw new ConflictError(Messages.ERROR.DUPLICATE('socio registrado con el dni proporcionado'));

    const member = repo.create({ name, lastname, role: 1, dni, member_id });
    return repo.save(member);
};

export async function registerLibrarian({ name, lastname, dni } = {}) {
    const repo = await getData(PersonSchema);
    const exists = await repo.findOne({ where: { dni } });
    const enrollment_librarian = generateNumber(dni, 2);
    if (exists) throw new ConflictError(Messages.ERROR.DUPLICATE('bibliotecario registrado con el dni proporcionado'));

    const librarian = repo.create({ name, lastname, role: 2, dni, enrollment_librarian });
    return repo.save(librarian);
};

// Buscar deudas de un socio
export async function listDebtsByMember(memberId, { onlyUnpaid = true } = {}) {
    const debtRepo = await getData(DebtSchema);
    await getMemberOrThrow(memberId);

    const where = { member: { id: Number(memberId) } };
    if (onlyUnpaid) where.paid = false;

    return debtRepo.find({
        where,
        relations: ['loan', 'loan.copy', 'loan.copy.book']
    });
};

