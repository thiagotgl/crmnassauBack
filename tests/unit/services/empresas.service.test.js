import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prismaMock: {
    empresa: {
      findUnique: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mocks.prismaMock)
}));

import {
  listarEmpresas,
  buscarEmpresaPorId
} from '../../../src/services/empresas.service.js';

describe('empresas.service', () => {
  beforeEach(() => {
    mocks.prismaMock.empresa.findUnique.mockReset();
    mocks.prismaMock.empresa.findMany.mockReset();
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
});
