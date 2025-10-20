import BookSchema from '../entities/book.entity.js';
import CopySchema from '../entities/copy.entity.js';
import LoanSchema from '../entities/loan.entity.js';
import { ConflictError, BadRequestError } from '../../core/errors/AppError.js';
import { getData } from '../../shared/utils/helpers.js';

// Registrar nuevo libro y sus ejemplares
export async function registerBookWithCopies({ isbn, title, author, copies = 1 } = {}) {
    const bookRepo = getData(BookSchema);
    const copyRepo = getData(CopySchema);

    if (!isbn || !title) throw new BadRequestError('ISBN y Titulo son obligatorios.');
    if (copies <= 0) throw new BadRequestError('El número de ejemplares debe ser >= 1.');

    const exists = await bookRepo.findOne({ where: { isbn } });
    if (exists) throw new ConflictError('Ya existe un libro con ese ISBN.');

    return ds.transaction(async () => {
        const book = bookRepo.create({ isbn, title, author });
        await bookRepo.save(book);

        const toCreate = Array.from({ length: copies }).map(() => copyRepo.create({ book }));
        await copyRepo.save(toCreate);

        return bookRepo.findOne({ where: { id: book.id }, relations: ['copies'] });
    });
};

export async function searchBook({ search } = {}) {
    const repo = getData(BookSchema);
    const result = await repo.createQueryBuilder('b')
        .where('LOWER(b.title) LIKE LOWER(:search)', { search: `%${search}%` })
        .orWhere('b.isbn = :isbn', { isbn: search })
        .leftJoinAndSelect('b.copies', 'c')
        .getMany();

    return result;
};

// Devuelve { total, prestados, disponibles } por Libro ID
export async function getBookAvailability(bookId) {
    const loanRepo = await getData(LoanSchema);
    const copyRepo = getData(CopySchema);

    const copies = await copyRepo.find({ where: { book: { id: Number(bookId) } } });
    if (copies.length === 0) throw new NotFoundError('Libro sin ejemplares o no existe.');

    let prestados = 0;
    for (const c of copies) {
        const active = await loanRepo.findOne({ where: { copy: { id: c.id }, returned_at: null } });
        if (active) prestados++;
    }
    return {
        total: copies.length,
        prestados,
        disponibles: copies.length - prestados
    };
};

// Buscar prestamos activos de un ejemplar (si True = NO hay préstamos activos)
export async function isCopyAvailable(copyId) {
    const repo = getData(LoanSchema);
    const active = await repo.findOne({
        where: { copy: { id: copyId }, returned_at: null },
        relations: ['copy']
    });
    return !active;
};

// Buscar los ejemplares por libro
export async function findAvailableCopyByBook(bookId) {
    const copyRepo = getData(CopySchema);

    const copies = await copyRepo.find({ where: { book: { id: bookId } } });
    for (const c of copies) {
        const available = await isCopyAvailable(c.id);
        if (available) return c;
    }
    return null;
};
