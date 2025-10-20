import { registerMember, registerLibrarian, listDebtsByMember, getAllMembers, getAllLibrarians } from '../services/person.service.js';
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'

export const registerNewMember = asyncHandler(async (req, res) => {
    const { name, lastname, dni } = req.body;
    const result = await registerMember({ name, lastname, dni });
    return res.status(201).json({ result });
});

export const registerNewLibrarian = asyncHandler(async (req, res) => {
    const { name, lastname, dni } = req.body;
    const result = await registerLibrarian({ name, lastname, dni });
    return res.status(201).json({ result });
});

export const listMemberDebts = asyncHandler(async (req, res) => {
    const memberId = Number(req.params.id);
    const onlyUnpaid = req.query.onlyUnpaid !== 'false';
    const result = await listDebtsByMember(memberId, { onlyUnpaid });
    return res.status(200).json(result);
});

export const getAllSocios = asyncHandler(async (req, res) => {   
    const result = await getAllMembers();
    return res.status(200).json(result);
});

export const getAllBibliotecarios = asyncHandler(async (req, res) => {   
    const result = await getAllLibrarians();
    return res.status(200).json(result);
});