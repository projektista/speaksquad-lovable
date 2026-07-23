import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Field, inputCls } from "@/components/ui/auth-frame";
import { getMyProfile, updateMyProfile } from "@/lib/booking.functions";
import type { CompleteProfileContent, Lang, ProfileContent, SignupContent } from "@/lib/i18n";

export function CompleteProfilePage({
  content,
  profile,
  signup,
  lang,
}: {
  content: CompleteProfileContent;
  profile: ProfileContent;
  signup: SignupContent;
  lang: Lang;
}) {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [level, setLevel] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [goal, setGoal] = useState("");
  const [mc, setMc] = useState("");
  const [fn, setFn] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        if (p) {
          setBirthDate((p as any).birth_date ?? "");
          setBio((p as any).bio ?? "");
          setLevel((p as any).english_level ?? "");
          setMc((p as any).minecraft_gamertag ?? "");
          setFn((p as any).fortnite_nickname ?? "");
          setInterests((p as any).interests ?? "");
          setGoal((p as any).learning_goal ?? "");
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!birthDate) {
      setErr(signup.birthDateRequired);
      return;
    }
    setBusy(true);
    try {
      await updateMyProfile({
        data: {
          birth_date: birthDate,
          english_level: level,
          bio,
          interests,
          learning_goal: goal,
          minecraft_gamertag: mc,
          fortnite_nickname: fn,
        },
      });
      navigate({ to: lang === "jp" ? "/dashboard" : "/ptbr/dashboard" });
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle}>
      {!loaded && <div className="text-muted">...</div>}
      {loaded && (
        <form onSubmit={onSubmit} className="space-y-6">
          <p className="text-sm text-muted max-w-2xl">{content.lead}</p>
          <div className="grid gap-6 md:grid-cols-2">
            <section className="card-hair p-6 space-y-4">
              <div className="section-label">{profile.sectionIdentity}</div>
              <Field label={signup.birthDate} hint={signup.birthDateHint}>
                <input
                  type="date"
                  required
                  className={inputCls}
                  value={birthDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </Field>
              <Field label={signup.level}>
                <select
                  className={inputCls}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="">{signup.levelPlaceholder}</option>
                  {signup.levelOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label={signup.goal}>
                <select
                  className={inputCls}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="">{signup.goalPlaceholder}</option>
                  {signup.goalOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
            </section>

            <section className="card-hair p-6 space-y-4">
              <div className="section-label">{profile.sectionLearning}</div>
              <Field label={signup.bio}>
                <textarea
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder={signup.bioPlaceholder}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Field>
              <Field label={signup.interests}>
                <input
                  className={inputCls}
                  placeholder={signup.interestsPlaceholder}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
              </Field>
            </section>
          </div>

          <section className="card-hair p-6 space-y-4">
            <div className="section-label">{profile.sectionGames}</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={profile.minecraftLabel}>
                <input className={inputCls} value={mc} onChange={(e) => setMc(e.target.value)} />
              </Field>
              <Field label={profile.fortniteLabel}>
                <input className={inputCls} value={fn} onChange={(e) => setFn(e.target.value)} />
              </Field>
            </div>
          </section>

          {err && <div className="text-sm text-magenta">{err}</div>}
          <div>
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? content.saving : content.submit}
            </button>
          </div>
        </form>
      )}
    </AppShell>
  );
}