import express from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory, restoreCategory } from './category.controller.js'

const categoryRouter = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorias
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: includeDeleted
 *         schema: 
 *           type: boolean
 *           default: false
 *         description: Incluir los registros borrados logicamente
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
categoryRouter.get('/', getAllCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoria
 *     responses:
 *       201:
 *         description: Categoria creada correctamente
 *       400:
 *         description: Datos inválidos
 */
categoryRouter.post('/', createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoria a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoria
 *     responses:
 *       200:
 *         description: Categoria actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoria no encontrada
 */
categoryRouter.put('/:id(\\d+)', updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar logicamente una categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoria a eliminar
 *     responses:
 *       200:
 *         description: Categoria eliminada correctamente
 *       404:
 *         description: Categoria no encontrada
 */
categoryRouter.delete('/:id(\\d+)', deleteCategory);

/**
 * @swagger
 * /categories/restore/{id}:
 *   delete:
 *     summary: Restaurar logicamente una categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoria a restaurar
 *     responses:
 *       200:
 *         description: Categoria restaurada correctamente
 *       404:
 *         description: Categoria no encontrada
 */
categoryRouter.delete('/restore/:id(\\d+)', restoreCategory);

export default categoryRouter;
