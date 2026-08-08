import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherPublicProfile } from "@/lib/teacher-public.functions";
import type { Lang } from "@/lib/i18n";

type Profile = Awaited<ReturnType<typeof getTeacherPublicProfile>>;

const copy = {
  pt: {
    title: "Perfil do Professor",
    loading: "carregando...",
    bioMissing: "Sem biografia ainda.",
    level: "nível de inglês",
    games: "jogos que ensina",
    minecraft: "minecraft gamertag",
    fortnite: "fortnite nickname",
  },
  jp: {
    title: "先生のプロフィール",
    loading: "読み込み中...",
    bioMissing: "自己紹介はまだありません。",
    level: "英語レベル",
    games: "対応ゲーム",
    minecraft: "Minecraft ゲーマータグ",
    fortnite: "Fortnite ニックネーム",
  },
} as const;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-hair pt-3">
      <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{label}</div>
      <div className="text-base">{value}</div>
    </div>
  );
}

export function TeacherPublicProfilePage({ id, lang = "pt" }: { id: string; lang?: Lang }) {
  const t = copy[lang];
  const [profile, setProfile] = useState<Profile | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getTeacherPublicProfile({ data: { id } })
      .then(setProfile)
      .catch((e) => setErr(e.message ?? String(e)));
  }, [id]);

  if (err) {
    return (
      <AppShell lang={lang} title={t.title}>
        <div className="text-magenta">{err}</div>
      </AppShell>
    );
  }
  if (!profile) {
    return (
      <AppShell lang={lang} title={t.title}>
        <div className="text-muted">{t.loading}</div>
      </AppShell>
    );
  }

  const games = (profile.games ?? []).filter(Boolean);

  return (
    <AppShell lang={lang} title={t.title}>
      <div className="card-hair max-w-2xl space-y-4 p-6">
        <h2 className="font-display text-2xl md:text-3xl">{profile.name}</h2>
        <p className="whitespace-pre-wrap text-base text-muted">{profile.bio || t.bioMissing}</p>
        {profile.english_level && <Row label={t.level} value={String(profile.english_level)} />}
        {games.length > 0 && <Row label={t.games} value={games.join(" · ")} />}
        {profile.minecraft_gamertag && <Row label={t.minecraft} value={profile.minecraft_gamertag} />}
        {profile.fortnite_nickname && <Row label={t.fortnite} value={profile.fortnite_nickname} />}
      </div>
    </AppShell>
  );
}