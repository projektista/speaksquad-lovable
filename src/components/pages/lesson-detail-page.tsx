import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/hooks/use-session";
import {
  finalizeLesson,
  getLessonDetail,
  getLessonMessages,
  postLessonMessage,
  studentCancelLesson,
  teacherCancelLesson,
  teacherMarkNoShow,
} from "@/lib/lesson.functions";
import type { Lang } from "@/lib/i18n";

type Detail = Awaited<ReturnType<typeof getLessonDetail>>;
type Msg = { id: string; sender_id: string; content: string; created_at: string };

export function LessonDetailPage({ id, lang = "pt" }: { id: string; lang?: Lang }) {
  const { user } = useSession();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [vocab, setVocab] = useState("");
  const [acting, setActing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLessonDetail({ data: { id } })
      .then(setDetail)
      .catch((e) => setErr(e.message ?? String(e)));
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function fetchMessages() {
      try {
        const m = (await getLessonMessages({ data: { lessonId: id } })) as Msg[];
        if (!cancelled) setMessages(m);
      } catch { /* ignore */ }
    }
    fetchMessages();
    const t = setInterval(fetchMessages, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text;
    setText("");
    try {
      await postLessonMessage({ data: { lessonId: id, content } });
      const m = (await getLessonMessages({ data: { lessonId: id } })) as Msg[];
      setMessages(m);
    } catch (e: any) {
      setErr(e.message ?? String(e));
      setText(content);
    }
  }

  async function act(fn: () => Promise<any>) {
    setActing(true);
    setErr(null);
    try {
      await fn();
      const d = await getLessonDetail({ data: { id } });
      setDetail(d);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setActing(false);
    }
  }

  if (err && !detail) return <AppShell lang={lang} title="Aula"><div className="text-magenta">{err}</div></AppShell>;
  if (!detail) return <AppShell lang={lang} title="Aula"><div className="text-muted">carregando...</div></AppShell>;

  const { lesson, student, viewerIsTeacher } = detail;
  const isFinished = ["completed", "student_cancelled", "teacher_cancelled", "no_show", "late_cancel"].includes(lesson.status);

  return (
    <AppShell lang={lang} title={`Aula · ${new Date(lesson.scheduled_at).toLocaleString(lang === "jp" ? "ja-JP" : "pt-BR")}`}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-hair space-y-3 p-5">
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">status</div>
            <div className="text-lg">{lesson.status}</div>
          </div>
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">modo</div>
            <div className="capitalize">{lesson.mode}</div>
          </div>
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">duração</div>
            <div>{lesson.duration_min} min</div>
          </div>
          {lesson.meet_url && (
            <a href={lesson.meet_url} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
              Abrir Zoom
            </a>
          )}
          {student && (
            <div className="border-t border-hair pt-3">
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">aluno</div>
              <div>{student.name}</div>
              {student.minecraft_gamertag && <div className="text-xs text-muted">MC: {student.minecraft_gamertag}</div>}
              {student.fortnite_nickname && <div className="text-xs text-muted">FN: {student.fortnite_nickname}</div>}
            </div>
          )}
          {lesson.feedback && (
            <div className="border-t border-hair pt-3">
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">feedback</div>
              <div className="text-sm whitespace-pre-wrap">{lesson.feedback}</div>
            </div>
          )}
          {lesson.vocabulary_notes && (
            <div>
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">vocabulário</div>
              <div className="text-sm whitespace-pre-wrap">{lesson.vocabulary_notes}</div>
            </div>
          )}

          {viewerIsTeacher && !isFinished && (
            <div className="border-t border-hair pt-4 space-y-2">
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-magenta">
                // ações_do_professor
              </div>
              <textarea
                rows={2}
                placeholder="feedback (opcional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded border border-hair bg-transparent p-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder="vocabulário aprendido (opcional)"
                value={vocab}
                onChange={(e) => setVocab(e.target.value)}
                className="w-full rounded border border-hair bg-transparent p-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={acting}
                  onClick={() =>
                    act(() =>
                      finalizeLesson({ data: { lessonId: id, feedback, vocabulary: vocab } }),
                    )
                  }
                  className="btn-primary !py-1 text-xs"
                >
                  Finalizar
                </button>
                <button
                  disabled={acting}
                  onClick={() => act(() => teacherCancelLesson({ data: { lessonId: id } }))}
                  className="btn-outline !py-1 text-xs"
                >
                  Cancelar (meu)
                </button>
                <button
                  disabled={acting}
                  onClick={() => act(() => teacherMarkNoShow({ data: { lessonId: id } }))}
                  className="btn-outline !py-1 text-xs border-magenta text-magenta"
                >
                  Imprevisto (no-show)
                </button>
              </div>
            </div>
          )}

          {!viewerIsTeacher && !isFinished && (
            <div className="border-t border-hair pt-4">
              <button
                disabled={acting}
                onClick={() => act(() => studentCancelLesson({ data: { lessonId: id } }))}
                className="btn-outline !py-1 text-xs"
              >
                Cancelar aula (política: 6h antes)
              </button>
            </div>
          )}
          {err && <div className="text-magenta text-sm">{err}</div>}
        </div>

        <div className="card-hair flex flex-col p-4" style={{ height: "500px" }}>
          <div className="mb-2 font-mono-alt text-[11px] uppercase tracking-widest text-muted">
            // chat (atualiza a cada 5s)
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {messages.length === 0 && <div className="text-sm text-muted">Sem mensagens ainda.</div>}
            {messages.map((m) => {
              const mine = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded px-3 py-2 text-sm ${
                      mine ? "bg-[color:var(--cyan)]/20 border border-[color:var(--cyan)]" : "border border-hair bg-bg2"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    <div className="mt-1 text-[10px] text-muted">
                      {new Date(m.created_at).toLocaleTimeString(lang === "jp" ? "ja-JP" : "pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="mt-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Mensagem..."
              className="flex-1 rounded border border-hair bg-transparent px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-primary !py-2 text-xs">Enviar</button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}