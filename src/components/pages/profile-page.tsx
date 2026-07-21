import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Field, inputCls } from "@/components/ui/auth-frame";
import { getMyProfile, updateMyProfile } from "@/lib/booking.functions";
import type { Lang, ProfileContent } from "@/lib/i18n";
import { useSession } from "@/hooks/use-session";

export function ProfilePage({ content, lang }: { content: ProfileContent; lang: Lang }) {
  const { user } = useSession();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [level, setLevel] = useState("beginner");
  const [mc, setMc] = useState("");
  const [fn, setFn] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p) {
        setName(p.name ?? "");
        setBio((p as any).bio ?? "");
        setLevel((p as any).english_level ?? "beginner");
        setMc((p as any).minecraft_gamertag ?? "");
        setFn((p as any).fortnite_nickname ?? "");
      }
      setLoaded(true);
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await updateMyProfile({
      data: {
        name,
        bio,
        english_level: level,
        minecraft_gamertag: mc,
        fortnite_nickname: fn,
      },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle}>
      {!loaded && <div className="text-muted">...</div>}
      {loaded && (
        <form onSubmit={onSubmit} className="card-hair max-w-lg space-y-4 p-6">
          <Field label={content.nameLabel}>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label={content.emailLabel}>
            <input className={inputCls} value={user?.email ?? ""} disabled />
          </Field>
          <Field label={content.levelLabel}>
            <select className={inputCls} value={level} onChange={(e) => setLevel(e.target.value)}>
              {content.levelOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label={content.bioLabel}>
            <textarea
              rows={3}
              placeholder={content.bioPlaceholder}
              className={`${inputCls} resize-none`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Field>
          <Field label={content.minecraftLabel}>
            <input className={inputCls} value={mc} onChange={(e) => setMc(e.target.value)} />
          </Field>
          <Field label={content.fortniteLabel}>
            <input className={inputCls} value={fn} onChange={(e) => setFn(e.target.value)} />
          </Field>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "..." : content.save}
            </button>
            {saved && <span className="text-cyan text-sm">{content.saved}</span>}
          </div>
        </form>
      )}
    </AppShell>
  );
}