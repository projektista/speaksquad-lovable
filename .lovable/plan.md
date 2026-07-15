## Escopo

Substituir o modelo atual (`credits.balance/reserved` como inteiros) por **lotes de créditos com expiração**, ligar Stripe (sandbox) para venda dos 3 pacotes, e completar o fluxo de agendamento com cancelamento 6h + regra de +7 dias no cancelamento pelo professor.

## Pacotes de crédito (Japão, JPY)

| Pacote | Créditos | Preço | Expiração |
|---|---|---|---|
| Aula avulsa | 1 | ¥2.800 | 30 dias |
| Pacote 5 | 5 | ¥13.000 | 45 dias |
| Pacote 10 | 10 | ¥24.000 | 90 dias |

## Modelo de dados (nova migração)

Aposentar `credits.balance/reserved` como fonte da verdade e usar uma tabela de lotes:

- **`credit_lots`** — um registro por crédito unitário. Colunas: `id`, `user_id`, `purchase_id` (fk), `expires_at`, `status` (`available|reserved|consumed|expired|refunded`), `reserved_for_lesson_id?`, `consumed_at?`. Cada compra de N créditos gera N linhas.
- **`credit_purchases`** — `id`, `user_id`, `package_code` (`single|pack5|pack10`), `credits`, `amount_jpy`, `stripe_session_id`, `stripe_payment_intent`, `status` (`pending|paid|refunded`), `expires_at` (data-base do lote).
- **`credit_transactions`** — mantém, agora com `type` incluindo `purchase|consumption|refund|expiration|extension`.
- **Views auxiliares**: `v_user_credit_summary` (available, reserved, next_expiration) para leituras rápidas do dashboard.
- Manter `credits` como cache derivado OU remover — vou remover e ler direto dos lotes via view (menos bugs de sincronização).

**FIFO ao reservar**: `SELECT ... FROM credit_lots WHERE user_id=? AND status='available' ORDER BY expires_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED` → marca `reserved` e grava `reserved_for_lesson_id`.

## Server functions atualizadas

- `bookLesson` — reserva o lote que expira primeiro.
- `cancelLessonAsStudent` — ≥6h: libera o lote (volta a `available` com `expires_at` original). <6h: marca lote como `consumed`, cria transaction `consumption`.
- `cancelLessonAsTeacher` — libera o lote **e estende `expires_at` em +7 dias** a partir de `now()` (ou mantém o original se já for maior). Cria transaction `extension`.
- `markLessonCompleted` — consome o lote reservado.
- `getMyOverview` — passa a devolver `available`, `reserved`, `nextExpiration` (data + qtd que expira nela).

## Página /credits (nova)

- Lista os 3 pacotes com preço e expiração.
- Botão "Comprar" → server fn `createCheckoutSession` (Stripe) → redireciona.
- Aba histórico: transações + lotes ativos com data de expiração destacada (verde >14d, amarelo 7-14d, vermelho <7d).

## Stripe

- Ativar seamless (`enable_stripe_payments`) — Japão, sem full compliance handling (Japão não é suportado); vai como `automatic_tax` (calcula/coleta, você declara).
- 3 produtos criados via `batch_create_product` com tax code apropriado (`txcd_10000000` para digital services).
- Webhook `/api/public/webhooks/stripe`: verifica assinatura, marca `credit_purchases.status='paid'`, gera N linhas em `credit_lots` com `expires_at = paid_at + interval do pacote`, cria transaction `purchase`.

## Expiração + notificação

- **Cron diário 02:00 JST** (`pg_cron` + `pg_net`) chama `/api/public/hooks/expire-credits`:
  - Marca lotes vencidos como `expired`, cria transaction.
  - 7 dias antes / 1 dia antes: enfileira email via Lovable email (Resend nativo do Cloud) — precisa de domínio verificado; enquanto isso manda pra `hugo@` como fallback ou usa remetente padrão do Cloud.
- Alternativa se não quiser configurar email agora: só marca `expired` silenciosamente + banner no dashboard "X créditos expiram em Y dias".

## Admin

- `/admin/students` mostra lotes ativos + próxima expiração por aluno.
- `/admin/finance` soma `purchase` por período em JPY.
- Ação manual "adicionar créditos" (para casos especiais) — cria lote com expiração custom.

## Ordem de execução

1. **Migração** — novo schema de lotes (destrói `credits`, cria `credit_lots`, `credit_purchases`, view).
2. **Server fns** — reescrever `booking.functions.ts` para FIFO; adaptar dashboard.
3. **Stripe** — habilitar, criar produtos, checkout + webhook, página `/credits`.
4. **Cron de expiração** — job + rota + notificação (email fica pra depois se precisar de domínio).
5. **Admin** — visão de lotes por aluno + finanças.

## Perguntas rápidas antes de começar

Nenhuma nova pergunta bloqueante — vou seguir com:
- Email de notificação usando remetente padrão do Lovable Cloud (`notifications@…`) até você configurar domínio próprio.
- Timezone JST em todas as expirações (calculadas em UTC, exibidas em JST).
- Cancelamento pelo professor: `expires_at = GREATEST(expires_at_original, now() + 7 days)`.

Confirma que posso executar nessa ordem?
