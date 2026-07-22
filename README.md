# SpeakSquad

Plataforma de ensino de idiomas — aulas ao vivo, prática guiada e comunidade para acelerar sua fluência.

## Stack

- **Framework:** TanStack Start (React 19 + Vite 7)
- **Estilo:** Tailwind CSS v4
- **Componentes:** shadcn/ui
- **Backend:** Supabase próprio (self-managed) + Stripe próprio via SDK oficial
- **Deploy alvo:** Vercel (via GitHub)

## Desenvolvimento local

```bash
bun install
bun run dev
```

Acesse `http://localhost:8080`.

### Scripts

- `bun run dev` — servidor de desenvolvimento
- `bun run build` — build de produção
- `bun run start` — servir o build

## Deploy no Vercel

1. Faça push deste repositório para o GitHub (a sincronização do Lovable já cuida disso automaticamente).
2. No Vercel: **Add New Project → Import Git Repository** e selecione o repo.
3. Framework Preset: **Other** (Vercel detecta Vite/TanStack automaticamente).
4. Build Command: `bun run build`
5. Output Directory: `.output/public` (padrão do Nitro/TanStack Start)
6. Configure as variáveis de ambiente necessárias (`VITE_*` públicas e segredos de servidor).
7. Deploy.

> Observação: o template usa Nitro com preset Cloudflare por padrão. Para produção 100% Vercel-native, ajuste o preset do Nitro para `vercel` em `vite.config.ts` se precisar de funções serverless no runtime da Vercel.

## Estrutura

```
src/
  routes/         # rotas file-based do TanStack Router
  components/     # componentes de UI e layout
  lib/            # utilitários e server functions
  styles.css      # tokens de design + Tailwind v4
```

## Licença

Todos os direitos reservados © SpeakSquad.