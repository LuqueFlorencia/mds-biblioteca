import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import categoryRoutes from '../modules/categories/category.routes.js';
import paymentRoutes from '../modules/payments/payment.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import saleRoutes from '../modules/sales/sale.routes.js';
import supplierRoutes from '../modules/suppliers/supplier.routes.js';
import unitRoutes from '../modules/units/unit.routes.js';

export const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para gestionar los usuarios y la autenticación del petshop
 */
router.use('/auth', authRoutes);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API para gestionar categorias del petshop
 */
router.use('/categories', categoryRoutes);

/**
 * @swagger
 * tags:
 *  name: Payments
 *  description: API para gestionar métodos de pago del petshop
 */
router.use('/payments', paymentRoutes);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para gestionar productos del petshop
 */
router.use('/products', productRoutes);

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: API para gestionar ventas y el detalle de ventas del petshop
 */
router.use('/sales', saleRoutes);

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API para gestionar proveedores del petshop
 */
router.use('/suppliers', supplierRoutes);

/**
 * @swagger
 * tags:
 *   name: Units
 *   description: API para gestionar unidades de medidas del petshop
 */
router.use('/units', unitRoutes);
