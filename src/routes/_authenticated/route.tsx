import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login" });
    }

    const path = location.pathname;
    // Skip the completion check on the completion page itself, and don't
    // gate teacher/admin routes (they don't take lessons).
    const isCompletePath =
      path === "/complete-profile" ||
      path === "/ptbr/complete-profile";
    const isTeacherPath = path.startsWith("/teacher/");
    if (!isCompletePath && !isTeacherPath) {
      const [rolesRes, profRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", data.user.id),
        (supabase as any)
          .from("profiles")
          .select("birth_date")
          .eq("id", data.user.id)
          .maybeSingle(),
      ]);
      const roles = (rolesRes.data ?? []).map((r: any) => r.role);
      const isStaff = roles.includes("teacher") || roles.includes("admin");
      const complete = isStaff || Boolean(profRes.data?.birth_date);
      if (!complete) {
        const to = path.startsWith("/ptbr")
          ? "/ptbr/complete-profile"
          : "/complete-profile";
        throw redirect({ to });
      }
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});