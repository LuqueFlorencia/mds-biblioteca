import { getDataSource } from '../../config/database.js';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError.js';

// Busca la información de la entidad indicadada en el repositorio especifico.
export async function getData(schema){
    const db = await getDataSource();
    const repo = db.getRepository(schema);
    return repo;
};

// Buscar un socio por su ID
export async function getMemberOrThrow(schema, id) {
    const repo = await getData(schema);
    const member = await repo.findOne({ where: { id: Number(id) } });
    if (!member) throw new NotFoundError('Socio');
    if (member.role_id !== 1) throw new BadRequestError('La persona no es socio.');
    return member;
};

// Buscar un bibliotecario por su ID
export async function getLibrarianOrThrow(schema, id) {
    const repo = await getData(schema);
    const librarian = await repo.findOne({ where: { id: Number(id) } });
    if (!librarian) throw new NotFoundError('Bibliotecario');
    if (librarian.role_id !== 2) throw new BadRequestError('La persona no es bibliotecario.');
    return librarian;
};

// Buscar un ejemplar de un libro por su ID
export async function getCopyOrThrow(schema, id) {
    const repo = await getData(schema);
    const copy = await repo.findOne({ where: { id: Number(id) }, relations: ['book'] });
    if (!copy) throw new NotFoundError('Ejemplar (Copia).');
    return copy;
};
