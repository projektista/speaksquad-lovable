# Deploy no Vercel

Este projeto está configurado para gerar output no formato Vercel (via `nitro: { preset: "vercel" }` em `vite.config.ts`). O backend (Supabase) continua rodando no Lovable Cloud — apenas o frontend + server functions são hospedados no Vercel.

## 1. Conectar repositório
1. Crie um projeto no Vercel apontando para este repo.
2. Framework Preset: **Other** (deixe em branco).
3. Build Command: `bun run build`.
4. Install Command: `bun install`.
5. Output Directory: deixe em branco (Nitro emite `.vercel/output`).

## 2. Variáveis de ambiente necessárias

No Vercel → Project Settings → Environment Variables, adicione todas em **Production** e **Preview**:

### Supabase (seu projeto próprio)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Stripe (sua conta própria)
- `STRIPE_SECRET_KEY` (`sk_test_...` em preview / `sk_live_...` em produção)
- `STRIPE_WEBHOOK_SECRET` (`whsec_...`)
- `VITE_STRIPE_PUBLISHABLE_KEY` (`pk_test_...` / `pk_live_...`)

## 3. Webhook do Stripe
Depois do primeiro deploy, aponte o webhook do Stripe (Developers → Webhooks) para:

```
https://SEU-DOMINIO.vercel.app/api/public/payments/webhook
```

A rota agora ignora o parâmetro `?env=`; o ambiente é definido pela chave `STRIPE_SECRET_KEY` que estiver configurada no deploy.

## 4. Domínio custom
Configure em Vercel → Domains como de costume.

## Observações
- O backend Supabase (banco, auth, storage) continua no Lovable Cloud — não precisa migrar nada.
- Se quiser sair do Lovable Cloud no futuro, será preciso exportar o banco e reconfigurar as chaves.
- O runtime das server functions no Vercel é Node 20 (Edge Runtime não é usado).