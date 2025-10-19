import { getAll, createNew, update, softDelete, restore } from './supplier.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const getAllSuppliers = asyncHandler(async (req, res) => {
    const includeDeleted = String(req.query.includeDeleted).toLowerCase() === 'true';
    const suppliers = await getAll({ includeDeleted });
    return res.status(200).json(suppliers);
});

export const createSupplier = asyncHandler(async (req, res) => {
    const result = await createNew(req.body);
    return res.status(201).json({ message: result.message });
});

export const updateSupplier = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await update(id, req.body);
    return res.status(200).json({ message: result.message });
});

export const deleteSupplier = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await softDelete(id);
    return res.status(200).json({ message: result.message });
});

export const restoreSupplier = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await restore(id);
    return res.status(200).json({ message: result.message });
});