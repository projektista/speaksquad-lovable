
# SpeakSquad — Redesign Cyberpunk Editorial

Este plano cobre **apenas design + estrutura de rotas**. Nada de banco, API, auth logic ou pagamentos (você já cuida disso).

## Direção visual

**Vibe: Cyberpunk editorial.** Grid marcado, tipografia mono grande, layouts assimétricos tipo revista tech, neon controlado (não saturado). Nada de gradientes genéricos roxos ou aesthetic "AI-slop".

**Tokens (mantidos do design system atual):**
- Cores: `--cyan #00d9ff`, `--magenta #ff006e`, `--violet #a78bfa`, backgrounds `#0d1117 / #161b22 / #1c2333`, texto `#f7fafc / #f1f5f9`, muted `#8b949e`, success `#00d9a3`, warn `#f0a500`, borders `#21262d / #30363d`
- Fontes carregadas via `<link>` no `__root.tsx`: Space Mono (display), IBM Plex Mono (dados/preços), Atkinson Hyperlegible (body). Noto Sans JP como fallback em `/jp/*`
- Radius: 6px (mantém a estética "hardware", nada arredondado demais)
- Rótulos de seção em violet, mono, uppercase, com prefixo tipo `// MÉTODO_01`

**Assinatura editorial (aplicada de forma consistente):**
- Header slim com bracket-marks (`[ ]`) e cursor piscando no logo
- Números de seção grandes em outline (ex: `01 / 07`) na lateral
- Divisores como linhas tracejadas cyan de baixa opacidade
- Preços renderizados em IBM Plex Mono, tabular-nums, com "¥" destacado em magenta
- Cards com border 1px + hover que revela border-gradient cyan→magenta
- Badges de status estilo terminal: `[ AO_VIVO ]`, `[ CONCLUÍDA ]`

## Animações (intensidade 2 — sutil)

Todas com `prefers-reduced-motion` respeitado. Sem parallax pesado, sem magnetic buttons.

1. **Typing / terminal** — apenas no H1 do hero (PT e JP) e no rótulo de seção do hero; cursor `▊` piscando. Uma vez por sessão, sem loop.
2. **Glitch / RGB split** — micro-glitch cyan/magenta (translate 1-2px) em: hover do logo, hover de títulos de card de jogo (Minecraft/Fortnite), aparição do H1. Duração ≤ 200ms.
3. **Scroll-driven reveals** — `IntersectionObserver` com fade + translateY(12px) para blocos de seção. Encadeamento em stagger de 60ms nos filhos. Usa o scroll-snap existente.
4. **Fundo vivo** — grid cyan 1px já existente + camada de partículas sutis (pontos pequenos flutuando lentamente, opacidade ≤ 0.15) no hero e no CTA final; canvas leve, pausa fora do viewport.

Motion library: **Motion for React** (framer-motion successor) para reveals; canvas raw para partículas; CSS keyframes para glitch/typing.

## Rotas — sistema completo

Todas as páginas serão criadas com o novo visual. Componentes visuais apenas; onde há integração pendente (auth, dados) fica UI + estados vazios/loading/error prontos, sem lógica de backend.

```
src/routes/
  __root.tsx              → shell, fontes, grid bg, header/footer, meta base
  index.tsx               → Landing PT-BR (porta do index.html atual)
  jp.tsx                  → layout /jp com <Outlet/> + lang="ja"
  jp.index.tsx            → Landing JP
  login.tsx
  signup.tsx
  _authenticated.tsx      → layout com sidebar/topbar do aluno
  _authenticated.dashboard.tsx
  _authenticated.schedule.tsx
  _authenticated.booking-confirmed.$id.tsx
  _authenticated.profile.tsx
  _authenticated.lessons.tsx
  _authenticated.lessons.$id.tsx
  _authenticated.credits.tsx
  _admin.tsx              → layout admin
  _admin.admin.index.tsx  → /admin
  _admin.admin.schedule.tsx
  _admin.admin.availability.tsx
  _admin.admin.students.tsx
  _admin.admin.lessons.$id.tsx
  _admin.admin.finance.tsx
```

Cada rota terá seu próprio `head()` com title/description/og únicos. Nada de metadata compartilhada estilo "Lovable App".

## Seções da landing (ordem preservada)

Hero → Método → Diferenciais → Fluxo da aula (3 partes) → Aula grátis → Preço (3 tiers) → Requisitos → Sobre Hugo → CTA final → FAQ. Mesma ordem em PT e JP, conteúdo adaptado (não traduzido).

Switcher de idioma no header com detecção `navigator.language` na primeira visita e escolha manual salva em `localStorage`.

## Componentes compartilhados a criar

```
src/components/
  layout/site-header.tsx        (público: logo + nav + lang switch + CTA)
  layout/site-footer.tsx
  layout/app-shell.tsx          (aluno: sidebar + topbar com créditos)
  layout/admin-shell.tsx
  fx/typing-text.tsx
  fx/glitch-text.tsx
  fx/reveal.tsx                 (wrapper Motion + IO)
  fx/particle-field.tsx         (canvas)
  fx/section-label.tsx          (// MÉTODO_01 em violet)
  fx/bracket-frame.tsx          (moldura [ ] nos cantos)
  ui/price-card.tsx
  ui/game-card.tsx
  ui/lesson-row.tsx
  ui/status-badge.tsx
```

## Detalhes técnicos

- `src/styles.css`: substituir a paleta shadcn default pelos tokens SpeakSquad em `:root` + mapear em `@theme inline`. Dark é o único tema — remover `.dark` variant e forçar dark permanente.
- `__root.tsx`: adicionar `<link>` para Google Fonts (Space Mono, IBM Plex Mono, Atkinson Hyperlegible, Noto Sans JP) e ajustar `html` para `lang="pt-BR"` no default, sobrescrito em `/jp`.
- Instalar `motion` (framer-motion moderno). Sem outras deps.
- `hreflang` alternates injetados no `head()` de `/` e `/jp/`.
- Acessibilidade: `prefers-reduced-motion` desativa typing/glitch/partículas; foco visível cyan; contraste WCAG AA verificado nos pares text/bg.

## O que NÃO está no escopo

- Integração Supabase, RLS, edge functions
- Stripe / créditos reais
- Lógica de agendamento e disponibilidade
- Envio de emails, Zoom links reais

Todos esses ficam como UI shells prontos para você plugar depois.

## Ordem de execução (build mode)

1. Tokens + fontes + `__root.tsx` + shells (header/footer/app/admin)
2. Landing PT (porta fiel do index.html com novo visual e componentes)
3. Landing JP
4. Login + Signup
5. Área do aluno (dashboard, schedule, booking-confirmed, profile, lessons, lessons/:id, credits)
6. Área admin (index, schedule, availability, students, lessons/:id, finance)
7. Passe final de polimento: reveals, glitch nos hovers, partículas, verificação reduced-motion
