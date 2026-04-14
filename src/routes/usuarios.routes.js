import { Router } from 'express';
import * as controller from '../controllers/usuarios.controller.js';
import { auth } from '../middlewares/auth.js';
import { onlyAdmin } from '../middlewares/authAdmin.js';

const router = Router();

router.post('/', auth, onlyAdmin, controller.criar);
router.get('/', auth, controller.listar);
router.post('/:id', auth, onlyAdmin, controller.atualizar);

export default router;