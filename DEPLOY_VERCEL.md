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

### Supabase (Lovable Cloud)
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Lovable AI Gateway (para o proxy Stripe)
- `LOVABLE_API_KEY`

### Stripe (sandbox)
- `STRIPE_SANDBOX_API_KEY`
- `PAYMENTS_SANDBOX_WEBHOOK_SECRET`
- `VITE_PAYMENTS_CLIENT_TOKEN`

### Stripe (produção — só após go-live)
- `STRIPE_LIVE_API_KEY`
- `PAYMENTS_LIVE_WEBHOOK_SECRET`

Os valores atuais estão disponíveis no Lovable → Cloud → Secrets (ou peça exportação).

## 3. Webhook do Stripe
Depois do primeiro deploy, atualize a URL do webhook Stripe (dashboard Stripe → Developers → Webhooks) para apontar para:

```
https://SEU-DOMINIO.vercel.app/api/public/payments/webhook?env=sandbox
```

(e o equivalente `?env=live` no webhook de produção).

## 4. Domínio custom
Configure em Vercel → Domains como de costume.

## Observações
- O backend Supabase (banco, auth, storage) continua no Lovable Cloud — não precisa migrar nada.
- Se quiser sair do Lovable Cloud no futuro, será preciso exportar o banco e reconfigurar as chaves.
- O runtime das server functions no Vercel é Node 20 (Edge Runtime não é usado).