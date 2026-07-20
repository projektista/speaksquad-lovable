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
  if (typeof navigator === "undefined") return "jp";
  const langs = [navigator.language, ...(navigator.languages ?? [])].filter(Boolean);
  for (const l of langs) {
    const low = l.toLowerCase();
    if (low.startsWith("ja")) return "jp";
    if (low.startsWith("pt")) return "pt";
  }
  return "jp";
}

/** Map a pathname between /... (JP default) and /ptbr/... (PT) equivalents. */
export function pathForLang(pathname: string, target: Lang): string {
  const isPt = pathname === "/ptbr" || pathname.startsWith("/ptbr/");
  const bare = isPt ? (pathname === "/ptbr" ? "/" : pathname.slice(5)) : pathname;
  if (target === "pt") return bare === "/" ? "/ptbr" : `/ptbr${bare}`;
  return bare;
}

/**
 * Auto-detect the visitor's preferred language on first visit to a landing
 * page (/ or /ptbr) and redirect if it differs. JP is now the default.
 */
export function useLangAutoDetect() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isLanding = pathname === "/" || pathname === "/ptbr";
    if (!isLanding) return;

    const stored = storedLang();
    if (stored) return; // user already made an explicit choice

    const preferred = detectBrowserLang();
    persistLang(preferred);

    const currentIsPt = pathname === "/ptbr";
    if (preferred === "pt" && !currentIsPt) {
      router.navigate({ to: "/ptbr", replace: true });
    } else if (preferred === "jp" && currentIsPt) {
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
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  passwordMismatch: string;
  minecraftGamertag: string;
  fortniteNickname: string;
  gameRequired: string;
  gamertagRequired: string;
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
    confirmPassword: "Confirmar senha",
    confirmPasswordPlaceholder: "Digite a senha novamente",
    passwordMismatch: "As senhas não coincidem",
    minecraftGamertag: "MINECRAFT GAMERTAG",
    fortniteNickname: "Nickname no FORTNITE",
    gameRequired: "Escolha pelo menos um jogo",
    gamertagRequired: "Preencha o nome de usuário do jogo escolhido",
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
    confirmPassword: "パスワード確認",
    confirmPasswordPlaceholder: "もう一度パスワードを入力",
    passwordMismatch: "パスワードが一致しません",
    minecraftGamertag: "MINECRAFT GAMERTAG",
    fortniteNickname: "FORTNITE ニックネーム",
    gameRequired: "少なくとも1つのゲームを選択してください",
    gamertagRequired: "選択したゲームのユーザー名を入力してください",
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
  noNextLesson: string;
  quickActionsCode: string;
  quickActionsTitle: string;
  quickScheduleTitle: string;
  quickScheduleDesc: string;
  quickCreditsTitle: string;
  quickCreditsDesc: string;
  quickProfileTitle: string;
  quickProfileDesc: string;
  open: string;
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
    noNextLesson: "Nenhuma aula agendada",
    quickActionsCode: "// ações_rápidas",
    quickActionsTitle: "O que você quer fazer agora?",
    quickScheduleTitle: "Agendar aula",
    quickScheduleDesc: "Escolha um horário aberto do Hugo.",
    quickCreditsTitle: "Comprar créditos",
    quickCreditsDesc: "Pacotes de 1, 5 ou 10 aulas.",
    quickProfileTitle: "Editar perfil",
    quickProfileDesc: "Atualize seus dados e nicknames dos jogos.",
    open: "Abrir",
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
    noNextLesson: "予約されたレッスンはありません",
    quickActionsCode: "// クイックアクション",
    quickActionsTitle: "何をしますか?",
    quickScheduleTitle: "レッスンを予約",
    quickScheduleDesc: "空き時間からお選びください。",
    quickCreditsTitle: "クレジット購入",
    quickCreditsDesc: "1・5・10レッスンパック。",
    quickProfileTitle: "プロフィール編集",
    quickProfileDesc: "情報とゲームIDを更新。",
    open: "開く",
  },
};
export type ScheduleContent = {
  metaTitle: string;
  title: string;
  subtitle: string;
  weekLabel: string;
  modeLabel: string;
  modes: { minecraft: string; fortnite: string };
  slotsLabel: string;
  noSlots: string;
  confirmCta: string;
  confirmedMsg: string;
  days: string[];
  monthLabel: string;
};

