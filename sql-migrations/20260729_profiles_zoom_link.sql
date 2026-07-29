-- Teacher's fixed, reusable Zoom link (replaces per-lesson lessons.meet_url).
alter table public.profiles
  add column if not exists zoom_link text;
