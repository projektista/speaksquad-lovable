import {
  CREDIT_PACKAGES,
  formatExpiryDays,
  formatExpiryFaq,
  formatJpyPrice,
  formatPricingPer,
  formatSavePercent,
} from "@/lib/pricing";

export type PricingTier = {
  name: string;
  price: string;
  per: string;
  save: string | null;
  features: string[];
  footer: string;
  featured: boolean;
};

export type FaqAnswer = string | (string | { text: string; to: string })[];

export type FaqItem = { q: string; a: FaqAnswer };

export type FaqCategory = { title: string; items: FaqItem[] };

export type LandingContent = {
  htmlLang: string;
  signupPath: "/signup" | "/ptbr/signup";
  hero: {
    label: string;
    titleLine1: string;
    titleWord1: string;
    typingText: string;
    typingSpeed: number;
    lead: string;
    ctaPrimary: string;
    noCard: string;
    requirementsNote: string;
    requirementsLink: string;
    tags: string[];
    sideLabel: string;
    stats: { v: string; l: string }[];
  };
  metodo: {
    label: string;
    sectionN: string;
    titleParts: { text: string; color: "white" | "cyan" | "magenta" }[];
    p1: string;
    p2: string;
  };
  features: {
    label: string;
    sectionN: string;
    titleParts: { text: string; color: "white" | "cyan" | "magenta" }[];
    items: { t: string; d: string }[];
  };
  fluxo: {
    label: string;
    sectionN: string;
    titleParts: { text: string; color: "white" | "cyan" | "magenta" }[];
    intro: string;
    partWord: string;
    items: { n: string; t: string; d: string }[];
  };
  gratis: {
    label: string;
    sectionN: string;
    titleParts: { text: string; color: "white" | "cyan" | "magenta" }[];
    banner: string;
    steps: { n: string; t: string; d: string }[];
  };
  pricing: {
    label: string;
    sectionN: string;
    title: string;
    intro: string;
    popularBadge: string;
    buyCta: string;
    tiers: PricingTier[];
  };
  requisitos: {
    label: string;
    sectionN: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix?: string;
    items: { t: string; o: string }[];
    ctaLine1: string;
    ctaLine2: string;
  };
  sobre: {
    label: string;
    sectionN: string;
    role: string;
    tag: string;
    paragraphs: string[];
  };
  cta: {
    label: string;
    sectionN: string;
    titleParts: { text: string; color: "white" | "cyan" | "magenta" }[];
    lead: string;
    button: string;
    caption: string;
  };
  faq: {
    label: string;
    sectionN: string;
    intro: string;
    categories: FaqCategory[];
  };
};

