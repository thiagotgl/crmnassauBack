import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { usuarioErrorMessages } from '../constants/errorMessages.js';

const prisma = new PrismaClient();
const tiposUsuarioValidos = ['admin', 'vendedor', 'cliente', 'supervisor'];
const usuarioSelectSeguro = {
  id: true,
  nome: true,
  email: true,
  cpf: true,
  tipo: true,
  ativo: true,
  autenticadorAtivo: true,
  criadoEm: true,
  atualizadoEm: true
};

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizePrismaUsuarioUpdateError(err) {
  if (err?.code === 'P2025') {
    throw createHttpError(usuarioErrorMessages.usuarioNaoEncontrado, 404);
  }

  if (err?.code === 'P2002') {
    throw createHttpError(usuarioErrorMessages.emailOuCpfEmUso, 409);
  }

  throw err;
}

export async function criarUsuario(data) {
  if (!data || typeof data !== 'object') {
    throw createHttpError(usuarioErrorMessages.corpoCadastroInvalido, 400);
  }

  const nome = typeof data.nome === 'string' ? data.nome.trim() : '';
  const cpf = typeof data.cpf === 'string' ? data.cpf.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const senha = typeof data.senha === 'string' ? data.senha : '';
  const tipo = typeof data.tipo === 'string' ? data.tipo.trim() : '';

  if (!nome) {
    throw createHttpError(usuarioErrorMessages.nomeObrigatorio, 400);
  }

  if (!cpf) {
    throw createHttpError(usuarioErrorMessages.cpfObrigatorio, 400);
  }

  if (!email) {
    throw createHttpError(usuarioErrorMessages.emailObrigatorio, 400);
  }

  if (!senha.trim()) {
    throw createHttpError(usuarioErrorMessages.senhaObrigatoria, 400);
  }

  if (!tipo) {
    throw createHttpError(usuarioErrorMessages.tipoObrigatorio, 400);
  }

  if (!tiposUsuarioValidos.includes(tipo)) {
    throw createHttpError(usuarioErrorMessages.tipoInvalido, 400);
  }

  const usuarioComMesmoEmail = await prisma.usuario.findUnique({
    where: { email },
    select: { id: true }
  });

  if (usuarioComMesmoEmail) {
    throw createHttpError(usuarioErrorMessages.emailOuCpfEmUso, 409);
  }

  const usuarioComMesmoCpf = await prisma.usuario.findUnique({
    where: { cpf },
    select: { id: true }
  });

  if (usuarioComMesmoCpf) {
    throw createHttpError(usuarioErrorMessages.emailOuCpfEmUso, 409);
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  try {
    return await prisma.usuario.create({
      data: {
        nome,
        cpf,
        email,
        senha: senhaCriptografada,
        tipo,
        ativo: true,
        autenticadorAtivo: false,
        criadoEm: new Date()
      },
      select: usuarioSelectSeguro
    });
  } catch (err) {
    if (err?.code === 'P2002') {
      throw createHttpError(usuarioErrorMessages.emailOuCpfEmUso, 409);
    }

    throw err;
  }
}

export async function listarUsuarios() {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      tipo: true
    }
  });
}

export async function buscarUsuarioPorId(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: usuarioSelectSeguro
  });

  if (!usuario) {
    throw createHttpError(usuarioErrorMessages.usuarioNaoEncontrado, 404);
  }

  return usuario;
}

export async function atualizarStatusAtivoUsuario(id, ativo) {
  if (typeof ativo !== 'boolean') {
    throw createHttpError(usuarioErrorMessages.ativoInvalido, 400);
  }

  try {
    return await prisma.usuario.update({
      where: { id },
      data: { ativo },
      select: usuarioSelectSeguro
    });
  } catch (err) {
    normalizePrismaUsuarioUpdateError(err);
  }
}

export async function atualizarSenhaUsuario(id, senha) {
  if (typeof senha !== 'string' || senha.trim() === '') {
    throw createHttpError(usuarioErrorMessages.senhaAtualizacaoInvalida, 400);
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  try {
    return await prisma.usuario.update({
      where: { id },
      data: { senha: senhaCriptografada },
      select: usuarioSelectSeguro
    });
  } catch (err) {
    normalizePrismaUsuarioUpdateError(err);
  }
}

export async function atualizarPerfilUsuario(id, data, podeAtualizarTipo = false) {
  if (!data || typeof data !== 'object') {
    throw createHttpError(usuarioErrorMessages.corpoPerfilInvalido, 400);
  }

  const camposPermitidos = ['nome', 'email', 'cpf'];
  const updateData = {};

  for (const campo of camposPermitidos) {
    if (data[campo] !== undefined) {
      updateData[campo] = data[campo];
    }
  }

  if (podeAtualizarTipo && data.tipo !== undefined) {
    const tipo = typeof data.tipo === 'string' ? data.tipo.trim() : '';

    if (!tiposUsuarioValidos.includes(tipo)) {
      throw createHttpError(usuarioErrorMessages.tipoInvalido, 400);
    }

    updateData.tipo = tipo;
  }

  if (Object.keys(updateData).length === 0) {
    throw createHttpError(usuarioErrorMessages.perfilSemCamposPermitidos, 400);
  }

  try {
    return await prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        ...usuarioSelectSeguro,
        dataConfirmacao2FA: true
      }
    });
  } catch (err) {
    normalizePrismaUsuarioUpdateError(err);
  }
}
