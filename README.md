# CRM Nassau Back

API Node.js com Express e Prisma para gerenciamento de usuarios e leads.

## Requisitos

- Node.js 20 ou superior
- Docker Desktop

## Subindo o ambiente de desenvolvimento

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
copy .env.example .env
```

3. Suba o banco PostgreSQL local:

```bash
docker compose up -d
```

4. Gere o client do Prisma e aplique as migracoes:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

5. Inicie a API em modo desenvolvimento:

```bash
npm run dev
```

O servidor sobe por padrao em `http://localhost:3000`.

## Variaveis de ambiente

- `PORT`: porta da API.
- `DATABASE_URL`: conexao com o PostgreSQL.
- `JWT_SECRET`: segredo usado para assinar os tokens JWT.

## Scripts uteis

- `npm run dev`: inicia com `nodemon`.
- `npm run start`: inicia em modo normal.
- `npm run test`: executa a suite de testes unitarios.
- `npm run test:watch`: executa os testes em modo watch.
- `npm run test:coverage`: gera cobertura dos testes.
- `npm run prisma:generate`: gera o client do Prisma.
- `npm run prisma:migrate`: cria/aplica migracoes no banco local.
- `npm run prisma:deploy`: aplica migracoes sem prompt.
- `npm run prisma:seed`: cria ou atualiza o usuario admin local.
- `npm run prisma:studio`: abre o Prisma Studio.

## Padrao da documentacao da API

Toda nova rota deve ser documentada em `src/docs/openapi.js` seguindo o mesmo padrao do Swagger ja existente.

- Definir `tag` e `summary` claros.
- Informar `security` com `bearerAuth` quando a rota exigir token.
- Documentar `requestBody` com schema reutilizavel em `components.schemas`.
- Documentar respostas de sucesso e erro com descricoes objetivas.
- Reutilizar os helpers e schemas padronizados do arquivo para manter consistencia visual e estrutural.

O visual da documentacao em `/docs` e customizado em `src/docs/swaggerUi.js`, entao novos metodos HTTP devem seguir esse mesmo padrao de estilo.

## Estrutura de testes

A base de testes unitarios fica na pasta `tests/` com a seguinte organizacao:

- `tests/setup`: setup global do runner.
- `tests/helpers`: mocks utilitarios de `req` e `res`.
- `tests/mocks`: mocks reutilizaveis, como Prisma.
- `tests/unit/services`: testes de regra de negocio.
- `tests/unit/controllers`: testes da camada HTTP.
- `tests/unit/middlewares`: testes de autenticacao e autorizacao.

O runner configurado e o `Vitest`, definido em `vitest.config.js`.

## Bootstrap de acesso

O seed cria um usuario administrador local:

- email: `admin@local.dev`
- senha padrao: `admin123`

Se quiser, voce pode sobrescrever a senha no `.env` com `SEED_ADMIN_PASSWORD`.
