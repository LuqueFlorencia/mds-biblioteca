import { Router } from 'express';
import bookRoutes from '../modules/routes/book.routes.js';
import loanRoutes from '../modules/routes/loan.routes.js';
import personRoutes from '../modules/routes/person.routes.js';

export const router = Router();

router.use('/book', bookRoutes);
router.use('/loan', loanRoutes);
router.use('/person', personRoutes);
