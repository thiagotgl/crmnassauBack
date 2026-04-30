import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import empresasRoutes from './routes/empresas.routes.js';
import { renderApiDocs } from './docs/apiDocs.js';
import { openApiDocument } from './docs/openapi.js';
import { renderSwaggerUi } from './docs/swaggerUi.js';


const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.type('html').send(renderApiDocs({ baseUrl }));
});

app.get('/openapi.json', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const document = {
    ...openApiDocument,
    servers: [
      {
        url: baseUrl,
        description: 'Servidor atual'
      }
    ]
  };

  res.json(document);
});

app.get('/docs', (req, res) => {
  res.type('html').send(
    renderSwaggerUi({
      title: 'CRM Nassau API Docs',
      specUrl: '/openapi.json'
    })
  );
});

app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);
app.use('/leads', leadsRoutes);
app.use('/empresas', empresasRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
