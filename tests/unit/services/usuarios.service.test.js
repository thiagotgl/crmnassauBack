import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prismaMock: {
    usuario: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn()
    }
  },
  bcryptHash: vi.fn()
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mocks.prismaMock)
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: mocks.bcryptHash
  }
}));

import {
  criarUsuario,
  buscarUsuarioPorId,
  atualizarPerfilUsuario,
  atualizarStatusAtivoUsuario,
  atualizarSenhaUsuario
} from '../../../src/services/usuarios.service.js';

describe('usuarios.service', () => {
  beforeEach(() => {
    mocks.prismaMock.usuario.create.mockReset();
    mocks.prismaMock.usuario.findUnique.mockReset();
    mocks.prismaMock.usuario.findMany.mockReset();
    mocks.prismaMock.usuario.update.mockReset();
    mocks.bcryptHash.mockReset();
  });

  it('cria usuario com senha criptografada e defaults seguros', async () => {
    mocks.bcryptHash.mockResolvedValue('senha-criptografada');
    mocks.prismaMock.usuario.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    mocks.prismaMock.usuario.create.mockResolvedValue({
      id: 1,
      nome: 'Maria',
      email: 'maria@email.com',
      cpf: '12345678900',
      tipo: 'vendedor',
      ativo: true,
      autenticadorAtivo: false
    });

    const result = await criarUsuario({
      nome: 'Maria',
      cpf: '12345678900',
      email: 'MARIA@email.com',
      senha: '123456',
      tipo: 'vendedor',
      ativo: false,
      autenticadorAtivo: true
    });

    expect(mocks.bcryptHash).toHaveBeenCalledWith('123456', 10);
    expect(mocks.prismaMock.usuario.findUnique).toHaveBeenNthCalledWith(1, {
      where: { email: 'maria@email.com' },
      select: { id: true }
    });
    expect(mocks.prismaMock.usuario.findUnique).toHaveBeenNthCalledWith(2, {
      where: { cpf: '12345678900' },
      select: { id: true }
    });
    expect(mocks.prismaMock.usuario.create).toHaveBeenCalledWith({
      data: {
        nome: 'Maria',
        cpf: '12345678900',
        email: 'maria@email.com',
        senha: 'senha-criptografada',
        tipo: 'vendedor',
        ativo: true,
        autenticadorAtivo: false,
        criadoEm: expect.any(Date)
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        ativo: true,
        autenticadorAtivo: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
    expect(result).toEqual({
      id: 1,
      nome: 'Maria',
      email: 'maria@email.com',
      cpf: '12345678900',
      tipo: 'vendedor',
      ativo: true,
      autenticadorAtivo: false
    });
  });

  it('rejeita cadastro quando email nao e enviado', async () => {
    await expect(
      criarUsuario({
        nome: 'Maria',
        cpf: '12345678900',
        senha: '123456',
        tipo: 'vendedor'
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'O campo email e obrigatorio'
    });
  });

  it('rejeita cadastro quando senha nao e enviada', async () => {
    await expect(
      criarUsuario({
        nome: 'Maria',
        cpf: '12345678900',
        email: 'maria@email.com',
        senha: '   ',
        tipo: 'vendedor'
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'O campo senha e obrigatorio'
    });
  });

  it('rejeita cadastro quando tipo nao e valido', async () => {
    await expect(
      criarUsuario({
        nome: 'Maria',
        cpf: '12345678900',
        email: 'maria@email.com',
        senha: '123456',
        tipo: 'gerente'
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'O campo tipo deve ser um valor valido de TipoUsuario'
    });
  });

  it('rejeita cadastro quando email ja existe', async () => {
    mocks.prismaMock.usuario.findUnique.mockResolvedValueOnce({ id: 1 });

    await expect(
      criarUsuario({
        nome: 'Maria',
        cpf: '12345678900',
        email: 'maria@email.com',
        senha: '123456',
        tipo: 'vendedor'
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: 'Ja existe um usuario com este email ou cpf'
    });
  });

  it('rejeita cadastro quando cpf ja existe', async () => {
    mocks.prismaMock.usuario.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 2 });

    await expect(
      criarUsuario({
        nome: 'Maria',
        cpf: '12345678900',
        email: 'maria@email.com',
        senha: '123456',
        tipo: 'vendedor'
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: 'Ja existe um usuario com este email ou cpf'
    });
  });

  it('busca usuario por id com select seguro', async () => {
    mocks.prismaMock.usuario.findUnique.mockResolvedValue({
      id: 5,
      nome: 'Ana',
      email: 'ana@email.com',
      cpf: '12345678900',
      tipo: 'cliente',
      ativo: true
    });

    const result = await buscarUsuarioPorId(5);

    expect(mocks.prismaMock.usuario.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        ativo: true,
        autenticadorAtivo: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
    expect(result).toEqual({
      id: 5,
      nome: 'Ana',
      email: 'ana@email.com',
      cpf: '12345678900',
      tipo: 'cliente',
      ativo: true
    });
  });

  it('retorna 404 quando usuario por id nao existe', async () => {
    mocks.prismaMock.usuario.findUnique.mockResolvedValue(null);

    await expect(buscarUsuarioPorId(999)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Usuario nao encontrado'
    });
  });

  it('atualiza o campo ativo quando recebe boolean', async () => {
    mocks.prismaMock.usuario.update.mockResolvedValue({
      id: 2,
      ativo: false
    });

    const result = await atualizarStatusAtivoUsuario(2, false);

    expect(mocks.prismaMock.usuario.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { ativo: false },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        ativo: true,
        autenticadorAtivo: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
    expect(result).toEqual({
      id: 2,
      ativo: false
    });
  });

  it('rejeita atualizacao de ativo quando o valor nao e boolean', async () => {
    await expect(atualizarStatusAtivoUsuario(2, 'false')).rejects.toMatchObject({
      statusCode: 400,
      message: 'O campo ativo deve ser enviado como true ou false'
    });
  });

  it('atualiza apenas nome, email e cpf no perfil do usuario quando tipo nao e permitido', async () => {
    mocks.prismaMock.usuario.update.mockResolvedValue({
      id: 4,
      nome: 'Joao',
      email: 'joao@email.com',
      cpf: '12345678900'
    });

    await atualizarPerfilUsuario(4, {
      nome: 'Joao',
      email: 'joao@email.com',
      cpf: '12345678900',
      ativo: false,
      tipo: 'admin'
    });

    expect(mocks.prismaMock.usuario.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: {
        nome: 'Joao',
        email: 'joao@email.com',
        cpf: '12345678900'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        ativo: true,
        autenticadorAtivo: true,
        dataConfirmacao2FA: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
  });

  it('atualiza o tipo do usuario quando permitido', async () => {
    mocks.prismaMock.usuario.update.mockResolvedValue({
      id: 4,
      nome: 'Joao',
      email: 'joao@email.com',
      cpf: '12345678900',
      tipo: 'supervisor'
    });

    const result = await atualizarPerfilUsuario(4, {
      tipo: ' supervisor '
    }, true);

    expect(mocks.prismaMock.usuario.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: {
        tipo: 'supervisor'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        ativo: true,
        autenticadorAtivo: true,
        dataConfirmacao2FA: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
    expect(result).toEqual({
      id: 4,
      nome: 'Joao',
      email: 'joao@email.com',
      cpf: '12345678900',
      tipo: 'supervisor'
    });
  });

  it('rejeita atualizacao de tipo invalido quando tipo e permitido', async () => {
    await expect(
      atualizarPerfilUsuario(4, {
        tipo: 'gerente'
      }, true)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'O campo tipo deve ser um valor valido de TipoUsuario'
    });
  });

  it('rejeita atualizacao de perfil quando nenhum campo permitido e enviado', async () => {
    await expect(
      atualizarPerfilUsuario(4, {
        ativo: false,
        tipo: 'admin'
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'Nenhum campo valido enviado para atualizacao'
    });
  });

  it('rejeita atualizacao de perfil quando o body nao e enviado', async () => {
    await expect(atualizarPerfilUsuario(4, undefined)).rejects.toMatchObject({
      statusCode: 400,
      message: 'O corpo da requisicao deve conter nome, email, cpf ou tipo'
    });
  });

  it('atualiza a senha com hash antes de salvar', async () => {
    mocks.bcryptHash.mockResolvedValue('senha-criptografada');
    mocks.prismaMock.usuario.update.mockResolvedValue({
      id: 9,
      email: 'usuario@email.com',
      ativo: true
    });

    const result = await atualizarSenhaUsuario(9, 'NovaSenha123');

    expect(mocks.bcryptHash).toHaveBeenCalledWith('NovaSenha123', 10);
    expect(mocks.prismaMock.usuario.update).toHaveBeenCalledWith({
      where: { id: 9 },
      data: { senha: 'senha-criptografada' },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        ativo: true,
        autenticadorAtivo: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
    expect(result).toEqual({
      id: 9,
      email: 'usuario@email.com',
      ativo: true
    });
  });

  it('rejeita atualizacao de senha quando a senha e vazia', async () => {
    await expect(atualizarSenhaUsuario(9, '')).rejects.toMatchObject({
      statusCode: 400,
      message: 'O campo senha deve ser enviado e nao pode ser vazio'
    });
  });
});
