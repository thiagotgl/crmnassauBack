import * as service from '../services/leads.service.js';

export async function criar(req, res) {
  try {
    const usuarioId = req.user.id;

    const lead = await service.criarLead(req.body, usuarioId);

    res.json(lead);
  } catch (err) {
  console.error('ERRO REAL:', err);
  res.status(500).json({ error: err.message });
}

}

export async function listar(req, res) {
  try {
    const leads = await service.listarLeads();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar leads' });
  }
}

export async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const usuarioId = req.user.id;

    const resultado = await service.atualizarStatus(
      Number(id),
      status,
      usuarioId
    );

    res.json(resultado);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


export async function historico(req, res) {
  try {
    const { id } = req.params;

    const dados = await service.listarHistorico(Number(id));

    res.json(dados);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
}


export async function ordenar(req, res) {
  try {
    const { leads } = req.body;

    await service.ordenarLeads(leads);

    res.json({ success: true });

  } catch (err) {
  console.error('ERRO REAL:', err);
  res.status(500).json({ error: err.message });
}
}