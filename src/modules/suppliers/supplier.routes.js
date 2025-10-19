import express from 'express';
import { createSupplier, getAllSuppliers, updateSupplier, deleteSupplier, restoreSupplier } from './supplier.controller.js'

const supplierRouter = express.Router();

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Obtener todas las proveedores
 *     tags: [Suppliers]
 *     parameters:
 *       - in: query
 *         name: includeDeleted
 *         schema: 
 *           type: boolean
 *           default: false
 *         description: Incluir los registros borrados logicamente
 *     responses:
 *       200:
 *         description: Lista de proveedores
 */
supplierRouter.get('/', getAllSuppliers);

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del proveedor
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente
 *       400:
 *         description: Datos inválidos
 */
supplierRouter.post('/', createSupplier);

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Actualizar una proveedor existente
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proveedor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del proveedor
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Proveedor no encontrado
 */
supplierRouter.put('/:id(\\d+)', updateSupplier);

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Eliminar logicamente un proveedor existente
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proveedor a eliminar
 *     responses:
 *       200:
 *         description: Proveedor eliminado correctamente
 *       404:
 *         description: Proveedor no encontrado
 */
supplierRouter.delete('/:id(\\d+)', deleteSupplier);

/**
 * @swagger
 * /suppliers/restore/{id}:
 *   delete:
 *     summary: Restaurar logicamente un proveedor existente
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proveedor a restaurar
 *     responses:
 *       200:
 *         description: Proveedor restaurada correctamente
 *       404:
 *         description: Proveedor no encontrada
 */
supplierRouter.delete('/restore/:id(\\d+)', restoreSupplier);

export default supplierRouter;
