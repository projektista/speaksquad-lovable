import { useEffect } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

export type Lang = "pt" | "jp";

export const LANG_STORAGE_KEY = "speaksquad_lang";

export function storedLang(): Lang | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (v === "ja") return "jp";
  if (v === "pt-BR" || v === "pt") return "pt";
  return null;
}

export function persistLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_STORAGE_KEY, lang === "jp" ? "ja" : "pt-BR");
}

function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "pt";
  const langs = [navigator.language, ...(navigator.languages ?? [])].filter(Boolean);
  for (const l of langs) {
    const low = l.toLowerCase();
    if (low.startsWith("ja")) return "jp";
    if (low.startsWith("pt")) return "pt";
  }
  return "pt";
}

/** Map a pathname between /... and /jp/... equivalents. */
export function pathForLang(pathname: string, target: Lang): string {
  const isJp = pathname === "/jp" || pathname.startsWith("/jp/");
  const bare = isJp ? (pathname === "/jp" ? "/" : pathname.slice(3)) : pathname;
  if (target === "jp") return bare === "/" ? "/jp" : `/jp${bare}`;
  return bare;
}

/**
 * Auto-detect the visitor's preferred language on first visit to a landing
 * page (/ or /jp) and redirect if it differs from the current URL. Runs once
 * per session and only when no explicit preference is stored.
 */
export function useLangAutoDetect() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isLanding = pathname === "/" || pathname === "/jp";
    if (!isLanding) return;

    const stored = storedLang();
    if (stored) return; // user already made an explicit choice

    const preferred = detectBrowserLang();
    persistLang(preferred);

    const currentIsJp = pathname === "/jp";
    if (preferred === "jp" && !currentIsJp) {
      router.navigate({ to: "/jp", replace: true });
    } else if (preferred === "pt" && currentIsJp) {
      router.navigate({ to: "/", replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ------------------------------------------------------------------ */
/* Page dictionaries                                                    */
/* ------------------------------------------------------------------ */

export type ContactContent = {
  metaTitle: string;
  metaDescription: string;
  sectionCode: string;
  sectionLabel: string;
  titleParts: [string, string, string, string];
  lead: string;
  fields: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
  };
  submit: string;
  sentMsg: string;
  info: {
    emailLabel: string;
    hoursLabel: string;
    hoursValue: string;
    baseLabel: string;
    baseValue: string;
  };
};

export const contactContent: Record<Lang, ContactContent> = {
  pt: {
    metaTitle: "Contato — SpeakSquad",
    metaDescription:
      "Fale com a SpeakSquad. Tire suas dúvidas sobre aulas de inglês via Minecraft e Fortnite antes de começar.",
    sectionCode: "00",
    sectionLabel: "Contato",
    titleParts: ["Vamos", "conversar", "já", "."],
    lead: "Dúvidas sobre método, agendamento ou pacotes? Escreva abaixo e respondemos em até 24h.",
    fields: {
      name: "Nome",
      namePlaceholder: "Seu nome",
      email: "Email",
      emailPlaceholder: "seu@email.com",
      subject: "Assunto",
      subjectPlaceholder: "Ex.: dúvida sobre pacotes",
      message: "Mensagem",
      messagePlaceholder: "Escreva sua mensagem...",
    },
    submit: "Enviar mensagem",
    sentMsg: "✓ Mensagem enviada. Obrigado — retornaremos em breve.",
    info: {
      emailLabel: "Email",
      hoursLabel: "Horário",
      hoursValue: "Seg–Sex · 10h–20h (JST)",
      baseLabel: "Base",
      baseValue: "Tóquio · Japão",
    },
  },
  jp: {
    metaTitle: "お問い合わせ — SpeakSquad",
    metaDescription:
      "SpeakSquadへのお問い合わせ。MinecraftとFortniteを使った英会話レッスンについてご質問ください。",
    sectionCode: "00",
    sectionLabel: "お問い合わせ",
    titleParts: ["今すぐ", "お話し", "しましょう", "。"],
    lead: "メソッド、予約、料金についてご質問がありますか?下記からご連絡ください。24時間以内にお返事します。",
    fields: {
      name: "お名前",
      namePlaceholder: "お名前",
      email: "メール",
      emailPlaceholder: "your@email.com",
      subject: "件名",
      subjectPlaceholder: "例: 料金プランについて",
      message: "メッセージ",
      messagePlaceholder: "メッセージをご入力ください...",
    },
    submit: "送信する",
    sentMsg: "✓ 送信完了。ありがとうございます。近日中にご返信いたします。",
    info: {
      emailLabel: "メール",
      hoursLabel: "受付時間",
      hoursValue: "月〜金 · 10:00–20:00 (JST)",
      baseLabel: "拠点",
      baseValue: "東京 · 日本",
    },
  },
};

export type LoginContent = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  show: string;
  hide: string;
  remember: string;
  forgot: string;
  submit: string;
  noAccount: string;
  createAccount: string;
};

export const loginContent: Record<Lang, LoginContent> = {
  pt: {
    metaTitle: "Entrar — SpeakSquad",
    metaDescription: "Acesse sua conta SpeakSquad.",
    title: "Entrar",
    subtitle: "Bem-vindo de volta. Continue sua jornada.",
    emailLabel: "Email",
    emailPlaceholder: "seu@email.com",
    passwordLabel: "Senha",
    passwordPlaceholder: "••••••••",
    show: "mostrar",
    hide: "ocultar",
    remember: "lembrar de mim",
    forgot: "esqueci a senha",
    submit: "Entrar",
    noAccount: "Não tem conta?",
    createAccount: "Criar conta",
  },
  jp: {
    metaTitle: "ログイン — SpeakSquad",
    metaDescription: "SpeakSquadアカウントにログイン。",
    title: "ログイン",
    subtitle: "おかえりなさい。学習を続けましょう。",
    emailLabel: "メール",
    emailPlaceholder: "your@email.com",
    passwordLabel: "パスワード",
    passwordPlaceholder: "••••••••",
    show: "表示",
    hide: "非表示",
    remember: "ログイン状態を保持",
    forgot: "パスワードを忘れた",
    submit: "ログイン",
    noAccount: "アカウントをお持ちでない方は",
    createAccount: "新規登録",
  },
};

export type SignupContent = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  sectionAccount: string;
  sectionProfile: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  strengthLabel: string;
  strengths: [string, string, string, string, string];
  level: string;
  levelPlaceholder: string;
  levelOptions: { value: string; label: string }[];
  bio: string;
  bioPlaceholder: string;
  game: string;
  submit: string;
  hasAccount: string;
  login: string;
  minecraftTag: string;
  fortniteTag: string;
};

