import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export type AppRole = "admin" | "teacher" | "student";

export function useRoles() {
  const { user, loading: sessionLoading } = useSession();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        setRoles(((data ?? []).map((r) => r.role as AppRole)) ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, sessionLoading]);

  return {
    roles,
    loading,
    isTeacher: roles.includes("teacher"),
    isAdmin: roles.includes("admin"),
    isStudent: roles.includes("student"),
  };
}