import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

 const token = jwt.sign(
  { id: usuario.id, tipo: usuario.tipo },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
}