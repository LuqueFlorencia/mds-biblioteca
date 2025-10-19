import { getAll, createNew, update, softDelete, restore } from './payment.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const getAllPayments = asyncHandler(async (req, res) => {  
    const includeDeleted = String(req.query.includeDeleted).toLowerCase() === 'true'; 
    const payments = await getAll({ includeDeleted });    
    return res.status(200).json(payments);
});

export const createPayment = asyncHandler(async (req, res) => {
    const result = await createNew(req.body);
    return res.status(201).json({ message: result.message });
});

export const updatePayment = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await update(id, req.body);
    return res.status(200).json({ message: result.message });
});

export const deletePayment = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await softDelete(id);
    return res.status(200).json({ message: result.message });
});

export const restorePayment = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await restore(id);
    return res.status(200).json({ message: result.message });
});