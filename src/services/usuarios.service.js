import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


import bcrypt from 'bcrypt';

export async function criarUsuario(data) {
  const senhaCriptografada = await bcrypt.hash(data.senha, 10);

  return prisma.usuario.create({
    data: {
      ...data,
      senha: senhaCriptografada
    }
  });
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



export async function atualizarUsuario(id, data) {
  const updateData = { ...data };

  // 🔐 se vier senha, criptografa
  if (data.senha) {
    updateData.senha = await bcrypt.hash(data.senha, 10);
  }

  return prisma.usuario.update({
    where: { id },
    data: updateData
  });
}