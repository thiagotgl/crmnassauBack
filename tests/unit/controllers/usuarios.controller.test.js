import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockRequest, createMockResponse } from '../../helpers/httpMocks.js';

const mocks = vi.hoisted(() => ({
  atualizarPerfilUsuario: vi.fn(),
  atualizarStatusAtivoUsuario: vi.fn(),
  atualizarSenhaUsuario: vi.fn(),
  criarUsuario: vi.fn(),
  listarUsuarios: vi.fn()
}));

vi.mock('../../../src/services/usuarios.service.js', () => ({
  criarUsuario: mocks.criarUsuario,
  listarUsuarios: mocks.listarUsuarios,
  atualizarPerfilUsuario: mocks.atualizarPerfilUsuario,
  atualizarStatusAtivoUsuario: mocks.atualizarStatusAtivoUsuario,
  atualizarSenhaUsuario: mocks.atualizarSenhaUsuario
}));

import {
  atualizarPerfil,
  atualizarStatusAtivo,
  atualizarSenha
} from '../../../src/controllers/usuarios.controller.js';

describe('usuarios.controller', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.criarUsuario.mockReset();
    mocks.atualizarPerfilUsuario.mockReset();
    mocks.atualizarStatusAtivoUsuario.mockReset();
    mocks.atualizarSenhaUsuario.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('cria usuario quando o service retorna sucesso', async () => {
    mocks.criarUsuario.mockResolvedValue({
      id: 1,
      nome: 'Maria',
      email: 'maria@email.com',
      tipo: 'vendedor',
      ativo: true
    });

    const { criar } = await import('../../../src/controllers/usuarios.controller.js');
    const req = createMockRequest({
      body: {
        nome: 'Maria',
        cpf: '12345678900',
        email: 'maria@email.com',
        senha: '123456',
        tipo: 'vendedor'
      }
    });
    const res = createMockResponse();

    await criar(req, res);

    expect(mocks.criarUsuario).toHaveBeenCalledWith({
      nome: 'Maria',
      cpf: '12345678900',
      email: 'maria@email.com',
      senha: '123456',
      tipo: 'vendedor'
    });
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nome: 'Maria',
      email: 'maria@email.com',
      tipo: 'vendedor',
      ativo: true
    });
  });

  it('repassa erro de validacao no cadastro', async () => {
    const error = new Error('O campo email e obrigatorio');
    error.statusCode = 400;
    mocks.criarUsuario.mockRejectedValue(error);

    const { criar } = await import('../../../src/controllers/usuarios.controller.js');
    const req = createMockRequest({
      body: {
        nome: 'Maria'
      }
    });
    const res = createMockResponse();

    await criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'O campo email e obrigatorio'
    });
  });

  it('retorna 403 quando o usuario tenta editar outro perfil', async () => {
    const req = createMockRequest({
      params: { id: '10' },
      user: { id: 1, tipo: 'vendedor' },
      body: { nome: 'Outro Nome' }
    });
    const res = createMockResponse();

    await atualizarPerfil(req, res);

    expect(mocks.atualizarPerfilUsuario).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Voce so pode editar o proprio usuario, exceto se for admin'
    });
  });

  it('atualiza o proprio perfil quando o id do token coincide com o id da rota', async () => {
    mocks.atualizarPerfilUsuario.mockResolvedValue({
      id: 3,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      cpf: '12345678900'
    });

    const req = createMockRequest({
      params: { id: '3' },
      user: { id: 3 },
      body: {
        nome: 'Maria Silva',
        email: 'maria@email.com',
        cpf: '12345678900'
      },
      user: { id: 3, tipo: 'vendedor' }
    });
    const res = createMockResponse();

    await atualizarPerfil(req, res);

    expect(mocks.atualizarPerfilUsuario).toHaveBeenCalledWith(3, {
      nome: 'Maria Silva',
      email: 'maria@email.com',
      cpf: '12345678900'
    });
    expect(res.json).toHaveBeenCalledWith({
      id: 3,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      cpf: '12345678900'
    });
  });

  it('permite que admin atualize o perfil de outro usuario', async () => {
    mocks.atualizarPerfilUsuario.mockResolvedValue({
      id: 10,
      nome: 'Outro Usuario',
      email: 'outro@email.com',
      cpf: '12345678900'
    });

    const req = createMockRequest({
      params: { id: '10' },
      user: { id: 1, tipo: 'admin' },
      body: {
        nome: 'Outro Usuario',
        email: 'outro@email.com',
        cpf: '12345678900'
      }
    });
    const res = createMockResponse();

    await atualizarPerfil(req, res);

    expect(mocks.atualizarPerfilUsuario).toHaveBeenCalledWith(10, {
      nome: 'Outro Usuario',
      email: 'outro@email.com',
      cpf: '12345678900'
    });
    expect(res.json).toHaveBeenCalledWith({
      id: 10,
      nome: 'Outro Usuario',
      email: 'outro@email.com',
      cpf: '12345678900'
    });
  });

  it('repassa erro de validacao no put de perfil', async () => {
    const error = new Error('Nenhum campo valido enviado para atualizacao');
    error.statusCode = 400;
    mocks.atualizarPerfilUsuario.mockRejectedValue(error);

    const req = createMockRequest({
      params: { id: '3' },
      user: { id: 3, tipo: 'vendedor' },
      body: {}
    });
    const res = createMockResponse();

    await atualizarPerfil(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Nenhum campo valido enviado para atualizacao'
    });
  });

  it('atualiza o status ativo do usuario no put admin', async () => {
    mocks.atualizarStatusAtivoUsuario.mockResolvedValue({
      id: 7,
      ativo: false
    });

    const req = createMockRequest({
      params: { id: '7' },
      body: { ativo: false },
      user: { id: 1, tipo: 'admin' }
    });
    const res = createMockResponse();

    await atualizarStatusAtivo(req, res);

    expect(mocks.atualizarStatusAtivoUsuario).toHaveBeenCalledWith(7, false);
    expect(res.json).toHaveBeenCalledWith({
      id: 7,
      ativo: false
    });
  });

  it('repassa erro de validacao no put de ativo', async () => {
    const error = new Error('O campo ativo deve ser enviado como true ou false');
    error.statusCode = 400;
    mocks.atualizarStatusAtivoUsuario.mockRejectedValue(error);

    const req = createMockRequest({
      params: { id: '7' },
      body: { ativo: 'false' },
      user: { id: 1, tipo: 'admin' }
    });
    const res = createMockResponse();

    await atualizarStatusAtivo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'O campo ativo deve ser enviado como true ou false'
    });
  });

  it('atualiza a senha do usuario no put admin', async () => {
    mocks.atualizarSenhaUsuario.mockResolvedValue({
      id: 8,
      email: 'usuario@email.com',
      ativo: true
    });

    const req = createMockRequest({
      params: { id: '8' },
      body: { senha: 'NovaSenha123' },
      user: { id: 1, tipo: 'admin' }
    });
    const res = createMockResponse();

    await atualizarSenha(req, res);

    expect(mocks.atualizarSenhaUsuario).toHaveBeenCalledWith(8, 'NovaSenha123');
    expect(res.json).toHaveBeenCalledWith({
      id: 8,
      email: 'usuario@email.com',
      ativo: true
    });
  });

  it('repassa erro de validacao no put de senha', async () => {
    const error = new Error('O campo senha deve ser enviado e nao pode ser vazio');
    error.statusCode = 400;
    mocks.atualizarSenhaUsuario.mockRejectedValue(error);

    const req = createMockRequest({
      params: { id: '8' },
      body: { senha: '' },
      user: { id: 1, tipo: 'admin' }
    });
    const res = createMockResponse();

    await atualizarSenha(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'O campo senha deve ser enviado e nao pode ser vazio'
    });
  });
});
