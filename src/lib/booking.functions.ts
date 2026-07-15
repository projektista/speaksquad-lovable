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