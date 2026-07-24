import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertTeacher(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  if (error) throw error;
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("teacher") && !roles.includes("admin")) {
    throw new Error("Forbidden");
  }
}

export const getTeacherOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertTeacher(context);
    const nowIso = new Date().toISOString();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [todayRes, upcomingRes, recentRes] = await Promise.all([
      context.supabase
        .from("lessons")
        .select("id, scheduled_at, mode, status, meet_url, student_id")
        .gte("scheduled_at", startOfToday.toISOString())
        .lte("scheduled_at", endOfToday.toISOString())
        .order("scheduled_at", { ascending: true }),
      context.supabase
        .from("lessons")
        .select("id, scheduled_at, mode, status, student_id")
        .gt("scheduled_at", nowIso)
        .eq("status", "scheduled")
        .order("scheduled_at", { ascending: true })
        .limit(5),
      context.supabase
        .from("lessons")
        .select("id, scheduled_at, mode, status, student_id, feedback")
        .in("status", ["completed", "student_cancelled", "teacher_cancelled", "late_cancel", "no_show"])
        .order("scheduled_at", { ascending: false })
        .limit(5),
    ]);

    return {
      today: todayRes.data ?? [],
      upcoming: upcomingRes.data ?? [],
      recent: recentRes.data ?? [],
    };
  });

export const getTeacherAllLessons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertTeacher(context);
    const { data } = await context.supabase
      .from("lessons")
      .select("id, scheduled_at, mode, status, student_id, feedback, meet_url")
      .order("scheduled_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

export const getTeacherProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertTeacher(context);
    const { data } = await context.supabase
      .from("profiles")
      .select("id, name, bio, english_level, minecraft_gamertag, fortnite_nickname")
      .eq("id", context.userId)
      .maybeSingle();
    return data;
  });

export const updateTeacherProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name?: string; bio?: string }) => data)
  .handler(async ({ data, context }) => {
    await assertTeacher(context);
    const patch: { name?: string; bio?: string | null } = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.bio !== undefined) patch.bio = data.bio;
    await context.supabase.from("profiles").update(patch).eq("id", context.userId);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Date-based availability slots                                      */
/* ------------------------------------------------------------------ */

/**
 * Returns slots + booked lessons for the teacher within [from, to).
 * Booked lessons come from the `lessons` table with active status.
 */
export const getTeacherAvailabilityRange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { from: string; to: string }) => data)
  .handler(async ({ data, context }) => {
    await assertTeacher(context);
    const [slotsRes, lessonsRes] = await Promise.all([
      (context.supabase as any)
        .from("teacher_availability_slots")
        .select("id, starts_at, status")
        .eq("teacher_id", context.userId)
        .gte("starts_at", data.from)
        .lt("starts_at", data.to),
      context.supabase
        .from("lessons")
        .select("id, scheduled_at, status, student_id")
        .in("status", ["scheduled"])
        .gte("scheduled_at", data.from)
        .lt("scheduled_at", data.to),
    ]);
    return {
      slots: (slotsRes.data ?? []) as Array<{ id: string; starts_at: string; status: string }>,
      lessons: (lessonsRes.data ?? []) as Array<{ id: string; scheduled_at: string; status: string; student_id: string }>,
    };
  });

