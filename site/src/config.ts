const WEBHOOK_URLS_ENV = import.meta.env.PUBLIC_WEBHOOK_URLS ?? "";
const REDIRECT_URL_ENV = import.meta.env.PUBLIC_REDIRECT_URL ?? "";

export const CONFIG = {
  // Webhooks — todos disparam em paralelo no submit (fire-and-forget).
  // Configure via PUBLIC_WEBHOOK_URLS (comma-separated) no .env
  WEBHOOK_URLS: WEBHOOK_URLS_ENV.split(",").map((u) => u.trim()).filter(Boolean),
  REDIRECT_URL: REDIRECT_URL_ENV,

  // Event details
  EVENT_NAME: "Intensivo Claude Code",
  EVENT_DATE: "16/05, evento online ao vivo no Zoom",
  EVENT_BADGE: "AO VIVO · 16 DE MAIO · ZOOM",
  TOP_BAR_TEXT: "ENTRE NO GRUPO E ACESSE A OFERTA ÚNICA DE R$27. CARRINHO PÚBLICO ABRE A R$47.",

  // Hero
  HEADLINE_PART1: "Aprenda como usar o Claude Code para colocar ",
  HEADLINE_HIGHLIGHT: "10 agentes de IA trabalhar pra você",
  HEADLINE_PART2: ".",
  SUBHEADLINE:
    "Aprenda do zero a ferramenta de IA preferida dos empreendedores e crie em minutos toda a estrutura digital do seu negócio.",
  ICP_LINE:
    "Intensivo para Empresários, Empreendedores e Profissionais Liberais.",
  PRICE_ANCHOR:
    "Oferta única de R$27. Entre no grupo para receber.",
  DIAGRAM_CAPTION:
    "Você no Mission Control. 4 squads de Claude Code fazendo o trabalho.",
  OBJECTIONS: [
    "Sem programar código",
    "Sem contratar mais gente",
    "Sem curso infinito antes de aplicar",
  ],
  CTA_TEXT: "ENTRAR NO GRUPO E VER A OFERTA",
  CTA_REINFORCEMENT: "Sábado 16/05 · 09h às 17h",

  // Benefits
  BENEFITS_TAG: "O QUE SÓ QUEM ESTÁ NO GRUPO TEM",
  BENEFITS_TITLE: "4 condições que o público geral não vai ter.",
  BENEFITS: [
    {
      number: "01",
      title: "Preço travado em R$27",
      description:
        "Carrinho público abre em 30/04 por R$47 no Lote 1. Quem está no grupo paga R$27 por estar 3 dias antes. Esse preço não volta.",
    },
    {
      number: "02",
      title: "Bônus de preparação",
      description:
        "Guia de setup do Claude Code e checklist dos 4 Squads no e-mail de boas-vindas. Você chega com o ambiente pronto no dia 16.",
    },
    {
      number: "03",
      title: "72h de vantagem",
      description:
        "Acesso ao carrinho 3 dias antes do público geral. Zero concorrência por vaga e menor preço garantido do funil.",
    },
    {
      number: "04",
      title: "Trial 30 dias ChatFunnel",
      description:
        "Todo ingresso inclui trial ativado do ChatFunnel, nossa plataforma própria de automação com IA. Aplica o que aprendeu imediatamente.",
    },
  ],
  BENEFITS_CTA: "QUERO ENTRAR NO GRUPO",

  // Timeline (agenda do dia)
  TIMELINE_TAG: "AGENDA DO DIA",
  TIMELINE_TITLE: "Como seu sábado vai ser montado",
  TIMELINE_SUBTITLE:
    "Você sai do dia com o Sistema 10x configurado, não só com o conceito entendido.",
  TIMELINE_BLOCKS: [
    {
      time: "09h00 às 12h00",
      title: "Bloco 1: Fundamentos do Claude Code",
      description:
        "O que é Claude Code, como instalar, primeiros passos e tour completo pelas funcionalidades. Você sai da manhã com o ambiente rodando e entendendo cada alavanca da ferramenta.",
    },
    {
      time: "12h00 às 14h00",
      title: "Intervalo para almoço",
      description:
        "Pausa para processar a primeira metade e voltar com a cabeça fresca para a parte prática.",
    },
    {
      time: "14h00 às 16h00",
      title: "Bloco 2: MCP, Agentes, Skills e Projetos Práticos",
      description:
        "Extensões avançadas do Claude Code: configuração de MCPs, construção de agentes, criação de skills e aplicação tudo junto em projetos práticos ao vivo.",
    },
    {
      time: "16h00 às 17h00",
      title: "Bloco 3: Apresentação do ecossistema AI Society",
      description:
        "Como o ecossistema AI Society acelera o que você acabou de aprender e continua te puxando pra cima depois do sábado.",
    },
  ],
  TIMELINE_FOOTER:
    "Sábado 16/05 · 09h às 17h · Ao vivo no Zoom com gravação liberada.",

  // Presenter
  PRESENTER_NAME: "Mateus Dias",
  PRESENTER_TITLE: "Quem conduz o intensivo?",
  PRESENTER_BIO:
    "Me chamo Mateus Dias. Sou fundador do Grupo VUK e especialista em operações de IA para negócios digitais.\n\n• CEO do ChatFunnel\n• CEO do ThumbFlow\n• Founder do AI Sigma Studio\n• Host da Imersão InfoSaaS e da CAIA\n\nCriador do maior canal de Funil de Vendas do Brasil, com 300 mil inscritos e 480+ vídeos que já alcançaram 70 milhões de pessoas.\n\n4.200+ alunos formados no ecossistema VUK e múltiplos produtos digitais com clientes recorrentes.",

  // Urgency
  URGENCY_TITLE: "A janela de mercado não espera.",
  URGENCY_SUBTITLE:
    "Claude Code é a conversa do mercado agora. Quem domina em maio sai na frente por 6 a 12 meses. O grupo fecha em 26/04 e a oferta única de R$27 não volta.",
  FINAL_CTA: "SIM, QUERO MEU LUGAR NO GRUPO",

  // Modal
  MODAL_TITLE: "Quase lá.",
  MODAL_SUBTITLE: "Preencha para entrar no grupo e acessar a oferta única de R$27.",
  MODAL_SUBMIT: "ENTRAR NO GRUPO",
  MODAL_PRIVACY: "Seus dados estão seguros. Zero spam.",
  MODAL_SUCCESS: "Você está dentro.",
  MODAL_ERROR: "Erro ao enviar. Tente novamente.",

  // FAQ
  FAQ_TAG: "PERGUNTAS FREQUENTES",
  FAQ_TITLE: "Respostas rápidas antes de você entrar.",
  FAQ_SUBTITLE:
    "Se ficou alguma dúvida, veja as perguntas mais comuns de quem estava no seu lugar.",
  FAQ_ITEMS: [
    {
      question: "Preciso saber programar para usar Claude Code?",
      answer:
        "Não. Claude Code foi desenhado para ser operado em linguagem natural. Você dá instruções como daria para um colaborador. O evento parte do zero em configuração e você vai acompanhar ao vivo cada passo.",
    },
    {
      question: "O que é esse grupo e por que entrar por ele?",
      answer:
        "É o grupo de acesso antecipado no WhatsApp com uma oferta única: R$27 no ingresso, disponível só para quem está dentro antes de 26/04. O carrinho público abre em 30/04 a R$47 no Lote 1. A oferta de R$27 não volta depois.",
    },
    {
      question: "E se eu não conseguir estar no Zoom no dia 16/05?",
      answer:
        "Se você sabe que não vai conseguir assistir ao vivo, recomendamos o ingresso VIP com gravação vitalícia. O evento ao vivo tem interações e demonstrações práticas que perdem parte do valor no replay.",
    },
    {
      question: "Já tenho um curso de Claude Code. Esse é diferente?",
      answer:
        "Totalmente. Cursos existentes ensinam produtividade pessoal: como você usa melhor a ferramenta. Este evento ensina como montar uma operação de IA que você vende para clientes e que gera recorrência mensal. Ângulos completamente diferentes.",
    },
    {
      question: "Preciso ter clientes de IA já para aproveitar o evento?",
      answer:
        "Não precisa. Se já tem clientes de outros serviços (tráfego, copy, social), você sai do evento com o roteiro para oferecer IA como novo serviço para eles. Se não tem clientes ainda, o bloco 4 cobre como posicionar e vender o serviço.",
    },
    {
      question: "Quanto custa para rodar o sistema depois do evento?",
      answer:
        "A infra completa do Sistema 10x fica em torno de R$39/mês com Claude Code Max mais o trial do ChatFunnel. Após o trial, o ChatFunnel custa R$497/mês. Você pode repassar esse custo ao cliente como parte do serviço recorrente.",
    },
    {
      question: "E se eu não gostar ou achar que não foi o que esperava?",
      answer:
        "Você tem 7 dias a partir da data do evento para pedir reembolso integral, sem precisar justificar. Nenhuma pergunta, nenhuma burocracia. O risco é todo nosso.",
    },
  ],

  // Footer
  COPYRIGHT: "© 2026 Grupo VUK. Todos os direitos reservados.",
};
