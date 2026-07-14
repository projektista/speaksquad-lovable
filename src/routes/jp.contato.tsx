import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionLabel } from "@/components/fx/section-label";
import { Reveal } from "@/components/fx/reveal";
import { BracketFrame } from "@/components/fx/bracket-frame";
import { ParticleField } from "@/components/fx/particle-field";

export const Route = createFileRoute("/jp/contato")({
  head: () => ({
    meta: [
      { title: "お問い合わせ — SpeakSquad" },
      {
        name: "description",
        content:
          "SpeakSquadへのお問い合わせ。MinecraftとFortniteを使った英会話レッスンについてご質問ください。",
      },
      { property: "og:title", content: "お問い合わせ — SpeakSquad" },
      {
        property: "og:description",
        content: "SpeakSquadへのお問い合わせ。初回体験前のご質問にお答えします。",
      },
    ],
  }),
  component: ContatoJP,
});

function ContatoJP() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-bg text-foreground" lang="ja">
      <SiteHeader lang="jp" />
      <section className="section-glow-cyan hero-aurora bg-noise relative overflow-hidden">
        <ParticleField density={28} />
        <div className="relative mx-auto max-w-5xl px-5 py-16 md:py-24">
          <Reveal variant="fade">
            <SectionLabel n="00">お問い合わせ</SectionLabel>
          </Reveal>
          <Reveal delay={80} variant="clip">
            <h1 className="glitch-rgb mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
              <span style={{ color: "#f7fafc" }}>今すぐ</span>{" "}
              <span style={{ color: "#00d9ff" }}>お話し</span>{" "}
              <span style={{ color: "#ff006e" }}>しましょう</span>。
            </h1>
          </Reveal>
          <Reveal delay={140} variant="fade-up">
            <p className="mt-6 max-w-xl text-soft">
              メソッド、予約、料金についてご質問がありますか?下記からご連絡ください。24時間以内にお返事します。
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_320px]">
            <Reveal delay={160} variant="slide-left">
              <BracketFrame className="card-tilt p-6">
                {sent ? (
                  <div className="py-8 text-center font-mono-alt text-sm text-success">
                    ✓ 送信完了。ありがとうございます。近日中にご返信いたします。
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                  >
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">お名前</span>
                      <input
                        required
                        className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder="お名前"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">メール</span>
                      <input
                        type="email"
                        required
                        className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder="your@email.com"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">件名</span>
                      <input
                        className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder="例: 料金プランについて"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">メッセージ</span>
                      <textarea
                        required
                        rows={6}
                        className="mt-2 w-full resize-y rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder="メッセージをご入力ください..."
                      />
                    </label>
                    <button type="submit" className="btn-primary btn-shine w-full justify-center">
                      送信する
                    </button>
                  </form>
                )}
              </BracketFrame>
            </Reveal>

            <Reveal delay={220} variant="slide-right">
              <div className="space-y-6 font-mono-alt text-sm">
                <div className="card-hair card-tilt p-5">
                  <div className="text-xs uppercase tracking-widest text-violet">メール</div>
                  <div className="mt-2 break-all text-soft">contato@speaksquad.jp</div>
                </div>
                <div className="card-hair card-tilt p-5">
                  <div className="text-xs uppercase tracking-widest text-violet">受付時間</div>
                  <div className="mt-2 text-soft">月〜金 · 10:00–20:00 (JST)</div>
                </div>
                <div className="card-hair card-tilt p-5">
                  <div className="text-xs uppercase tracking-widest text-violet">拠点</div>
                  <div className="mt-2 text-soft">東京 · 日本</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <SiteFooter lang="jp" />
    </div>
  );
}