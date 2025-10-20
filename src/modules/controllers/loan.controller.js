import { loanBook, returnBook, payDebtId, listActiveLoans } from '../services/loan.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const createLoan = asyncHandler(async (req, res) => {
    const { memberId, librarianId, copyId, dateFrom, dateTo } = req.body;
    const result = await loanBook({ memberId, librarianId, copyId, dateFrom, dateTo });
    return res.status(201).json({ result });
});

export const returnLoan = asyncHandler(async (req, res) => {
    const loanId = Number(req.params.id);
    const { damaged = false, damageAmount = 0 } = req.body;
    const result = await returnBook({ loanId, damaged, damageAmount });
    return res.status(200).json({ result });
});

export const payDebt = asyncHandler(async (req, res) => {
    const debtId = Number(req.params.id);
    const result = await payDebtId(debtId);
    return res.status(200).json({ result });
});

export async function getActiveLoans(req, res) {
    const { memberId, librarianId, limit, offset } = req.query;
    const loans = await listActiveLoans({
        memberId: memberId ? Number(memberId) : undefined,
        librarianId: librarianId ? Number(librarianId) : undefined,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
    });
    return res.status(200).json(loans);
};