export const ptContent: LandingContent = {
  htmlLang: "pt-BR",
  signupPath: "/ptbr/signup",
  hero: {
    label: "LEVEL UP YOUR ENGLISH",
    titleLine1: "APRENDA INGLÊS",
    titleWord1: "jogando",
    typingText: "GAMES",
    typingSpeed: 90,
    lead:
      "Um método de ensino que usa conversação em jogos 1:1. Aprenda inglês fazendo o que você já gosta de fazer. Ideal para quem tem vontade de aprender e poucas oportunidades de praticar.",
    ctaPrimary: "Primeira aula grátis",
    noCard: "Sem cartão para a aula experimental.",
    requirementsNote: "Só precisa ter o jogo e se cadastrar.",
    requirementsLink: "Saiba mais",
    tags: ["Minecraft", "Fortnite", "Zoom"],
    sideLabel: "// VANTAGENS",
    stats: [
      { v: "1-on-1", l: "mesmo professor sempre" },
      { v: "50min", l: "por aula, sem enrolação" },
      { v: "¥0", l: "para experimentar" },
    ],
  },
  metodo: {
    label: "O método",
    sectionN: "01",
    titleParts: [
      { text: "Esse ", color: "white" },
      { text: "método ", color: "cyan" },
      { text: "vai funcionar com ", color: "white" },
      { text: "você", color: "magenta" },
      { text: ".", color: "white" },
    ],
    p1: "Quando forçamos algo que não gostamos, fica estressante e fácil de desistir. Quando fazemos algo que já temos interesse, é mais fácil manter o hábito.",
    p2: "Esse método de conversação em inglês através de jogos pega algo que você já gosta, jogar, para desenvolver e melhorar sua habilidade no idioma.",
  },
  features: {
    label: "Diferenciais",
    sectionN: "02",
    titleParts: [
      { text: "Aprenda ", color: "white" },
      { text: "falando, ", color: "magenta" },
      { text: "não decorando", color: "cyan" },
      { text: ".", color: "white" },
    ],
    items: [
      { t: "Professor dedicado", d: "Um professor que conhece seu progresso, seu nível e seus jogos favoritos. Ele atua como tutor, dando instruções específicas para você." },
      { t: "Conversação real", d: "Não é sala de aula, ficando na revisão de gramática e regras. Usamos inglês em contexto: dar ordens no jogo, descrever estratégias, reagir a situações." },
      { t: "Progresso acompanhado", d: "Cada aula gera uma entrada no seu histórico. O professor envia relatório com vocabulário trabalhado e pontos a treinar." },
      { t: "Ambiente seguro", d: "Você fica à vontade para se expressar e treinar seu inglês, sem julgamento, num ambiente descontraído." },
      { t: "Diversão", d: "O principal objetivo é ser uma forma divertida de aprender inglês. Seu tutor também gosta de jogos." },
      { t: "Simplicidade", d: "Cadastro, compra de créditos (1 crédito = 1 aula) e agendamento. Sem burocracia no meio do caminho." },
    ],
  },
  fluxo: {
    label: "Estrutura da aula",
    sectionN: "03",
    titleParts: [
      { text: "Como é o ", color: "white" },
      { text: "fluxo ", color: "magenta" },
      { text: "da ", color: "white" },
      { text: "aula", color: "cyan" },
      { text: ".", color: "white" },
    ],
    intro: "Cada aula é dividida em três partes. Não é só \"entrar e jogar\".",
    partWord: "PARTE",
    items: [
      { n: "01", t: "Introdução", d: "Conversa introdutória e tranquila. Muitas vezes usada para revisar o que já foi visto e alinhar o foco daquela aula." },
      { n: "02", t: "Gameplay", d: "Durante o jogo, o professor ensina e ajuda o aluno a se expressar com frases e termos de forma natural, no contexto do que está acontecendo." },
      { n: "03", t: "Revisão", d: "Repetimos palavras e frases usadas durante o jogo, focando no que foi mais difícil, e o ajudamos a sair confiante." },
    ],
  },
  gratis: {
    label: "Como funciona",
    sectionN: "04",
    titleParts: [
      { text: "Sua ", color: "white" },
      { text: "1ª aula ", color: "cyan" },
      { text: "é ", color: "white" },
      { text: "gratuita", color: "magenta" },
      { text: ".", color: "white" },
    ],
    banner: "Criar sua conta e agendar sua primeira aula, leva poucos minutos. Vale a pena!",
    steps: [
      { n: "PASSO 1", t: "Registre-se", d: "Insira nome, email e senha para criar sua conta." },
      { n: "PASSO 2", t: "Complete seu perfil", d: "Escolha seu jogo de preferência e conte um pouco sobre você." },
      { n: "PASSO 3", t: "Agende sua aula", d: "Escolha o horário que funciona melhor para você." },
      { n: "PASSO 4", t: "Entre na aula", d: "Acesse a videoconferência pelo seu perfil ou pelo link no email." },
    ],
  },
  pricing: {
    label: "Preço",
    sectionN: "05",
    title: "Simples, transparente e direto.",
    intro: "1 crédito = 1 aula de 50 minutos. Compre o que precisar, quando precisar.",
    popularBadge: "[ mais_popular ]",
    buyCta: "Comprar",
    tiers: [
      { name: "Unitário", price: formatJpyPrice(CREDIT_PACKAGES.single.amountJpy), per: formatPricingPer(CREDIT_PACKAGES.single.amountJpy, CREDIT_PACKAGES.single.credits, "pt"), features: ["1 aula de 50 minutos", formatExpiryDays(CREDIT_PACKAGES.single.expiryDays, "pt"), "Flexibilidade total"], footer: "Sem contrato. Sem matrícula.", featured: false, save: null },
      { name: "Pacote 5", price: formatJpyPrice(CREDIT_PACKAGES.pack5.amountJpy), per: formatPricingPer(CREDIT_PACKAGES.pack5.amountJpy, CREDIT_PACKAGES.pack5.credits, "pt"), save: formatSavePercent(CREDIT_PACKAGES.pack5.amountJpy, CREDIT_PACKAGES.pack5.credits, "pt"), features: ["5 aulas de 50 minutos", formatExpiryDays(CREDIT_PACKAGES.pack5.expiryDays, "pt"), "Flexibilidade total", "Planeje suas aulas com mais antecedência"], footer: "Teste uma aula grátis antes.", featured: true },
      { name: "Pacote 10", price: formatJpyPrice(CREDIT_PACKAGES.pack10.amountJpy), per: formatPricingPer(CREDIT_PACKAGES.pack10.amountJpy, CREDIT_PACKAGES.pack10.credits, "pt"), save: formatSavePercent(CREDIT_PACKAGES.pack10.amountJpy, CREDIT_PACKAGES.pack10.credits, "pt"), features: ["10 aulas de 50 minutos", formatExpiryDays(CREDIT_PACKAGES.pack10.expiryDays, "pt"), "Flexibilidade total", "Planeje suas aulas com mais antecedência"], footer: "Sem contrato. Sem surpresas.", featured: false },
    ],
  },
  requisitos: {
    label: "Antes de começar",
    sectionN: "06",    
    titleParts: [
      { text: "O que ", color: "cyan" },
      { text: "você ", color: "white" },
      { text: "precisa ", color: "magenta" },
      { text: "ter.", color: "white" },
    ],
    items: [
      { t: "Jogo instalado e atualizado", o: "No seu console ou PC" },
      { t: "Zoom", o: "Para a videochamada com o professor" },
      { t: "PC, tablet ou smartphone", o: "Qualquer um serve" },
      { t: "Fone com microfone", o: "Opcional, mas recomendado" },
    ],
    ctaLine1: "Tenho tudo isso.",
    ctaLine2: "Quero minha aula grátis!",
  },
  sobre: {
    label: "Sobre",
    sectionN: "07",
    role: "Fundador · Instrutor · Gamer",
    tag: "[ tokyo · jst ]",
    paragraphs: [
      "A SpeakSquad começou porque eu, Hugo, percebi que oportunidades estavam sendo perdidas. Alunos que gostam de jogar e querem aprender inglês acabam a aula apenas com a sensação de que foi legal jogar com o professor.",
      "Deixar as aulas muito livres pode prejudicar o aprendizado. A troca constante de professores não é a melhor estratégia para quem está começando. E permitir dois ou mais irmãos na mesma aula faz as crianças caírem no português.",
      "Peguei um método que já existe no mercado, aulas de inglês via jogos, e adicionei o que faltava: continuidade pedagógica, modo de jogo escolhido com a intenção de ensinar inglês, e adaptação real para cada aluno.",
      "Ainda sou eu quem dá as aulas. Não é um app, nem IA. É uma pessoa que se importa com o desenvolvimento do seu filho e tem critérios claros sobre como uma boa aula funciona.",
    ],
  },
  cta: {
    label: "Interessou?",
    sectionN: "08",
    titleParts: [
      { text: "Comece sua primeira\n", color: "white" },
      { text: "aula gratuita ", color: "cyan" },
      { text: "JÁ!", color: "magenta" },
    ],
    lead: "Sem registro complicado. Sem cobrança escondida. 50 minutos de aula real, e depois você decide.",
    button: "Agendar aula experimental",
    caption: "Faça um teste já!",
  },
  faq: {
    label: "Perguntas frequentes",
    sectionN: "09",
    intro: "Se sua dúvida não estiver aqui, é só perguntar antes da aula experimental.",
    categories: [
      {
        title: "Sobre o método",
        items: [
          { q: "Preciso já falar inglês para começar?", a: "Não. Atendemos desde iniciantes até níveis avançados. Na aula gratuita, avaliamos o nível atual e ajustamos o ritmo a partir daí." },
          { q: "Como funciona uma aula, na prática?", a: "Cada aula tem 50 minutos e é dividida em três partes: uma introdução relaxada (revisão do que foi visto antes e foco do dia), o momento de jogo em si (onde o vocabulário e as expressões aparecem naturalmente conforme a situação do jogo), e uma revisão final para reforçar o que foi praticado." },
          { q: "Por que aprender inglês jogando funciona?", a: "Porque tira o peso de \u201cestudar\u201d uma matéria chata. Você já gosta de jogar — a aula aproveita esse interesse genuíno para criar repetição natural de vocabulário e situações de comunicação real, sem parecer exercício de sala de aula." },
          { q: "Quais jogos vocês usam?", a: "Minecraft e Fortnite. A escolha do jogo é feita no seu perfil e pode ser ajustada conforme sua preferência." },
          { q: "Terei sempre o mesmo professor?", a: "Sim. A continuidade com um único professor é um dos pilares do método — ele acompanha seu progresso, nível e histórico de aulas ao longo do tempo, o que permite um ensino mais personalizado do que trocar de professor a cada aula." },
        ],
      },
      {
        title: "Segurança e confiança",
        items: [
          { q: "As aulas são dadas por uma pessoa real?", a: "Sim. As aulas são conduzidas por Hugo, fundador do SpeakSquad — não há IA nem professor terceirizado. É a mesma pessoa que acompanha o progresso do seu filho ao longo do tempo." },
          { q: "As aulas são gravadas?", a: "Não gravamos áudio ou vídeo das aulas. O que fica registrado é um resumo em texto do vocabulário trabalhado, disponível para consulta no histórico da aula." },
          { q: "Como posso acompanhar o progresso do meu filho?", a: "Cada aula gera um breve relatório com o vocabulário e as expressões trabalhadas, visível na página da aula dentro da plataforma." },
          { q: "O jogo usado na aula tem chat público ou contato com estranhos?", a: "As aulas acontecem em ambiente controlado, dentro de uma sessão privada entre aluno e professor. Não há exposição a chat público ou jogadores desconhecidos durante o horário da aula." },
          { q: "Quem pode criar a conta — eu ou meu filho?", a: "O cadastro e a compra de créditos devem ser feitos por um responsável adulto. A criança participa apenas do momento da aula em si." },
          {
            q: "Vocês têm alguma política específica para menores de idade?",
            a: [
              "Sim — veja nossa ",
              { text: "Política de Privacidade", to: "/ptbr/privacy" },
              " para detalhes sobre como tratamos dados de menores, e os ",
              { text: "Termos de Uso", to: "/ptbr/terms" },
              " para as regras de conduta durante as aulas.",
            ],
          },
        ],
      },
      {
        title: "Agendamento e cancelamento",
        items: [
          { q: "Posso cancelar ou remarcar uma aula agendada?", a: "Sim, desde que seja feito com pelo menos 6 horas de antecedência — nesse caso, o crédito volta integralmente para sua conta. Cancelamentos com menos de 6 horas de antecedência não têm o crédito devolvido." },
          { q: "O que acontece se eu (ou meu filho) não comparecer à aula?", a: "Se não houver comparecimento dentro de 10 minutos do horário agendado, o crédito da aula é consumido, sem devolução. Recomendamos entrar com alguma antecedência para evitar isso." },
          { q: "Como faço para agendar uma aula?", a: "Pelo menu \u201cAgendar\u201d no seu painel — lá você vê os horários que o professor deixou disponíveis numa agenda semanal navegável, e escolhe o que for melhor pra você." },
          { q: "Posso agendar aulas para várias semanas à frente?", a: "Sim, a agenda permite navegar e escolher horários com bastante antecedência, dentro da disponibilidade aberta pelo professor." },
        ],
      },
      {
        title: "Créditos e pagamento",
        items: [
          { q: "Os créditos têm validade?", a: formatExpiryFaq("pt") },
          { q: "Quais formas de pagamento vocês aceitam?", a: "Pagamento via Stripe, com cartão de crédito. O SpeakSquad não armazena os dados do seu cartão." },
          { q: "Emitem recibo ou nota fiscal?", a: "Você recebe automaticamente um recibo de pagamento por e-mail assim que a compra é confirmada. Para necessidades específicas de nota fiscal, entre em contato conosco." },
          {
            q: "Se eu não usar todos os créditos do pacote, posso pedir reembolso?",
            a: [
              "Créditos não utilizados dentro do prazo de validade não são reembolsáveis em dinheiro. Veja os detalhes completos nos ",
              { text: "Termos de Compra de Créditos", to: "/ptbr/terms" },
              ".",
            ],
          },
          { q: "Posso comprar mais créditos mesmo tendo créditos ativos?", a: "Sim, você pode comprar novos pacotes a qualquer momento — os créditos se acumulam, cada lote mantendo sua própria data de expiração." },
        ],
      },
      {
        title: "Aspectos práticos",
        items: [
          { q: "Preciso comprar o jogo antes da aula gratuita?", a: "Sim, é necessário ter o Minecraft ou Fortnite instalado para participar, inclusive da aula gratuita." },
          { q: "Posso ter aula com meu irmão/irmã ao mesmo tempo?", a: "Recomendamos aulas individuais. Quando irmãos fazem aula juntos, é comum que voltem a falar em português entre si, o que reduz o tempo real de prática em inglês." },
          { q: "O que preciso ter para participar de uma aula?", a: "O jogo (Minecraft ou Fortnite) instalado, em PC ou console; Zoom, para a videochamada com o professor; um dispositivo com câmera (PC, tablet ou celular); fone de ouvido com microfone (recomendado, mas não obrigatório)." },
          {
            q: "O que acontece se a internet cair no meio da aula?",
            a: [
              "Ter uma conexão estável e um dispositivo funcionando é responsabilidade do aluno, então a regra geral é: problema técnico do seu lado = crédito consumido, mesmo que o professor espere os 50 minutos completos da aula. A única exceção é avisar dentro dos primeiros 10 minutos do horário marcado que a conexão ou o dispositivo estão com problema — nesse caso, devolvemos o crédito. Se você entrar, cair depois disso e não conseguir voltar na hora, ainda pode contestar em até 2 horas após o horário da aula. Já se o problema for da nossa parte (professor ou plataforma), o crédito é sempre devolvido. Veja os detalhes completos nos ",
              { text: "Termos de Compra de Créditos", to: "/ptbr/terms" },
              ".",
            ],
          },
          { q: "As aulas são sempre no mesmo horário toda semana?", a: "Não necessariamente — você escolhe o horário que quiser dentro da disponibilidade do professor a cada semana, sem compromisso de horário fixo recorrente (a menos que prefira agendar dessa forma)." },
        ],
      },
    ],
  },
};

