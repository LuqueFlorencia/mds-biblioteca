import express from 'express';
import { getAllPayments, createPayment, updatePayment, deletePayment, restorePayment } from './payment.controller.js';

const paymentRouter = express.Router();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Obtener todos los métodos de pago
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: includeDeleted
 *         schema: 
 *           type: boolean
 *           default: false
 *         description: Incluir los registros borrados logicamente
 *     responses:
 *       200:
 *         description: Lista de métodos de pago
 */
 paymentRouter.get('/', getAllPayments);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Crear un nuevo método de pago
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del método de pago
 *     responses:
 *       201:
 *         description: Método de pago creado correctamente
 *       400:
 *         description: Datos inválidos
 */
paymentRouter.post('/', createPayment);

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Actualizar un método de pago existente
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del método de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del método de pago
 *     responses:
 *       200:
 *         description: Método de pago actualizado correctamente
 *       400:
 *         description: Datos inválidos
 */
paymentRouter.put('/:id(\\d+)', updatePayment);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Eliminar logicamente un método de pago existente
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del método de pago a eliminar
 *     responses:
 *       200:
 *         description: Método de pago eliminado correctamente
 *       404:
 *         description: Método de pago no encontrado
 */
paymentRouter.delete('/:id(\\d+)', deletePayment);

/**
 * @swagger
 * /payments/restore/{id}:
 *   delete:
 *     summary: Restaurar logicamente un método de pago existente
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del método de pago a restaurar
 *     responses:
 *       200:
 *         description: Método de pago restaurado correctamente
 *       404:
 *         description: Método de pago no encontrado
 */
paymentRouter.delete('/restore/:id(\\d+)', restorePayment);

export default paymentRouter;