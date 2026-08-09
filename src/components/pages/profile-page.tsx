import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Field, inputCls } from "@/components/ui/auth-frame";
import { getMyProfile, updateMyProfile } from "@/lib/booking.functions";
import { pathForLang, persistLang, type Lang, type ProfileContent } from "@/lib/i18n";
import { useSession } from "@/hooks/use-session";

export function ProfilePage({ content, lang }: { content: ProfileContent; lang: Lang }) {
  const { user } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [level, setLevel] = useState("beginner");
  const [mc, setMc] = useState("");
  const [fn, setFn] = useState("");
  const [interests, setInterests] = useState("");
  const [goal, setGoal] = useState("");
  const [prefLang, setPrefLang] = useState<Lang>(lang);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((p) => {
      if (p) {
        setName(p.name ?? "");
        setBirthDate(p.birth_date ?? "");
        setBio(p.bio ?? "");
        setLevel(p.english_level ?? "beginner");
        setMc(p.minecraft_gamertag ?? "");
        setFn(p.fortnite_nickname ?? "");
        setInterests(p.interests ?? "");
        setGoal(p.learning_goal ?? "");
        if (p.preferred_lang === "pt" || p.preferred_lang === "jp") setPrefLang(p.preferred_lang);
      }
      })
      .catch((e: any) => setErr(e?.message ?? String(e)))
      .finally(() => setLoaded(true));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      await updateMyProfile({
        data: {
          name,
          birth_date: birthDate,
          bio,
          english_level: level,
          minecraft_gamertag: mc,
          fortnite_nickname: fn,
          interests,
          learning_goal: goal,
          preferred_lang: prefLang,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (prefLang !== lang) {
        persistLang(prefLang);
        navigate({ to: pathForLang(pathname, prefLang), replace: true });
      }
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle}>
      {!loaded && <div className="text-muted">...</div>}
      {loaded && (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <section className="card-hair p-6 space-y-4">
              <div className="section-label">{content.sectionIdentity}</div>
              <Field label={content.nameLabel}>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label={content.emailLabel}>
                <input className={inputCls} value={user?.email ?? ""} disabled />
              </Field>
              <Field label={content.birthDateLabel}>
                <input
                  type="date"
                  className={inputCls}
                  value={birthDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </Field>
            </section>

            <section className="card-hair p-6 space-y-4">
              <div className="section-label">{content.sectionLearning}</div>
              <Field label={content.levelLabel}>
                <select
                  className={inputCls}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  {content.levelOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label={content.goalLabel}>
                <select
                  className={inputCls}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="">{content.goalPlaceholder}</option>
                  {content.goalOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label={content.bioLabel}>
                <textarea
                  rows={4}
                  placeholder={content.bioPlaceholder}
                  className={`${inputCls} resize-none`}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Field>
              <Field label={content.interestsLabel}>
                <input
                  className={inputCls}
                  placeholder={content.interestsPlaceholder}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
              </Field>
            </section>
          </div>

          <section className="card-hair p-6 space-y-3">
            <div className="section-label">{content.langLabel}</div>
            <Field label={content.langLabel} hint={content.langHint}>
              <select
                className={inputCls}
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value as Lang)}
              >
                {content.langOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          </section>

          <section className="card-hair p-6 space-y-4">
            <div className="section-label">{content.sectionGames}</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={content.minecraftLabel}>
                <input className={inputCls} value={mc} onChange={(e) => setMc(e.target.value)} />
              </Field>
              <Field label={content.fortniteLabel}>
                <input className={inputCls} value={fn} onChange={(e) => setFn(e.target.value)} />
              </Field>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "..." : content.save}
            </button>
            {saved && <span className="text-cyan text-sm">{content.saved}</span>}
            {err && <span className="text-magenta text-sm">{err}</span>}
          </div>
        </form>
      )}
    </AppShell>
  );
}