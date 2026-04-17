import * as service from '../services/usuarios.service.js';
import { usuarioErrorMessages } from '../constants/errorMessages.js';

export async function criar(req, res) {
  try {
    const usuario = await service.criarUsuario(req.body);
    res.json(usuario);
  } catch (err) {
    console.error(err);

    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: usuarioErrorMessages.erroCriar });
  }
}

export async function listar(req, res) {
  try {
    const usuarios = await service.listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuarios' });
  }
}

export async function atualizarStatusAtivo(req, res) {
  try {
    const id = Number(req.params.id);
    const { ativo } = req.body;

    const usuario = await service.atualizarStatusAtivoUsuario(id, ativo);

    res.json(usuario);
  } catch (err) {
    console.error(err);

    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: usuarioErrorMessages.erroAtualizarStatus });
  }
}

export async function atualizarSenha(req, res) {
  try {
    const id = Number(req.params.id);
    const { senha } = req.body;

    const usuario = await service.atualizarSenhaUsuario(id, senha);

    res.json(usuario);
  } catch (err) {
    console.error(err);

    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: usuarioErrorMessages.erroAtualizarSenha });
  }
}

export async function atualizarPerfil(req, res) {
  try {
    const id = Number(req.params.id);
    const podeEditarOutroUsuario = req.user?.tipo === 'admin';

    if (req.user.id !== id && !podeEditarOutroUsuario) {
      return res.status(403).json({
        error: usuarioErrorMessages.perfilSemPermissao
      });
    }

    const usuario = await service.atualizarPerfilUsuario(id, req.body);

    res.json(usuario);
  } catch (err) {
    console.error(err);

    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: usuarioErrorMessages.erroAtualizarPerfil });
  }
}
