import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Biblioteca API',
      version: '1.0.0',
      description: 'Documentación de la API de Biblioteca',
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor local',
      }
    ],
  },
  apis: [
    path.join(__dirname, 'routes.js'),

    path.join(__dirname, '..', 'modules', '**', '*.routes.js'),
    path.join(__dirname, '..', 'modules', '**', '*.controller.js'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
