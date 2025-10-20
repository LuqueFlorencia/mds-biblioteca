import express from 'express';
import { registerNewMember, registerNewLibrarian, listMemberDebts, getAllSocios, getAllBibliotecarios } from '../controllers/person.controller.js';
import { memberCreateRequest, librarianCreateRequest } from '../schemas/person.schema.js';
import { validateBody, validateParams } from '../../core/middlewares/validate.js';
import { idParamSchema } from '../../shared/utils/joi.primitives.js';

const personRoutes = express.Router();

/**
 * @swagger
 * /person/socio:
 *   post:
 *     summary: Registrar un nuevo socio
 *     tags: [People]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MemberCreateRequest' }
 *     responses:
 *       201:
 *         description: Socio registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
personRoutes.post('/socio/', validateBody(memberCreateRequest), registerNewMember);

/**
 * @swagger
 * /person/bibliotecario:
 *   post:
 *     summary: Registrar un nuevo bibliotecario
 *     tags: [People]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LibrarianCreateRequest' }
 *     responses:
 *       201:
 *         description: Bibliotecario registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
personRoutes.post('/bibliotecario/', validateBody(librarianCreateRequest), registerNewLibrarian);

/**
 * @swagger
 * /person/{id}/deudas:
 *   get:
 *     summary: Listar deudas de un socio
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 5 }
 *       - in: query
 *         name: onlyUnpaid
 *         schema: { type: boolean, default: true }
 *         description: Si es true, trae solo impagas
 *     responses:
 *       200:
 *         description: Deudas del socio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Debt' }
 *       404: { description: Socio no encontrado }
 */
personRoutes.get('/:id(\\d+)/deudas/', validateParams(idParamSchema), listMemberDebts);

/**
 * @swagger
 * /person/socios:
 *   get:
 *     summary: Obtener todas los socios 
 *     tags: [People]
 *     responses:
 *       200:
 *         description: Lista de socios
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeopleList' }
 */
personRoutes.get('/socios/', getAllSocios);

/**
 * @swagger
 * /person/bibliotecarios:
 *   get:
 *     summary: Obtener todas los bibliotecarios 
 *     tags: [People]
 *     responses:
 *       200:
 *         description: Lista de bibliotecarios
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeopleList' }
 */
personRoutes.get('/bibliotecarios/', getAllBibliotecarios);

/**
 * @swagger
 * components:
 *   schemas: 
 *     PersonBase:
 *       type: object
 *       properties:
 *         name: { type: string, maxLength: 250, description: Nombre de la persona, example: Juan }
 *         lastname: { type: string, maxLength: 250, description: Apellido de la persona, example: Perez }
 *         dni: { type: string, maxLength: 9, description: DNI de la persona (sin puntos), example: 12345678 }
 * 
 *     MemberCreateRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/PersonBase'
 *       required: [name, lastname, dni]
 * 
 *     LibrarianCreateRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/PersonBase'
 *       required: [name, lastname, dni]
 * 
 *     Person:
 *       allOf:
 *         - $ref: '#/components/schemas/PersonBase'
 *       properties:
 *         id: { type: integer, example: 1 }
 *         enrollment_librarian: { type: string, example: B-xxxx }
 *         member_id: { type: string, example: S-xxxx }
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
 * 
 *     PeopleList:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Person'
 */

export default personRoutes;