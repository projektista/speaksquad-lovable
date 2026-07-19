
## Escopo

Reforma frontend + ajustes de backend necessários para que a agenda passe a operar com datas reais (não semana genérica), aluno agende contra disponibilidade real do professor, e dashboards fiquem separados por papel.

## 1. Banco — migração de agenda para datas reais

A `teacher_availability` atual é semanal genérica (`weekday`, `start_time`). Isso é incompatível com "navegar para setembro e liberar horários específicos". Migração:

- Nova tabela `teacher_availability_slots(id, teacher_id, starts_at timestamptz, duration_min int default 60, status enum('available','blocked'), created_at)`.
- Índice único `(teacher_id, starts_at)`.
- RLS: professor lê/escreve os próprios; `anon`/`authenticated` faz SELECT apenas de `status='available'` no futuro.
- Manter `teacher_availability` antiga por enquanto (não referenciada pela UI nova) — remoção em migração posterior quando confirmarmos que nada mais lê.
- Um slot fica "ocupado" quando existe uma `lessons` com `scheduled_at = slot.starts_at` e status ativo (`scheduled`/`confirmed`). Não duplicamos estado no slot; magenta na UI = derivado do JOIN.

## 2. Server functions

Atualizar `src/lib/teacher.functions.ts`:
- `getTeacherAvailabilityRange({ from, to })` → devolve slots + lessons naquele intervalo.
- `setSlot({ starts_at, state })` → upsert/delete conforme available/blocked/off. Rejeita se o slot já tem lesson ativa.

Atualizar `src/lib/booking.functions.ts`:
- `getAvailableSlotsRange({ from, to })` → slots available do único professor, excluindo os já reservados.
- `bookLesson({ starts_at })` mantém, mas passa a validar contra a nova tabela.
- `getPreviousLessonsNotes({ studentId, limit=3 })` para a página da aula.

Janela de agendamento: derivada server-side como "hoje até o último dia do mês (hoje + 2 meses)". Aplicada em `getAvailableSlotsRange` e em `setSlot`.

## 3. Agenda do professor (`/teacher/agendamento`)

- Cabeçalho com navegação `‹ semana anterior / semana atual (Dom DD/MM – Sáb DD/MM) / próxima ›`, limitada à janela.
- Grid 24×7, cabeçalho só com dias (Dom–Sáb) + data. Sem coluna "hora" isolada — hora aparece dentro de cada célula (`08:00` no canto do box).
- Estados por célula: off (borda hair), available (ciano), blocked (violeta), booked (magenta, não clicável, link para `/lessons/:id`).
- Clique cicla off→available→blocked→off. Booked não cicla.

## 4. Agendar aula (`/schedule` e `/jp/schedule`)

- Mesma grade semanal, mesma navegação, mesma janela.
- Só exibe células `available` (não mostra blocked/off do professor).
- Célula clicável seleciona; botão "Agendar" abre modal:
  - Texto conforme spec (PT/JP).
  - "Sim" → chama `bookLesson`, sucesso muda modal para "Agendamento finalizado" com botões `Agendar outra aula` / `Dashboard`.
  - Erro (sem crédito, slot tomado) → mostra mensagem no modal.
- Consome `getAvailableSlotsRange` real (remove mocks da SchedulePage).

## 5. Página da aula (`/lessons/:id`, `/jp/lessons/:id`)

Reorganizar `LessonDetailPage`:
- Header: data, horário (JST), duração 50 min.
- Card "Professor": nome/bio/foto de `teacher_profiles`.
- Card "Notas de aulas anteriores": últimas 3 do mesmo aluno com o mesmo professor, colapsado com scroll curto + botão "Ver histórico completo" que expande para todas.
- Link Zoom (quando presente).
- Chat polling 5s (mantém).
- Ações aluno: Cancelar (backend já aplica regra 6h; UI mostra aviso).
- Ações professor: Finalizar / Cancelar / No-show — cada uma com campos `feedback` e `vocabulary` (obrigatórios em Finalizar, opcionais nas outras).
- Traduzir strings para JP via dicionário em `i18n.ts`.

## 6. Dashboard do aluno

Novo `AppShell` com **sidebar esquerda** (só para role student) contendo: Dashboard, Créditos, Aulas, Perfil. Remover as labels "01/02/…".

Página `/dashboard`:
- Card "Créditos totais" — número + botão "Comprar mais" → `/credits`.
- Card "Próxima aula" — data/hora/modo + `Acessar Zoom` (se houver `meet_url`) + `Ver mais` → `/lessons/:id`.
- Card "Agendar aula" — CTA → `/schedule`.

Criar `/lessons` (lista aluno: próximas + histórico) e `/perfil` (edição) se ainda não existirem em versão limpa.

## 7. Dashboard do professor

- `AppShell` para role teacher/admin usa **apenas** `teacher_menu` (Dashboard, Aulas, Agendamento, Perfil). Remover completamente os itens de aluno (Dashboard/Créditos/Aulas/Agendar/Perfil "01–05").
- Nenhuma referência a créditos na UI do professor (nem card, nem menu, nem link "Comprar mais").
- Rotas de aluno acessadas por conta de teacher redirecionam ao `/teacher/dashboard`.

## 8. Espelho JP

Rotas em `/jp/*` para: dashboard, credits, schedule, lessons/:id, perfil, aulas. Reutilizam os mesmos componentes de página, passando `lang="jp"` e dicionários em `src/lib/i18n.ts`. Professor não ganha espelho JP.

## 9. Landing — valores

`src/components/landing/landing-content.ts` (PT + JP):
- Unitária ¥2.800 — expira em **20 dias** (atualmente 30).
- 5 aulas ¥13.000 — 45 dias.
- 10 aulas ¥24.000 — 90 dias.

Também atualizar a `credit_purchases`/produtos do Stripe? **Fora do escopo desta rodada** (mexe em backend/Stripe que você quer testar depois). Apenas ajusto o texto exibido — os produtos reais no Stripe você atualiza quando for testar checkout.

## 10. Fora do escopo (confirmar depois)

- Job de expiração automática de `credit_lots` (cron) — a validade já é gravada; auto-marcar `expired` fica para outra rodada.
- Remoção da tabela `teacher_availability` legada.
- Atualização dos produtos no Stripe para refletir 20 dias.

## Ordem de execução

1. Migração `teacher_availability_slots` + policies.
2. Server fns novas (teacher/booking/notes).
3. Teacher agenda (grid com datas + navegação).
4. Schedule aluno (grid real + modal).
5. AppShell dividido por role + sidebar aluno.
6. Dashboard aluno reformulado.
7. LessonDetailPage reorganizada + i18n JP.
8. Rotas JP faltantes.
9. Landing: valores.
