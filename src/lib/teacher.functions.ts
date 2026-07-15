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
        .in("status", ["completed", "cancelled_student", "cancelled_teacher"])
        .order("scheduled_at", { ascending: false })
        .limit(5),
    ]);

    return {
      today: todayRes.data ?? [],
      upcoming: upcomingRes.data ?? [],
      recent: recentRes.data ?? [],
    };
  });

export const getTeacherAvailability = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertTeacher(context);
    const { data } = await context.supabase
      .from("teacher_availability")
      .select("id, weekday, start_time, end_time, active")
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true });
    return data ?? [];
  });

export const setWeeklySlot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { weekday: number; hour: number; state: "available" | "blocked" | "off" }) => {
    if (data.weekday < 0 || data.weekday > 6) throw new Error("Invalid weekday");
    if (data.hour < 0 || data.hour > 23) throw new Error("Invalid hour");
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertTeacher(context);
    const start = `${String(data.hour).padStart(2, "0")}:00:00`;
    const end = `${String((data.hour + 1) % 24).padStart(2, "0")}:00:00`;

    // Delete any slot matching that hour on that weekday
    await context.supabase
      .from("teacher_availability")
      .delete()
      .eq("weekday", data.weekday)
      .eq("start_time", start);

    if (data.state === "off") return { ok: true };

    await context.supabase.from("teacher_availability").insert({
      weekday: data.weekday,
      start_time: start,
      end_time: end,
      active: data.state === "available",
    });
    return { ok: true };
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
    const patch: Record<string, unknown> = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.bio !== undefined) patch.bio = data.bio;
    await context.supabase.from("profiles").update(patch).eq("id", context.userId);
    return { ok: true };
  });