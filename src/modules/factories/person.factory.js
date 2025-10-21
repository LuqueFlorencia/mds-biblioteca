import { BadRequestError } from '../../core/errors/AppError.js';

const ROLES = {
    MEMBER: 1,
    LIBRARIAN: 2,
};

function genMemberId() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `S-${rand}`;
};

function genEnrollmentCode() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `B-${rand}`;
};

export class PersonFactory {
    /**
     * @param {'member'|'librarian'} kind
     * @param {{ name:string, lastname:string, dni:string }} data
     * @returns {{ name, lastname, dni, role_id:number, member_id:string|null, enrollment_librarian:string|null }}
     */
    static create(kind, { name, lastname, dni }) {
        if (!name || !lastname || !dni) {
            throw new BadRequestError('Faltan datos obligatorios (name, lastname, dni).');
        }

        if (kind === 'member') {
        return {
            name,
            lastname,
            dni,
            role_id: ROLES.MEMBER,
            member_id: genMemberId(),
            enrollment_librarian: null,
        };
        }

        if (kind === 'librarian') {
        return {
            name,
            lastname,
            dni,
            role_id: ROLES.LIBRARIAN,
            member_id: null,
            enrollment_librarian: genEnrollmentCode(),
        };
        }

        throw new BadRequestError('Tipo de persona inválido.');
    }
}
