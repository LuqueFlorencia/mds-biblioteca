import PersonSchema from '../entities/person.entity.js';
import DebtSchema from '../entities/debt.entity.js';
import { ConflictError } from '../../core/errors/AppError.js';
import { Messages } from '../../shared/messages.js';
import { getData, getMemberOrThrow } from '../../shared/utils/helpers.js';
import { PersonFactory } from '../factories/person.factory.js';

export async function registerMember({ name, lastname, dni } = {}) {
    const repo = await getData(PersonSchema);
    const exists = await repo.findOne({ where: { dni } });
    if (exists) throw new ConflictError(Messages.ERROR.DUPLICATE('socio registrado con el dni proporcionado'));

    const data = PersonFactory.create('member', { name, lastname, dni });
    const person = repo.create(data);

    await repo.save(person);
    return person;
};

export async function registerLibrarian({ name, lastname, dni } = {}) {
    const repo = await getData(PersonSchema);
    const exists = await repo.findOne({ where: { dni } });
    if (exists) throw new ConflictError(Messages.ERROR.DUPLICATE('bibliotecario registrado con el dni proporcionado'));

    const data = PersonFactory.create('librarian', { name, lastname, dni });
    const person = repo.create(data);

    await repo.save(person);
    return person;
};

// Buscar deudas de un socio
export async function listDebtsByMember(memberId, { onlyUnpaid = true } = {}) {
    const debtRepo = await getData(DebtSchema);
    await getMemberOrThrow(PersonSchema, memberId);

    const where = { member: { id: Number(memberId) } };
    if (onlyUnpaid) where.paid = false;

    return debtRepo.find({
        where,
        relations: ['loan', 'loan.copy', 'loan.copy.book']
    });
};

export async function getAllMembers() {
    const repo = await getData(PersonSchema);
    const where = { role_id: 1 };
    return await repo.find({ 
        where,
        order: { id: 'ASC' } 
    });
};

export async function getAllLibrarians() {
    const repo = await getData(PersonSchema);
    const where = { role_id: 2 };
    return await repo.find({ 
        where,
        order: { id: 'ASC' } 
    });
};
