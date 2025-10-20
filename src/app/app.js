import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { swaggerUi, swaggerSpec } from '../config/swagger.js';
import { errorHandler } from '../core/middlewares/errorHandler.js';
import { router as apiRouter } from './routes.js';

export function createApp() {
    dotenv.config();
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname  = path.dirname(__filename);

    const app = express();

    const publicDir = path.resolve(__dirname, './public');
    
    app.use(express.json());
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use('/api/static', express.static(publicDir, { maxAge: '30d', immutable: true }));

    app.get('/', (req, res) => { res.status(200).json('Running API'); });

    // Rutas de tu API
    app.use('/api', apiRouter);

    // Swagger UI (OpenAPI)
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Healthcheck rápido
    app.get('/health', (_req, res) => res.json({ ok: true }));

    app.use(errorHandler);

    return app;
}
