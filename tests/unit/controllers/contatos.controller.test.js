import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  listarContatos: vi.fn(),
  buscarContatoPorId: vi.fn(),
  criarContato: vi.fn(),
  atualizarContato: vi.fn(),
  excluirContato: vi.fn()
}));

vi.mock('../../../src/services/contatos.service.js', () => ({
  listarContatos: mocks.listarContatos,
  buscarContatoPorId: mocks.buscarContatoPorId,
  criarContato: mocks.criarContato,
  atualizarContato: mocks.atualizarContato,
  excluirContato: mocks.excluirContato
}));

import { listar, criar, excluir } from '../../../src/controllers/contatos.controller.js';

describe('contatos.controller', () => {
  const createMockRequest = (overrides = {}) => ({
    params: {},
    body: {},
    ...overrides
  });

  const createMockResponse = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('criar', () => {
    it('retorna contato criado com status 200', async () => {
      const contatoMock = { id: 1, nome: 'Joao' };
      mocks.criarContato.mockResolvedValue(contatoMock);

      const req = createMockRequest({ body: { nome: 'Joao' } });
      const res = createMockResponse();

      await criar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(contatoMock);
    });

    it('repassa erro do servico', async () => {
      const error = new Error('CPF em uso');
      error.statusCode = 409;
      mocks.criarContato.mockRejectedValue(error);

      const req = createMockRequest();
      const res = createMockResponse();

      await criar(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'CPF em uso' });
    });
  });

  describe('excluir', () => {
    it('retorna 204 no sucesso', async () => {
      mocks.excluirContato.mockResolvedValue();
      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();

      await excluir(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
