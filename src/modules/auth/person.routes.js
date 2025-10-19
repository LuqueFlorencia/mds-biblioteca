import express from 'express';
import { register, } from './person.controller.js';

const authRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ApiMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Operación realizada con éxito.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Credenciales inválidas.
 *     UserPublic:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Ana López"
 *         email:
 *           type: string
 *           format: email
 *           example: "ana@example.com"
 *     RegisterRequest:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           example: "Ana López"
 *         email:
 *           type: string
 *           format: email
 *           example: "ana@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "S3gura!2025"
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Usuario creado correctamente."
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "ana@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "S3gura!2025"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *         user:
 *           $ref: '#/components/schemas/UserPublic'
 *         expiresIn:
 *           type: string
 *           description: TTL configurado para el access token
 *           example: "60m"
 *     RefreshRequest:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *         expiresIn:
 *           type: string
 *           example: "60m"
 *     LogoutRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *     ForgotPasswordRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "ana@example.com"
 *     ForgotPasswordResponse:
 *       oneOf:
 *         - $ref: '#/components/schemas/ApiMessage'
 *         - type: object
 *           description: Respuesta alternativa si el envío de mail falla (modo debug)
 *           properties:
 *             message:
 *               type: string
 *               example: "Token creado."
 *             token:
 *               type: string
 *               example: "c1a2b3...e9f0"
 *             expiresAt:
 *               type: string
 *               format: date-time
 *               example: "2025-07-21T15:30:00.000Z"
 *             resetUrl:
 *               type: string
 *               example: "http://localhost:4200/reset-password?token=c1a2b3...e9f0"
 *     ResetPasswordRequest:
 *       type: object
 *       required: [token, newPassword]
 *       properties:
 *         token:
 *           type: string
 *           example: "c1a2b3...e9f0"
 *         newPassword:
 *           type: string
 *           format: password
 *           example: "Nuev4!Clave2025"
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Contraseña reestablecida.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de usuario
 *     description: Crea un nuevo usuario. Hash de contraseña en backend.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterRequest' }
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RegisterResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: Email ya registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
authRouter.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Valida credenciales y devuelve tokens JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRequest' }
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoginResponse' }
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
authRouter.post('/login', login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renovar access token
 *     description: Genera un nuevo access token a partir de un refresh token válido.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RefreshRequest' }
 *     responses:
 *       200:
 *         description: Token renovado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RefreshResponse' }
 *       400:
 *         description: Falta el refresh token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401:
 *         description: Refresh token inválido o expirado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
authRouter.post('/refresh', refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida el refresh token almacenado para el usuario.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LogoutRequest' }
 *     responses:
 *       200:
 *         description: Logout OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */
authRouter.post('/logout', logout); // si mandás userId en body, no requiere auth

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     description: Genera un token de reseteo y envía email con el enlace de recuperación.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ForgotPasswordRequest' }
 *     responses:
 *       200:
 *         description: Mensaje de confirmación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ForgotPasswordResponse' }
 *       400:
 *         description: Email inválido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
authRouter.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña
 *     description: Consume el token de reseteo y establece una nueva contraseña.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ResetPasswordRequest' }
 *     responses:
 *       200:
 *         description: Contraseña restablecida
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ResetPasswordResponse' }
 *       400:
 *         description: Token o datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401:
 *         description: Token expirado o ya usado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
authRouter.post('/reset-password', resetPassword);

export default authRouter;
