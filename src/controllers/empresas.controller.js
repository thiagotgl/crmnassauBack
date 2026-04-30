import * as service from '../services/empresas.service.js';
import { empresaErrorMessages } from '../constants/errorMessages.js';

export async function listar(req, res) {
  try {
    const empresas = await service.listarEmpresas();
    res.json(empresas);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: empresaErrorMessages.erroListar });
  }
}

export async function buscarPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const empresa = await service.buscarEmpresaPorId(id);
    res.json(empresa);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: empresaErrorMessages.erroBuscar });
  }
}

export async function criar(req, res) {
  try {
    const empresa = await service.criarEmpresa(req.body);
    res.status(201).json(empresa);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
}

export async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const empresa = await service.atualizarEmpresa(id, req.body);
    res.json(empresa);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
}

export async function excluir(req, res) {
  try {
    const id = Number(req.params.id);
    await service.excluirEmpresa(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao excluir empresa' });
  }
}
