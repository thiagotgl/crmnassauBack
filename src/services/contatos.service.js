import { PrismaClient } from '@prisma/client';
import { contatoErrorMessages } from '../constants/errorMessages.js';

const prisma = new PrismaClient();

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function limparCPF(cpf) {
  if (!cpf) return null;
  return cpf.replace(/\D/g, '');
}

export async function listarContatos() {
  try {
    return await prisma.contato.findMany({
      include: {
        empresa: {
          select: { id: true, nome: true }
        }
      },
      orderBy: { nome: 'asc' }
    });
  } catch (err) {
    console.error(err);
    throw createHttpError(contatoErrorMessages.erroListar, 500);
  }
}

export async function buscarContatoPorId(id) {
  try {
    const contato = await prisma.contato.findUnique({
      where: { id },
      include: {
        empresa: true,
        leads: true
      }
    });

    if (!contato) {
      throw createHttpError(contatoErrorMessages.contatoNaoEncontrado, 404);
    }

    return contato;
  } catch (err) {
    if (err.statusCode) throw err;
    console.error(err);
    throw createHttpError(contatoErrorMessages.erroBuscar, 500);
  }
}

export async function criarContato(data) {
  if (!data.nome || data.nome.trim() === '') {
    throw createHttpError(contatoErrorMessages.nomeObrigatorio, 400);
  }

  const cpfLimpo = limparCPF(data.cpf);

  if (cpfLimpo) {
    const contatoExistente = await prisma.contato.findUnique({
      where: { cpf: cpfLimpo }
    });
    if (contatoExistente) {
      throw createHttpError(contatoErrorMessages.cpfEmUso, 409);
    }
  }

  if (data.empresaId) {
    const empresa = await prisma.empresa.findUnique({
      where: { id: Number(data.empresaId) }
    });
    if (!empresa) {
      throw createHttpError(contatoErrorMessages.empresaNaoEncontrada, 404);
    }
  }

  return prisma.contato.create({
    data: {
      nome: data.nome,
      cpf: cpfLimpo,
      telefone: data.telefone,
      email: data.email,
      empresaId: data.empresaId ? Number(data.empresaId) : null
    }
  });
}

export async function atualizarContato(id, data) {
  const contato = await prisma.contato.findUnique({
    where: { id }
  });

  if (!contato) {
    throw createHttpError(contatoErrorMessages.contatoNaoEncontrado, 404);
  }

  if (data.nome !== undefined && data.nome.trim() === '') {
    throw createHttpError(contatoErrorMessages.nomeObrigatorio, 400);
  }

  let cpfLimpo;
  if (data.cpf !== undefined) {
    cpfLimpo = limparCPF(data.cpf);
    if (cpfLimpo && cpfLimpo !== contato.cpf) {
      const existente = await prisma.contato.findUnique({ where: { cpf: cpfLimpo } });
      if (existente) throw createHttpError(contatoErrorMessages.cpfEmUso, 409);
    }
  }

  if (data.empresaId) {
    const empresa = await prisma.empresa.findUnique({
      where: { id: Number(data.empresaId) }
    });
    if (!empresa) throw createHttpError(contatoErrorMessages.empresaNaoEncontrada, 404);
  }

  return prisma.contato.update({
    where: { id },
    data: {
      ...data,
      cpf: cpfLimpo,
      empresaId: data.empresaId ? Number(data.empresaId) : undefined
    }
  });
}

export async function excluirContato(id) {
  const contato = await prisma.contato.findUnique({
    where: { id },
    include: {
      _count: {
        select: { leads: true }
      }
    }
  });

  if (!contato) {
    throw createHttpError(contatoErrorMessages.contatoNaoEncontrado, 404);
  }

  if (contato._count.leads > 0) {
    throw createHttpError(contatoErrorMessages.erroExcluirComVinculos, 400);
  }

  return prisma.contato.delete({
    where: { id }
  });
}
