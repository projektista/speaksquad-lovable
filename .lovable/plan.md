
# Próximos passos para o deploy do SpeakSquad

## Contexto importante (leia antes)

Os documentos que você enviou (`BACKEND_API.md`, `INFRAESTRUTURA.md`, `SCHEMA.md`, `STRIPE.md`, `ACESSOS_E_CREDENCIAIS.md`) descrevem uma arquitetura **anterior**:

- Frontend estático (HTML puro) na Vercel
- Backend Express separado no Render
- Supabase próprio (projeto `speaksquad` em Tóquio)

O **projeto atual no Lovable é diferente**:

- **TanStack Start** (React 19 + Vite 7) — SSR/full-stack num único app
- **Lovable Cloud** já ativado (Supabase gerenciado pelo Lovable, não é o mesmo projeto Supabase antigo)
- Backend vive dentro do próprio app como *server functions* — **não precisa mais** de um serviço Express separado no Render

Ou seja: a stack ficou mais simples. Você pode **descontinuar Render + backend Express** e **descontinuar o Supabase antigo** — o Lovable Cloud cobre auth + banco + funções de servidor.

Antes de seguir, precisamos alinhar duas decisões (respondo depois na próxima mensagem):

1. **Migrar dados do Supabase antigo** para o Lovable Cloud, ou começar limpo (o projeto ainda não tem alunos reais)?
2. **Onde hospedar?** As opções realistas para TanStack Start com SSR:
   - **Cloudflare Workers** (preset padrão do template, sem cold start, free tier generoso) — recomendado
   - **Vercel** (funciona, mas exige trocar o preset do Nitro para `vercel`)
   - **Publicar via Lovable** (`*.lovable.app`, um clique, sem GitHub/Vercel)

## Roteiro (independente da hospedagem escolhida)

### 1. Preparar o schema no Lovable Cloud
Aplicar as tabelas do `schema_completo.sql` como migrations do Lovable Cloud, adaptando:
- Trocar `role` na tabela `profiles` por uma tabela `user_roles` + enum `app_role` + função `has_role()` (padrão de segurança do Lovable — evita escalonamento de privilégio)
- Adicionar `GRANT` explícitos em todas as tabelas do schema `public` (obrigatório no Lovable Cloud)
- Manter RLS, triggers de `updated_at`, e a função `is_admin()` reescrita em cima de `has_role()`

### 2. Autenticação
- Ativar email/senha no Lovable Cloud Auth
- Página `/signup` e `/login` já existem — ligar aos hooks do Supabase client já gerado (`@/integrations/supabase/client`)
- Trigger no signup para criar `profiles` + `credits` zerados automaticamente

### 3. Server functions (substituem o backend Express)
Reimplementar cada rota do `BACKEND_API.md` como `createServerFn` em `src/lib/`:
- `getMe` / `updateMe` — perfil + créditos (com `requireSupabaseAuth`)
- `listAvailability` / `bookLesson` / `cancelLesson`
- `createCheckoutSession` (Stripe) — usa server function
- Webhook do Stripe → rota pública em `src/routes/api/public/stripe-webhook.ts` com verificação de assinatura

### 4. Stripe
- Guardar `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` via `add_secret` (secrets do Lovable Cloud, não `.env`)
- Criar os 3 produtos (¥2.000, ¥8.500, ¥14.000) direto no dashboard Stripe
- Publishable key vai como `VITE_STRIPE_PUBLISHABLE_KEY` no código

### 5. SEO e i18n
- A rota `/jp` já existe — garantir `hreflang` no `head()` de cada rota (pt-BR ↔ ja ↔ x-default)
- Preencher `title`/`description`/`og:*` em cada rota (hoje só o root está setado)

### 6. Hospedagem
Depois de tudo acima, publicar:
- **Se Lovable:** botão Publish (já configurado) → sai em `speaksquad.lovable.app` em ~1 min. Depois conecta domínio custom em Project Settings → Domains.
- **Se Cloudflare/Vercel:** o GitHub sync já está de pé; basta importar o repo lá e configurar env vars (as mesmas secrets do Lovable Cloud precisam ser replicadas no provedor).

### 7. Domínio
Comprar/apontar o domínio final (ex.: `speaksquad.com` ou `.jp`) — configuração de DNS depende do provedor escolhido no passo 6.

## Perguntas para você antes de eu montar o plano definitivo

1. **Migrar dados do Supabase antigo** ou começar do zero no Lovable Cloud?
2. **Onde hospedar:** Lovable (mais simples), Cloudflare Workers (recomendado técnico) ou Vercel (o que estava planejado)?
3. **Stripe:** já quer integrar agora ou deixar para depois do MVP no ar?
