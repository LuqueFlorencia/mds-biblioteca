import { getAll, createNew, update, softDelete, restore } from './product.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const getAllProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const search = (req.query.search ?? '').toString();
    const includeDeleted = String(req.query.includeDeleted).toLowerCase() === 'true';

    const result = await getAll({ page, pageSize, search, includeDeleted });
    return res.status(200).json(result);
});

export const createProduct = asyncHandler(async (req, res) => {
    const result = await createNew(req.body);
    return res.status(201).json({ message: result.message });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    
    const result = await update(id, req.body);
    return res.status(200).json({ message: result.message });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await softDelete(id);
    return res.status(200).json({ message: result.message });
});

export const restoreProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const result = await restore(id);
    return res.status(200).json({ message: result.message });
});