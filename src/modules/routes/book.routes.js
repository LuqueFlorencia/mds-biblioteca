import express from 'express';
import { registerBook, getAvailability, searchBooks } from '../controllers/book.controller.js';
import { bookCreateRequest, bookSearchQuery } from '../schemas/book.schema.js';
import { validateBody, validateParams, validateQuery } from '../../core/middlewares/validate.js';
import { idParamSchema } from '../../shared/utils/joi.primitives.js';

const bookRoutes = express.Router();

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Registrar un nuevo libro y sus ejemplares
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreateRequest'
 *           example:
 *             isbn: "978-84-08-18123-4"
 *             title: "Harry Potter"
 *             author: "J.K. Rowling"
 *             copies: 3
 *     responses:
 *       201:
 *         description: Libro registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookWithCopies'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: ISBN duplicado
 */
bookRoutes.post('/', validateBody(bookCreateRequest), registerBook);

/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Obtener disponibilidad (total, prestados, disponibles) de un libro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *         description: ID del libro
 *     responses:
 *       200:
 *         description: Ejemplares disponibles del libro indicado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total: { type: integer, example: 3 }
 *                 prestados: { type: integer, example: 1 }
 *                 disponibles: { type: integer, example: 2 }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Libro no encontrado o sin ejemplares
 */
bookRoutes.get('/:id(\\d+)', validateParams(idParamSchema), getAvailability);

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Listado de libros acorde al filtro de busqueda
 *     tags: [Books]
 *     parameters:
 *         name: search
 *         schema: { type: string }
 *         description: Búsqueda por título (ILIKE) o ISBN exacto
 *     responses:
 *       200:
 *         description: Listado de libros acorde al filtro de busqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Book' }
 */
bookRoutes.get('/', validateQuery(bookSearchQuery), searchBooks);

/**
 * @swagger
 * components:
 *   schemas:
 *     BookBase:
 *       type: object
 *       properties:
 *         isbn:   { type: string, maxLength: 250, description: ISBN del libro, example: "978-84-08-18123-4" }
 *         title:  { type: string, maxLength: 250, description: Título del libro, example: "Harry Potter" }
 *         author: { type: string, maxLength: 250, description: Autor, example: "J.K. Rowling" }
 *
 *     BookCreateRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/BookBase'
 *       required: [isbn, title, author, copies]
 *       properties:
 *         copies:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Cantidad de ejemplares a crear
 *
 *     Copy:
 *       type: object
 *       properties:
 *         id:   { type: integer, example: 7 }
 *         book: { $ref: '#/components/schemas/Book' }
 *
 *     Book:
 *       allOf:
 *         - $ref: '#/components/schemas/BookBase'
 *       properties:
 *         id: { type: integer, example: 1 }
 *
 *     BookWithCopies:
 *       allOf:
 *         - $ref: '#/components/schemas/Book'
 *       properties:
 *         copies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Copy'
 */

export default bookRoutes;