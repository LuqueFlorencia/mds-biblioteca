import { loanBook, returnBook, payDebtId } from '../services/loan.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const createLoan = asyncHandler(async (req, res) => {
    const { memberId, librarianId, copyId, dateFrom, dateTo } = req.body;
    const result = await loanBook({ memberId, librarianId, copyId, dateFrom, dateTo });
    return res.status(201).json({ result });
});

export const returnLoan = asyncHandler(async (req, res) => {
    const loanId = Number(req.params.loanId);
    const { damaged = false, damageAmount = 0 } = req.body;
    const result = await returnBook({ loanId, damaged, damageAmount });
    return res.status(200).json({ result });
});

export const payDebt = asyncHandler(async (req, res) => {
    const debtId = Number(req.params.debtId);
    const result = await payDebtId(debtId);
    return res.status(200).json({ result });
});