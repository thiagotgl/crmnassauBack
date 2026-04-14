import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function limparCNPJ(cnpj) {
  if (!cnpj) return null;
  return cnpj.replace(/\D/g, '');
}

export async function criarLead(data, usuarioId) {
  return prisma.$transaction(async (tx) => {

    const cnpjLimpo = limparCNPJ(data.cnpj);

    const { cnpj, ...resto } = data;

    let empresa = null;

    if (cnpjLimpo) {
      empresa = await tx.empresa.findUnique({
        where: { cnpj: cnpjLimpo }
      });
    }

    if (!empresa && resto.nome) {
      empresa = await tx.empresa.create({
        data: {
          nome: resto.nome,
          cnpj: cnpjLimpo,
          telefone: resto.telefone,
          email: resto.email
        }
      });
    }

    const lead = await tx.lead.create({
      data: {
        ...resto,
        usuarioId,
        empresaId: empresa?.id || null
      }
    });

    return lead;
  });
}

export async function listarLeads() {
  return prisma.lead.findMany({
    orderBy: { ordem: 'asc' }
  });
}

export async function atualizarStatus(id, status, usuarioId) {
  return prisma.$transaction(async (tx) => {

    let contatoCriado = null;

    let lead = await tx.lead.update({
      where: { id },
      data: { status }
    });

    // 🔥 HISTÓRICO
    await tx.historico.create({
      data: {
        descricao: `Status alterado para ${status}`,
        tipo: 'alteracao_status',
        usuarioId,
        leadId: id
      }
    });

    let empresa = null;

    if (status === 'fechado_ganho') {

      // 🔍 tenta encontrar empresa
      empresa = await tx.empresa.findFirst({
        where: {
          nome: lead.nome
        }
      });

      // 🏢 cria se não existir
      if (!empresa) {
        empresa = await tx.empresa.create({
          data: {
            nome: lead.nome,
            telefone: lead.telefone,
            email: lead.email
          }
        });
      }

      // 👤 cria contato
      contatoCriado = await tx.contato.create({
        data: {
          nome: lead.nome,
          telefone: lead.telefone,
          email: lead.email,
          empresaId: empresa.id
        }
      });

      // 🔗 vincula
      lead = await tx.lead.update({
        where: { id },
        data: {
          empresaId: empresa.id,
          contatoId: contatoCriado.id
        }
      });

      // 📝 histórico
      await tx.historico.create({
        data: {
          descricao: `Lead convertido em negócio da empresa ${empresa.nome}`,
          tipo: 'alteracao_status',
          usuarioId,
          leadId: id
        }
      });
    }

    return {
      lead,
      empresa,
      contatoCriado
    };
  });
}


export async function listarHistorico(leadId) {
  return prisma.historico.findMany({
    where: { leadId },
    orderBy: { criadoEm: 'desc' }
  });
}

export async function ordenarLeads(lista) {
  return prisma.$transaction(
    lista.map(item =>
      prisma.lead.update({
        where: { id: item.id },
        data: { ordem: item.ordem }
      })
    )
  );
}