import { Router } from 'express';
import * as controller from '../controllers/empresas.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, controller.listar);
router.post('/', auth, controller.criar);
router.get('/:id', auth, controller.buscarPorId);
router.put('/:id', auth, controller.atualizar);
router.delete('/:id', auth, controller.excluir);

export default router;
