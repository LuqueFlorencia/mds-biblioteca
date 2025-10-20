import { registerBookWithCopies, searchBook, getBookAvailability, getBooksWithAvailableCopies } from '../services/book.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const registerBook = asyncHandler(async (req, res) => {
    const { isbn, title, author, copies } = req.body || {};
    const book = await registerBookWithCopies({ isbn, title, author, copies });
    return res.status(201).json(book);
});

export const getAvailability = asyncHandler(async (req, res) => {
    const bookId = Number(req.params.id);
    const result = await getBookAvailability(bookId);
    return res.status(200).json(result);
});

export const searchBooks = asyncHandler(async (req, res) => {
    const search = (req.query.search || '').trim();
    if (!search) return res.json([]);
    const result = await searchBook({ search });
    return res.status(200).json({ result });
});

export async function listBooksWithAvailableCopies(req, res, next) {
    const { search: q, limit, offset } = req.query;
    const data = await getBooksWithAvailableCopies({
        q,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
    });
    return res.status(200).json(data);
};
