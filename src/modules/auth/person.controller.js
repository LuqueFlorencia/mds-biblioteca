import { createUser, } from './person.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'
import { Messages } from '../../shared/messages.js';

export const register = asyncHandler(async (req, res) => {
    const result = await createUser(req.body);
    return res.status(201).json({ message: result.message });
});

