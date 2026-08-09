-- Persistent UI language preference per user ('jp' | 'pt'). NULL = not chosen
-- yet (legacy accounts): the app then falls back to the URL-based language.
alter table public.profiles
  add column if not exists preferred_lang text
  check (preferred_lang in ('jp','pt'));

-- Persist the language detected at signup time (sent via signUp options.data).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  _games text[];
  _lang text := NULLIF(meta->>'preferred_lang','');
BEGIN
  IF jsonb_typeof(meta->'games') = 'array' THEN
    SELECT array_agg(value) INTO _games FROM jsonb_array_elements_text(meta->'games');
  END IF;

  IF _lang IS NOT NULL AND _lang NOT IN ('jp','pt') THEN
    _lang := 'jp';
  END IF;

  INSERT INTO public.profiles (
    id, name, bio, english_level, preferred_game, games,
    minecraft_gamertag, fortnite_nickname,
    birth_date, interests, learning_goal, preferred_lang
  )
  VALUES (
    NEW.id,
    COALESCE(meta->>'name',''),
    NULLIF(meta->>'bio',''),
    NULLIF(meta->>'english_level','')::english_level,
    NULLIF(meta->>'preferred_game','')::game_mode,
    COALESCE(_games, ARRAY[]::text[]),
    NULLIF(meta->>'minecraft_gamertag',''),
    NULLIF(meta->>'fortnite_nickname',''),
    NULLIF(meta->>'birth_date','')::date,
    NULLIF(meta->>'interests',''),
    NULLIF(meta->>'learning_goal',''),
    _lang
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NULLIF(EXCLUDED.name,''), public.profiles.name),
    bio = COALESCE(EXCLUDED.bio, public.profiles.bio),
    english_level = COALESCE(EXCLUDED.english_level, public.profiles.english_level),
    preferred_game = COALESCE(EXCLUDED.preferred_game, public.profiles.preferred_game),
    games = CASE
      WHEN array_length(EXCLUDED.games,1) IS NOT NULL THEN EXCLUDED.games
      ELSE public.profiles.games
    END,
    minecraft_gamertag = COALESCE(EXCLUDED.minecraft_gamertag, public.profiles.minecraft_gamertag),
    fortnite_nickname = COALESCE(EXCLUDED.fortnite_nickname, public.profiles.fortnite_nickname),
    birth_date = COALESCE(EXCLUDED.birth_date, public.profiles.birth_date),
    interests = COALESCE(EXCLUDED.interests, public.profiles.interests),
    learning_goal = COALESCE(EXCLUDED.learning_goal, public.profiles.learning_goal),
    preferred_lang = COALESCE(EXCLUDED.preferred_lang, public.profiles.preferred_lang);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF NEW.email IS DISTINCT FROM 'projektista@gmail.com' THEN
    INSERT INTO public.credit_lots (user_id, expires_at, source, note)
    VALUES (
      NEW.id,
      now() + interval '30 days',
      'free_trial',
      'Signup free trial credit'
    );
  END IF;

  RETURN NEW;
END;
$$;
