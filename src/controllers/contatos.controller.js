import * as service from '../services/contatos.service.js';
import { contatoErrorMessages } from '../constants/errorMessages.js';

export async function listar(req, res) {
  try {
    const contatos = await service.listarContatos();
    res.json(contatos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: contatoErrorMessages.erroListar });
  }
}

export async function buscarPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const contato = await service.buscarContatoPorId(id);
    res.json(contato);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: contatoErrorMessages.erroBuscar });
  }
}

export async function criar(req, res) {
  try {
    const contato = await service.criarContato(req.body);
    res.status(200).json(contato); // Usando 200 conforme padrão do projeto
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: contatoErrorMessages.erroCriar });
  }
}

export async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const contato = await service.atualizarContato(id, req.body);
    res.json(contato);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: contatoErrorMessages.erroAtualizar });
  }
}

export async function excluir(req, res) {
  try {
    const id = Number(req.params.id);
    await service.excluirContato(id);
    res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: contatoErrorMessages.erroExcluir });
  }
}
