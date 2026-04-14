export function onlyAdmin(req, res, next) {
  const usuario = req.usuario; // vindo do JWT

  if (!usuario || usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  next();
}