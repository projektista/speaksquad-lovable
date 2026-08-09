import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherProfile, updateTeacherProfile } from "@/lib/teacher.functions";
import { inputCls, Field } from "@/components/ui/auth-frame";

export function TeacherProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [mc, setMc] = useState("");
  const [fn, setFn] = useState("");
  const [zoom, setZoom] = useState("");
  const [prefLang, setPrefLang] = useState<"jp" | "pt">("pt");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTeacherProfile().then((p) => {
      if (p) {
        setName(p.name ?? "");
        setBio(p.bio ?? "");
        setMc(p.minecraft_gamertag ?? "");
        setFn(p.fortnite_nickname ?? "");
        setZoom(p.zoom_link ?? "");
        if (p.preferred_lang === "jp" || p.preferred_lang === "pt") setPrefLang(p.preferred_lang);
      }
      setLoaded(true);
    });
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await updateTeacherProfile({
      data: {
        name,
        bio,
        minecraft_gamertag: mc,
        fortnite_nickname: fn,
        zoom_link: zoom,
        preferred_lang: prefLang,
      },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AppShell lang="pt" title="Perfil do professor" subtitle="Editar suas informações públicas.">
      {!loaded && <div className="text-muted">carregando...</div>}
      {loaded && (
        <form onSubmit={onSave} className="card-hair max-w-lg space-y-4 p-6">
          <Field label="Nome de exibição">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Bio">
            <textarea
              rows={4}
              className={`${inputCls} resize-none`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Field>
          <Field label="Minecraft gamertag">
            <input className={inputCls} value={mc} onChange={(e) => setMc(e.target.value)} />
          </Field>
          <Field label="Fortnite nickname">
            <input className={inputCls} value={fn} onChange={(e) => setFn(e.target.value)} />
          </Field>
          <Field label="Link do Zoom">
            <input
              type="url"
              inputMode="url"
              placeholder="https://zoom.us/j/..."
              className={inputCls}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />
          </Field>
          <p className="font-mono-alt text-[11px] text-muted">
            Este link fixo é usado como sala de todas as suas aulas.
          </p>
          <Field label="Idioma preferido">
            <select
              className={inputCls}
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value as "jp" | "pt")}
            >
              <option value="jp">日本語</option>
              <option value="pt">Português</option>
            </select>
          </Field>
          <p className="font-mono-alt text-[11px] text-muted">
            Define em qual idioma você vê as páginas do site depois de entrar (o painel do
            professor permanece em português). Só é aplicado ao salvar.
          </p>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "..." : "Salvar"}
          </button>
          {saved && <span className="ml-3 text-cyan">✓ salvo</span>}
        </form>
      )}
    </AppShell>
  );
}