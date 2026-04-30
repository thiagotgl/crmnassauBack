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
