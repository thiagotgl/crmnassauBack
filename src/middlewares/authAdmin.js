import { authErrorMessages } from '../constants/errorMessages.js';

export function onlyAdmin(req, res, next) {
  const usuario = req.user;

  if (!usuario || usuario.tipo !== 'admin') {
    return res.status(403).json({ error: authErrorMessages.acessoNegado });
  }

  next();
}
