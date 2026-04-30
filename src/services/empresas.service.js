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
