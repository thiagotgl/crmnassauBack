const bearerSecurity = [{ bearerAuth: [] }];

const idPathParameter = {
  in: 'path',
  name: 'id',
  required: true,
  schema: { type: 'integer', example: 1 }
};

function jsonRequestBody(schemaRef) {
  return {
    required: true,
    content: {
      'application/json': {
        schema: { $ref: schemaRef }
      }
    }
  };
}

function jsonResponse(description, schema) {
  return {
    description,
    content: {
      'application/json': {
        schema
      }
    }
  };
}

function errorResponse(description) {
  return jsonResponse(description, { $ref: '#/components/schemas/ErrorResponse' });
}

const schemas = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'senha'],
    properties: {
      email: { type: 'string', format: 'email', example: 'admin@local.dev' },
      senha: { type: 'string', example: 'adminexample' }
    }
  },
  LoginResponse: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'jwt-aqui' }
    }
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      error: { type: 'string', example: 'Mensagem de erro' }
    }
  },
  Usuario: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Administrador' },
      email: { type: 'string', format: 'email', example: 'admin@local.dev' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'admin'
      }
    }
  },
  UsuarioPerfil: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Administrador' },
      email: { type: 'string', format: 'email', example: 'admin@local.dev' },
      cpf: { type: 'string', example: '12345678900' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'admin'
      },
      ativo: { type: 'boolean', example: true },
      autenticadorAtivo: { type: 'boolean', example: false },
      dataConfirmacao2FA: {
        oneOf: [
          { type: 'null' },
          { type: 'string', format: 'date-time', example: '2026-04-17T12:00:00.000Z' }
        ]
      },
      criadoEm: { type: 'string', format: 'date-time' },
      atualizadoEm: { type: 'string', format: 'date-time' }
    }
  },
  UsuarioCriado: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Maria' },
      email: { type: 'string', format: 'email', example: 'maria@email.com' },
      cpf: { type: 'string', example: '12345678900' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'vendedor'
      },
      ativo: { type: 'boolean', example: true },
      autenticadorAtivo: { type: 'boolean', example: false },
      criadoEm: { type: 'string', format: 'date-time' },
      atualizadoEm: { type: 'string', format: 'date-time' }
    }
  },
  UsuarioDetalhado: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Maria' },
      email: { type: 'string', format: 'email', example: 'maria@email.com' },
      cpf: { type: 'string', example: '12345678900' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'vendedor'
      },
      ativo: { type: 'boolean', example: true },
      autenticadorAtivo: { type: 'boolean', example: false },
      criadoEm: { type: 'string', format: 'date-time' },
      atualizadoEm: { type: 'string', format: 'date-time' }
    }
  },
  CreateUsuarioRequest: {
    type: 'object',
    required: ['nome', 'cpf', 'email', 'senha', 'tipo'],
    properties: {
      nome: { type: 'string', example: 'Maria' },
      cpf: { type: 'string', example: '12345678900' },
      email: { type: 'string', format: 'email', example: 'maria@email.com' },
      senha: { type: 'string', example: '123456' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'vendedor'
      }
    }
  },
  UpdateUsuarioAtivoPayload: {
    type: 'object',
    required: ['ativo'],
    properties: {
      ativo: { type: 'boolean', example: false }
    }
  },
  UsuarioStatusAtivo: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Administrador' },
      email: { type: 'string', format: 'email', example: 'admin@local.dev' },
      cpf: { type: 'string', example: '12345678900' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'admin'
      },
      ativo: { type: 'boolean', example: false },
      criadoEm: { type: 'string', format: 'date-time' },
      atualizadoEm: { type: 'string', format: 'date-time' }
    }
  },
  UpdateUsuarioSenhaPayload: {
    type: 'object',
    required: ['senha'],
    properties: {
      senha: { type: 'string', example: 'NovaSenha123' }
    }
  },
  UsuarioSenhaAtualizada: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Administrador' },
      email: { type: 'string', format: 'email', example: 'admin@local.dev' },
      cpf: { type: 'string', example: '12345678900' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'admin'
      },
      ativo: { type: 'boolean', example: true },
      criadoEm: { type: 'string', format: 'date-time' },
      atualizadoEm: { type: 'string', format: 'date-time' }
    }
  },
  UpdatePerfilUsuarioRequest: {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Maria Silva' },
      cpf: { type: 'string', example: '12345678900' },
      email: { type: 'string', format: 'email', example: 'maria@email.com' },
      tipo: {
        type: 'string',
        enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
        example: 'supervisor',
        description: 'Somente admin pode alterar este campo.'
      }
    }
  },
  Lead: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      ordem: { type: 'integer', example: 0 },
      nome: { type: 'string', example: 'Empresa XPTO' },
      telefone: { type: 'string', nullable: true, example: '81999999999' },
      email: { type: 'string', nullable: true, example: 'contato@xpto.com' },
      origem: { type: 'string', nullable: true, example: 'site' },
      status: {
        type: 'string',
        enum: [
          'novo',
          'contato',
          'qualificado',
          'proposta',
          'negociacao',
          'fechado_ganho',
          'fechado_perdido'
        ],
        example: 'novo'
      },
      valorEstimado: { type: 'number', nullable: true, example: 15000 },
      usuarioId: { type: 'integer', example: 1 },
      contatoId: { type: 'integer', nullable: true, example: null },
      empresaId: { type: 'integer', nullable: true, example: null },
      criadoEm: { type: 'string', format: 'date-time' },
      atualizadoEm: { type: 'string', format: 'date-time' }
    }
  },
  CreateLeadRequest: {
    type: 'object',
    required: ['nome'],
    properties: {
      nome: { type: 'string', example: 'Empresa XPTO' },
      telefone: { type: 'string', example: '81999999999' },
      email: { type: 'string', format: 'email', example: 'contato@xpto.com' },
      origem: { type: 'string', example: 'site' },
      valorEstimado: { type: 'number', example: 15000 },
      cnpj: { type: 'string', example: '12345678000199' }
    }
  },
  UpdateLeadStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: [
          'novo',
          'contato',
          'qualificado',
          'proposta',
          'negociacao',
          'fechado_ganho',
          'fechado_perdido'
        ],
        example: 'proposta'
      }
    }
  },
  Historico: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 10 },
      titulo: { type: 'string', nullable: true, example: null },
      descricao: { type: 'string', example: 'Status alterado para proposta' },
      leadId: { type: 'integer', nullable: true, example: 1 },
      tipo: {
        type: 'string',
        enum: ['observacao', 'ligacao', 'whatsapp', 'email', 'alteracao_status'],
        example: 'alteracao_status'
      },
      usuarioId: { type: 'integer', example: 1 },
      contatoId: { type: 'integer', nullable: true, example: null },
      empresaId: { type: 'integer', nullable: true, example: null },
      criadoEm: { type: 'string', format: 'date-time' }
    }
  },
  UpdateLeadStatusResponse: {
    type: 'object',
    properties: {
      lead: { $ref: '#/components/schemas/Lead' },
      empresa: {
        oneOf: [
          { type: 'null' },
          {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              nome: { type: 'string', example: 'Empresa XPTO' }
            }
          }
        ]
      },
      contatoCriado: {
        oneOf: [
          { type: 'null' },
          {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              nome: { type: 'string', example: 'Empresa XPTO' }
            }
          }
        ]
      }
    }
  },
  OrdenarLeadsRequest: {
    type: 'object',
    required: ['leads'],
    properties: {
      leads: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'ordem'],
          properties: {
            id: { type: 'integer', example: 1 },
            ordem: { type: 'integer', example: 0 }
          }
        }
      }
    }
  },
  SuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true }
    }
  },
  Empresa: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Empresa XPTO' },
      cnpj: { type: 'string', nullable: true, example: '12345678000199' },
      telefone: { type: 'string', nullable: true, example: '81999999999' },
      email: { type: 'string', nullable: true, example: 'contato@xpto.com' },
      ativo: { type: 'boolean', example: true },
      criadoEm: { type: 'string', format: 'date-time' },
      atualizadoEm: { type: 'string', format: 'date-time' },
      _count: {
        type: 'object',
        properties: {
          leads: { type: 'integer', example: 5 },
          contatos: { type: 'integer', example: 2 }
        }
      }
    }
  },
  EmpresaDetalhada: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Empresa XPTO' },
      cnpj: { type: 'string', nullable: true, example: '12345678000199' },
      telefone: { type: 'string', nullable: true, example: '81999999999' },
      email: { type: 'string', nullable: true, example: 'contato@xpto.com' },
      ativo: { type: 'boolean', example: true },
      contatos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Joao Silva' },
            email: { type: 'string', example: 'joao@xpto.com' }
          }
        }
      },
      leads: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Lead'
        }
      }
    }
  }
};

