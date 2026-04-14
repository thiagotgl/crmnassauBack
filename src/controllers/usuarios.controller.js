import * as service from '../services/usuarios.service.js';

export async function criar(req, res) {
  try {
    const usuario = await service.criarUsuario(req.body);
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

export async function listar(req, res) {
  try {
    const usuarios = await service.listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

export async function atualizar(req, res) {
  try {
    const { id } = req.params;

    const usuario = await service.atualizarUsuario(
      Number(id),
      req.body
    );

    res.json(usuario);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}