import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getProfileCompletion } from "@/lib/booking.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login" });
    }

    const path = location.pathname;
    const isCompletePath =
      path === "/complete-profile" ||
      path === "/ptbr/complete-profile";
    const isTeacherPath = path.startsWith("/teacher/");
    if (!isCompletePath && !isTeacherPath) {
      const { complete } = await getProfileCompletion();
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