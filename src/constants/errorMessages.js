export const authErrorMessages = {
  tokenNaoInformado: 'Token nao informado',
  tokenInvalido: 'Token invalido',
  acessoNegado: 'Acesso negado'
};

export const loginErrorMessages = {
  usuarioNaoEncontrado: 'Usuario nao encontrado',
  senhaInvalida: 'Senha invalida',
  usuarioInativo: 'Usuario inativo',
  erroLogin: 'Erro no login'
};

export const usuarioErrorMessages = {
  erroCriar: 'Erro ao criar usuario',
  erroBuscar: 'Erro ao buscar usuario',
  erroAtualizarPerfil: 'Erro ao atualizar perfil',
  erroAtualizarSenha: 'Erro ao atualizar senha do usuario',
  erroAtualizarStatus: 'Erro ao atualizar status do usuario',
  usuarioNaoEncontrado: 'Usuario nao encontrado',
  corpoCadastroInvalido: 'O corpo da requisicao deve conter os dados do usuario',
  nomeObrigatorio: 'O campo nome e obrigatorio',
  cpfObrigatorio: 'O campo cpf e obrigatorio',
  emailObrigatorio: 'O campo email e obrigatorio',
  senhaObrigatoria: 'O campo senha e obrigatorio',
  tipoObrigatorio: 'O campo tipo e obrigatorio',
  tipoInvalido: 'O campo tipo deve ser um valor valido de TipoUsuario',
  emailOuCpfEmUso: 'Ja existe um usuario com este email ou cpf',
  ativoInvalido: 'O campo ativo deve ser enviado como true ou false',
  senhaAtualizacaoInvalida: 'O campo senha deve ser enviado e nao pode ser vazio',
  corpoPerfilInvalido: 'O corpo da requisicao deve conter nome, email, cpf ou tipo',
  perfilSemCamposPermitidos: 'Nenhum campo valido enviado para atualizacao',
  perfilSemPermissao: 'Voce so pode editar o proprio usuario, exceto se for admin',
  tipoSemPermissao: 'Somente admin pode alterar o tipo do usuario'
};
