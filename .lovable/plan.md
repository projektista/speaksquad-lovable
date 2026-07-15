# Plano — Vercel + Funcionalidades Completas

Escopo grande. Vou entregar em **4 fases** para manter cada etapa verificável. Você aprova o plano e eu executo tudo em sequência sem parar entre fases (a menos que apareça bloqueio real, ex.: secret que precisa ser adicionado por você).

---

## Fase 1 — Migração para Vercel

O projeto hoje roda TanStack Start no runtime Cloudflare Workers (via `@lovable.dev/vite-tanstack-config` + nitro). Para Vercel:

1. Trocar preset do nitro para `vercel` no `vite.config.ts`.
2. Verificar cada server function e a rota `api/public/payments/webhook.ts` — a maioria já usa APIs Web-standard (fetch, crypto.subtle), compatíveis com Vercel Edge/Node.
3. Criar `vercel.json` mínimo se necessário (roteamento SSR).
4. Documentar em `README.md` variáveis de ambiente que você precisa configurar no Vercel:
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `LOVABLE_API_KEY`, `STRIPE_SANDBOX_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_PAYMENTS_CLIENT_TOKEN`

**Aviso:** o backend continua sendo Lovable Cloud (Supabase gerenciado). A Vercel só hospeda o frontend + server functions. Isso é o padrão e funciona bem.

Você fará o deploy no Vercel manualmente (conectando o repo). Eu deixo tudo pronto para `vercel deploy` funcionar direto.

---

## Fase 2 — Signup revisado + criação de professor

**Signup (`/signup` e `/jp/signup`):**
- Adicionar campo **confirmação de senha** (obrigatório, deve bater).
- Substituir botões de jogo por **checkboxes** (Minecraft / Fortnite, múltipla seleção, mínimo 1).
- Ao marcar Minecraft → campo `MINECRAFT GAMERTAG:` obrigatório.
- Ao marcar Fortnite → campo `Nickname no FORTNITE:` obrigatório.
- Salvar em `profiles`: adicionar colunas `minecraft_gamertag`, `fortnite_nickname`, `games` (array). Migração incluída.

**Virar professor:**
- Você cria a conta em `/signup` com `projektista@gmail.com`.
- Eu adiciono migração que insere role `teacher` E `admin` para esse email (via lookup em `auth.users`).

---

## Fase 3 — Dashboard do aluno + Página da aula

**Dashboard aluno (`/dashboard`, `/jp/dashboard`):**
- Card **Créditos**: disponível / reservado / próxima expiração + botão "Histórico" (modal com `credit_purchases` + `credit_transactions`).
- Card **Próxima aula**: data, modo, link para `/lessons/:id`.
- Card **Perfil**: editar nome, bio, nível, gamertags.
- Card **Aulas concluídas**: contador + link para histórico.

**Página da aula (`/lessons/:id`):**
- Detalhes (data, professor, Zoom URL, status).
- **Chat com polling** (5s): tabela nova `lesson_messages` (sender, content, created_at).
- **Ações do professor** (só visível para role teacher):
  - `Finalizar` → status=completed, chama `consume_credit_lot`.
  - `Cancelar` (cancelamento normal, prof) → status=cancelled_teacher, chama `release_credit_lot` com extensão.
  - `Imprevisto` (no-show/last-minute do aluno) → status=cancelled_student, chama `consume_credit_lot`.
- **Ações do aluno**:
  - `Cancelar` (só se > 6h antes conforme política já memorizada) → `release_credit_lot`.

---

## Fase 4 — Dashboard do professor + páginas extras

**Menu especial do professor** (aparece no header quando role=teacher): Dashboard · Agendamento · Todas as aulas · Editar perfil.

**Dashboard professor (`/teacher`):**
- Aulas de hoje, próximas 5, últimas 5 concluídas com status.

**Agendamento (`/teacher/agendamento`):**
- Calendário semanal (domingo a sábado, colunas), 24 linhas de 1h (00:00–24:00).
- Clicar em célula alterna estado. 3 estados cíclicos:
  - **Cinza** (indisponível — padrão)
  - **Ciano** (disponível para agendamento)
  - **Violeta** (bloqueado/férias) — *(magenta reservo para "aula marcada" read-only)*
- Persistência em `teacher_availability` (já existe) + `availability_exceptions`.
- Navegação semana anterior/próxima.

**Todas as aulas (`/teacher/aulas`):**
- Lista paginada de todas as aulas do professor com filtros (status, aluno).

**Editar perfil professor (`/teacher/perfil`):**
- Nome, bio, foto (opcional futuro), especialidades.

---

## Detalhes técnicos

- **Migrações necessárias:**
  - `profiles`: `minecraft_gamertag text`, `fortnite_nickname text`, `games text[]`.
  - `lesson_messages`: id, lesson_id, sender_id, content, created_at + RLS (aluno e professor da aula veem/inserem).
  - Insert `user_roles` (teacher, admin) para `projektista@gmail.com` — condicional a existência do usuário.
- **Server functions novas:** `getLessonDetail`, `postLessonMessage`, `getLessonMessages`, `finalizeLesson`, `cancelLessonTeacher`, `noShowLesson`, `cancelLessonStudent`, `getTeacherWeek`, `upsertAvailabilitySlot`, `getTeacherAllLessons`, `getTeacherOverview`, `updateProfile`, `updateTeacherProfile`, `getCreditHistory`.
- **Componentes de página** ficam em `src/components/pages/` (bilíngue via dicionários em `src/lib/i18n.ts`, seguindo memória do projeto).
- **Rotas PT e JP** espelhadas para todas as novas páginas.

---

## O que NÃO está incluído

- Foto de perfil / upload de avatar (posso adicionar depois).
- Sistema de notificações/lembretes por email antes da aula (posso adicionar depois com Lovable Email).
- Pagamento em produção (continua sandbox até você fazer go-live no Stripe).

Confirma e eu executo as 4 fases em sequência.
