import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
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
import { lessonDetailContent, lessonStatusLabel, type Lang } from "@/lib/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [confirm, setConfirm] = useState<null | { title: string; run: () => Promise<any> }>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getLessonDetail({ data: { id } })
      .then(setDetail)
      .catch((e) => setErr(e.message ?? String(e)));
  }, [id]);

  useEffect(() => {
    const studentId = detail?.lesson?.student_id;
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

  // Auto-grow the chat textarea up to ~6 lines, then scroll inside it.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const line = 20;
    const max = line * 6 + 16;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, [text]);

  async function send(e: { preventDefault: () => void }) {
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

  const { lesson, student, teacher, viewerIsTeacher } = detail;
  const isFinished = ["completed", "student_cancelled", "teacher_cancelled", "no_show", "late_cancel"].includes(lesson.status);
  const when = new Date(lesson.scheduled_at);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(when)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});
  const ymd = `${parts["year"]}/${parts["month"]}/${parts["day"]}`;
  const hhmm = `${parts["hour"]}:${parts["minute"]}`;
  const hour24 = Number(parts["hour"] ?? "0");
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = String(hour24 % 12 === 0 ? 12 : hour24 % 12).padStart(2, "0");
  const topLabel = `// LESSON_${ymd}_${hour12}${ampm}`;
  const weekday = new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Tokyo",
    weekday: lang === "jp" ? "narrow" : "long",
  }).format(when);
  const teacherProfileHref =
    lang === "jp" ? "/teacher-profile/$id" : "/ptbr/teacher-profile/$id";

  const detailCards = viewerIsTeacher ? null : (
    <>
      <div className="card-hair space-y-3 p-5">
        <div>
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.statusLabel}</div>
          <div className="text-lg">{lessonStatusLabel(lesson.status, lang)}</div>
        </div>
        <div>
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.dateLabel}</div>
          <div>{ymd} ({weekday})</div>
        </div>
        <div>
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.timeLabel}</div>
          <div>{hhmm}</div>
        </div>
        <div>
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.durationLabel}</div>
          <div>{lesson.duration_min}{t.minutes}</div>
        </div>
        {teacher?.zoom_link && (
          <a href={teacher.zoom_link} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
            {t.openZoom}
          </a>
        )}
        {lesson.feedback && (
          <div className="border-t border-hair pt-3">
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.feedbackLabel}</div>
            <div className="text-sm whitespace-pre-wrap">{lesson.feedback}</div>
          </div>
        )}
        {lesson.vocabulary_notes && (
          <div className="border-t border-hair pt-3">
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.vocabularyLabel}</div>
            <div className="text-sm whitespace-pre-wrap">{lesson.vocabulary_notes}</div>
          </div>
        )}
      </div>

      <div className="card-hair space-y-2 p-5">
        <div className="font-mono-alt text-[11px] uppercase tracking-widest text-magenta">
          {t.remindersTitle}
        </div>
        <p className="text-sm text-muted">{t.remindersText}</p>
      </div>

      <div className="card-hair space-y-3 p-5">
        {teacher && (
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.teacherLabel}</div>
            <Link
              to={teacherProfileHref}
              params={{ id: teacher.id }}
              className="text-cyan underline underline-offset-4"
            >
              {teacher.name}
            </Link>
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
        {!isFinished && (
          <div className="border-t border-hair pt-3 space-y-2">
            <div className="text-xs text-muted">{t.cancelPolicy}</div>
            <button
              disabled={acting}
              onClick={() =>
                setConfirm({
                  title: t.confirmTitleStudentCancel,
                  run: () => studentCancelLesson({ data: { lessonId: id } }),
                })
              }
              className="btn-outline !py-1 text-xs"
            >
              {t.studentCancel}
            </button>
          </div>
        )}
        {err && <div className="text-magenta text-sm">{err}</div>}
      </div>
    </>
  );

  return (
    <AppShell lang={lang} title={t.pageTitle} label={topLabel}>
      <div className="grid items-stretch gap-6 md:grid-cols-2">
        <div className="space-y-6">
        {detailCards}
        {viewerIsTeacher && (
        <div className="card-hair space-y-3 p-5">
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.statusLabel}</div>
            <div className="text-lg">{lessonStatusLabel(lesson.status, lang)}</div>
          </div>
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.modeLabel}</div>
            <div className="capitalize">{lesson.mode}</div>
          </div>
          <div>
            <div className="font-mono-alt text-[11px] uppercase tracking-widest text-muted">{t.durationLabel}</div>
            <div>{lesson.duration_min} {t.minutes}</div>
          </div>
          {teacher?.zoom_link && (
            <a href={teacher.zoom_link} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
              {t.openZoom}
            </a>
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
                  onClick={() =>
                    setConfirm({
                      title: t.confirmTitleTeacherCancel,
                      run: () => teacherCancelLesson({ data: { lessonId: id } }),
                    })
                  }
                  className="btn-outline !py-1 text-xs"
                >
                  {t.cancelMine}
                </button>
                <button
                  disabled={acting}
                  onClick={() =>
                    setConfirm({
                      title: t.confirmTitleNoShow,
                      run: () => teacherMarkNoShow({ data: { lessonId: id } }),
                    })
                  }
                  className="btn-outline !py-1 text-xs border-magenta text-magenta"
                >
                  {t.markNoShow}
                </button>
              </div>
            </div>
          )}

          {err && <div className="text-magenta text-sm">{err}</div>}
        </div>
        )}
        </div>

        <div className="card-hair flex h-full min-h-[24rem] flex-col p-4">
          <div className="mb-2 font-mono-alt text-[11px] uppercase tracking-widest text-muted">
            {t.chatTitle}
          </div>
          <div
            className="flex-1 overflow-y-auto space-y-2 pr-2"
            role="log"
            aria-live="polite"
            aria-label={t.chatLogLabel}
            tabIndex={0}
          >
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
          <form onSubmit={send} className="mt-3 flex flex-col gap-2">
            <label htmlFor={`chat-input-${id}`} className="sr-only">
              {t.chatInputLabel}
            </label>
            <textarea
              id={`chat-input-${id}`}
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-describedby={`chat-hint-${id}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(e);
                }
              }}
              placeholder={t.chatPlaceholder}
              className="w-full resize-none rounded border border-hair bg-transparent px-3 py-2 text-sm leading-5"
            />
            <div className="flex items-center justify-between gap-3">
              <p id={`chat-hint-${id}`} className="text-[11px] text-muted">
                {t.chatKeyboardHint}
              </p>
              <button type="submit" className="btn-primary !py-2 text-xs" disabled={!text.trim()}>
                {t.send}
              </button>
            </div>
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

      <AlertDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{t.cancelPolicy}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acting}>{t.confirmNo}</AlertDialogCancel>
         <AlertDialogAction
              disabled={acting}
              onClick={() => {
                const c = confirm;
                if (c) act(c.run).then(() => setConfirm(null));
              }}
            >
              {acting ? t.confirmLoading : t.confirmYes}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
