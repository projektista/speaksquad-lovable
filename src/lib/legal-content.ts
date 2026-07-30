export type LegalSection = {
  heading: string;
  /** Paragraphs of plain text. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
};

export type LegalContent = {
  metaTitle: string;
  metaDescription: string;
  sectionCode: string;
  sectionLabel: string;
  title: string;
  updatedLabel: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
};

const placeholderNoticePt =
  "Conteúdo em preparação. O texto completo desta página será publicado em breve.";
const placeholderNoticeJp = "本ページの内容は現在準備中です。全文は近日公開いたします。";

export const privacyContent: Record<"pt" | "jp", LegalContent> = {
  pt: {
    metaTitle: "Política de Privacidade — SpeakSquad",
    metaDescription:
      "Como a SpeakSquad coleta, usa e protege os dados pessoais de alunos e responsáveis.",
    sectionCode: "05",
    sectionLabel: "privacidade",
    title: "Política de Privacidade",
    updatedLabel: "Última atualização",
    updatedAt: "2026",
    intro: placeholderNoticePt,
    sections: [],
  },
  jp: {
    metaTitle: "プライバシーポリシー — SpeakSquad",
    metaDescription:
      "SpeakSquadにおける生徒・保護者の個人情報の取得、利用、保護についてのご案内。",
    sectionCode: "05",
    sectionLabel: "privacy_policy",
    title: "プライバシーポリシー",
    updatedLabel: "最終更新",
    updatedAt: "2026年",
    intro: placeholderNoticeJp,
    sections: [],
  },
};

export const termsContent: Record<"pt" | "jp", LegalContent> = {
  pt: {
    metaTitle: "Termos de Uso — SpeakSquad",
    metaDescription:
      "Regras de uso da plataforma SpeakSquad: aulas, créditos, cancelamentos e responsabilidades.",
    sectionCode: "06",
    sectionLabel: "termos",
    title: "Termos de Uso",
    updatedLabel: "Última atualização",
    updatedAt: "2026",
    intro: placeholderNoticePt,
    sections: [],
  },
  jp: {
    metaTitle: "利用規約 — SpeakSquad",
    metaDescription:
      "SpeakSquadのご利用にあたってのルール（レッスン、クレジット、キャンセル、責任範囲）。",
    sectionCode: "06",
    sectionLabel: "terms_of_use",
    title: "利用規約",
    updatedLabel: "最終更新",
    updatedAt: "2026年",
    intro: placeholderNoticeJp,
    sections: [],
  },
};