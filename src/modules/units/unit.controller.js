import { getAll, createNew, update, softDelete, restore } from './unit.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const getAllUnits = asyncHandler(async (req, res) => {
    const includeDeleted = String(req.query.includeDeleted).toLowerCase() === 'true';
    const units = await getAll({ includeDeleted });
    return res.status(200).json(units);
});

export const createUnit = asyncHandler(async (req, res) => {
    const result = await createNew(req.body);
    return res.status(201).json({ message: result.message });
});

export const updateUnit = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    
    const result = await update(id, req.body);
    return res.status(200).json({ message: result.message });
});

export const deleteUnit = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await softDelete(id);
    return res.status(200).json({ message: result.message });
});

export const restoreUnit = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await restore(id);
    return res.status(200).json({ message: result.message });
});