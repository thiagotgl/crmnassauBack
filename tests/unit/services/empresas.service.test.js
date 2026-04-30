import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prismaMock: {
    empresa: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mocks.prismaMock)
}));

import {
  listarEmpresas,
  buscarEmpresaPorId,
  criarEmpresa,
  atualizarEmpresa,
  excluirEmpresa
} from '../../../src/services/empresas.service.js';

describe('empresas.service', () => {
  beforeEach(() => {
    mocks.prismaMock.empresa.findUnique.mockReset();
    mocks.prismaMock.empresa.findMany.mockReset();
    mocks.prismaMock.empresa.create.mockReset();
    mocks.prismaMock.empresa.update.mockReset();
    mocks.prismaMock.empresa.delete.mockReset();
  });

  describe('listarEmpresas', () => {
    it('lista todas as empresas ordenadas por nome com contagem de leads e contatos', async () => {
      const empresasMock = [
        { id: 1, nome: 'Empresa A', _count: { leads: 2, contatos: 1 } },
        { id: 2, nome: 'Empresa B', _count: { leads: 0, contatos: 0 } }
      ];
      mocks.prismaMock.empresa.findMany.mockResolvedValue(empresasMock);

      const result = await listarEmpresas();

      expect(mocks.prismaMock.empresa.findMany).toHaveBeenCalledWith({
        orderBy: { nome: 'asc' },
        include: {
          _count: {
            select: { leads: true, contatos: true }
          }
        }
      });
      expect(result).toEqual(empresasMock);
    });

    it('lança erro 500 em caso de falha no banco', async () => {
      mocks.prismaMock.empresa.findMany.mockRejectedValue(new Error('DB Error'));

      await expect(listarEmpresas()).rejects.toMatchObject({
        statusCode: 500,
        message: 'Erro ao listar empresas'
      });
    });
  });

  describe('buscarEmpresaPorId', () => {
    it('busca empresa por ID incluindo contatos e leads', async () => {
      const empresaMock = {
        id: 1,
        nome: 'Empresa A',
        contatos: [],
        leads: []
      };
      mocks.prismaMock.empresa.findUnique.mockResolvedValue(empresaMock);

      const result = await buscarEmpresaPorId(1);

      expect(mocks.prismaMock.empresa.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          contatos: true,
          leads: true
        }
      });
      expect(result).toEqual(empresaMock);
    });

    it('retorna 404 quando empresa nao existe', async () => {
      mocks.prismaMock.empresa.findUnique.mockResolvedValue(null);

      await expect(buscarEmpresaPorId(999)).rejects.toMatchObject({
        statusCode: 404,
        message: 'Empresa nao encontrada'
      });
    });
  });

  describe('criarEmpresa', () => {
    it('cria uma empresa com sucesso limpando o cnpj', async () => {
      const input = {
        nome: '  Empresa XPTO  ',
        cnpj: '12.345.678/0001-99',
        telefone: '81988887777',
        email: 'contato@xpto.com'
      };

      mocks.prismaMock.empresa.findUnique.mockResolvedValue(null);
      mocks.prismaMock.empresa.create.mockResolvedValue({ id: 10, ...input, cnpj: '12345678000199' });

      const result = await criarEmpresa(input);

      expect(mocks.prismaMock.empresa.findUnique).toHaveBeenCalledWith({
        where: { cnpj: '12345678000199' }
      });
      expect(mocks.prismaMock.empresa.create).toHaveBeenCalledWith({
        data: {
          nome: '  Empresa XPTO  ',
          cnpj: '12345678000199',
          telefone: '81988887777',
          email: 'contato@xpto.com'
        }
      });
      expect(result.id).toBe(10);
    });

    it('rejeita criacao sem nome', async () => {
      await expect(criarEmpresa({ cnpj: '123' })).rejects.toMatchObject({
        statusCode: 400,
        message: 'O nome da empresa e obrigatorio'
      });
    });

    it('rejeita criacao com cnpj duplicado', async () => {
      mocks.prismaMock.empresa.findUnique.mockResolvedValue({ id: 5 });

      await expect(criarEmpresa({ nome: 'A', cnpj: '123' })).rejects.toMatchObject({
        statusCode: 409,
        message: 'Ja existe uma empresa cadastrada com este CNPJ'
      });
    });
  });

  describe('atualizarEmpresa', () => {
    it('atualiza empresa com sucesso', async () => {
      mocks.prismaMock.empresa.findUnique.mockResolvedValue({ id: 1, cnpj: '123' });
      mocks.prismaMock.empresa.update.mockResolvedValue({ id: 1, nome: 'Novo Nome' });

      const result = await atualizarEmpresa(1, { nome: 'Novo Nome' });

      expect(mocks.prismaMock.empresa.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'Novo Nome', cnpj: undefined }
      });
      expect(result.nome).toBe('Novo Nome');
    });

    it('rejeita se empresa nao existe', async () => {
      mocks.prismaMock.empresa.findUnique.mockResolvedValue(null);
      await expect(atualizarEmpresa(99, {})).rejects.toMatchObject({ statusCode: 404 });
    });

    it('rejeita se cnpj duplicado', async () => {
      mocks.prismaMock.empresa.findUnique
        .mockResolvedValueOnce({ id: 1, cnpj: '123' }) // find original
        .mockResolvedValueOnce({ id: 2, cnpj: '456' }); // find duplicate

      await expect(atualizarEmpresa(1, { cnpj: '456' })).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('excluirEmpresa', () => {
    it('exclui empresa sem vinculos', async () => {
      mocks.prismaMock.empresa.findUnique.mockResolvedValue({
        id: 1,
        _count: { leads: 0, contatos: 0 }
      });

      await excluirEmpresa(1);

      expect(mocks.prismaMock.empresa.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('rejeita exclusao com leads vinculados', async () => {
      mocks.prismaMock.empresa.findUnique.mockResolvedValue({
        id: 1,
        _count: { leads: 1, contatos: 0 }
      });

      await expect(excluirEmpresa(1)).rejects.toMatchObject({
        statusCode: 400,
        message: 'Nao e possivel excluir uma empresa que possui leads ou contatos vinculados'
      });
    });
  });
});
