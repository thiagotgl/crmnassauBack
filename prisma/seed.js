import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const senhaPadrao = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const senhaHash = await bcrypt.hash(senhaPadrao, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@local.dev' },
    update: {
      nome: 'Administrador',
      tipo: 'admin',
      ativo: true,
      senha: senhaHash
    },
    create: {
      nome: 'Administrador',
      cpf: '00000000000',
      email: 'admin@local.dev',
      senha: senhaHash,
      tipo: 'admin',
      ativo: true
    }
  });

  console.log(`Usuario admin pronto: ${usuario.email}`);
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
