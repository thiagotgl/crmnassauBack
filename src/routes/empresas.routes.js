import { Router } from 'express';
import * as controller from '../controllers/empresas.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, controller.listar);
router.get('/:id', auth, controller.buscarPorId);

export default router;
