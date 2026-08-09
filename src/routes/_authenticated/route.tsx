import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getProfileCompletion } from "@/lib/booking.functions";
import { pathForLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login" });
    }

    const path = location.pathname;
    const { complete, isStaff, preferredLang } = await getProfileCompletion();

    // Student-only areas: staff (teacher/admin) never belong here.
    const studentOnly = ["/dashboard", "/schedule", "/credits"];
    const bare = path.startsWith("/ptbr") ? path.slice("/ptbr".length) : path;
    if (isStaff && studentOnly.includes(bare)) {
      throw redirect({ to: "/teacher/dashboard" });
    }

    // Persistent language preference wins over the URL that was clicked.
    // NULL (legacy accounts / not chosen yet) keeps the current behaviour.
    // The teacher panel is Portuguese-only, so it is never redirected.
    if (preferredLang && !bare.startsWith("/teacher")) {
      const target = pathForLang(path, preferredLang);
      if (target !== path) {
        throw redirect({ to: target, search: location.search, replace: true });
      }
    }

    // Profile completeness is no longer enforced here — it is checked only at
    // booking time (see bookLesson / getProfileCompletion).
    return { user: data.user, isStaff, profileComplete: complete };
  },
  component: () => <Outlet />,
});