export const scheduleContent: Record<Lang, ScheduleContent> = {
  pt: {
    metaTitle: "Agendar — SpeakSquad",
    title: "Agendar aula",
    subtitle: "Escolha um horário aberto do Hugo esta semana.",
    weekLabel: "// semana_atual",
    modeLabel: "modo_da_aula",
    modes: { minecraft: "Minecraft · Survival", fortnite: "Fortnite · BR" },
    slotsLabel: "horários_disponíveis",
    noSlots: "Sem horários neste dia.",
    confirmCta: "Confirmar agendamento",
    confirmedMsg: "✓ Aula confirmada. Você receberá um email com o link.",
    days: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    monthLabel: "Julho 2026",
  },
  jp: {
    metaTitle: "予約 — SpeakSquad",
    title: "レッスンを予約",
    subtitle: "今週の空き時間からお選びください。",
    weekLabel: "// 今週",
    modeLabel: "レッスンモード",
    modes: { minecraft: "Minecraft · Survival", fortnite: "Fortnite · BR" },
    slotsLabel: "空き時間",
    noSlots: "この日は空きがありません。",
    confirmCta: "予約を確定",
    confirmedMsg: "✓ 予約完了。詳細をメールでお送りします。",
    days: ["月", "火", "水", "木", "金", "土", "日"],
    monthLabel: "2026年7月",
  },
};

/* ------------------------------------------------------------------ */
/* Lessons list (student)                                              */
/* ------------------------------------------------------------------ */

export type LessonsListContent = {
  metaTitle: string;
  title: string;
  subtitle: string;
  empty: string;
  scheduleCta: string;
  filterAll: string;
  filterUpcoming: string;
  filterPast: string;
  open: string;
  statusLabels: Record<string, string>;
};

