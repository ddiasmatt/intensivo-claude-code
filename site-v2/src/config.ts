const WEBHOOK_URLS_ENV = import.meta.env.PUBLIC_WEBHOOK_URLS ?? '';
const REDIRECT_URL_ENV = import.meta.env.PUBLIC_REDIRECT_URL ?? '';

export const CONFIG = {
  // Meta do produto
  EVENT_NAME: 'Intensivo Claude Code',
  EVENT_DATE: '16/05, evento online ao vivo no Zoom',
  EVENT_START_ISO: '2026-05-16T09:00:00-03:00',
  EVENT_END_ISO: '2026-05-16T17:00:00-03:00',
  PRICE_GROUP: 'R$ 27',
  PRICE_PUBLIC: 'R$ 47',
  GROUP_CLOSES: '26/04',
  CART_OPENS: '30/04',

  // URLs e env
  REDIRECT_URL: REDIRECT_URL_ENV || 'https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx',
  WEBHOOK_URLS: WEBHOOK_URLS_ENV.split(',')
    .map((u: string) => u.trim())
    .filter(Boolean),

  // TopBar
  TOPBAR_TEXT: 'ENTRE NO GRUPO E ACESSE A OFERTA ÚNICA DE R$ 27. CARRINHO PÚBLICO ABRE A R$ 47.',

  // Hero
  HERO_KICKER: 'AO VIVO . 16 DE MAIO . ZOOM',
  HERO_H1_LINES: [
    { text: 'Intensivo', style: 'default' },
    { text: 'Claude Code', style: 'bold-accent-on-claude' },
  ],
  HERO_SUBHEADLINE: 'Aprenda do zero a ferramenta de IA preferida dos empreendedores e crie em minutos toda a estrutura digital do seu negócio.',
  HERO_ICP: 'Intensivo para empresários, empreendedores e profissionais liberais.',
  HERO_OFFER: 'Oferta única R$ 27. Entre no grupo para receber.',
  HERO_CTA: 'ENTRAR NO GRUPO E VER A OFERTA',
  HERO_MICROCOPY: 'Sábado 16/05 . 09h às 17h',
  HERO_BULLETS: [
    'Sem programar código',
    'Sem contratar mais gente',
    'Sem curso infinito antes de aplicar',
  ],

  // Social Proof
  SOCIALPROOF_HEADLINE: '4.200+ empresários já aplicaram o método.',
  SOCIALPROOF_SUB: 'Rola pra ver alguns dos resultados de quem já participou.',
  SOCIALPROOF_FOOTER: '19 prints reais. Zero stock. Zero ator pago.',
  SOCIALPROOF_IMAGES: Array.from(
    { length: 19 },
    (_, i) => `${import.meta.env.BASE_URL}depoimentos/depoimento-${String(i + 1).padStart(2, '0')}.webp`
  ),

  // Big Idea
  BIGIDEA_KICKER: 'A TESE DA PÁGINA',
  BIGIDEA_HEADLINE: 'Aprender Claude Code em 2026 tem a vantagem de quem aprendeu marketing digital em 2015.',
  BIGIDEA_PARA1: 'Poucos sabiam. Muitos negócios precisavam.',
  BIGIDEA_PARA2: 'Hoje, dashboards, ferramentas internas, automações e aplicações de nicho deixaram de ser "software". Viraram ativo digital de qualquer negócio minimamente sério.',
  BIGIDEA_SIGNATURE: 'Mateus Dias, abril de 2026',

  // Use Cases - Setores (8)
  USECASES_KICKER: 'QUEM JÁ USA',
  USECASES_HEADLINE: 'Setores que já estão construindo com Claude Code.',
  USECASES: [
    {
      title: 'Saúde',
      description: 'Médicos criando apps de acompanhamento. Clínicas automatizando agendamento e prontuários.',
    },
    {
      title: 'Jurídico',
      description: 'Advogados lançando ferramentas de análise de contratos e dashboards de gestão de processos.',
    },
    {
      title: 'Construção civil',
      description: 'Construtoras criando sistemas de gestão de obras sem contratar software house.',
    },
    {
      title: 'Educação',
      description: 'Professores construindo plataformas próprias de aprendizado com assinatura mensal.',
    },
    {
      title: 'Varejo',
      description: 'Lojistas automatizando precificação, estoque e atendimento com ferramentas próprias.',
    },
    {
      title: 'Finanças',
      description: 'Consultores lançando dashboards de acompanhamento para clientes com recorrência.',
    },
    {
      title: 'Marketing',
      description: 'Agências criando ferramentas de relatório e automação de entregáveis.',
    },
    {
      title: 'Hospitalidade',
      description: 'Hotéis automatizando reservas e comunicação com hóspedes.',
    },
  ],

  // Para Quem É (5 perfis + P.S. outlier + micro-CTA)
  PARAQUEM_KICKER: 'PERFIL DE QUEM VAI',
  PARAQUEM_HEADLINE: 'Marque os que se aplicam a você.',
  PARAQUEM_SUB: 'Autoteste. Marque quem você é. Nenhum dado é enviado.',
  PARAQUEM: [
    {
      title: 'Empresários e empreendedores',
      description: 'Que querem criar ferramentas internas, automatizar processos ou lançar um produto digital sem depender de dev.',
    },
    {
      title: 'Profissionais liberais e consultores',
      description: 'Que querem transformar seu conhecimento de nicho em SaaS com receita recorrente.',
    },
    {
      title: 'Criadores e influenciadores',
      description: 'Que têm audiência e querem criar uma ferramenta própria para monetizar além do conteúdo.',
    },
    {
      title: 'Founders e futuros founders',
      description: 'Que têm ideia de startup mas travam na parte técnica. Valide, lance e itere sem CTO.',
    },
    {
      title: 'Gestores e analistas',
      description: 'Que vivem em planilhas e processos manuais e querem construir ferramentas internas.',
    },
  ],
  PARAQUEM_FOOTNOTE: {
    label: 'VOCÊ NÃO PRECISA SABER PROGRAMAR',
    body: 'O pré-requisito é ter uma ideia de problema que vale resolver. A IA cuida do resto.',
  },
  PARAQUEM_CTA_TEXT: 'Se você se reconheceu em algum desses, entra no grupo e pega a oferta única de R$ 27.',
  PARAQUEM_CTA_BUTTON: 'ENTRAR NO GRUPO',

  // Benefits (4)
  BENEFITS_KICKER: 'O QUE SÓ QUEM ESTÁ NO GRUPO TEM',
  BENEFITS_HEADLINE: '4 condições que o público geral não vai ter.',
  BENEFITS: [
    {
      number: '01',
      title: 'Preço travado em R$ 27',
      description: 'Carrinho público abre em 30/04 por R$ 47 no Lote 1. Quem está no grupo paga R$ 27 por estar 3 dias antes. Esse preço não volta.',
    },
    {
      number: '02',
      title: 'Bônus de preparação',
      description: 'Guia de setup do Claude Code e checklist dos 4 Squads no e-mail de boas-vindas. Você chega com o ambiente pronto no dia 16.',
    },
    {
      number: '03',
      title: '72h de vantagem',
      description: 'Acesso ao carrinho 3 dias antes do público geral. Zero concorrência por vaga e menor preço garantido do funil.',
    },
    {
      number: '04',
      title: 'Trial 30 dias ChatFunnel',
      description: 'Todo ingresso inclui trial ativado do ChatFunnel, nossa plataforma própria de automação com IA. Aplica o que aprendeu imediatamente.',
    },
  ],
  BENEFITS_CTA: 'QUERO ENTRAR NO GRUPO',

  // Timeline
  TIMELINE_KICKER: 'AGENDA DO DIA',
  TIMELINE_HEADLINE: 'Como seu sábado vai ser montado',
  TIMELINE_SUBHEADLINE: 'Você sai do dia com a operação configurada, não só com o conceito entendido.',
  TIMELINE_BLOCKS: [
    {
      time: '09h00 às 12h00',
      title: 'Bloco 1: Fundamentos do Claude Code',
      description: 'O que é, como instalar, primeiros passos e tour completo. Sai da manhã com o ambiente rodando e entendendo cada alavanca.',
    },
    {
      time: '12h00 às 14h00',
      title: 'Intervalo para almoço',
      description: 'Pausa para processar a primeira metade.',
    },
    {
      time: '14h00 às 16h00',
      title: 'Bloco 2: MCP, Agentes, Skills e Projetos Práticos',
      description: 'Extensões avançadas. Configuração de MCPs, construção de agentes, criação de skills e aplicação tudo junto em projetos práticos ao vivo.',
    },
    {
      time: '16h00 às 17h00',
      title: 'Bloco 3: Apresentação do ecossistema AI Society',
      description: 'Como o ecossistema acelera o que você acabou de aprender e continua te puxando pra cima depois do sábado.',
    },
  ],
  TIMELINE_FOOTER: 'Sábado 16/05 . 09h às 17h . ao vivo no Zoom.',

  // Autoridade - Mateus Dias
  AUTHORITY_KICKER: 'QUEM CONDUZ',
  AUTHORITY_NAME: 'Mateus Dias',
  AUTHORITY_BIO: 'Fundador do Grupo VUK e especialista em operações de IA para negócios digitais.',
  AUTHORITY_CREDENTIALS: [
    'CEO do ChatFunnel',
    'CEO do ThumbFlow',
    'Founder do AI Sigma Studio',
    'Host da Imersão InfoSaaS e da CAIA',
  ],
  AUTHORITY_PROOF: 'Criador do maior canal de Funil de Vendas do Brasil, com 300 mil inscritos e 480+ vídeos que já alcançaram 70 milhões de pessoas. 4.200+ alunos formados no ecossistema VUK.',

  // Final CTA
  FINALCTA_HEADLINE: 'A janela de mercado não espera.',
  FINALCTA_SUBHEADLINE: 'Claude Code é a conversa do mercado agora. Quem domina em maio sai na frente por 6 a 12 meses. O grupo fecha em 26/04 e a oferta única de R$ 27 não volta.',
  FINALCTA_BUTTON: 'SIM, QUERO MEU LUGAR NO GRUPO',
  FINALCTA_MICROCOPY: 'Seus dados vão direto para o grupo. Zero spam.',

  // FAQ (7 perguntas)
  FAQ_KICKER: 'PERGUNTAS FREQUENTES',
  FAQ_HEADLINE: 'Respostas rápidas antes de você entrar.',
  FAQ_ITEMS: [
    {
      question: 'Preciso saber programar para usar Claude Code?',
      answer: 'Não. Claude Code foi desenhado para ser operado em linguagem natural. Você dá instruções como daria para um colaborador. O evento parte do zero em configuração e você acompanha ao vivo cada passo.',
    },
    {
      question: 'O que é esse grupo e por que entrar por ele?',
      answer: 'É o grupo de acesso antecipado no WhatsApp com uma oferta única: R$ 27 no ingresso, disponível só para quem está dentro antes de 26/04. O carrinho público abre em 30/04 a R$ 47 no Lote 1. A oferta de R$ 27 não volta depois.',
    },
    {
      question: 'E se eu não conseguir estar no Zoom no dia 16/05?',
      answer: 'Se você sabe que não vai conseguir ao vivo, recomendamos o ingresso VIP com gravação vitalícia. O evento ao vivo tem interações e demonstrações práticas que perdem parte do valor no replay.',
    },
    {
      question: 'Já tenho um curso de Claude Code. Esse é diferente?',
      answer: 'Totalmente. Cursos existentes ensinam produtividade pessoal. Este evento ensina como montar uma operação de IA que você vende para clientes e que gera recorrência mensal. Ângulos completamente diferentes.',
    },
    {
      question: 'Preciso ter clientes de IA já para aproveitar o evento?',
      answer: 'Não. Se já tem clientes de outros serviços (tráfego, copy, social), você sai do evento com o roteiro para oferecer IA como novo serviço para eles. Se não tem clientes ainda, o bloco 3 cobre como posicionar e vender o serviço.',
    },
    {
      question: 'Quanto custa para rodar a infra depois do evento?',
      answer: 'A infra completa fica em torno de R$ 39/mês com Claude Code Max mais o trial do ChatFunnel. Após o trial, o ChatFunnel custa R$ 497/mês. Você pode repassar esse custo ao cliente como parte do serviço recorrente.',
    },
    {
      question: 'E se eu não gostar ou achar que não foi o que esperava?',
      answer: 'Você tem 7 dias a partir da data do evento para pedir reembolso integral, sem justificar. Nenhuma pergunta, nenhuma burocracia.',
    },
  ],

  // Modal
  MODAL_TITLE: 'Quase lá.',
  MODAL_SUBTITLE: 'Preencha para entrar no grupo e acessar a oferta única de R$ 27.',
  MODAL_SUBMIT: 'ENTRAR NO GRUPO',
  MODAL_PRIVACY: 'Seus dados estão seguros. Zero spam.',
  MODAL_SUCCESS: 'Você está dentro.',
  MODAL_ERROR: 'Erro ao enviar. Tente novamente.',

  // Footer
  COPYRIGHT: '© 2026 Grupo VUK. Todos os direitos reservados.',

  // Hero Mission Control
  HERO_MISSION_CONTROL: {
    EYEBROW: 'MISSION CONTROL',
    BADGE: '10 AGENTES ATIVOS',
    LIVE_LABEL: '/live',
    COUNTER_LABEL: 'TAREFAS CONCLUÍDAS HOJE',
    COUNTER_INITIAL_RANGE: [240, 260] as const,
    FOOTER_LINE: 'VOCÊ NO CENTRO. DEZ AGENTES EM PARALELO TRABALHANDO PRA VOCÊ.',
    SQUADS: [
      { handle: '@pesquisa',  tasks: ['mapeando concorrentes', 'coletando benchmarks', 'extraindo reviews de produto', 'analisando ICPs'] },
      { handle: '@copy',      tasks: ['escrevendo headline', 'afinando CTA', 'variante A/B da página', 'sequência de e-mails'] },
      { handle: '@dev',       tasks: ['gerando dashboard', 'criando checkout', 'integrando webhook', 'deploy em staging'] },
      { handle: '@design',    tasks: ['refinando hero', 'ajustando grid mobile', 'exportando assets', 'OG image nova'] },
      { handle: '@analytics', tasks: ['validando eventos GA4', 'checando dedup Meta', 'funil de conversão', 'painel semanal'] },
      { handle: '@conteudo',  tasks: ['roteiro de YouTube', 'post do Instagram', 'script de short', 'editorial da newsletter'] },
      { handle: '@trafego',   tasks: ['criativos Meta Ads', 'teste de públicos', 'escala de campanha', 'UTM de lote'] },
      { handle: '@audio',     tasks: ['voice clone update', 'narração do VSL', 'efeito de abertura', 'áudio digest'] },
      { handle: '@vendas',    tasks: ['follow-up WhatsApp', 'agendamento de call', 'proposta personalizada', 'segmentação de leads'] },
      { handle: '@cs',        tasks: ['resposta de ticket', 'onboarding ativo', 'NPS trimestral', 'escalada pra time'] },
    ],
  },
} as const;
