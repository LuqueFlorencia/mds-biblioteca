import express from 'express';
import { createProduct, getAllProducts, updateProduct, deleteProduct, restoreProduct } from './product.controller.js'

const productRoutes = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listado paginado de productos (incluye categorias y unidades de medida)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Número de página (1-based)
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer }
 *         description: Cantidad por página
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Búsqueda por nombre/descr. (ILIKE)
 *       - in: query
 *         name: includeDeleted
 *         schema: 
 *           type: boolean
 *           default: false
 *         description: Incluir los registros borrados logicamente
 *     responses:
 *       200:
 *         description: Resultado paginado de productos (no incluye eliminados lógicamente)
 */
productRoutes.get('/', getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Precio del producto
 *                 example: 10.99
 *               stock:
 *                 type: number
 *                 format: float
 *                 description: Cantidad en stock
 *                 example: 10.00
 *               category_id:
 *                 type: integer
 *                 description: ID de la categoría
 *               unit_id:
 *                 type: integer
 *                 description: ID de la unidad de medida
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Datos inválidos o categoría inexistente
 */
productRoutes.post('/', createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Precio del producto
 *                 example: 10.99
 *               stock:
 *                 type: number
 *                 format: float
 *                 description: Cantidad en stock
 *                 example: 10.00   
 *               category_id:
 *                 type: integer
 *                 description: ID de la categoría
 *               unit_id:
 *                 type: integer
 *                 description: ID de la unidad de medida
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: Datos inválidos o categoría inexistente
 */
productRoutes.put('/:id(\\d+)', updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar logicamente un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto eliminado lógicamente
 *       400:
 *         description: No encontrado
 */
productRoutes.delete('/:id(\\d+)', deleteProduct);

/**
 * @swagger
 * /products/restore/{id}:
 *   delete:
 *     summary: Restaurar logicamente un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto restaurado correctamente
 *       400:
 *         description: No encontrado
 */
productRoutes.delete('/restore/:id(\\d+)', restoreProduct);

export default productRoutes;
