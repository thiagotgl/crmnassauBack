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
    { name: 'Leads', description: 'Operacoes do funil de leads.' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
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
      UpdateUsuarioRequest: {
        type: 'object',
        properties: {
          nome: { type: 'string', example: 'Maria Silva' },
          cpf: { type: 'string', example: '12345678900' },
          email: { type: 'string', format: 'email', example: 'maria@email.com' },
          senha: { type: 'string', example: 'nova-senha' },
          tipo: {
            type: 'string',
            enum: ['admin', 'vendedor', 'cliente', 'supervisor'],
            example: 'vendedor'
          },
          ativo: { type: 'boolean', example: true }
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
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica um usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Token JWT gerado com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          401: {
            description: 'Credenciais invalidas.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Lista usuarios',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuarios.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Usuario' }
                }
              }
            }
          },
          401: {
            description: 'Token ausente ou invalido.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Cria um usuario',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUsuarioRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuario criado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' }
              }
            }
          },
          403: {
            description: 'Somente admin pode criar usuarios.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/usuarios/{id}': {
      post: {
        tags: ['Usuarios'],
        summary: 'Atualiza um usuario',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer', example: 2 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUsuarioRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuario atualizado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' }
              }
            }
          },
          403: {
            description: 'Somente admin pode atualizar usuarios.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/leads': {
      get: {
        tags: ['Leads'],
        summary: 'Lista leads',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de leads.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Lead' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Leads'],
        summary: 'Cria um lead',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateLeadRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Lead criado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lead' }
              }
            }
          }
        }
      }
    },
    '/leads/{id}/status': {
      post: {
        tags: ['Leads'],
        summary: 'Atualiza o status de um lead',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateLeadStatusRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Status atualizado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateLeadStatusResponse' }
              }
            }
          }
        }
      }
    },
    '/leads/{id}/historico': {
      get: {
        tags: ['Leads'],
        summary: 'Lista o historico do lead',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          200: {
            description: 'Historico retornado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Historico' }
                }
              }
            }
          }
        }
      }
    },
    '/leads/ordenar': {
      post: {
        tags: ['Leads'],
        summary: 'Reordena os leads do quadro',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrdenarLeadsRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Ordenacao aplicada com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      }
    }
  }
};
