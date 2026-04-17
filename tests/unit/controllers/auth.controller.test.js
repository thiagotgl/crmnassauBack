import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockRequest, createMockResponse } from '../../helpers/httpMocks.js';

const mocks = vi.hoisted(() => ({
  prismaMock: {
    usuario: {
      findUnique: vi.fn()
    }
  },
  bcryptCompare: vi.fn(),
  jwtSign: vi.fn()
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mocks.prismaMock)
}));

vi.mock('bcrypt', () => ({
  default: {
    compare: mocks.bcryptCompare
  }
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: mocks.jwtSign
  }
}));

import { login } from '../../../src/controllers/auth.controller.js';

describe('auth.controller login', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mocks.prismaMock.usuario.findUnique.mockReset();
    mocks.bcryptCompare.mockReset();
    mocks.jwtSign.mockReset();
  });

  it('retorna 401 quando o email nao existe', async () => {
    mocks.prismaMock.usuario.findUnique.mockResolvedValue(null);

    const req = createMockRequest({
      body: { email: 'naoexiste@email.com', senha: '123456' }
    });
    const res = createMockResponse();

    await login(req, res);

    expect(mocks.prismaMock.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: 'naoexiste@email.com' }
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuario nao encontrado' });
  });

  it('retorna 401 quando a senha e invalida', async () => {
    mocks.prismaMock.usuario.findUnique.mockResolvedValue({
      id: 1,
      email: 'admin@local.dev',
      senha: 'hash-da-senha',
      tipo: 'admin',
      ativo: true
    });
    mocks.bcryptCompare.mockResolvedValue(false);

    const req = createMockRequest({
      body: { email: 'admin@local.dev', senha: 'senha-errada' }
    });
    const res = createMockResponse();

    await login(req, res);

    expect(mocks.bcryptCompare).toHaveBeenCalledWith('senha-errada', 'hash-da-senha');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Senha invalida' });
  });

  it('retorna 403 quando o usuario esta inativo', async () => {
    mocks.prismaMock.usuario.findUnique.mockResolvedValue({
      id: 2,
      email: 'inativo@local.dev',
      senha: 'hash-da-senha',
      tipo: 'vendedor',
      ativo: false
    });
    mocks.bcryptCompare.mockResolvedValue(true);

    const req = createMockRequest({
      body: { email: 'inativo@local.dev', senha: '123456' }
    });
    const res = createMockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuario inativo' });
  });

  it('retorna token JWT quando email, senha e status estao validos', async () => {
    mocks.prismaMock.usuario.findUnique.mockResolvedValue({
      id: 3,
      email: 'ativo@local.dev',
      senha: 'hash-da-senha',
      tipo: 'admin',
      ativo: true
    });
    mocks.bcryptCompare.mockResolvedValue(true);
    mocks.jwtSign.mockReturnValue('jwt-token-teste');

    const req = createMockRequest({
      body: { email: 'ativo@local.dev', senha: '123456' }
    });
    const res = createMockResponse();

    await login(req, res);

    expect(mocks.jwtSign).toHaveBeenCalledWith(
      { id: 3, tipo: 'admin' },
      'test-secret',
      { expiresIn: '1d' }
    );
    expect(res.json).toHaveBeenCalledWith({ token: 'jwt-token-teste' });
  });
});
