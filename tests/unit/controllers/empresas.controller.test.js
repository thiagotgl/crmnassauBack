import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockRequest, createMockResponse } from '../../helpers/httpMocks.js';

const mocks = vi.hoisted(() => ({
  listarEmpresas: vi.fn(),
  buscarEmpresaPorId: vi.fn()
}));

vi.mock('../../../src/services/empresas.service.js', () => ({
  listarEmpresas: mocks.listarEmpresas,
  buscarEmpresaPorId: mocks.buscarEmpresaPorId
}));

import {
  listar,
  buscarPorId
} from '../../../src/controllers/empresas.controller.js';

describe('empresas.controller', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.listarEmpresas.mockReset();
    mocks.buscarEmpresaPorId.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('listar', () => {
    it('retorna lista de empresas com status 200', async () => {
      const empresasMock = [{ id: 1, nome: 'Empresa A' }];
      mocks.listarEmpresas.mockResolvedValue(empresasMock);

      const req = createMockRequest();
      const res = createMockResponse();

      await listar(req, res);

      expect(mocks.listarEmpresas).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(empresasMock);
    });

    it('retorna erro 500 em caso de falha no service', async () => {
      const error = new Error('Erro ao listar empresas');
      error.statusCode = 500;
      mocks.listarEmpresas.mockRejectedValue(error);

      const req = createMockRequest();
      const res = createMockResponse();

      await listar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao listar empresas' });
    });
  });

  describe('buscarPorId', () => {
    it('retorna empresa por ID com status 200', async () => {
      const empresaMock = { id: 1, nome: 'Empresa A' };
      mocks.buscarEmpresaPorId.mockResolvedValue(empresaMock);

      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();

      await buscarPorId(req, res);

      expect(mocks.buscarEmpresaPorId).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(empresaMock);
    });

    it('retorna erro 404 quando empresa nao existe', async () => {
      const error = new Error('Empresa nao encontrada');
      error.statusCode = 404;
      mocks.buscarEmpresaPorId.mockRejectedValue(error);

      const req = createMockRequest({ params: { id: '999' } });
      const res = createMockResponse();

      await buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Empresa nao encontrada' });
    });
  });
});
