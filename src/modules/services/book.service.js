import { getDataSource } from '../../config/database.js';
import BookSchema from '../entities/book.entity.js';
import CopySchema from '../entities/copy.entity.js';
import LoanSchema from '../entities/loan.entity.js';
import { ConflictError, BadRequestError } from '../../core/errors/AppError.js';
import { getData } from '../../shared/utils/helpers.js';

// Registrar nuevo libro y sus ejemplares
export async function registerBookWithCopies({ isbn, title, author, copies = 1 } = {}) {
    if (!isbn || !title) throw new BadRequestError('ISBN y Titulo son obligatorios.');
    if (copies <= 0) throw new BadRequestError('El número de ejemplares debe ser >= 1.');

    const ds = await getDataSource();
    const bookRepo = ds.getRepository(BookSchema);

    const exists = await bookRepo.findOne({ where: { isbn } });
    if (exists) throw new ConflictError('Ya existe un libro con ese ISBN.');

    const created = await ds.transaction(async (manager) => {
        const bookRepoTx = manager.getRepository(BookSchema);
        const copyRepoTx = manager.getRepository(CopySchema);

        const book = bookRepoTx.create({ isbn, title, author });
        await bookRepoTx.save(book);

        const copiesArr = Array.from({ length: copies }).map(() => copyRepoTx.create({ book }));
        await copyRepoTx.save(copiesArr);

        return book;
    });

    return await bookRepo.findOne({
        where: { id: created.id },
        relations: ['copies'],
    });
};

export async function searchBook({ search } = {}) {
    const repo = await getData(BookSchema);
    const result = await repo.createQueryBuilder('b')
        .where('LOWER(b.title) LIKE LOWER(:search)', { search: `%${search}%` })
        .orWhere('b.isbn = :isbn', { isbn: search })
        .leftJoinAndSelect('b.copies', 'c')
        .getMany();

    return result;
};

export async function getBooksWithAvailableCopies({ q, limit = 50, offset = 0 } = {}) {
    const bookRepo = await getData(BookSchema);

    const subQuery = `
        SELECT 1 FROM loan l
        WHERE l.copy_id = c.id AND l.returned_at IS NULL
    `;

    const qb = bookRepo
        .createQueryBuilder('b')
        .innerJoinAndSelect('b.copies', 'c', `NOT EXISTS (${subQuery})`);

    // Filtro opcional por título/ISBN/autor
    if (q && q.trim()) {
        qb.andWhere(
            '(LOWER(b.title) ILIKE :q OR LOWER(b.author) ILIKE :q OR b.isbn = :isbn)',
            { q: `%${q.toLowerCase()}%`, isbn: q }
        );
    }

    qb.orderBy('b.title', 'ASC')
        .addOrderBy('c.id', 'ASC')
        .take(limit)
        .skip(offset);

    const books = await qb.getMany();

    return books.map(b => ({
        id: b.id,
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        availableCount: Array.isArray(b.copies) ? b.copies.length : 0,
        availableCopies: (b.copies || []).map(c => ({ id: c.id })),
    }));
}

// Devuelve { total, prestados, disponibles } por Libro ID
export async function getBookAvailability(bookId) {
    const loanRepo = await getData(LoanSchema);
    const copyRepo = await getData(CopySchema);

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
    const repo = await getData(LoanSchema);
    const active = await repo.findOne({
        where: { copy: { id: copyId }, returned_at: null },
        relations: ['copy']
    });
    return !active;
};

// Buscar los ejemplares por libro
export async function findAvailableCopyByBook(bookId) {
    const copyRepo = await getData(CopySchema);

    const copies = await copyRepo.find({ where: { book: { id: bookId } } });
    for (const c of copies) {
        const available = await isCopyAvailable(c.id);
        if (available) return c;
    }
    return null;
};
