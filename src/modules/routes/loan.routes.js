import express from 'express';
import { createLoan, returnLoan, payDebt } from '../controllers/loan.controller.js';
import { loanCreateRequest, returnLoanRequest } from '../schemas/loan.schema.js';
import { validateBody, validateParams } from '../../core/middlewares/validate.js';
import { idParamSchema } from '../../shared/utils/joi.primitives.js';

const loanRoutes = express.Router();

/**
 * @swagger
 * /loan:
 *   post:
 *     summary: Registrar un nuevo préstamo
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoanCreateRequest' }
 *           example:
 *             memberId: 5
 *             librarianId: 1
 *             copyId: 12
 *             dateFrom: "2025-10-20T10:00:00Z"
 *             dateTo:   "2025-11-03T10:00:00Z"
 *     responses:
 *       201:
 *         description: Préstamo registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Loan' }
 *       400: { description: Datos inválidos }
 *       404: { description: Socio/Bibliotecario/Ejemplar no encontrado }
 *       409: { description: El ejemplar ya está prestado }
 */
loanRoutes.post('/', validateBody(loanCreateRequest), createLoan);

/**
 * @swagger
 * /loan/{id}/return:
 *   post:
 *     summary: Registrar la devolución de un préstamo (crea deuda si hay daño)
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 10 }
 *         description: ID del préstamo
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReturnLoanRequest' }
 *           example:
 *             damaged: true
 *             damageAmount: 1500.00
 *     responses:
 *       200:
 *         description: Devolución registrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loan: { $ref: '#/components/schemas/Loan' }
 *                 createdDebt: { $ref: '#/components/schemas/Debt' }
 *       404: { description: Préstamo no encontrado }
 *       409: { description: El préstamo ya fue devuelto }
 */
loanRoutes.post('/:id(\\d+)/return', validateBody(returnLoanRequest), returnLoan);

/**
 * @swagger
 * /loan/{debtId}/payDebt:
 *   post:
 *     summary: Marcar deuda como pagada
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: debtId
 *         required: true
 *         schema: { type: integer, example: 3 }
 *     responses:
 *       200:
 *         description: Deuda pagada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Debt' }
 *       404: { description: Deuda no encontrada }
 */
loanRoutes.post('/:debtId(\\d+)/payDebt', validateParams(idParamSchema), payDebt);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoanCreateRequest:
 *       type: object
 *       required: [memberId, librarianId, copyId, dateFrom, dateTo]
 *       properties:
 *         memberId:    { type: integer, example: 5 }
 *         librarianId: { type: integer, example: 1 }
 *         copyId:      { type: integer, example: 12 }
 *         dateFrom:    { type: string, format: date-time, example: "2025-10-20T10:00:00Z" }
 *         dateTo:      { type: string, format: date-time, example: "2025-11-03T10:00:00Z" }
 *
 *     ReturnLoanRequest:
 *       type: object
 *       properties:
 *         damaged:      { type: boolean, default: false }
 *         damageAmount: { type: number, format: float, example: 1500.00, minimum: 0 }
 *
 *     Loan:
 *       type: object
 *       properties:
 *         id:          { type: integer, example: 10 }
 *         date_from:   { type: string, format: date-time }
 *         date_to:     { type: string, format: date-time }
 *         returned_at: { type: string, format: date-time, nullable: true }
 *         member:
 *           type: object
 *           properties: { id: { type: integer }, name: { type: string } }
 *         librarian:
 *           type: object
 *           properties: { id: { type: integer }, name: { type: string } }
 *         copy:
 *           type: object
 *           properties:
 *             id: { type: integer }
 *             book:
 *               $ref: '#/components/schemas/Book'
 *
 *     Debt:
 *       type: object
 *       properties:
 *         id:     { type: integer, example: 3 }
 *         amount: { type: number, format: float, example: 1500.00 }
 *         paid:   { type: boolean, example: false }
 *         loan:
 *           type: object
 *           properties:
 *             id: { type: integer, example: 10 }
 */

export default loanRoutes;