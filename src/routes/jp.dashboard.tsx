import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";

export const Route = createFileRoute("/jp/dashboard")({
  head: () => ({
    meta: [
      { title: "ダッシュボード — SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardJP,
});

function DashboardJP() {
  return (
    <AppShell lang="jp" title="ダッシュボード" subtitle="あなたのコントロールパネル。" credits={3}>
      <div className="grid gap-4 md:grid-cols-3">
        <Reveal>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">残りクレジット</div>
            <div className="mt-2 font-display text-4xl text-cyan">3</div>
            <Link to="/jp/credits" className="btn-outline mt-4 w-full !py-2 text-xs">追加購入</Link>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">次のレッスン</div>
            <div className="mt-2 font-display text-lg">火 · 7月15日</div>
            <div className="font-mono-alt text-sm text-cyan">18:00 JST</div>
            <div className="mt-1 font-mono-alt text-xs text-muted">Minecraft · Survival</div>
            <Link to="/jp/schedule" className="btn-outline mt-4 w-full !py-2 text-xs">詳細を見る</Link>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">合計レッスン数</div>
            <div className="mt-2 font-display text-4xl">12</div>
            <Link to="/jp/lessons" className="btn-outline mt-4 w-full !py-2 text-xs">履歴</Link>
          </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="card-hair mt-8 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <div className="section-label">// next_step</div>
            <h2 className="mt-2 font-display text-xl">次のレッスンを予約しますか?</h2>
            <p className="mt-1 text-sm text-muted">
              今週の空き時間からお選びください。
            </p>
          </div>
          <Link to="/jp/schedule" className="btn-primary">レッスンを予約</Link>
        </div>
      </Reveal>
    </AppShell>
  );
}