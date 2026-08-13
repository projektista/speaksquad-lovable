import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function getRoles(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  return (data ?? []).map((r: { role: string }) => r.role as string);
}

/** Ensures the caller participates in the lesson (student owner, teacher or admin). */
async function assertParticipant(
  context: { supabase: any; userId: string },
  lessonId: string,
) {
  const { data: lesson, error } = await context.supabase
    .from("lessons")
    .select("id, student_id, teacher_id")
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!lesson) throw new Error("Not found");
  const roles = await getRoles(context);
  const isStaff = roles.includes("teacher") || roles.includes("admin");
  if (!isStaff && lesson.student_id !== context.userId) throw new Error("Forbidden");
  return lesson;
}

/** Ensures the caller is the lesson's own teacher (admins may act on any lesson). */
async function assertLessonTeacher(
  context: { supabase: any; userId: string },
  lessonId: string,
) {
  const roles = await getRoles(context);
  const isAdmin = roles.includes("admin");
  if (!isAdmin && !roles.includes("teacher")) throw new Error("Forbidden");
  const { data: lesson, error } = await context.supabase
    .from("lessons")
    .select("id, teacher_id")
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!lesson) throw new Error("Not found");
  if (!isAdmin && lesson.teacher_id !== context.userId) throw new Error("Forbidden");
  return lesson;
}

export const getLessonDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: lesson, error } = await context.supabase
      .from("lessons")
      .select("id, scheduled_at, mode, status, student_id, teacher_id, feedback, vocabulary_notes, duration_min")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!lesson) throw new Error("Not found");

    const roles = await getRoles(context);
    const isTeacher = roles.includes("teacher") || roles.includes("admin");
    if (!isTeacher && lesson.student_id !== context.userId) {
      throw new Error("Forbidden");
    }

    const { data: student } = await context.supabase
      .from("profiles")
      .select("id, name, minecraft_gamertag, fortnite_nickname")
      .eq("id", lesson.student_id)
      .maybeSingle();

    const { data: teacher } = lesson.teacher_id
      ? await context.supabase
          .from("profiles")
          .select("id, name, bio, zoom_link")
          .eq("id", lesson.teacher_id)
          .maybeSingle()
      : { data: null };

    return {
      lesson,
      student,
      teacher,
      viewerIsTeacher: isTeacher,
    };
  });

/**
 * Returns the last N completed lessons (with feedback/vocab) for a given student,
 * excluding the current lesson. Used by the lesson detail page ("previous notes").
 */
export const getPreviousLessonsNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { studentId: string; excludeLessonId: string; limit?: number; offset?: number }) => data)
  .handler(async ({ data, context }) => {
    const roles = await getRoles(context);
    const isTeacher = roles.includes("teacher") || roles.includes("admin");
    if (!isTeacher && data.studentId !== context.userId) throw new Error("Forbidden");
    const limit = Math.min(data.limit ?? 3, 20);
    const offset = data.offset ?? 0;
    const { data: rows } = await context.supabase
      .from("lessons")
      .select("id, scheduled_at, mode, feedback, vocabulary_notes")
      .eq("student_id", data.studentId)
      .eq("status", "completed")
      .neq("id", data.excludeLessonId)
      .order("scheduled_at", { ascending: false })
      .range(offset, offset + limit - 1);
    return rows ?? [];
  });

export const getLessonMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lessonId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertParticipant(context, data.lessonId);
    const { data: messages } = await context.supabase
      .from("lesson_messages")
      .select("id, sender_id, content, created_at")
      .eq("lesson_id", data.lessonId)
      .order("created_at", { ascending: true });
    return messages ?? [];
  });

export const postLessonMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lessonId: string; content: string }) => {
    const c = data.content.trim();
    if (!c) throw new Error("Empty");
    if (c.length > 2000) throw new Error("Too long");
    return { lessonId: data.lessonId, content: c };
  })
  .handler(async ({ data, context }) => {
    await assertParticipant(context, data.lessonId);
    const { error } = await context.supabase.from("lesson_messages").insert({
      lesson_id: data.lessonId,
      sender_id: context.userId,
      content: data.content,
    });
    if (error) throw error;
    return { ok: true };
  });

export const finalizeLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lessonId: string; feedback?: string; vocabulary?: string }) => data)
  .handler(async ({ data, context }) => {
    await assertLessonTeacher(context, data.lessonId);
    // service_role-only RPC — role already checked above with the user's client.
    await supabaseAdmin.rpc("consume_credit_lot", { _lesson_id: data.lessonId });
    const patch: { status: "completed"; feedback?: string | null; vocabulary_notes?: string | null } = { status: "completed" };
    if (data.feedback !== undefined) patch.feedback = data.feedback || null;
    if (data.vocabulary !== undefined) patch.vocabulary_notes = data.vocabulary || null;
    const { error } = await context.supabase.from("lessons").update(patch).eq("id", data.lessonId);
    if (error) throw error;
    return { ok: true };
  });

export const teacherCancelLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lessonId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertLessonTeacher(context, data.lessonId);
    // Release credit and extend expiration by 30 days as compensation.
    // service_role-only RPC — role already checked above with the user's client.
    await supabaseAdmin.rpc("release_credit_lot", {
      _lesson_id: data.lessonId,
      _extend_days: 30,
    });
    const { error } = await context.supabase
      .from("lessons")
      .update({ status: "teacher_cancelled", cancelled_at: new Date().toISOString(), cancelled_by: "teacher" })
      .eq("id", data.lessonId);
    if (error) throw error;
    return { ok: true };
  });

export const teacherMarkNoShow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lessonId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertLessonTeacher(context, data.lessonId);
    // Consume the credit (student pays). service_role-only RPC — role
    // already checked above with the user's client.
    await supabaseAdmin.rpc("consume_credit_lot", { _lesson_id: data.lessonId });
    const { error } = await context.supabase
      .from("lessons")
      .update({ status: "no_show", cancelled_at: new Date().toISOString(), cancelled_by: "teacher" })
      .eq("id", data.lessonId);
    if (error) throw error;
    return { ok: true };
  });

export const studentCancelLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lessonId: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: lesson } = await context.supabase
      .from("lessons")
      .select("scheduled_at, student_id, status")
      .eq("id", data.lessonId)
      .maybeSingle();
    if (!lesson) throw new Error("Not found");
    if (lesson.student_id !== context.userId) throw new Error("Forbidden");
    if (lesson.status !== "scheduled") throw new Error("Lesson is not scheduled");

    const hoursUntil = (new Date(lesson.scheduled_at).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < 6) {
      // Late cancel — credit is consumed.
      // consume_credit_lot only grants EXECUTE to service_role (by design,
      // see 20260715093907 migration) — ownership/status/timing were already
      // validated above with the user's own client, so it's safe to use the
      // admin client here just for this privileged RPC call.
      await supabaseAdmin.rpc("consume_credit_lot", { _lesson_id: data.lessonId });
      await context.supabase
        .from("lessons")
        .update({ status: "late_cancel", cancelled_at: new Date().toISOString(), cancelled_by: "student" })
        .eq("id", data.lessonId);
      return { ok: true, refunded: false };
    }
    // Normal cancel — credit released, no extension.
    // Same reasoning as above: release_credit_lot is service_role-only.
    await supabaseAdmin.rpc("release_credit_lot", { _lesson_id: data.lessonId, _extend_days: 0 });
    await context.supabase
      .from("lessons")
      .update({ status: "student_cancelled", cancelled_at: new Date().toISOString(), cancelled_by: "student" })
      .eq("id", data.lessonId);
    return { ok: true, refunded: true };
  });
