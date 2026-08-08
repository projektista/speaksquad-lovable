import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Public-facing teacher profile. Deliberately excludes zoom_link and any
 * other sensitive field.
 */
export const getTeacherPublicProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: profile, error } = await context.supabase
      .from("profiles")
      .select(
        "id, name, bio, english_level, games, minecraft_gamertag, fortnite_nickname, preferred_game",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!profile) throw new Error("Not found");
    return profile;
  });