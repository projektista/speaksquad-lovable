import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionLabel } from "@/components/fx/section-label";
import { TypingText } from "@/components/fx/typing-text";
import { Reveal } from "@/components/fx/reveal";
import { ParticleField } from "@/components/fx/particle-field";
import { BracketFrame } from "@/components/fx/bracket-frame";
import { GlitchText } from "@/components/fx/glitch-text";
import { useState } from "react";

export const Route = createFileRoute("/jp")({
  head: () => ({
    meta: [
      { title: "SpeakSquad — ゲームで英語を身につける" },
      {
        name: "description",
        content:
          "MinecraftとFortniteで学ぶ、日本語がわかる先生とのマンツーマン英会話。初回50分無料。東京。",
      },
      { property: "og:title", content: "SpeakSquad — Level Up Your English" },
      {
        property: "og:description",
        content:
          "ゲームで学ぶマンツーマン英会話。同じ先生が最後まで担当。初回無料。",
      },
    ],
    links: [
      { rel: "alternate", hrefLang: "pt-BR", href: "/" },
      { rel: "alternate", hrefLang: "ja", href: "/jp" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: LandingJP,
});

const featuresJP = [
  { t: "専任講師", d: "同じ先生が最後まで担当。生徒のレベル・好きなゲーム・進み具合を把握したうえで指導します。" },
  { t: "本物の会話", d: "文法や規則の暗記ではなく、ゲームの中で英語を使います。指示、戦略、リアクション。" },
  { t: "進捗の記録", d: "毎回のレッスンで学んだ語彙と課題をレポートで共有。何を身につけたかが明確です。" },
  { t: "安心できる環境", d: "間違えても大丈夫。リラックスした雰囲気で自分を表現する練習ができます。" },
  { t: "楽しさが第一", d: "楽しく学ぶことが目的。講師自身もゲームが好きなので、レッスンは自然と盛り上がります。" },
  { t: "シンプル", d: "登録・クレジット購入(1クレジット = 1レッスン)・予約。それだけです。" },
];

const fluxoJP = [
  { n: "01", t: "導入", d: "リラックスした会話から始めます。前回の復習と、今回の焦点を確認します。" },
  { n: "02", t: "ゲームプレイ", d: "ゲーム中に、状況に合った英語表現を自然に教えていきます。" },
  { n: "03", t: "復習", d: "使った表現を繰り返し、難しかった部分に絞って自信をつけて終わります。" },
];

const passosJP = [
  { n: "STEP 1", t: "登録", d: "名前・メール・パスワードでアカウントを作成。" },
  { n: "STEP 2", t: "プロフィール", d: "希望のゲームと自己紹介を入力。" },
  { n: "STEP 3", t: "予約", d: "都合のいい時間を選択。" },
  { n: "STEP 4", t: "レッスン", d: "Zoomでレッスン開始。無料体験を楽しんでください。" },
];

const pricingJP = [
  { name: "単発", price: "¥2.000", per: "1レッスン", features: ["50分レッスン × 1", "有効期限なし", "柔軟な予約"], footer: "契約なし。入会金なし。", featured: false, save: null },
  { name: "5回パック", price: "¥8.500", per: "1回あたり ¥1.700", save: "15%オフ", features: ["50分レッスン × 5", "有効期限なし", "柔軟な予約", "優先予約"], footer: "まずは無料体験から。", featured: true },
  { name: "10回パック", price: "¥14.000", per: "1回あたり ¥1.400", save: "30%オフ", features: ["50分レッスン × 10", "有効期限なし", "柔軟な予約", "優先予約"], footer: "契約なし。隠れた費用なし。", featured: false },
];

const requisitosJP = [
  { t: "ゲーム(インストール済み)", o: "PCまたはコンソール" },
  { t: "Zoom", o: "先生とのビデオ通話用" },
  { t: "PC・タブレット・スマホ", o: "どれでも可" },
  { t: "マイク付きヘッドフォン", o: "任意ですが推奨" },
];

const faqJP = [
  { q: "英語が全く話せなくても大丈夫ですか?", a: "はい。初心者から上級者まで対応します。無料体験でレベルを確認し、進度を調整します。" },
  { q: "クレジットに有効期限はありますか?", a: "ありません。購入したクレジットは期限なくいつでもご利用いただけます。" },
  { q: "予約のキャンセル・変更はできますか?", a: "予約時に案内する期限内であれば可能です。直前のキャンセルはクレジットを消費します。" },
  { q: "兄弟で一緒にレッスンできますか?", a: "個別レッスンを推奨します。兄弟だと日本語で話してしまい、英語練習の時間が減る傾向があります。" },
  { q: "無料体験の前にゲームを買う必要はありますか?", a: "はい。MinecraftまたはFortniteをインストール済みの状態でご参加ください。" },
  { q: "支払い方法は?", a: "Stripe決済です。カード情報はSpeakSquadに保存されません。" },
];

function LandingJP() {
  return (
    <div className="min-h-screen bg-bg text-foreground" lang="ja">
      <SiteHeader lang="jp" />
      <HeroJP />
      <MetodoJP />
      <FeaturesJP />
      <FluxoJP />
      <GratisJP />
      <PricingJP />
      <RequisitosJP />
      <SobreJP />
      <CTAJP />
      <FAQJP />
      <SiteFooter lang="jp" />
    </div>
  );
}

function HeroJP() {
  return (
    <section className="relative overflow-hidden">
      <ParticleField density={36} />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.2fr_0.8fr] md:pb-24 md:pt-20">
        <div>
          <SectionLabel n="00">
            <span className="text-magenta">&gt;_</span> LEVEL UP YOUR ENGLISH
          </SectionLabel>
          <h1 className="mt-5 font-display text-4xl leading-[1.1] md:text-6xl">
            <span className="block">ゲームで、</span>
            <span className="block">
              <span className="text-cyan">
                <TypingText text="英語を身につける" speed={100} startDelay={350} />
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-soft">
            MinecraftとFortniteを使った、マンツーマンの英会話レッスン。日本語がわかる先生と一緒に、
            楽しみながら本物の会話力を身につけます。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/signup" className="btn-primary">無料体験レッスン</Link>
            <a href="#method" className="btn-outline">メソッドを見る</a>
          </div>
          <p className="mt-4 flex items-center gap-2 font-mono-alt text-xs text-muted">
            <span className="text-success">✓</span> 体験レッスンにクレジットカード不要。
          </p>
          <div className="mt-8 flex flex-wrap gap-2 font-mono-alt text-xs">
            <span className="rounded-[4px] border-hair bg-bg2 px-2.5 py-1 text-soft">Minecraft</span>
            <span className="rounded-[4px] border-hair bg-bg2 px-2.5 py-1 text-soft">Fortnite</span>
            <span className="rounded-[4px] border-hair bg-bg2 px-2.5 py-1 text-soft">Zoom</span>
          </div>
        </div>
        <BracketFrame className="relative p-5">
          <div className="section-label mb-4">// hero_stats</div>
          <div className="space-y-4 font-mono-alt">
            {[
              { v: "1-on-1", l: "同じ先生が担当" },
              { v: "50min", l: "1レッスン" },
              { v: "¥0", l: "初回体験" },
            ].map((s, i) => (
              <Reveal key={s.v} delay={i * 80} className="flex items-baseline justify-between border-b border-hair pb-3">
                <span className="font-display text-2xl text-cyan md:text-3xl">{s.v}</span>
                <span className="text-xs text-muted">{s.l}</span>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between font-mono-alt text-[10px] uppercase tracking-widest text-muted">
            <span>tokyo · jst</span>
            <span className="text-magenta">▊ online</span>
          </div>
        </BracketFrame>
      </div>
      <div className="hair-divider mx-auto max-w-6xl" />
    </section>
  );
}

function MetodoJP() {
  return (
    <section id="method" className="section-glow-cyan mx-auto max-w-6xl px-5 py-20">
      <Reveal><SectionLabel n="01">メソッド</SectionLabel></Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          好きなことなら、<span className="text-cyan">続く</span>。
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Reveal delay={120}>
          <p className="text-soft">
            嫌なことを無理に続けるのは大変です。すでに好きなことなら、習慣にしやすい。
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-soft">
            ゲームを通した英会話は、生徒がすでに楽しんでいる時間を、英語力を伸ばす時間に変えます。
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturesJP() {
  return (
    <section className="section-glow-magenta section-scanlines border-t border-hair bg-bg2/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><SectionLabel n="02">特長</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            暗記ではなく、<span className="text-magenta">話す</span>ことで学ぶ。
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featuresJP.map((f, i) => (
            <Reveal key={f.t} delay={i * 60}>
              <div className="card-hair h-full p-6">
                <div className="font-mono-alt text-xs text-muted">0{i + 1}</div>
                <h3 className="mt-2 font-display text-lg"><GlitchText>{f.t}</GlitchText></h3>
                <p className="mt-3 text-sm leading-relaxed text-soft">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FluxoJP() {
  return (
    <section className="section-glow-violet mx-auto max-w-6xl px-5 py-20">
      <Reveal><SectionLabel n="03">レッスンの流れ</SectionLabel></Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 font-display text-3xl md:text-5xl">3つのパート。</h2>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {fluxoJP.map((f, i) => (
          <Reveal key={f.n} delay={i * 100}>
            <div className="card-hair relative h-full overflow-hidden p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 font-display text-[6rem] leading-none text-[color:var(--bg3)]"
              >
                {f.n}
              </div>
              <div className="relative">
                <div className="font-mono-alt text-xs text-violet">PART {f.n}</div>
                <h3 className="mt-2 font-display text-xl text-cyan">{f.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-soft">{f.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GratisJP() {
  return (
    <section className="section-glow-cyan section-scanlines border-t border-hair bg-bg2/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><SectionLabel n="04">流れ</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            初回レッスンは<span className="text-cyan">無料</span>。
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {passosJP.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <div className="card-hair h-full p-5">
                <div className="font-mono-alt text-[11px] tracking-widest text-violet">{p.n}</div>
                <h3 className="mt-2 font-display text-lg text-cyan">{p.t}</h3>
                <p className="mt-2 text-sm text-soft">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingJP() {
  return (
    <section className="section-glow-magenta mx-auto max-w-6xl px-5 py-20">
      <Reveal><SectionLabel n="05">料金</SectionLabel></Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          シンプル。<span className="text-magenta">隠れた費用なし。</span>
        </h2>
      </Reveal>
      <p className="mt-4 max-w-2xl text-soft">
        1クレジット = 50分レッスン1回。必要な分だけ購入できます。
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {pricingJP.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <div className={`card-hair relative flex h-full flex-col p-6 ${p.featured ? "border-[color:var(--cyan)]" : ""}`}>
              {p.featured && (
                <div className="absolute -top-3 left-4 rounded-[3px] border border-[color:var(--magenta)] bg-bg px-2 py-0.5 font-mono-alt text-[10px] uppercase tracking-widest text-magenta">
                  [ 人気 ]
                </div>
              )}
              <div className="font-mono-alt text-xs uppercase tracking-widest text-muted">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono-alt text-4xl font-semibold text-foreground">
                  <span className="text-magenta">¥</span>{p.price.replace("¥", "")}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted">
                <span className="text-success">{p.per}</span>
                {p.save && <span className="ml-2 text-magenta">// {p.save}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-2 font-mono-alt text-sm">
                {p.features.map((it) => (
                  <li key={it} className="flex items-start gap-2 border-b border-hair pb-2">
                    <span className="text-success">✓</span>
                    <span className="text-soft">{it}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`mt-6 w-full ${p.featured ? "btn-primary" : "btn-outline"}`}>
                購入する
              </Link>
              <div className="mt-3 text-center font-mono-alt text-[11px] text-muted">{p.footer}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RequisitosJP() {
  return (
    <section className="section-glow-violet border-t border-hair bg-bg2/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><SectionLabel n="06">準備するもの</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 font-display text-3xl md:text-5xl">
            必要なものは<span className="text-cyan">シンプル</span>。
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {requisitosJP.map((r, i) => (
            <Reveal key={r.t} delay={i * 60}>
              <div className="card-hair flex items-start gap-4 p-5">
                <span className="mt-0.5 font-mono-alt text-xs text-cyan">[{String(i + 1).padStart(2, "0")}]</span>
                <div>
                  <div className="font-display text-base">{r.t}</div>
                  <div className="mt-1 font-mono-alt text-xs text-muted">{r.o}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SobreJP() {
  return (
    <section className="section-glow-cyan mx-auto max-w-6xl px-5 py-20">
      <Reveal><SectionLabel n="07">紹介</SectionLabel></Reveal>
      <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr] md:gap-12">
        <Reveal>
          <BracketFrame className="p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-hair2 bg-bg3 text-4xl">🎮</div>
            <div className="mt-4 font-display text-xl">Hugo(ヒューゴ)</div>
            <div className="mt-1 font-mono-alt text-xs text-muted">創設者 · speaksquad</div>
            <div className="mt-4 font-mono-alt text-[10px] uppercase tracking-widest text-cyan">[ tokyo · jst ]</div>
          </BracketFrame>
        </Reveal>
        <Reveal delay={100}>
          <div className="space-y-4 text-soft">
            <p>
              SpeakSquadは、ブラジル出身で東京在住の講師Hugoが立ち上げました。日本語が理解できる講師として、日本の家庭の文化や習慣を尊重しながらレッスンを提供します。
            </p>
            <p>
              「ネイティブ講師」を売りにするサービスは多いですが、私はネイティブではありません。その代わり、生徒の背景と目標を理解し、続けられる形で英語力を伸ばすことに専念します。
            </p>
            <p>
              レッスンを担当するのは私自身です。アプリでもAIでもなく、生徒一人ひとりの進歩に責任を持つ人間が教えます。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTAJP() {
  return (
    <section className="relative overflow-hidden border-y border-hair bg-bg2/40">
      <ParticleField density={30} />
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center">
        <Reveal><SectionLabel n="08">興味がありますか?</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 font-display text-3xl md:text-5xl">
            初回<span className="text-cyan">無料レッスン</span>を予約。
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-4 max-w-xl text-soft">
            複雑な登録も、隠れた課金もありません。50分の本物のレッスン。続けるかはその後で。
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8">
            <Link to="/signup" className="btn-primary">体験レッスンを予約</Link>
          </div>
        </Reveal>
        <p className="mt-6 font-mono-alt text-xs text-muted">
          日本国内の子ども・ティーン向け。<br />
          Zoom · Minecraft / Fortnite · JST.
        </p>
      </div>
    </section>
  );
}

function FAQJP() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-20">
      <Reveal><SectionLabel n="09">よくある質問</SectionLabel></Reveal>
      <Reveal delay={80}><h2 className="mt-4 font-display text-3xl md:text-5xl">FAQ</h2></Reveal>
      <div className="mt-8 space-y-2">
        {faqJP.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="card-hair overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-base">{f.q}</span>
                <span className={`font-mono-alt text-cyan transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className="grid transition-[grid-template-rows] duration-300" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-4 text-sm leading-relaxed text-soft">{f.a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}