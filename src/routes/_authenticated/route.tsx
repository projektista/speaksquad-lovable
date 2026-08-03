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
    const { complete, isStaff } = await getProfileCompletion();

    // Student-only areas: staff (teacher/admin) never belong here.
    const studentOnly = ["/dashboard", "/schedule", "/credits"];
    const bare = path.startsWith("/ptbr") ? path.slice("/ptbr".length) : path;
    if (isStaff && studentOnly.includes(bare)) {
      throw redirect({ to: "/teacher/dashboard" });
    }

    // Profile completeness is no longer enforced here — it is checked only at
    // booking time (see bookLesson / getProfileCompletion).
    return { user: data.user, isStaff, profileComplete: complete };
  },
  component: () => <Outlet />,
});