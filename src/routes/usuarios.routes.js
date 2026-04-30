import { Router } from 'express';
import * as controller from '../controllers/usuarios.controller.js';
import { auth } from '../middlewares/auth.js';
import { onlyAdmin } from '../middlewares/authAdmin.js';

const router = Router();

router.post('/', auth, onlyAdmin, controller.criar);
router.get('/', auth, controller.listar);
router.get('/:id', auth, controller.buscarPorId);
router.put('/:id', auth, controller.atualizarPerfil);
router.put('/:id/ativo', auth, onlyAdmin, controller.atualizarStatusAtivo);
router.put('/:id/senha', auth, onlyAdmin, controller.atualizarSenha);

export default router;