export const lessonsListContent: Record<Lang, LessonsListContent> = {
  pt: {
    metaTitle: "Minhas aulas — SpeakSquad",
    title: "Aulas",
    subtitle: "Suas aulas agendadas e histórico.",
    empty: "Você ainda não tem aulas. Que tal agendar a primeira?",
    scheduleCta: "Agendar aula",
    filterAll: "Todas",
    filterUpcoming: "Próximas",
    filterPast: "Anteriores",
    open: "Abrir",
    statusLabels: {
      scheduled: "agendada",
      completed: "concluída",
      student_cancelled: "cancelada por você",
      teacher_cancelled: "cancelada pelo professor",
      late_cancel: "cancelamento tardio",
      no_show: "no-show",
    },
  },
  jp: {
    metaTitle: "レッスン一覧 — SpeakSquad",
    title: "レッスン",
    subtitle: "予約済みのレッスンと履歴。",
    empty: "まだレッスンがありません。予約してみましょう。",
    scheduleCta: "レッスンを予約",
    filterAll: "すべて",
    filterUpcoming: "今後",
    filterPast: "過去",
    open: "開く",
    statusLabels: {
      scheduled: "予約済み",
      completed: "完了",
      student_cancelled: "自分でキャンセル",
      teacher_cancelled: "先生がキャンセル",
      late_cancel: "遅いキャンセル",
      no_show: "ノーショー",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Profile                                                              */
/* ------------------------------------------------------------------ */

export type ProfileContent = {
  metaTitle: string;
  title: string;
  subtitle: string;
  nameLabel: string;
  emailLabel: string;
  levelLabel: string;
  bioLabel: string;
  bioPlaceholder: string;
  minecraftLabel: string;
  fortniteLabel: string;
  save: string;
  saved: string;
  levelOptions: { value: string; label: string }[];
};

export const profileContent: Record<Lang, ProfileContent> = {
  pt: {
    metaTitle: "Perfil — SpeakSquad",
    title: "Perfil",
    subtitle: "Seus dados e nicknames de jogo.",
    nameLabel: "Nome",
    emailLabel: "Email",
    levelLabel: "Nível de inglês",
    bioLabel: "Breve apresentação",
    bioPlaceholder: "Conte um pouco sobre você...",
    minecraftLabel: "Minecraft gamertag",
    fortniteLabel: "Nickname no Fortnite",
    save: "Salvar",
    saved: "✓ Perfil atualizado.",
    levelOptions: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  jp: {
    metaTitle: "プロフィール — SpeakSquad",
    title: "プロフィール",
    subtitle: "情報とゲームID。",
    nameLabel: "お名前",
    emailLabel: "メール",
    levelLabel: "英語レベル",
    bioLabel: "自己紹介",
    bioPlaceholder: "少し教えてください...",
    minecraftLabel: "Minecraft ゲーマータグ",
    fortniteLabel: "Fortnite ニックネーム",
    save: "保存",
    saved: "✓ 更新しました。",
    levelOptions: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Lesson detail                                                        */
/* ------------------------------------------------------------------ */

export type LessonDetailContent = {
  metaTitle: string;
  loading: string;
  statusLabel: string;
  modeLabel: string;
  durationLabel: string;
  minutes: string;
  openZoom: string;
  studentLabel: string;
  teacherLabel: string;
  feedbackLabel: string;
  vocabularyLabel: string;
  teacherActions: string;
  finalize: string;
  cancelMine: string;
  markNoShow: string;
  studentCancel: string;
  cancelPolicy: string;
  chatTitle: string;
  chatEmpty: string;
  chatPlaceholder: string;
  send: string;
  historyTitle: string;
  historyEmpty: string;
  expand: string;
  collapse: string;
  bioMissing: string;
  feedbackPlaceholder: string;
  vocabPlaceholder: string;
};

export const lessonDetailContent: Record<Lang, LessonDetailContent> = {
  pt: {
    metaTitle: "Aula · SpeakSquad",
    loading: "carregando...",
    statusLabel: "status",
    modeLabel: "modo",
    durationLabel: "duração",
    minutes: "min",
    openZoom: "Abrir Zoom",
    studentLabel: "aluno",
    teacherLabel: "professor",
    feedbackLabel: "feedback",
    vocabularyLabel: "vocabulário",
    teacherActions: "// ações_do_professor",
    finalize: "Finalizar",
    cancelMine: "Cancelar (meu)",
    markNoShow: "Imprevisto (no-show)",
    studentCancel: "Cancelar aula",
    cancelPolicy: "Política: cancelamentos com mais de 6h antes retornam o crédito. Depois disso, o crédito é consumido.",
    chatTitle: "// chat (atualiza a cada 5s)",
    chatEmpty: "Sem mensagens ainda.",
    chatPlaceholder: "Mensagem...",
    send: "Enviar",
    historyTitle: "// aulas_anteriores",
    historyEmpty: "Nenhuma aula anterior concluída.",
    expand: "expandir",
    collapse: "recolher",
    bioMissing: "Sem biografia ainda.",
    feedbackPlaceholder: "feedback (opcional)",
    vocabPlaceholder: "vocabulário aprendido (opcional)",
  },
  jp: {
    metaTitle: "レッスン · SpeakSquad",
    loading: "読み込み中...",
    statusLabel: "ステータス",
    modeLabel: "モード",
    durationLabel: "時間",
    minutes: "分",
    openZoom: "Zoomを開く",
    studentLabel: "生徒",
    teacherLabel: "先生",
    feedbackLabel: "フィードバック",
    vocabularyLabel: "語彙",
    teacherActions: "// 先生のアクション",
    finalize: "完了",
    cancelMine: "キャンセル(自分)",
    markNoShow: "ノーショー",
    studentCancel: "レッスンをキャンセル",
    cancelPolicy: "ポリシー: 6時間前までのキャンセルはクレジット返却。それ以降は消費されます。",
    chatTitle: "// チャット(5秒ごと更新)",
    chatEmpty: "メッセージはまだありません。",
    chatPlaceholder: "メッセージ...",
    send: "送信",
    historyTitle: "// 過去のレッスン",
    historyEmpty: "完了した過去のレッスンはありません。",
    expand: "展開",
    collapse: "たたむ",
    bioMissing: "自己紹介はまだありません。",
    feedbackPlaceholder: "フィードバック(任意)",
    vocabPlaceholder: "学んだ語彙(任意)",
  },
};
