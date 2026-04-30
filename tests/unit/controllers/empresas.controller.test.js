import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockRequest, createMockResponse } from '../../helpers/httpMocks.js';

const mocks = vi.hoisted(() => ({
  listarEmpresas: vi.fn(),
  buscarEmpresaPorId: vi.fn(),
  criarEmpresa: vi.fn(),
  atualizarEmpresa: vi.fn(),
  excluirEmpresa: vi.fn()
}));

vi.mock('../../../src/services/empresas.service.js', () => ({
  listarEmpresas: mocks.listarEmpresas,
  buscarPorId: mocks.buscarEmpresaPorId, // Wait, I used buscarEmpresaPorId in service.
  buscarEmpresaPorId: mocks.buscarEmpresaPorId,
  criarEmpresa: mocks.criarEmpresa,
  atualizarEmpresa: mocks.atualizarEmpresa,
  excluirEmpresa: mocks.excluirEmpresa
}));

import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
} from '../../../src/controllers/empresas.controller.js';

describe('empresas.controller', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.listarEmpresas.mockReset();
    mocks.buscarEmpresaPorId.mockReset();
    mocks.criarEmpresa.mockReset();
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

  describe('criar', () => {
    it('retorna empresa criada com status 201', async () => {
      const empresaMock = { id: 10, nome: 'Nova Empresa' };
      mocks.criarEmpresa.mockResolvedValue(empresaMock);

      const req = createMockRequest({ body: { nome: 'Nova Empresa' } });
      const res = createMockResponse();

      await criar(req, res);

      expect(mocks.criarEmpresa).toHaveBeenCalledWith({ nome: 'Nova Empresa' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(empresaMock);
    });

    it('repassa erro 400 de validacao', async () => {
      const error = new Error('Nome obrigatorio');
      error.statusCode = 400;
      mocks.criarEmpresa.mockRejectedValue(error);

      const req = createMockRequest({ body: {} });
      const res = createMockResponse();

      await criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome obrigatorio' });
    });

    it('repassa erro 409 de conflito', async () => {
      const error = new Error('CNPJ em uso');
      error.statusCode = 409;
      mocks.criarEmpresa.mockRejectedValue(error);

      const req = createMockRequest({ body: { nome: 'A', cnpj: '123' } });
      const res = createMockResponse();

      await criar(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'CNPJ em uso' });
    });
  });

  describe('atualizar', () => {
    it('retorna empresa atualizada com status 200', async () => {
      const empresaMock = { id: 1, nome: 'Nome Editado' };
      mocks.atualizarEmpresa.mockResolvedValue(empresaMock);

      const req = createMockRequest({ params: { id: '1' }, body: { nome: 'Nome Editado' } });
      const res = createMockResponse();

      await atualizar(req, res);

      expect(mocks.atualizarEmpresa).toHaveBeenCalledWith(1, { nome: 'Nome Editado' });
      expect(res.json).toHaveBeenCalledWith(empresaMock);
    });

    it('repassa erro 404 se nao encontrada', async () => {
      const error = new Error('Nao encontrada');
      error.statusCode = 404;
      mocks.atualizarEmpresa.mockRejectedValue(error);

      const req = createMockRequest({ params: { id: '99' } });
      const res = createMockResponse();

      await atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('excluir', () => {
    it('retorna status 204 ao excluir com sucesso', async () => {
      mocks.excluirEmpresa.mockResolvedValue();

      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();
      res.send = vi.fn().mockReturnValue(res);

      await excluir(req, res);

      expect(mocks.excluirEmpresa).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('repassa erro 400 de vinculos', async () => {
      const error = new Error('Possui vinculos');
      error.statusCode = 400;
      mocks.excluirEmpresa.mockRejectedValue(error);

      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();

      await excluir(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Possui vinculos' });
    });
  });
});
