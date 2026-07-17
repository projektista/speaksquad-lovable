# Migração para infraestrutura própria (Supabase + Stripe + Vercel)

Este documento descreve os passos que **você** precisa executar fora do editor do Lovable para tirar o projeto do Lovable Cloud e do gateway de Stripe da Lovable, e passar tudo para infraestrutura sua. Depois que essas etapas estiverem prontas, o agente do editor executa a Fase 4 (reescrita do código) num único turno.

---

## Fase 0 — Backup do estado atual

Antes de desconectar qualquer coisa:

1. **Exportar dados de todas as tabelas** via editor do Lovable → **Cloud → Advanced → Export data**. Baixe um CSV por tabela mesmo que esteja vazia (é a única forma suportada — `pg_dump` completo não é permitido no Lovable Cloud).
   - Tabelas atuais: `availability_exceptions`, `credit_lots`, `credit_purchases`, `credit_transactions`, `lesson_messages`, `lessons`, `profiles`, `teacher_availability`, `user_roles`.
   - Snapshot atual: apenas `profiles` (1 linha) e `user_roles` (3 linhas) têm dados. Os JSONs desses dois já foram exportados em `data_profiles.jsonl` e `data_user_roles.jsonl`.
2. **Anotar os UUIDs dos usuários em `auth.users`**. Rode no SQL Editor do Lovable Cloud:
   ```sql
   SELECT id, email, created_at FROM auth.users;
   ```
   Guarde a lista — você vai recriar esses usuários no seu Supabase novo (senhas hashadas **não** são exportáveis pelo Lovable Cloud, porque `SUPABASE_SERVICE_ROLE_KEY` não é exposto para você).

---

## Fase 1 — Criar sua conta Supabase própria

1. Criar conta em https://supabase.com e criar um novo projeto (região próxima aos usuários).
2. Anotar em **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL` e `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**secreto**, só backend)
3. Abrir o **SQL Editor** e rodar `schema.sql` (arquivo entregue junto). Contém, em ordem: enums, tabelas, functions (`has_role`, `handle_new_user`, `reserve_credit_lot`, `consume_credit_lot`, `release_credit_lot`, `grant_founder_roles`, `set_updated_at`), triggers, RLS policies e GRANTs.
4. Recriar os usuários de `auth.users` em **Authentication → Users → Add user**. Mantenha os UUIDs originais — `profiles` e `user_roles` referenciam `auth.users.id`.
5. Importar `data_profiles.jsonl` e `data_user_roles.jsonl` via SQL Editor com `INSERT ... FROM json_populate_recordset(...)`.

---

## Fase 2 — Criar sua conta Stripe própria

1. Criar conta em https://stripe.com.
2. **Test mode**: Dashboard → Developers → API keys → `sk_test_...` e `pk_test_...`.
3. **Live mode** (após ativar a conta): `sk_live_...` e `pk_live_...`.
4. Recriar os produtos/preços no Dashboard → Products. `lookup_key` exatos:
   - `credit_single` — 2800 JPY (1 crédito, 30 dias)
   - `credit_pack5` — 13000 JPY (5 créditos, 45 dias)
   - `credit_pack10` — 24000 JPY (10 créditos, 90 dias)
5. Webhook em Dashboard → Developers → Webhooks → Add endpoint:
   - URL: `https://SEU-DOMINIO.vercel.app/api/public/payments/webhook?env=live` (e outro `?env=sandbox` para test mode)
   - Eventos: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
   - `Signing secret` (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

---

## Fase 3 — Desconectar o Lovable Cloud

**Irreversível.** Só faça depois que Fase 1 e Fase 2 estiverem prontas.

Editor → **Cloud → Advanced → Disconnect**. Isso apaga o banco atual do Lovable Cloud e libera as variáveis `VITE_SUPABASE_*` gerenciadas.

Aviso ao agente após:
> "Cloud desconectado. Credenciais novas prontas."

---

## Fase 4 — Reescrita do código (agente executa)

Num único turno, o agente vai:

- reescrever `src/lib/stripe.server.ts` com SDK oficial (`new Stripe(process.env.STRIPE_SECRET_KEY)`), sem gateway
- reescrever `src/lib/payments.functions.ts` (sem `X-Connection-Api-Key` / `Lovable-API-Key`)
- reescrever `src/routes/api/public/payments/webhook.ts` usando `stripe.webhooks.constructEventAsync` do SDK oficial
- substituir `src/integrations/supabase/client.ts` por client manual lendo `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- substituir `client.server.ts` e `auth-middleware.ts` por versões manuais com `SUPABASE_SERVICE_ROLE_KEY`
- remover toda referência a `LOVABLE_API_KEY` e `connector-gateway.lovable.dev`
- atualizar `vercel.json`

---

## Fase 5 — Deploy no Vercel

1. Push do repo para GitHub.
2. Import em https://vercel.com/new.
3. **Environment Variables** (Production + Preview):

   | Nome | Contexto | Exemplo |
   |---|---|---|
   | `VITE_SUPABASE_URL` | build (frontend) | `https://xxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | build (frontend) | `eyJhbGci...` |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | build (frontend) | `pk_live_...` / `pk_test_...` |
   | `SUPABASE_URL` | runtime | `https://xxx.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | runtime (secreto) | `eyJhbGci...` |
   | `STRIPE_SECRET_KEY` | runtime (secreto) | `sk_live_...` / `sk_test_...` |
   | `STRIPE_WEBHOOK_SECRET` | runtime (secreto) | `whsec_...` |

4. **Não** configurar: `LOVABLE_API_KEY`, `STRIPE_SANDBOX_API_KEY`, `STRIPE_LIVE_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`, `PAYMENTS_LIVE_WEBHOOK_SECRET`. Tudo isso some na Fase 4.
5. Deploy. `vercel.json` + `nitro: { preset: "vercel" }` já estão configurados.
6. Voltar no Stripe Dashboard e atualizar o endpoint do webhook para o domínio Vercel real.

---

## Limitações que o editor do Lovable NÃO consegue contornar

- Não posso criar o projeto Supabase novo por você.
- Não posso migrar `auth.users` com senhas hashadas (`service_role` indisponível no Cloud).
- Não posso editar `src/integrations/supabase/*.ts`, `.env` ou `supabase/config.toml` enquanto o Lovable Cloud estiver ligado neste projeto — o Cloud sobrescreve esses arquivos a cada build.
- Por isso a **Fase 4 só roda depois** do Disconnect da Fase 3.
