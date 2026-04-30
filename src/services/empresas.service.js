import { PrismaClient } from '@prisma/client';
import { empresaErrorMessages } from '../constants/errorMessages.js';

const prisma = new PrismaClient();

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function listarEmpresas() {
  try {
    return await prisma.empresa.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: {
          select: { leads: true, contatos: true }
        }
      }
    });
  } catch (err) {
    throw createHttpError(empresaErrorMessages.erroListar, 500);
  }
}

export async function buscarEmpresaPorId(id) {
  const empresa = await prisma.empresa.findUnique({
    where: { id },
    include: {
      contatos: true,
      leads: true
    }
  });

  if (!empresa) {
    throw createHttpError(empresaErrorMessages.empresaNaoEncontrada, 404);
  }

  return empresa;
}

function limparCNPJ(cnpj) {
  if (!cnpj) return null;
  return cnpj.replace(/\D/g, '');
}

export async function criarEmpresa(data) {
  if (!data.nome || data.nome.trim() === '') {
    throw createHttpError(empresaErrorMessages.nomeObrigatorio, 400);
  }

  const cnpjLimpo = limparCNPJ(data.cnpj);

  if (cnpjLimpo) {
    const empresaExistente = await prisma.empresa.findUnique({
      where: { cnpj: cnpjLimpo }
    });

    if (empresaExistente) {
      throw createHttpError(empresaErrorMessages.cnpjEmUso, 409);
    }
  }

  return prisma.empresa.create({
    data: {
      nome: data.nome,
      cnpj: cnpjLimpo,
      telefone: data.telefone,
      email: data.email
    }
  });
}

export async function atualizarEmpresa(id, data) {
  const empresa = await prisma.empresa.findUnique({
    where: { id }
  });

  if (!empresa) {
    throw createHttpError(empresaErrorMessages.empresaNaoEncontrada, 404);
  }

  if (data.nome !== undefined && data.nome.trim() === '') {
    throw createHttpError(empresaErrorMessages.nomeObrigatorio, 400);
  }

  let cnpjLimpo;
  if (data.cnpj !== undefined) {
    cnpjLimpo = limparCNPJ(data.cnpj);

    if (cnpjLimpo && cnpjLimpo !== empresa.cnpj) {
      const empresaExistente = await prisma.empresa.findUnique({
        where: { cnpj: cnpjLimpo }
      });

      if (empresaExistente) {
        throw createHttpError(empresaErrorMessages.cnpjEmUso, 409);
      }
    }
  }

  return prisma.empresa.update({
    where: { id },
    data: {
      ...data,
      cnpj: cnpjLimpo
    }
  });
}

export async function excluirEmpresa(id) {
  const empresa = await prisma.empresa.findUnique({
    where: { id },
    include: {
      _count: {
        select: { leads: true, contatos: true }
      }
    }
  });

  if (!empresa) {
    throw createHttpError(empresaErrorMessages.empresaNaoEncontrada, 404);
  }

  if (empresa._count.leads > 0 || empresa._count.contatos > 0) {
    throw createHttpError(empresaErrorMessages.erroExcluirComVinculos, 400);
  }

  return prisma.empresa.delete({
    where: { id }
  });
}
