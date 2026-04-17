# Estrutura de Testes

Esta pasta concentra a base dos testes unitarios da aplicacao.

## Estrutura inicial

- `setup/`: arquivos executados antes dos testes.
- `helpers/`: utilitarios para mocks de `req` e `res`.
- `mocks/`: factories de mocks reutilizaveis, como Prisma.
- `unit/services/`: testes unitarios dos services.
- `unit/controllers/`: testes unitarios dos controllers.
- `unit/middlewares/`: testes unitarios dos middlewares.

## Convencoes

- Nomear arquivos como `*.test.js`.
- Priorizar testes unitarios nas regras de negocio dos services.
- Controllers devem focar em status HTTP e payloads.
- Middlewares devem validar regras de autenticacao e autorizacao.

## Proxima etapa

Antes de escrever os testes, o ideal e centralizar dependencias compartilhadas, como a instancia do Prisma, para facilitar mocks.
