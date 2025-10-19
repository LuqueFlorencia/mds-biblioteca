import { getAll, createNew, update, softDelete, restore } from './category.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const getAllCategories = asyncHandler(async (req, res) => {
    const includeDeleted = String(req.query.includeDeleted).toLowerCase() === 'true';
    const categories = await getAll({ includeDeleted });
    return res.status(200).json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
    const result = await createNew(req.body);
    return res.status(201).json({ message: result.message });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await update(id, req.body);
    return res.status(200).json({ message: result.message });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await softDelete(id);
    return res.status(200).json({ message: result.message });
});

export const restoreCategory = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await restore(id);
    return res.status(200).json({ message: result.message });
});