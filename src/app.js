import 'dotenv/config';
import express from 'express';
import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import leadsRoutes from './routes/leads.routes.js';


const app = express();

app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);
app.use('/leads', leadsRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});