export const signupContent: Record<Lang, SignupContent> = {
  pt: {
    metaTitle: "Criar conta — SpeakSquad",
    metaDescription: "Registre-se para começar sua primeira aula gratuita de inglês via games.",
    title: "Criar conta",
    subtitle: "Primeira aula grátis. Sem cartão. Sem pressão.",
    sectionAccount: "// dados_da_conta",
    sectionProfile: "// perfil_de_aprendizado",
    name: "Nome",
    namePlaceholder: "Seu nome",
    email: "Email",
    emailPlaceholder: "seu@email.com",
    password: "Senha",
    passwordPlaceholder: "Mínimo 8 caracteres",
    strengthLabel: "força",
    strengths: ["fraca", "ok", "boa", "forte", "excelente"],
    level: "Nível de inglês",
    levelPlaceholder: "Selecione",
    levelOptions: [
      { value: "beginner", label: "Beginner (começo do zero)" },
      { value: "intermediate", label: "Intermediate (entendo alguma coisa)" },
      { value: "advanced", label: "Advanced (quero fluência)" },
    ],
    bio: "Breve apresentação",
    bioPlaceholder: "Conte um pouco sobre você ou seu filho...",
    game: "Jogo preferido",
    submit: "Criar conta",
    hasAccount: "Já tem conta?",
    login: "Entrar",
    minecraftTag: "survival · pvp",
    fortniteTag: "battle royale",
  },
  jp: {
    metaTitle: "新規登録 — SpeakSquad",
    metaDescription: "無料体験レッスンのためのアカウントを作成しましょう。",
    title: "新規登録",
    subtitle: "初回レッスン無料。カード不要。",
    sectionAccount: "// account_info",
    sectionProfile: "// learning_profile",
    name: "お名前",
    namePlaceholder: "お名前",
    email: "メール",
    emailPlaceholder: "your@email.com",
    password: "パスワード",
    passwordPlaceholder: "8文字以上",
    strengthLabel: "強度",
    strengths: ["弱い", "普通", "良い", "強い", "非常に強い"],
    level: "英語レベル",
    levelPlaceholder: "選択してください",
    levelOptions: [
      { value: "beginner", label: "Beginner(初心者)" },
      { value: "intermediate", label: "Intermediate(中級)" },
      { value: "advanced", label: "Advanced(上級)" },
    ],
    bio: "自己紹介",
    bioPlaceholder: "ご自身やお子様について少し教えてください...",
    game: "好きなゲーム",
    submit: "アカウント作成",
    hasAccount: "すでにアカウントをお持ちですか?",
    login: "ログイン",
    minecraftTag: "survival · pvp",
    fortniteTag: "battle royale",
  },
};

export type DashboardContent = {
  metaTitle: string;
  title: string;
  subtitle: string;
  creditsLabel: string;
  buyMore: string;
  nextLessonLabel: string;
  nextLessonDate: string;
  nextLessonMode: string;
  seeDetails: string;
  totalLabel: string;
  history: string;
  nextStepCode: string;
  nextStepTitle: string;
  nextStepLead: string;
  scheduleCta: string;
};

export const dashboardContent: Record<Lang, DashboardContent> = {
  pt: {
    metaTitle: "Dashboard — SpeakSquad",
    title: "Dashboard",
    subtitle: "Sua central de controle.",
    creditsLabel: "créditos_disponíveis",
    buyMore: "Comprar mais",
    nextLessonLabel: "próxima_aula",
    nextLessonDate: "Ter · 15 jul",
    nextLessonMode: "Minecraft · Survival",
    seeDetails: "Ver detalhes",
    totalLabel: "total_de_aulas",
    history: "Histórico",
    nextStepCode: "// próximo_passo",
    nextStepTitle: "Pronto para agendar sua próxima aula?",
    nextStepLead: "Escolha um horário aberto pelo Hugo esta semana.",
    scheduleCta: "Agendar aula",
  },
  jp: {
    metaTitle: "ダッシュボード — SpeakSquad",
    title: "ダッシュボード",
    subtitle: "あなたのコントロールパネル。",
    creditsLabel: "残りクレジット",
    buyMore: "追加購入",
    nextLessonLabel: "次のレッスン",
    nextLessonDate: "火 · 7月15日",
    nextLessonMode: "Minecraft · Survival",
    seeDetails: "詳細を見る",
    totalLabel: "合計レッスン数",
    history: "履歴",
    nextStepCode: "// next_step",
    nextStepTitle: "次のレッスンを予約しますか?",
    nextStepLead: "今週の空き時間からお選びください。",
    scheduleCta: "レッスンを予約",
  },
};