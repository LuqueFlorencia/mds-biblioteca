import express from 'express';
import { createUnit, getAllUnits, updateUnit, deleteUnit, restoreUnit } from './unit.controller.js'

const unitRouter = express.Router();

/**
 * @swagger
 * /units:
 *   get:
 *     summary: Obtener todas las unidades de medida
 *     tags: [Units]
 *     parameters:
 *       - in: query
 *         name: includeDeleted
 *         schema: 
 *           type: boolean
 *           default: false
 *         description: Incluir los registros borrados logicamente
 *     responses:
 *       200:
 *         description: Lista de unidades de medida
 */
unitRouter.get('/', getAllUnits);

/**
 * @swagger
 * /units:
 *   post:
 *     summary: Crear una nueva unidad de medida
 *     tags: [Units]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la unidad de medida
*               description:
 *                 type: string
 *                 description: Descripcion de la unidad de medida
 *     responses:
 *       201:
 *         description: Unidad de medida creada correctamente
 *       400:
 *         description: Datos inválidos
 */
unitRouter.post('/', createUnit);

/**
 * @swagger
 * /units/{id}:
 *   put:
 *     summary: Actualizar una unidad de medida existente
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la unidad de medida a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la unidad de medida
 *               description:
 *                 type: string
 *                 description: Descripcion de la unidad de medida
 *     responses:
 *       200:
 *         description: Unidad de medida actualizada correctamente
 *       400:
 *         description: Datos inválidos
 */
unitRouter.put('/:id(\\d+)', updateUnit);

/**
 * @swagger
 * /units/{id}:
 *   delete:
 *     summary: Eliminar logicamente una unidad de medida existente
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Unidad de medida eliminada lógicamente
 *       400:
 *         description: No encontrado
 */
unitRouter.delete('/:id(\\d+)', deleteUnit);

/**
 * @swagger
 * /units/restore/{id}:
 *   delete:
 *     summary: Restaurar logicamente una unidad de medida existente
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Unidad de medida restaurada correctamente
 *       400:
 *         description: No encontrado
 */
unitRouter.delete('/restore/:id(\\d+)', restoreUnit);

export default unitRouter;
