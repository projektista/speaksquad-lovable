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