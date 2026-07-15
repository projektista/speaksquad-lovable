## Objetivo

Ligar o front-end existente a um backend real (Lovable Cloud) que suporte: cadastro de aluno, compra de créditos, agendamento com hold de crédito, política de cancelamento definida, e um dashboard administrativo para o professor gerenciar disponibilidade e aulas.

## Política de cancelamento (confirmada)

- Crédito é **reservado** ao agendar, não descontado.
- Aluno cancela **≥ 6h** antes → reserva liberada, crédito volta.
- Aluno cancela **< 6h** antes ou **no-show** → crédito consumido.
- Professor cancela **a qualquer momento** → crédito sempre volta.
- Aula `completed` → crédito consumido (1 `deduction`).

## Etapas

### 1. Ativar Lovable Cloud
Habilita banco (Postgres + RLS), auth e edge functions. Sem isso não há persistência.

### 2. Schema (migração SQL)

Tabelas em `public`:

- `profiles` (id = auth.uid, name, level, bio, preferred_game, role: `student|admin`)
- `user_roles` + enum `app_role` + função `has_role` (padrão de segurança)
- `credits` (user_id, balance int, reserved int) — 1 linha por aluno
- `credit_transactions` (user_id, lesson_id?, type: `purchase|deduction|refund`, amount, stripe_session_id?)
- `teacher_availability` (id, weekday 0–6, start_time, end_time, active) — regras recorrentes do Hugo
- `availability_exceptions` (date, start_time?, end_time?, blocked bool) — folgas/aberturas pontuais
- `lessons` (id, student_id, scheduled_at UNIQUE, duration_min=50, mode: `minecraft|fortnite`, status: `scheduled|completed|late_cancel|no_show|student_cancelled|teacher_cancelled`, meet_url?, feedback?, vocabulary_notes?, cancelled_at?, cancelled_by?)
- RLS: aluno vê/edita só o próprio; admin (via `has_role`) vê tudo. `GRANT`s explícitos para `authenticated` + `service_role`.

### 3. Server functions (`createServerFn` + `requireSupabaseAuth`)

- `listAvailableSlots({ from, to })` — cruza `teacher_availability` + `availability_exceptions` − `lessons` ocupadas.
- `bookLesson({ scheduled_at, mode })` — valida slot, checa `balance - reserved >= 1`, incrementa `reserved`, cria `lesson` (status `scheduled`). Transação atômica.
- `cancelLessonAsStudent({ lesson_id })` — se `scheduled_at - now >= 6h`: libera `reserved`, status `student_cancelled`. Senão: `reserved--`, `balance--`, cria `deduction`, status `late_cancel`.
- `cancelLessonAsTeacher({ lesson_id })` — sempre libera `reserved`, status `teacher_cancelled` (admin only).
- `markLessonCompleted({ lesson_id, feedback?, vocabulary_notes? })` — admin only. `reserved--`, `balance--`, cria `deduction`, status `completed`.
- `markNoShow({ lesson_id })` — admin only. Igual a late_cancel mas status `no_show`.
- Admin CRUD: `upsertAvailabilityRule`, `deleteAvailabilityRule`, `addAvailabilityException`, `listAllLessons`, `listStudents`.

### 4. Créditos & Stripe

- Habilitar Lovable Payments (Stripe seamless) — passo separado quando o usuário confirmar.
- Produto: pacote de créditos (ex.: 1, 4, 8 créditos).
- Webhook `/api/public/webhooks/stripe` → verifica assinatura, cria `credit_transactions` (purchase) e incrementa `balance`.
- Página `/credits` (nova) para comprar.

### 5. Rotas novas / atualizadas

- `/schedule` e `/jp/schedule` — trocar mock por `listAvailableSlots` + `bookLesson`.
- `/lessons/$id` e `/jp/lessons/$id` — página única por aula (link do Meet, modo, status, botão cancelar com aviso da regra 6h, feedback pós-aula em read-only p/ aluno).
- `/credits` e `/jp/credits` — compra e histórico de transações.

### 6. Admin (`/admin/*`, gate por `has_role('admin')`)

Layout `AdminShell` (já existe). Páginas:

- `/admin` — overview: próximas 5 aulas, créditos totais em circulação.
- `/admin/availability` — editor de regras semanais + exceções por data.
- `/admin/schedule` — calendário com todas as aulas futuras; clique abre `/admin/lessons/$id`.
- `/admin/lessons/$id` — detalhe da aula: marcar `completed` / `no_show` / cancelar, editar `feedback` e `vocabulary_notes`.
- `/admin/students` — lista com nome, nível, créditos, última aula.
- `/admin/finance` — soma de `purchase` e `deduction` por período.

### 7. Auth real

Ligar `LoginPage` / `SignupPage` ao Supabase Auth (email+senha). Signup cria linha em `profiles` e `credits` (balance 0). Gate `_authenticated/` já é gerenciado.

## Ordem de execução sugerida

1. Ativar Cloud + schema + RLS + roles.
2. Auth real (login/signup) + `_authenticated` para `/dashboard`, `/schedule`, `/lessons/*`, `/credits`.
3. Server fns de disponibilidade e booking (sem Stripe ainda — créditos podem ser adicionados manualmente para teste).
4. Admin de disponibilidade + admin de aulas.
5. Página `/lessons/$id` com cancelamento (regra 6h).
6. Habilitar Stripe + `/credits` + webhook.
7. Marcação de `completed` / `no_show` pelo professor.

## Perguntas antes de começar

1. **Pacotes de crédito**: quantos e a que preço (ex.: 1 crédito ¥3.000, 4 por ¥11.000, 8 por ¥20.000)?
2. **Duração da aula**: fixa em 50 min (docs) ou configurável?
3. **Fuso**: tudo em JST no banco (`timestamptz` armazenado UTC, exibido JST)?
4. **Meet link**: você cola manualmente ao criar a aula, ou geramos um placeholder e você edita depois?

Posso começar pela etapa 1 (Cloud + schema) assim que confirmar essas 4 respostas — ou já sigo com defaults (¥3k/¥11k/¥20k, 50min fixo, JST, Meet manual) se preferir.
