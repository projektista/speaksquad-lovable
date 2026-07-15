import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns the current student's credit balance and next upcoming lesson.
 */
export const getMyOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [creditsRes, nextLessonRes, totalRes] = await Promise.all([
      supabase
        .from("credits")
        .select("balance, reserved")
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
      balance: creditsRes.data?.balance ?? 0,
      reserved: creditsRes.data?.reserved ?? 0,
      available: (creditsRes.data?.balance ?? 0) - (creditsRes.data?.reserved ?? 0),
      nextLesson: nextLessonRes.data ?? null,
      totalCompleted: totalRes.count ?? 0,
    };
  });