export type PricingTier = {
  name: string;
  price: string;
  per: string;
  save: string | null;
  features: string[];
  footer: string;
  featured: boolean;
};

export type LandingContent = {
  htmlLang: string;
  signupPath: "/signup" | "/jp/signup";
  hero: {
    label: string;
    titleLine1: string;
    titleWord1: string;
    typingText: string;
    typingSpeed: number;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    noCard: string;
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
    items: { q: string; a: string }[];
  };
};

export const ptContent: LandingContent = {
  htmlLang: "pt-BR",
  signupPath: "/signup",
  hero: {
    label: "LEVEL UP YOUR ENGLISH",
    titleLine1: "APRENDA INGLÊS",
    titleWord1: "jogando",
    typingText: "GAMES",
    typingSpeed: 90,
    lead:
      "Um método de ensino que usa conversação em jogos 1:1. Aprenda inglês fazendo o que você já gosta de fazer. Ideal para quem tem vontade de aprender e poucas oportunidades de praticar.",
    ctaPrimary: "Primeira aula grátis",
    ctaSecondary: "Ver o método",
    noCard: "Sem cartão para a aula experimental.",
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
      { text: "da aula", color: "white" },
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
      { name: "Unitário", price: "¥2.000", per: "por aula", features: ["1 aula de 50 minutos", "Sem expiração", "Flexibilidade total"], footer: "Sem contrato. Sem matrícula.", featured: false, save: null },
      { name: "Pacote 5", price: "¥8.500", per: "¥1.700 por aula", save: "economize 15%", features: ["5 aulas de 50 minutos", "Sem expiração", "Flexibilidade total", "Prioridade no agendamento"], footer: "Teste uma aula grátis antes.", featured: true },
      { name: "Pacote 10", price: "¥14.000", per: "¥1.400 por aula", save: "economize 30%", features: ["10 aulas de 50 minutos", "Sem expiração", "Flexibilidade total", "Prioridade no agendamento"], footer: "Sem contrato. Sem surpresas.", featured: false },
    ],
  },
  requisitos: {
    label: "Antes de começar",
    sectionN: "06",
    titlePrefix: "O que você ",
    titleHighlight: "precisa ter",
    titleSuffix: ".",
    items: [
      { t: "Jogo instalado e atualizado", o: "No seu console ou PC" },
      { t: "Zoom", o: "Para a videochamada com o professor" },
      { t: "PC, tablet ou smartphone", o: "Qualquer um serve" },
      { t: "Fone com microfone", o: "Opcional, mas recomendado" },
    ],
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
      { text: "já", color: "magenta" },
      { text: ".", color: "white" },
    ],
    lead: "Sem registro complicado. Sem cobrança escondida. 50 minutos de aula real, e depois você decide.",
    button: "Agendar aula experimental",
    caption: "Faça um teste já!",
  },
  faq: {
    label: "Perguntas frequentes",
    sectionN: "09",
    intro: "Se sua dúvida não estiver aqui, é só perguntar antes da aula experimental.",
    items: [
      { q: "Meu filho precisa já saber inglês para começar?", a: "Não. Atendemos desde quem nunca estudou até níveis avançados. Na aula experimental avaliamos o nível atual e ajustamos o ritmo a partir daí." },
      { q: "Os créditos expiram?", a: "Não. Uma vez comprado, o crédito é seu, sem prazo de validade." },
      { q: "Posso cancelar ou remarcar uma aula agendada?", a: "Sim, com antecedência mínima informada no agendamento. Avisos de última hora podem consumir o crédito da aula." },
      { q: "Dois irmãos podem fazer aula juntos?", a: "Preferimos aulas individuais. É comum as crianças caírem no português entre si durante a aula, o que reduz o tempo real de prática em inglês." },
      { q: "Preciso ter o jogo comprado antes da aula experimental?", a: "Sim, o aluno precisa ter Minecraft ou Fortnite instalado e funcionando no dispositivo que for usar." },
      { q: "Como funciona o pagamento?", a: "Pelo Stripe, com criptografia completa. Seus dados de cartão não ficam armazenados na SpeakSquad." },
    ],
  },
};

export const jpContent: LandingContent = {
  htmlLang: "ja",
  signupPath: "/jp/signup",
  hero: {
    label: "LEVEL UP YOUR ENGLISH",
    titleLine1: "ゲームで、",
    titleWord1: "英語を",
    typingText: "身につける",
    typingSpeed: 100,
    lead:
      "マンツーマンのゲーム内会話で学ぶ英語メソッド。すでに好きなことをしながら英語を伸ばします。学ぶ意欲はあるのに、練習の機会が少ない人に最適です。",
    ctaPrimary: "無料体験レッスン",
    ctaSecondary: "メソッドを見る",
    noCard: "体験レッスンにクレジットカード不要。",
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
      { name: "単発", price: "¥2.000", per: "1レッスン", features: ["50分レッスン × 1", "有効期限なし", "柔軟な予約"], footer: "契約なし。入会金なし。", featured: false, save: null },
      { name: "5回パック", price: "¥8.500", per: "1回あたり ¥1.700", save: "15%オフ", features: ["50分レッスン × 5", "有効期限なし", "柔軟な予約", "優先予約"], footer: "まずは無料体験から。", featured: true },
      { name: "10回パック", price: "¥14.000", per: "1回あたり ¥1.400", save: "30%オフ", features: ["50分レッスン × 10", "有効期限なし", "柔軟な予約", "優先予約"], footer: "契約なし。隠れた費用なし。", featured: false },
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
    items: [
      { q: "英語が全く話せなくても大丈夫ですか?", a: "はい。初心者から上級者まで対応します。無料体験でレベルを確認し、そこから進度を調整します。" },
      { q: "クレジットに有効期限はありますか?", a: "ありません。購入したクレジットは期限なくいつでもご利用いただけます。" },
      { q: "予約のキャンセル・変更はできますか?", a: "予約時に案内する期限内であれば可能です。直前のキャンセルはクレジットを消費する場合があります。" },
      { q: "兄弟で一緒にレッスンできますか?", a: "個別レッスンを推奨します。兄弟だと日本語で話してしまい、英語練習の時間が減る傾向があります。" },
      { q: "無料体験の前にゲームを買う必要はありますか?", a: "はい。MinecraftまたはFortniteをインストール済みの状態でご参加ください。" },
      { q: "支払い方法は?", a: "Stripe決済です。カード情報はSpeakSquadに保存されません。" },
    ],
  },
};