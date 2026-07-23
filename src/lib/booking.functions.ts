import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns the current student's credit summary and next upcoming lesson.
 */
export const getMyOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [summaryRes, nextLessonRes, totalRes] = await Promise.all([
      supabase
        .from("v_user_credit_summary")
        .select("available, reserved, next_expiration")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("lessons")
        .select("id, scheduled_at, mode, status, meet_url")
        .eq("student_id", userId)
        .eq("status", "scheduled")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("lessons")
        .select("id", { count: "exact", head: true })
        .eq("student_id", userId)
        .eq("status", "completed"),
    ]);

    return {
      available: summaryRes.data?.available ?? 0,
      reserved: summaryRes.data?.reserved ?? 0,
      nextExpiration: summaryRes.data?.next_expiration ?? null,
      nextLesson: nextLessonRes.data ?? null,
      totalCompleted: totalRes.count ?? 0,
    };
  });

/**
 * Returns the current student's lessons list (all statuses).
 */
export const getMyLessons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("lessons")
      .select("id, scheduled_at, mode, status, meet_url")
      .eq("student_id", context.userId)
      .order("scheduled_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

/**
 * Returns the current user's profile (student self-view).
 */
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await (context.supabase as any)
      .from("profiles")
      .select(
        "id, name, bio, english_level, minecraft_gamertag, fortnite_nickname, birth_date, interests, learning_goal",
      )
      .eq("id", context.userId)
      .maybeSingle();
    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    name?: string;
    bio?: string;
    english_level?: string;
    minecraft_gamertag?: string;
    fortnite_nickname?: string;
    birth_date?: string;
    interests?: string;
    learning_goal?: string;
  }) => data)
  .handler(async ({ data, context }) => {
    const patch: Record<string, string | null> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) patch[k] = v || null;
    }
    const { error } = await (context.supabase as any)
      .from("profiles")
      .update(patch)
      .eq("id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

/**
 * Returns whether the current user's profile has the essentials filled in
 * (birth_date is the required signal). Used by the auth gate to redirect
 * incomplete profiles (e.g. Google signups) to /complete-profile.
 * Teachers/admins are always considered complete — they don't take lessons.
 */
export const getProfileCompletion = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [rolesRes, profRes] = await Promise.all([
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId),
      (context.supabase as any)
        .from("profiles")
        .select("birth_date")
        .eq("id", context.userId)
        .maybeSingle(),
    ]);
    const roles = (rolesRes.data ?? []).map((r: any) => r.role);
    const isStaff = roles.includes("teacher") || roles.includes("admin");
    const complete = isStaff || Boolean(profRes.data?.birth_date);
    return { complete, isStaff };
  });

/**
 * Public availability for booking: returns available slots (not yet booked)
 * across all teachers within [from, to). No auth required — RLS restricts to
 * status='available' AND starts_at>now().
 */
export const getAvailableSlotsRange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { from: string; to: string }) => data)
  .handler(async ({ data, context }) => {
    const [slotsRes, lessonsRes] = await Promise.all([
      (context.supabase as any)
        .from("teacher_availability_slots")
        .select("id, starts_at, teacher_id, status")
        .eq("status", "available")
        .gte("starts_at", data.from)
        .lt("starts_at", data.to)
        .order("starts_at", { ascending: true }),
      context.supabase
        .from("lessons")
        .select("scheduled_at")
        .in("status", ["scheduled"])
        .gte("scheduled_at", data.from)
        .lt("scheduled_at", data.to),
    ]);
    const taken = new Set((lessonsRes.data ?? []).map((l: any) => l.scheduled_at));
    const slots = (slotsRes.data ?? []).filter((s: any) => !taken.has(s.starts_at));
    return slots as Array<{ id: string; starts_at: string; teacher_id: string; status: string }>;
  });

/**
 * Books a lesson at a specific available slot. Reserves 1 credit (FIFO).
 */
export const bookLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { starts_at: string; mode: "minecraft" | "fortnite" }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Ensure slot is still available & not double-booked
    const [{ data: slot }, { data: existing }] = await Promise.all([
      (supabase as any)
        .from("teacher_availability_slots")
        .select("id, teacher_id, status")
        .eq("starts_at", data.starts_at)
        .eq("status", "available")
        .maybeSingle(),
      supabase
        .from("lessons")
        .select("id")
        .eq("scheduled_at", data.starts_at)
        .in("status", ["scheduled"])
        .maybeSingle(),
    ]);
    if (!slot) throw new Error("Slot indisponível.");
    if (existing) throw new Error("Slot já reservado.");

    // Check available credit
    const { data: summary } = await supabase
      .from("v_user_credit_summary")
      .select("available")
      .eq("user_id", userId)
      .maybeSingle();
    if (!summary || (summary.available ?? 0) < 1) throw new Error("Sem créditos disponíveis.");

    // Insert lesson
    const { data: lesson, error: insErr } = await (supabase as any)
      .from("lessons")
      .insert({
        student_id: userId,
        teacher_id: slot.teacher_id,
        scheduled_at: data.starts_at,
        duration_min: 50,
        mode: data.mode,
        status: "scheduled",
      })
      .select("id")
      .single();
    if (insErr || !lesson) throw new Error(insErr?.message ?? "Falha ao agendar");

    // Reserve credit lot (FIFO) via RPC defined in earlier migrations
    const { error: rpcErr } = await (supabase as any).rpc("reserve_credit_lot", {
      _lesson_id: lesson.id,
    });
    if (rpcErr) {
      // Rollback lesson
      await supabase.from("lessons").delete().eq("id", lesson.id);
      throw new Error(rpcErr.message ?? "Falha ao reservar crédito");
    }

    return { ok: true, lessonId: lesson.id };
  });