export const jpContent: LandingContent = {
  htmlLang: "ja",
  signupPath: "/signup",
  hero: {
    label: "LEVEL UP YOUR ENGLISH",
    titleLine1: "ゲームで、",
    titleWord1: "英語を",
    typingText: "身につける",
    typingSpeed: 100,
    lead:
      "マンツーマンのゲーム内会話で学ぶ英語メソッド。すでに好きなことをしながら英語を伸ばします。学ぶ意欲はあるのに、練習の機会が少ない人に最適です。",
    ctaPrimary: "無料体験レッスン",
    noCard: "体験レッスンにクレジットカード不要。",
    requirementsNote: "ゲームと登録だけでOK。",
    requirementsLink: "詳しく見る",
    tags: ["Minecraft", "Fortnite", "Zoom"],
    sideLabel: "// メリット",
    stats: [
      { v: "1-on-1", l: "同じ先生が担当" },
      { v: "50min", l: "1レッスン、無駄なし" },
      { v: "¥0", l: "初回体験" },
    ],
  },
  metodo: {
    label: "メソッド",
    sectionN: "01",
    titleParts: [
      { text: "この", color: "white" },
      { text: "メソッド", color: "cyan" },
      { text: "は", color: "white" },
      { text: "あなた", color: "magenta" },
      { text: "に効く。", color: "white" },
    ],
    p1: "嫌なことを無理に続けるのはストレスで、すぐ挫折します。もともと興味があることなら、習慣にしやすい。",
    p2: "ゲームを通した英会話メソッドは、すでに好きな「遊ぶこと」を、英語力を伸ばす時間に変えます。",
  },
  features: {
    label: "特長",
    sectionN: "02",
    titleParts: [
      { text: "暗記ではなく、", color: "white" },
      { text: "話して", color: "magenta" },
      { text: "学ぶ", color: "cyan" },
      { text: "。", color: "white" },
    ],
    items: [
      { t: "専任講師", d: "生徒の進度・レベル・好きなゲームを把握した同じ講師が最後まで担当。個別最適化された指示を行います。" },
      { t: "本物の会話", d: "文法や規則の暗記に留まる授業ではありません。ゲーム内で英語を使います。指示を出す、戦略を伝える、状況に反応する。" },
      { t: "進捗の記録", d: "毎回のレッスンが履歴に残ります。学んだ語彙と練習すべきポイントをレポートで共有します。" },
      { t: "安心できる環境", d: "リラックスした雰囲気の中で、判断されず自分を表現し英語を練習できます。" },
      { t: "楽しさ", d: "楽しく英語を学ぶことが最大の目的。講師自身もゲームが好きです。" },
      { t: "シンプル", d: "登録・クレジット購入(1クレジット=1レッスン)・予約。途中に無駄な手続きはありません。" },
    ],
  },
  fluxo: {
    label: "レッスンの構成",
    sectionN: "03",
    titleParts: [
      { text: "レッスンの", color: "white" },
      { text: "流れ", color: "magenta" },
      { text: "。", color: "white" },
    ],
    intro: "1レッスンは3つのパートで構成されています。「ただ入って遊ぶ」だけではありません。",
    partWord: "PART",
    items: [
      { n: "01", t: "導入", d: "リラックスした導入の会話。前回の復習と、今回の焦点を確認する時間としても使います。" },
      { n: "02", t: "ゲームプレイ", d: "ゲーム中に、その場の状況に合った表現や単語を、講師が自然に教えていきます。" },
      { n: "03", t: "復習", d: "使ったフレーズを繰り返し、難しかった部分に絞って自信を持って終わります。" },
    ],
  },
  gratis: {
    label: "流れ",
    sectionN: "04",
    titleParts: [
      { text: "初回レッスンは", color: "white" },
      { text: "無料", color: "cyan" },
      { text: "です", color: "magenta" },
      { text: "。", color: "white" },
    ],
    banner: "アカウント作成と初回予約は数分で完了。試す価値あり!",
    steps: [
      { n: "STEP 1", t: "登録", d: "名前・メール・パスワードでアカウントを作成。" },
      { n: "STEP 2", t: "プロフィール", d: "希望のゲームと自己紹介を入力。" },
      { n: "STEP 3", t: "予約", d: "都合のいい時間を選択。" },
      { n: "STEP 4", t: "レッスン参加", d: "プロフィールまたはメールのリンクからビデオ通話に入室。" },
    ],
  },
  pricing: {
    label: "料金",
    sectionN: "05",
    title: "シンプル、明確、率直。",
    intro: "1クレジット = 50分レッスン1回。必要な分だけ、必要なときに購入できます。",
    popularBadge: "[ 人気 ]",
    buyCta: "購入する",
    tiers: [
      { name: "単発", price: formatJpyPrice(CREDIT_PACKAGES.single.amountJpy), per: formatPricingPer(CREDIT_PACKAGES.single.amountJpy, CREDIT_PACKAGES.single.credits, "jp"), features: ["50分レッスン × 1", formatExpiryDays(CREDIT_PACKAGES.single.expiryDays, "jp"), "柔軟な予約"], footer: "契約なし。入会金なし。", featured: false, save: null },
      { name: "5回パック", price: formatJpyPrice(CREDIT_PACKAGES.pack5.amountJpy), per: formatPricingPer(CREDIT_PACKAGES.pack5.amountJpy, CREDIT_PACKAGES.pack5.credits, "jp"), save: formatSavePercent(CREDIT_PACKAGES.pack5.amountJpy, CREDIT_PACKAGES.pack5.credits, "jp"), features: ["50分レッスン × 5", formatExpiryDays(CREDIT_PACKAGES.pack5.expiryDays, "jp"), "柔軟な予約", "余裕を持って予定を組める"], footer: "まずは無料体験から。", featured: true },
      { name: "10回パック", price: formatJpyPrice(CREDIT_PACKAGES.pack10.amountJpy), per: formatPricingPer(CREDIT_PACKAGES.pack10.amountJpy, CREDIT_PACKAGES.pack10.credits, "jp"), save: formatSavePercent(CREDIT_PACKAGES.pack10.amountJpy, CREDIT_PACKAGES.pack10.credits, "jp"), features: ["50分レッスン × 10", formatExpiryDays(CREDIT_PACKAGES.pack10.expiryDays, "jp"), "柔軟な予約", "余裕を持って予定を組める"], footer: "契約なし。隠れた費用なし。", featured: false },
    ],
  },
  requisitos: {
    label: "準備するもの",
    sectionN: "06",
    titlePrefix: "必要なものは ",
    titleHighlight: "シンプル",
    titleSuffix: "。",
    items: [
      { t: "ゲーム(インストール済み)", o: "PCまたはコンソール" },
      { t: "Zoom", o: "先生とのビデオ通話用" },
      { t: "PC・タブレット・スマホ", o: "どれでも可" },
      { t: "マイク付きヘッドフォン", o: "任意ですが推奨" },
    ],
    ctaLine1: "全部そろっています。",
    ctaLine2: "無料レッスンを受けたい!",
  },
  sobre: {
    label: "紹介",
    sectionN: "07",
    role: "創設者 · 講師 · ゲーマー",
    tag: "[ tokyo · jst ]",
    paragraphs: [
      "SpeakSquadは、私Hugoが「機会が失われている」と感じたところから始まりました。ゲームが好きで英語を学びたい生徒が、結局「先生と遊べて楽しかった」で終わってしまう。",
      "レッスンを自由にしすぎると学習が薄くなる。講師が毎回変わるのは初学者に向かない。兄弟を同じレッスンに入れると子どもたちは日本語に戻ってしまう。",
      "既に存在する「ゲームで学ぶ英会話」というメソッドをベースに、足りなかったもの――教育的な継続性、英語を教える意図で選ばれたゲームモード、一人ひとりに合わせた本当の意味での調整――を加えました。",
      "レッスンを担当するのは今も私自身です。アプリでもAIでもなく、お子さんの成長を大切に思い、良いレッスンとは何かの基準を持った一人の人間が教えます。",
    ],
  },
  cta: {
    label: "興味がありますか?",
    sectionN: "08",
    titleParts: [
      { text: "初回の\n", color: "white" },
      { text: "無料レッスン ", color: "cyan" },
      { text: "を予約", color: "magenta" },
      { text: "。", color: "white" },
    ],
    lead: "複雑な登録も、隠れた課金もありません。50分の本物のレッスン。続けるかはその後で決めてください。",
    button: "体験レッスンを予約",
    caption: "今すぐ試してみてください!",
  },
  faq: {
    label: "よくある質問",
    sectionN: "09",
    intro: "ここに答えがない質問は、体験レッスンの前に気軽にお問い合わせください。",
    categories: [
      {
        title: "メソッドについて",
        items: [
          { q: "英語が全く話せなくても始められますか?", a: "はい。初心者から上級者まで対応します。無料体験でレベルを確認し、そこから進度を調整します。" },
          { q: "レッスンは実際どんな流れですか?", a: "1レッスン50分で、3つのパートに分かれます。まずは軽い導入(前回の復習と今日のポイント)、次にゲーム本編(ゲームの状況に合わせて語彙や表現が自然に出てきます)、最後に振り返りで練習した内容を定着させます。" },
          { q: "ゲームで英語を学ぶのがなぜ効くのですか?", a: "「勉強しなきゃ」という負担がなくなるからです。もともと好きなゲームを使うので、語彙のくり返しやリアルなコミュニケーションが自然に生まれ、教室の練習問題のようになりません。" },
          { q: "使うゲームは何ですか?", a: "MinecraftとFortniteです。使うゲームはプロフィールで選べ、好みに合わせて変更できます。" },
          { q: "先生はいつも同じ人ですか?", a: "はい。同じ先生が担当し続けることがメソッドの柱です。進み具合・レベル・レッスン履歴を把握しているので、毎回先生が変わる場合よりも個別に合わせた指導ができます。" },
        ],
      },
      {
        title: "安全性・信頼性",
        items: [
          { q: "レッスンは実在の人が担当しますか?", a: "はい。SpeakSquad創業者のHugoが担当します。AIや外部委託の講師ではありません。お子さんの成長を同じ人がずっと見守ります。" },
          { q: "レッスンは録画されますか?", a: "音声や映像の録画はしません。記録として残るのは、学んだ語彙をまとめたテキストのサマリーだけで、レッスン履歴から確認できます。" },
          { q: "子どもの進み具合はどう確認できますか?", a: "毎回のレッスンごとに、学んだ語彙や表現の短いレポートが作成され、プラットフォーム内のレッスンページで見られます。" },
          { q: "レッスン中のゲームに公開チャットや知らない人との接触はありますか?", a: "レッスンは生徒と先生だけのプライベートなセッション内、管理された環境で行います。レッスン中に公開チャットや見知らぬプレイヤーに触れることはありません。" },
          { q: "アカウントは保護者と子どものどちらが作りますか?", a: "登録とクレジットの購入は成人の保護者が行ってください。お子さんはレッスンの時間のみ参加します。" },
          {
            q: "未成年に関する方針はありますか?",
            a: [
              "はい。未成年のデータの扱いについては",
              { text: "プライバシーポリシー", to: "/privacy" },
              "を、レッスン中のルールについては",
              { text: "利用規約", to: "/terms" },
              "をご覧ください。",
            ],
          },
        ],
      },
      {
        title: "予約とキャンセル",
        items: [
          { q: "予約のキャンセル・変更はできますか?", a: "はい。6時間前までであれば可能で、その場合クレジットは全額返却されます。6時間を切ってからのキャンセルはクレジットが返却されません。" },
          { q: "レッスンに参加できなかった場合はどうなりますか?", a: "予約時刻から10分以内に参加がない場合、そのレッスンのクレジットは消費され、返却されません。少し早めの入室をおすすめします。" },
          { q: "予約はどうやってしますか?", a: "ダッシュボードの「予約」メニューからです。先生が公開している空き枠を週表示のカレンダーで確認し、都合のいい時間を選べます。" },
          { q: "何週間も先まで予約できますか?", a: "はい。先生が公開している範囲内であれば、かなり先の枠まで選んで予約できます。" },
        ],
      },
      {
        title: "クレジットとお支払い",
        items: [
          { q: "クレジットに有効期限はありますか?", a: formatExpiryFaq("jp") },
          { q: "支払い方法は?", a: "Stripeによるクレジットカード決済です。カード情報はSpeakSquadに保存されません。" },
          { q: "領収書は発行されますか?", a: "購入が確定すると、決済の領収書がメールで自動的に届きます。それ以外の書類が必要な場合はお問い合わせください。" },
          {
            q: "使い切らなかったクレジットは返金されますか?",
            a: [
              "有効期限内に使わなかったクレジットの現金返金はありません。詳細は",
              { text: "クレジット購入規約", to: "/terms" },
              "をご覧ください。",
            ],
          },
          { q: "クレジットが残っていても追加購入できますか?", a: "はい。いつでも新しいパックを購入できます。クレジットは加算され、それぞれのパックごとに有効期限が管理されます。" },
        ],
      },
      {
        title: "参加に必要なもの",
        items: [
          { q: "無料体験の前にゲームを買う必要はありますか?", a: "はい。無料体験も含め、MinecraftまたはFortniteをインストール済みの状態でご参加ください。" },
          { q: "兄弟姉妹で一緒にレッスンできますか?", a: "個別レッスンを推奨します。兄弟だと日本語で話してしまい、英語を実際に使う時間が減る傾向があります。" },
          { q: "レッスンに必要なものは?", a: "ゲーム(MinecraftまたはFortnite)をPCかコンソールにインストール済みであること、先生とのビデオ通話用のZoom、カメラ付きの端末(PC・タブレット・スマホ)、マイク付きイヤホン(推奨、必須ではありません)。" },
          {
            q: "レッスン中にインターネットが切れたらどうなりますか?",
            a: [
              "安定した通信環境と動作する端末を用意するのは生徒側の責任です。そのため原則として、生徒側の技術的な問題はクレジット消費となり、先生が50分まるごと待った場合も同じです。例外は、予約時刻から10分以内に通信や端末の不具合を連絡いただいた場合で、そのときはクレジットを返却します。入室後にそれ以降で切断し戻れなかった場合も、レッスン時刻から2時間以内であれば申し立てできます。こちら側(先生またはプラットフォーム)の問題であれば、クレジットは必ず返却します。詳細は",
              { text: "クレジット購入規約", to: "/terms" },
              "をご覧ください。",
            ],
          },
          { q: "レッスンは毎週同じ時間ですか?", a: "必ずしもそうではありません。毎週、先生の空き枠の中から好きな時間を選べます。固定の曜日・時間に縛られません(希望すればその形で予約することもできます)。" },
        ],
      },
    ],
  },
};
