import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginErrorMessages } from '../constants/errorMessages.js';

const prisma = new PrismaClient();

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: loginErrorMessages.usuarioNaoEncontrado });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: loginErrorMessages.senhaInvalida });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ error: loginErrorMessages.usuarioInativo });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: loginErrorMessages.erroLogin });
  }
}
