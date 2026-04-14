import { Router } from 'express';
import * as controller from '../controllers/leads.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/', auth, controller.criar);
router.get('/', auth, controller.listar);
router.post('/:id/status', auth, controller.atualizarStatus);
router.get('/:id/historico', auth, controller.historico);
router.post('/ordenar', auth, controller.ordenar);


export default router;