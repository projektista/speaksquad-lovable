import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/hooks/use-session";
import {
  finalizeLesson,
  getLessonDetail,
  getLessonMessages,
  getPreviousLessonsNotes,
  postLessonMessage,
  studentCancelLesson,
  teacherCancelLesson,
  teacherMarkNoShow,
} from "@/lib/lesson.functions";
import { lessonDetailContent, type Lang } from "@/lib/i18n";

type Detail = Awaited<ReturnType<typeof getLessonDetail>>;
type Msg = { id: string; sender_id: string; content: string; created_at: string };
type Prev = { id: string; scheduled_at: string; mode: string; feedback: string | null; vocabulary_notes: string | null };

export function LessonDetailPage({ id, lang = "pt" }: { id: string; lang?: Lang }) {
  const t = lessonDetailContent[lang];
  const locale = lang === "jp" ? "ja-JP" : "pt-BR";
  const { user } = useSession();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [prev, setPrev] = useState<Prev[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
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
    const studentId = (detail as any)?.lesson?.student_id;
    if (!studentId) return;
    getPreviousLessonsNotes({ data: { studentId, excludeLessonId: id, limit: 3 } })
      .then((rows) => setPrev(rows as Prev[]))
      .catch(() => setPrev([]));
  }, [detail, id]);

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

  if (err && !detail) return <AppShell lang={lang} title={t.metaTitle}><div className="text-magenta">{err}</div></AppShell>;
  if (!detail) return <AppShell lang={lang} title={t.metaTitle}><div className="text-muted">{t.loading}</div></AppShell>;

  const { lesson, student, viewerIsTeacher } = detail;
  const teacher = (detail as any).teacher as { id: string; name: string | null; bio: string | null } | null;
  const isFinished = ["completed", "student_cancelled", "teacher_cancelled", "no_show", "late_cancel"].includes(lesson.status);

  return (
    <AppShell lang={lang} title={`${t.metaTitle.split(" · ")[0]} · ${new Date(lesson.scheduled_at).toLocaleString(locale, { timeZone: "Asia/Tokyo" })}`}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-hair space-y-3 p-5">
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.statusLabel}</div>
            <div className="text-lg">{lesson.status}</div>
          </div>
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.modeLabel}</div>
            <div className="capitalize">{lesson.mode}</div>
          </div>
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.durationLabel}</div>
            <div>{lesson.duration_min} {t.minutes}</div>
          </div>
          {lesson.meet_url && (
            <a href={lesson.meet_url} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
              {t.openZoom}
            </a>
          )}
          {teacher && !viewerIsTeacher && (
            <div className="border-t border-hair pt-3">
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.teacherLabel}</div>
              <div>{teacher.name}</div>
              <div className="mt-1 text-xs text-muted whitespace-pre-wrap">{teacher.bio || t.bioMissing}</div>
            </div>
          )}
          {student && (
            <div className="border-t border-hair pt-3">
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.studentLabel}</div>
              <div>{student.name}</div>
              {student.minecraft_gamertag && <div className="text-xs text-muted">MC: {student.minecraft_gamertag}</div>}
              {student.fortnite_nickname && <div className="text-xs text-muted">FN: {student.fortnite_nickname}</div>}
            </div>
          )}
          {lesson.feedback && (
            <div className="border-t border-hair pt-3">
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.feedbackLabel}</div>
              <div className="text-sm whitespace-pre-wrap">{lesson.feedback}</div>
            </div>
          )}
          {lesson.vocabulary_notes && (
            <div>
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.vocabularyLabel}</div>
              <div className="text-sm whitespace-pre-wrap">{lesson.vocabulary_notes}</div>
            </div>
          )}

          {viewerIsTeacher && !isFinished && (
            <div className="border-t border-hair pt-4 space-y-2">
              <div className="font-mono-alt text-[11px] uppercase tracking-widest text-magenta">
                {t.teacherActions}
              </div>
              <textarea
                rows={2}
                placeholder={t.feedbackPlaceholder}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded border border-hair bg-transparent p-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder={t.vocabPlaceholder}
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
                  {t.finalize}
                </button>
                <button
                  disabled={acting}
                  onClick={() => act(() => teacherCancelLesson({ data: { lessonId: id } }))}
                  className="btn-outline !py-1 text-xs"
                >
                  {t.cancelMine}
                </button>
                <button
                  disabled={acting}
                  onClick={() => act(() => teacherMarkNoShow({ data: { lessonId: id } }))}
                  className="btn-outline !py-1 text-xs border-magenta text-magenta"
                >
                  {t.markNoShow}
                </button>
              </div>
            </div>
          )}

          {!viewerIsTeacher && !isFinished && (
            <div className="border-t border-hair pt-4 space-y-2">
              <div className="text-xs text-muted">{t.cancelPolicy}</div>
              <button
                disabled={acting}
                onClick={() => act(() => studentCancelLesson({ data: { lessonId: id } }))}
                className="btn-outline !py-1 text-xs"
              >
                {t.studentCancel}
              </button>
            </div>
          )}
          {err && <div className="text-magenta text-sm">{err}</div>}
        </div>

        <div className="card-hair flex flex-col p-4" style={{ height: "500px" }}>
          <div className="mb-2 font-mono-alt text-[11px] uppercase tracking-widest text-muted">
            {t.chatTitle}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {messages.length === 0 && <div className="text-sm text-muted">{t.chatEmpty}</div>}
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
                      {new Date(m.created_at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
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
              placeholder={t.chatPlaceholder}
              className="flex-1 rounded border border-hair bg-transparent px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-primary !py-2 text-xs">{t.send}</button>
          </form>
        </div>
      </div>

      <div className="mt-6 card-hair p-5">
        <div className="mb-3 font-mono-alt text-[11px] uppercase tracking-widest text-magenta">
          {t.historyTitle}
        </div>
        {prev.length === 0 ? (
          <div className="text-sm text-muted">{t.historyEmpty}</div>
        ) : (
          <ul className="space-y-2">
            {prev.map((h) => {
              const isOpen = !!expanded[h.id];
              return (
                <li key={h.id} className="border border-hair rounded">
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => ({ ...s, [h.id]: !s[h.id] }))}
                    className="flex w-full items-center justify-between p-3 text-left"
                  >
                    <span className="font-mono-alt text-xs text-muted">
                      {new Date(h.scheduled_at).toLocaleString(locale, {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Tokyo",
                      })}{" "}
                      · <span className="capitalize">{h.mode}</span>
                    </span>
                    <span className="font-mono-alt text-[11px] text-cyan">
                      {isOpen ? t.collapse : t.expand}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-hair p-3 space-y-2 text-sm">
                      {h.feedback && (
                        <div>
                          <div className="font-mono-alt text-[10px] uppercase text-muted">{t.feedbackLabel}</div>
                          <div className="whitespace-pre-wrap">{h.feedback}</div>
                        </div>
                      )}
                      {h.vocabulary_notes && (
                        <div>
                          <div className="font-mono-alt text-[10px] uppercase text-muted">{t.vocabularyLabel}</div>
                          <div className="whitespace-pre-wrap">{h.vocabulary_notes}</div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}