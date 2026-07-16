import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherProfile, updateTeacherProfile } from "@/lib/teacher.functions";
import { inputCls, Field } from "@/components/ui/auth-frame";

export function TeacherProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTeacherProfile().then((p) => {
      if (p) {
        setName(p.name ?? "");
        setBio(p.bio ?? "");
      }
      setLoaded(true);
    });
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await updateTeacherProfile({ data: { name, bio } });
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
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "..." : "Salvar"}
          </button>
          {saved && <span className="ml-3 text-cyan">✓ salvo</span>}
        </form>
      )}
    </AppShell>
  );
}