const paths = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Autentica um usuario',
      requestBody: jsonRequestBody('#/components/schemas/LoginRequest'),
      responses: {
        200: jsonResponse('Token JWT gerado com sucesso.', {
          $ref: '#/components/schemas/LoginResponse'
        }),
        401: errorResponse('Credenciais invalidas.')
      }
    }
  },
  '/usuarios': {
    get: {
      tags: ['Usuarios'],
      summary: 'Lista usuarios',
      security: bearerSecurity,
      responses: {
        200: jsonResponse('Lista de usuarios.', {
          type: 'array',
          items: { $ref: '#/components/schemas/Usuario' }
        }),
        401: errorResponse('Token ausente ou invalido.')
      }
    },
    post: {
      tags: ['Usuarios'],
      summary: 'Cria um usuario',
      security: bearerSecurity,
      requestBody: jsonRequestBody('#/components/schemas/CreateUsuarioRequest'),
      responses: {
        200: jsonResponse('Usuario criado com sucesso.', {
          $ref: '#/components/schemas/UsuarioCriado'
        }),
        400: errorResponse(
          'Campos obrigatorios invalidos ou ausentes. Exemplos: nome, cpf, email, senha ou tipo ausentes; tipo invalido.'
        ),
        409: errorResponse(
          'Ja existe um usuario com este email ou cpf.'
        ),
        401: errorResponse('Token ausente ou invalido.'),
        403: errorResponse('Somente admin pode criar usuarios.')
      }
    }
  },
  '/usuarios/{id}': {
    get: {
      tags: ['Usuarios'],
      summary: 'Busca um usuario por id',
      security: bearerSecurity,
      parameters: [idPathParameter],
      responses: {
        200: jsonResponse('Usuario encontrado.', {
          $ref: '#/components/schemas/UsuarioDetalhado'
        }),
        401: errorResponse('Token ausente ou invalido.'),
        404: errorResponse('Usuario nao encontrado.')
      }
    },
    put: {
      tags: ['Usuarios'],
      summary: 'Atualiza os dados do proprio usuario ou de outro usuario quando for admin',
      security: bearerSecurity,
      parameters: [idPathParameter],
      requestBody: jsonRequestBody('#/components/schemas/UpdatePerfilUsuarioRequest'),
      responses: {
        200: jsonResponse('Perfil atualizado com sucesso.', {
          $ref: '#/components/schemas/UsuarioPerfil'
        }),
        400: errorResponse('Nenhum campo valido foi enviado.'),
        401: errorResponse('Token ausente ou invalido.'),
        403: errorResponse('O usuario autenticado so pode editar o proprio cadastro, exceto se for admin. Somente admin pode alterar tipo.')
      }
    },
  },
  '/usuarios/{id}/ativo': {
    put: {
      tags: ['Usuarios'],
      summary: 'Ativa ou inativa um usuario',
      security: bearerSecurity,
      parameters: [idPathParameter],
      requestBody: jsonRequestBody('#/components/schemas/UpdateUsuarioAtivoPayload'),
      responses: {
        200: jsonResponse('Status do usuario atualizado.', {
          $ref: '#/components/schemas/UsuarioStatusAtivo'
        }),
        400: errorResponse('O campo ativo deve ser enviado como true ou false.'),
        401: errorResponse('Token ausente ou invalido.'),
        403: errorResponse('Somente admin pode atualizar usuarios.')
      }
    }
  },
  '/usuarios/{id}/senha': {
    put: {
      tags: ['Usuarios'],
      summary: 'Atualiza a senha de um usuario',
      security: bearerSecurity,
      parameters: [idPathParameter],
      requestBody: jsonRequestBody('#/components/schemas/UpdateUsuarioSenhaPayload'),
      responses: {
        200: jsonResponse('Senha do usuario atualizada.', {
          $ref: '#/components/schemas/UsuarioSenhaAtualizada'
        }),
        400: errorResponse('O campo senha deve ser enviado e nao pode ser vazio.'),
        401: errorResponse('Token ausente ou invalido.'),
        403: errorResponse('Somente admin pode atualizar usuarios.')
      }
    }
  },
  '/leads': {
    get: {
      tags: ['Leads'],
      summary: 'Lista leads',
      security: bearerSecurity,
      responses: {
        200: jsonResponse('Lista de leads.', {
          type: 'array',
          items: { $ref: '#/components/schemas/Lead' }
        }),
        401: errorResponse('Token ausente ou invalido.')
      }
    },
    post: {
      tags: ['Leads'],
      summary: 'Cria um lead',
      security: bearerSecurity,
      requestBody: jsonRequestBody('#/components/schemas/CreateLeadRequest'),
      responses: {
        200: jsonResponse('Lead criado.', { $ref: '#/components/schemas/Lead' }),
        401: errorResponse('Token ausente ou invalido.')
      }
    }
  },
  '/leads/{id}/status': {
    post: {
      tags: ['Leads'],
      summary: 'Atualiza o status de um lead',
      security: bearerSecurity,
      parameters: [idPathParameter],
      requestBody: jsonRequestBody('#/components/schemas/UpdateLeadStatusRequest'),
      responses: {
        200: jsonResponse('Status atualizado.', {
          $ref: '#/components/schemas/UpdateLeadStatusResponse'
        }),
        401: errorResponse('Token ausente ou invalido.')
      }
    }
  },
  '/leads/{id}/historico': {
    get: {
      tags: ['Leads'],
      summary: 'Lista o historico do lead',
      security: bearerSecurity,
      parameters: [idPathParameter],
      responses: {
        200: jsonResponse('Historico retornado com sucesso.', {
          type: 'array',
          items: { $ref: '#/components/schemas/Historico' }
        }),
        401: errorResponse('Token ausente ou invalido.')
      }
    }
  },
  '/leads/ordenar': {
    post: {
      tags: ['Leads'],
      summary: 'Reordena os leads do quadro',
      security: bearerSecurity,
      requestBody: jsonRequestBody('#/components/schemas/OrdenarLeadsRequest'),
      responses: {
        200: jsonResponse('Ordenacao aplicada com sucesso.', {
          $ref: '#/components/schemas/SuccessResponse'
        }),
        401: errorResponse('Token ausente ou invalido.')
      }
    }
  },
  '/empresas': {
    get: {
      tags: ['Empresas'],
      summary: 'Lista todas as empresas cadastradas',
      security: bearerSecurity,
      responses: {
        200: jsonResponse('Lista de empresas.', {
          type: 'array',
          items: { $ref: '#/components/schemas/Empresa' }
        }),
        401: errorResponse('Token ausente ou invalido.')
      }
    }
  },
  '/empresas/{id}': {
    get: {
      tags: ['Empresas'],
      summary: 'Busca os detalhes de uma empresa por ID',
      security: bearerSecurity,
      parameters: [idPathParameter],
      responses: {
        200: jsonResponse('Detalhes da empresa.', {
          $ref: '#/components/schemas/EmpresaDetalhada'
        }),
        401: errorResponse('Token ausente ou invalido.'),
        404: errorResponse('Empresa nao encontrada.')
      }
    }
  }
};

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'CRM Nassau API',
    version: '1.0.0',
    description:
      'Documentacao OpenAPI inicial da API de autenticacao, usuarios e leads.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Ambiente local'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Autenticacao e emissao de token JWT.' },
    { name: 'Usuarios', description: 'Gestao de usuarios da plataforma.' },
    { name: 'Leads', description: 'Operacoes do funil de leads.' },
    { name: 'Empresas', description: 'Consulta de empresas e clientes.' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas
  },
  paths
};