export const setSlot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { starts_at: string; state: "available" | "blocked" | "off" }) => data)
  .handler(async ({ data, context }) => {
    await assertTeacher(context);
    // If a lesson exists on this slot, block changes.
    const { data: lesson } = await context.supabase
      .from("lessons")
      .select("id, status")
      .eq("scheduled_at", data.starts_at)
      .in("status", ["scheduled"])
      .maybeSingle();
    if (lesson) throw new Error("Slot já reservado por uma aula.");

    if (data.state === "off") {
      await (context.supabase as any)
        .from("teacher_availability_slots")
        .delete()
        .eq("teacher_id", context.userId)
        .eq("starts_at", data.starts_at);
      return { ok: true };
    }

    await (context.supabase as any)
      .from("teacher_availability_slots")
      .upsert(
        {
          teacher_id: context.userId,
          starts_at: data.starts_at,
          status: data.state,
          duration_min: 60,
        },
        { onConflict: "teacher_id,starts_at" },
      );
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Student management (teacher/admin only)                            */
/* ------------------------------------------------------------------ */

export const listStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertTeacher(context);
    const supabase = context.supabase as any;

    const { data: roleRows, error: rolesErr } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "student");
    if (rolesErr) throw rolesErr;
    const ids: string[] = (roleRows ?? []).map((r: any) => r.user_id);
    if (ids.length === 0) return [];

    const [profilesRes, summariesRes, lessonsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, name, birth_date")
        .in("id", ids),
      supabase
        .from("v_user_credit_summary")
        .select("user_id, available, reserved, next_expiration")
        .in("user_id", ids),
      supabase
        .from("lessons")
        .select("student_id, scheduled_at, status")
        .in("student_id", ids)
        .eq("status", "completed")
        .order("scheduled_at", { ascending: false }),
    ]);

    // Fetch emails via admin API (privileged operation, teacher/admin only).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const emails: Record<string, string> = {};
    // getUserById one at a time is fine for small lists; keep parallel.
    await Promise.all(
      ids.map(async (id) => {
        const { data } = await supabaseAdmin.auth.admin.getUserById(id);
        if (data?.user?.email) emails[id] = data.user.email;
      }),
    );

    const profileById = new Map<string, any>();
    for (const p of profilesRes.data ?? []) profileById.set(p.id, p);
    const summaryById = new Map<string, any>();
    for (const s of summariesRes.data ?? []) summaryById.set(s.user_id, s);
    const lastLessonById = new Map<string, string>();
    for (const l of lessonsRes.data ?? []) {
      if (!lastLessonById.has(l.student_id)) {
        lastLessonById.set(l.student_id, l.scheduled_at);
      }
    }

    return ids.map((id) => {
      const p = profileById.get(id);
      const s = summaryById.get(id);
      return {
        id,
        name: (p?.name as string) ?? "",
        email: emails[id] ?? "",
        available: (s?.available as number) ?? 0,
        reserved: (s?.reserved as number) ?? 0,
        lastCompletedAt: lastLessonById.get(id) ?? null,
        profileComplete: Boolean(p?.birth_date),
      };
    });
  });

export const getStudentDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { studentId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertTeacher(context);
    const supabase = context.supabase as any;
    const studentId = data.studentId;

    const [profileRes, summaryRes, lotsRes, lessonsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, name, bio, english_level, minecraft_gamertag, fortnite_nickname, birth_date, interests, learning_goal",
        )
        .eq("id", studentId)
        .maybeSingle(),
      supabase
        .from("v_user_credit_summary")
        .select("available, reserved, next_expiration")
        .eq("user_id", studentId)
        .maybeSingle(),
      supabase
        .from("credit_lots")
        .select("id, status, source, note, created_at, expires_at, consumed_at, reserved_for_lesson_id")
        .eq("user_id", studentId)
        .order("created_at", { ascending: false }),
      supabase
        .from("lessons")
        .select("id, scheduled_at, status, mode")
        .eq("student_id", studentId)
        .order("scheduled_at", { ascending: false })
        .limit(20),
    ]);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(studentId);

    return {
      profile: profileRes.data ?? null,
      email: userData?.user?.email ?? "",
      summary: summaryRes.data ?? { available: 0, reserved: 0, next_expiration: null },
      lots: lotsRes.data ?? [],
      lessons: lessonsRes.data ?? [],
    };
  });

export const grantStudentCredits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { studentId: string; quantity: number; expiresAt: string; note: string }) => data,
  )
  .handler(async ({ data, context }) => {
    await assertTeacher(context);
    const quantity = Math.floor(Number(data.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 100) {
      throw new Error("Quantidade inválida (1-100).");
    }
    const note = data.note?.trim();
    if (!note) throw new Error("Motivo é obrigatório.");
    const expiresAt = new Date(data.expiresAt);
    if (Number.isNaN(expiresAt.getTime())) throw new Error("Data de expiração inválida.");

    // Ensure the target is actually a student we know about (RLS + sanity).
    const { data: exists } = await context.supabase
      .from("user_roles")
      .select("user_id")
      .eq("user_id", data.studentId)
      .eq("role", "student")
      .maybeSingle();
    if (!exists) throw new Error("Aluno não encontrado.");

    const rows = Array.from({ length: quantity }).map(() => ({
      user_id: data.studentId,
      expires_at: expiresAt.toISOString(),
      source: "manual_grant",
      status: "available" as const,
      note,
    }));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("credit_lots").insert(rows);
    if (error) throw error;
    return { ok: true, granted: quantity };
  });