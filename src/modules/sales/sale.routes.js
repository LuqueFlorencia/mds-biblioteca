import express from 'express';
import { getAllSales, getSaleById, createSale, getSalesReport } from './sale.controller.js';

const saleRoutes = express.Router();

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Listado paginado de ventas (incluye medio de pago)
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Número de página
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer }
 *         description: Cantidad por página
 *       - in: query
 *         name: payment_id
 *         schema: { type: integer }
 *         description: Búsqueda por id de medio de pago
 *       - in: query
 *         name: kind_id
 *         schema: { type: integer }
 *         description: Búsqueda por tipo de operación
 *       - in: query
 *         name: state_id
 *         schema: { type: integer }
 *         description: Búsqueda por estado de operación
 *       - in: query
 *         name: day
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por día exacto (yyy-mm-ddTHH:mm:ssZ)
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por rango desde (yyy-mm-ddTHH:mm:ssZ)
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por rango hasta (yyy-mm-ddTHH:mm:ssZ). Si se usa rango, ignora 'day'
 *     responses:
 *       200:
 *         description: Resultado paginado de ventas
 *       400:
 *         description: Error en parametros proporcionados
 */
saleRoutes.get('/', getAllSales);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Obtiene una venta por su ID (incluye medio de pago y detalle de venta con productos)
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: integer }
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Detalle de la venta
 *       404:
 *         description: No existe una venta con ese ID
 */
saleRoutes.get('/:id(\\d+)', getSaleById);

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Crea una operación de venta/compra/ajuste con sus ítems y actualiza stock
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSaleRequest'
 *           examples:
 *             venta/compra simple:
 *               summary: Venta con ítems
 *               value:
 *                 payment_id: 3
 *                 kind_id: 1
 *                 state_id: 1
 *                 date: "2025-10-02T15:30:00Z"
 *                 items:
 *                   - product_id: 1
 *                     quantity: 2
 *                     unit_price: 5000
 *                   - product_id: 2
 *                     quantity: 1.5
 *                     unit_price: 2500.50
 *     responses:
 *       201:
 *         description: Operación creada correctamente
 *       400:
 *         description: Datos inválidos o referencias inexistentes / stock insuficiente.
*         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
saleRoutes.post('/', createSale);

/**
 * @swagger
 * /sales/report.pdf:
 *   get:
 *     summary: Reporte en PDF de ventas
 *     description: Genera un PDF con las ventas filtradas (sin paginar) y un resumen de totales por tipo de movimiento y medio de pago.
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         schema: { type: integer }
 *         description: Búsqueda por id de medio de pago
 *       - in: query
 *         name: kind_id
 *         schema: { type: integer }
 *         description: Búsqueda por tipo de operación
 *       - in: query
 *         name: state_id
 *         schema: { type: integer }
 *         description: Búsqueda por estado de operación
 *       - in: query
 *         name: day
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por día exacto (yyy-mm-ddTHH:mm:ssZ)
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por rango desde (yyy-mm-ddTHH:mm:ssZ)
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por rango hasta (yyy-mm-ddTHH:mm:ssZ). Si se usa rango, ignora 'day'
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en parámetros proporcionados
 */
saleRoutes.get('/report.pdf', (req, res, next) => {
    req.query.format = 'pdf';
    return getSalesReport(req, res, next);
});

/**
 * @swagger
 * /sales/report.xlsx:
 *   get:
 *     summary: Reporte en EXCEL de ventas
 *     description: Genera un excel con las ventas filtradas (sin paginar) y un resumen de totales por tipo de movimiento y medio de pago.
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         schema: { type: integer }
 *         description: Búsqueda por id de medio de pago
 *       - in: query
 *         name: kind_id
 *         schema: { type: integer }
 *         description: Búsqueda por tipo de operación
 *       - in: query
 *         name: state_id
 *         schema: { type: integer }
 *         description: Búsqueda por estado de operación
 *       - in: query
 *         name: day
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por día exacto (yyy-mm-ddTHH:mm:ssZ)
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por rango desde (yyy-mm-ddTHH:mm:ssZ)
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date-time }
 *         description: Filtrado por rango hasta (yyy-mm-ddTHH:mm:ssZ). Si se usa rango, ignora 'day'
 *     responses:
 *       200:
 *         description: XLSX generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en parámetros proporcionados
 */
saleRoutes.get('/report.xlsx', (req, res, next) => {
    req.query.format = 'xlsx';
    return getSalesReport(req, res, next);
});


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSaleRequest:
 *       type: object
 *       required:
 *         - payment_id
 *         - kind_id
 *         - state_id
 *         - items
 *       properties:
 *         payment_id:
 *           type: integer
 *           example: 1
 *           description: ID del método de pago
 *         kind_id:
 *           type: integer
 *           enum: [1, 2, 3]
 *           example: 1
 *           description: Tipo de operación (1=Venta, 2=Compra, 3=Ajuste)
 *         state_id:
 *           type: integer
 *           enum: [1, 2, 3]
 *           example: 1
 *           description: Estado de la venta (1=Confirmado, 2=Pendiente, 3=Anulado)
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-10-02T15:30:00Z"
 *           description: Fecha de registro de la venta (si no se envía, se usa la fecha actual)
 *         items:
 *           type: array
 *           description: Lista de productos vendidos
 *           items:
 *             type: object
 *             required: [product_id, quantity]
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 10
 *                 description: ID del producto
 *               quantity:
 *                 type: number
 *                 format: decimal
 *                 example: 2.5
 *                 description: Cantidad vendida del producto
 *               unit_price:
 *                 type: number
 *                 format: decimal
 *                 example: 1234.56
 *                 description: Precio unitario (opcional). Si no se envía, se usa el precio del producto.
 *
 *     SaleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-10-02T15:30:00Z"
 *         total:
 *           type: number
 *           format: decimal
 *           example: 350.75
 *         kind_id:
 *           type: integer
 *           enum: [1, 2, 3]
 *         state_id:
 *           type: integer
 *           enum: [1, 2, 3]
 *         payment_id:
 *           type: integer
 *           example: 3
 *         payment_name:
 *           type: string
 *           example: "Debito"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id: { type: integer, example: 10 }
 *               product_name: { type: string, example: "Collar para perro" }
 *               quantity: { type: number, format: decimal, example: 2 }
 *               unit_price: { type: number, format: decimal, example: 100.50 }
 *               subtotal: { type: number, format: decimal, example: 201.00 }
 */

export default saleRoutes;