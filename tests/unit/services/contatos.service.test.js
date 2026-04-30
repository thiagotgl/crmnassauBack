import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  prismaMock: {
    contato: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    empresa: {
      findUnique: vi.fn()
    }
  }
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mocks.prismaMock)
}));

import {
  listarContatos,
  buscarContatoPorId,
  criarContato,
  atualizarContato,
  excluirContato
} from '../../../src/services/contatos.service.js';

describe('contatos.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('criarContato', () => {
    it('cria contato com sucesso', async () => {
      mocks.prismaMock.contato.findUnique.mockResolvedValue(null);
      mocks.prismaMock.contato.create.mockResolvedValue({ id: 1, nome: 'Joao' });

      const result = await criarContato({ nome: 'Joao', cpf: '123' });

      expect(mocks.prismaMock.contato.create).toHaveBeenCalled();
      expect(result.nome).toBe('Joao');
    });

    it('rejeita se nome for vazio', async () => {
      await expect(criarContato({ nome: '' })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('rejeita se CPF ja existe', async () => {
      mocks.prismaMock.contato.findUnique.mockResolvedValue({ id: 2 });
      await expect(criarContato({ nome: 'Joao', cpf: '123' })).rejects.toMatchObject({ statusCode: 409 });
    });

    it('rejeita se empresa informada nao existe', async () => {
      mocks.prismaMock.contato.findUnique.mockResolvedValue(null);
      mocks.prismaMock.empresa.findUnique.mockResolvedValue(null);
      await expect(criarContato({ nome: 'Joao', empresaId: 99 })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('excluirContato', () => {
    it('exclui contato sem leads', async () => {
      mocks.prismaMock.contato.findUnique.mockResolvedValue({
        id: 1,
        _count: { leads: 0 }
      });

      await excluirContato(1);
      expect(mocks.prismaMock.contato.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('bloqueia exclusao com leads', async () => {
      mocks.prismaMock.contato.findUnique.mockResolvedValue({
        id: 1,
        _count: { leads: 1 }
      });

      await expect(excluirContato(1)).rejects.toMatchObject({ statusCode: 400 });
    });
  });
});
