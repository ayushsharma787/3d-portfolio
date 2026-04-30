"use client";

import { useEffect, useRef } from "react";
import RaymondMark from "./RaymondMark";

/**
 * Cinematic, scroll-as-timeline experience.
 * - Cursor-reactive light color field on a fixed canvas (z-index: -1).
 * - 6 fullscreen "scenes" pinned via fixed positioning, driven by a single
 *   scroll progress value 0..1.
 * - Light palette only. Dark text on airy backgrounds.
 */
export default function CinematicExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const palette = [
      { h: 32, s: 70, l: 95 },
      { h: 290, s: 55, l: 96 },
      { h: 18, s: 80, l: 94 },
      { h: 150, s: 50, l: 96 },
      { h: 210, s: 60, l: 96 },
      { h: 340, s: 60, l: 96 },
    ];
    const glowHues = [200, 280, 20, 320, 160, 40];

    const mouse = { x: w / 2, y: h / 2, tx: w / 2, ty: h / 2 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let t = 0;
    let raf = 0;
    let sceneIdx = 0;
    let sceneBlend = 0;

    const render = () => {
      t += 0.004;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const a = palette[sceneIdx % palette.length];
      const b = palette[(sceneIdx + 1) % palette.length];
      const lerp = (x: number, y: number, k: number) => x + (y - x) * k;
      const breath = (Math.sin(t * 1.3) + 1) * 0.5;

      const baseH = lerp(a.h, b.h, sceneBlend) + Math.sin(t * 0.7) * 6;
      const baseS = lerp(a.s, b.s, sceneBlend);
      const baseL = lerp(a.l, b.l, sceneBlend) + breath * 1.2;

      const drift1X = w * (0.2 + 0.1 * Math.sin(t * 0.6));
      const drift1Y = h * (0.3 + 0.08 * Math.cos(t * 0.5));
      const drift2X = w * (0.8 + 0.1 * Math.cos(t * 0.4));
      const drift2Y = h * (0.7 + 0.09 * Math.sin(t * 0.7));

      ctx.fillStyle = `hsl(${baseH}, ${baseS}%, ${Math.min(baseL, 99)}%)`;
      ctx.fillRect(0, 0, w, h);

      const g1 = ctx.createRadialGradient(drift1X, drift1Y, 0, drift1X, drift1Y, Math.max(w, h) * 0.7);
      g1.addColorStop(0, `hsla(${baseH + 30}, ${baseS}%, 96%, 0.9)`);
      g1.addColorStop(1, `hsla(${baseH + 30}, ${baseS}%, 96%, 0)`);
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(drift2X, drift2Y, 0, drift2X, drift2Y, Math.max(w, h) * 0.6);
      g2.addColorStop(0, `hsla(${baseH - 40}, ${baseS}%, 95%, 0.85)`);
      g2.addColorStop(1, `hsla(${baseH - 40}, ${baseS}%, 95%, 0)`);
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const glowHue = glowHues[sceneIdx % glowHues.length] + Math.sin(t * 0.9) * 12;
      const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 380);
      glow.addColorStop(0, `hsla(${glowHue}, 80%, 90%, 0.85)`);
      glow.addColorStop(0.45, `hsla(${glowHue}, 80%, 93%, 0.35)`);
      glow.addColorStop(1, `hsla(${glowHue}, 80%, 96%, 0)`);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const scenesEls = sceneRefs.current.filter(Boolean) as HTMLDivElement[];
    const sceneCount = scenesEls.length;

    const updateScenes = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const scaled = p * (sceneCount - 1);
      sceneIdx = Math.min(Math.floor(scaled), sceneCount - 1);
      sceneBlend = scaled - sceneIdx;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }

      scenesEls.forEach((el, i) => {
        const d = i - scaled;
        const ad = Math.abs(d);
        const opacity = ad < 1 ? 1 - ad : 0;
        const scale = 1 + d * 0.08;
        const blur = ad < 1 ? ad * 8 : 8;
        const ty = d * 28;
        el.style.opacity = String(Math.max(opacity, 0));
        el.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.pointerEvents = ad < 0.5 ? "auto" : "none";

        const localP = Math.max(0, Math.min(1, 1 - ad));
        el.style.setProperty("--p", String(localP));
        // Continuous scroll-driven progress for marquee/parallax (-1..1)
        el.style.setProperty("--d", String(Math.max(-1, Math.min(1, d))));
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScenes();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScenes();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scenes = [
    {
      eyebrow: "ACT I",
      title: "The Complete Man",
      body: "A century of craft. A wardrobe of memory. A name woven into the fabric of a nation.",
      reveal: "iris",
    },
    {
      eyebrow: "ACT II",
      title: "Threads of Time",
      body: "Since 1925, every cut has carried an inheritance — of patience, of poise, of a quiet, durable elegance.",
      reveal: "wipe",
    },
    {
      eyebrow: "ACT III",
      title: "Twenty Thousand Hands",
      body: "Across cities and small towns, a latent atelier of master tailors hums beneath the surface — measured, exacting, unseen.",
      reveal: "letters",
    },
    {
      eyebrow: "ACT IV",
      title: "From Transaction to Identity",
      body: "Each measurement, a fingerprint. Each fitting, a remembered self. The platform is the thread that ties them.",
      reveal: "slide",
    },
    {
      eyebrow: "ACT V",
      title: "An Architecture of Trust",
      body: "Not another marketplace — an inheritance, distributed. Tailors as nodes. Customers as continuities. Raymond as the loom.",
      reveal: "scale",
    },
    {
      eyebrow: "FINALE",
      title: "Curtain.",
      body: "The complete man was never the suit. He was the story stitched between the seams.",
      reveal: "fade-out",
    },
  ];

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <div className="cine-logo">
        <RaymondMark />
      </div>

      <div className="cine-progress">
        <div className="cine-progress-bar" ref={progressBarRef} />
      </div>

      <div className="cine-stage">
        {scenes.map((s, i) => {
          const letters = Array.from(s.title);
          return (
            <section
              key={i}
              ref={(el) => {
                sceneRefs.current[i] = el;
              }}
              className={`cine-scene reveal-${s.reveal}`}
              data-index={i}
              style={{ ["--scene-i" as any]: i }}
            >
              <div className="cine-shape cine-shape-1" aria-hidden />
              <div className="cine-shape cine-shape-2" aria-hidden />
              <div className="cine-shape cine-shape-3" aria-hidden />

              <div className="cine-marquee cine-marquee-top" aria-hidden>
                <div className="cine-marquee-track">
                  {Array.from({ length: 8 }).map((_, k) => (
                    <span key={k}>
                      {s.title} &nbsp;·&nbsp; Raymond &nbsp;·&nbsp; The Complete Man &nbsp;·&nbsp; Since 1925 &nbsp;·&nbsp;&nbsp;
                    </span>
                  ))}
                </div>
              </div>

              <div className="cine-marquee cine-marquee-bottom" aria-hidden>
                <div className="cine-marquee-track reverse">
                  {Array.from({ length: 8 }).map((_, k) => (
                    <span key={k}>
                      {s.eyebrow} &nbsp;·&nbsp; A film in six acts &nbsp;·&nbsp; {s.title} &nbsp;·&nbsp;&nbsp;
                    </span>
                  ))}
                </div>
              </div>

              <div className="cine-scene-inner">
                <div className="cine-eyebrow">{s.eyebrow}</div>
                <h2 className="cine-title">
                  {letters.map((ch, ci) => (
                    <span
                      key={ci}
                      className={`cine-letter${ch === " " ? " is-space" : ""}`}
                      style={{ ["--li" as any]: ci }}
                    >
                      {ch === " " ? " " : ch}
                    </span>
                  ))}
                </h2>
                <p className="cine-body">{s.body}</p>
                <div className="cine-rule" />
                <div className="cine-meta">
                  Scene {String(i + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
                </div>
              </div>

              <div className="cine-parallax" />
            </section>
          );
        })}
      </div>

      <div className="cine-spacer" style={{ height: `${scenes.length * 100}vh` }} />

      <style jsx global>{`
        :root {
          --cine-ink: #141414;
          --cine-ink-soft: #3a3a3a;
        }
        html, body { background: #fdf8ee; }
        body { color: var(--cine-ink); }

        .glass-cream, .pattern-grid, .pattern-grid-fine { background: transparent !important; }

        /* ---------- Logo mark ---------- */
        .cine-logo {
          position: fixed;
          top: 22px;
          left: 26px;
          z-index: 50;
          pointer-events: none;
          mix-blend-mode: multiply;
        }
        .raymond-mark {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-family: 'Times New Roman', Georgia, serif;
          color: #1a1a1a;
        }
        .rm-tagline { font-style: italic; font-weight: 500; font-size: 18px; letter-spacing: 0.01em; }
        .rm-block {
          background: #d4202b;
          padding: 6px 22px 8px;
          box-shadow: 0 4px 18px rgba(212, 32, 43, 0.18);
        }
        .rm-word {
          color: #ffffff;
          font-style: italic;
          font-weight: 700;
          font-size: 36px;
          letter-spacing: -0.01em;
          line-height: 1;
          font-family: 'Playfair Display', 'Times New Roman', serif;
        }
        .rm-since {
          display: inline-flex;
          align-items: center;
          gap: 0.24em;
          padding: 4px 12px;
          border: 1px solid #1a1a1a;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.32em;
        }
        .rm-since .rm-gap { width: 10px; }

        @media (max-width: 640px) {
          .rm-tagline { font-size: 13px; }
          .rm-word { font-size: 26px; }
          .rm-since { font-size: 9px; padding: 3px 8px; }
        }

        /* ---------- Progress film-strip ---------- */
        .cine-progress {
          position: fixed;
          left: 0; right: 0; top: 0;
          height: 3px;
          background: rgba(20,20,20,0.06);
          z-index: 40;
          pointer-events: none;
        }
        .cine-progress-bar {
          height: 100%;
          width: 100%;
          transform-origin: 0% 50%;
          transform: scaleX(0);
          background: linear-gradient(90deg, #141414, #d4202b);
          transition: transform 0.15s linear;
        }

        /* ---------- Scenes ---------- */
        .cine-stage { position: fixed; inset: 0; z-index: 10; pointer-events: none; }
        .cine-scene {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0;
          will-change: opacity, transform, filter;
          padding: 6vh 7vw;
          pointer-events: none;
          overflow: hidden;
        }
        .cine-scene-inner {
          max-width: 1100px;
          width: 100%;
          text-align: left;
          position: relative;
          z-index: 3;
        }

        .cine-eyebrow {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          letter-spacing: 0.45em;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--cine-ink-soft);
          margin-bottom: 12px;
          opacity: calc(var(--p, 0) * 1);
          transform: translateX(calc((1 - var(--p, 0)) * -22px));
          transition: opacity 0.5s, transform 0.6s;
        }

        .cine-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 800;
          color: var(--cine-ink);
          font-size: clamp(60px, 11.5vw, 188px);
          line-height: 0.94;
          letter-spacing: -0.025em;
          margin: 0 0 18px;
          /* Continuous scroll-tied subtle scale + slide for liveliness */
          transform: translate3d(calc(var(--d, 0) * -40px), 0, 0)
                     scale(calc(1 + var(--d, 0) * -0.02));
          will-change: transform;
        }

        .cine-letter {
          display: inline-block;
          opacity: 0;
          filter: blur(18px);
          transform: translateY(60px) rotate(6deg);
          animation: cine-letter-in 0.9s cubic-bezier(.16,1,.3,1) forwards;
          animation-delay: calc(var(--li) * 0.035s + 0.1s);
        }
        .cine-letter.is-space {
          width: 0.32em;
          animation: none;
          opacity: 1;
          filter: none;
          transform: none;
        }
        @keyframes cine-letter-in {
          to { opacity: 1; filter: blur(0); transform: translateY(0) rotate(0); }
        }

        .cine-body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(17px, 1.45vw, 21px);
          line-height: 1.55;
          color: var(--cine-ink-soft);
          max-width: 640px;
          margin: 0;
          opacity: calc(var(--p, 0) * 1);
          transform: translateY(calc((1 - var(--p, 0)) * 16px));
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .cine-rule {
          margin-top: 22px;
          width: calc(var(--p, 0) * 280px);
          height: 2px;
          background: linear-gradient(90deg, #141414, transparent);
          transition: width 0.3s linear;
        }
        .cine-meta {
          margin-top: 14px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          font-weight: 500;
          text-transform: uppercase;
          color: rgba(20,20,20,0.55);
        }

        /* ---------- Marquee strips (string-tune-style horizontal flow) ---------- */
        .cine-marquee {
          position: absolute;
          left: 0; right: 0;
          z-index: 1;
          overflow: hidden;
          white-space: nowrap;
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 600;
          color: rgba(20,20,20,0.06);
          font-size: clamp(60px, 9vw, 140px);
          line-height: 1;
          pointer-events: none;
        }
        .cine-marquee-top { top: 9vh; transform: translateX(calc(var(--d, 0) * -120px)); }
        .cine-marquee-bottom { bottom: 6vh; transform: translateX(calc(var(--d, 0) * 120px)); }
        .cine-marquee-track {
          display: inline-block;
          animation: cine-mq 38s linear infinite;
        }
        .cine-marquee-track.reverse { animation: cine-mq-rev 46s linear infinite; }
        @keyframes cine-mq {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cine-mq-rev {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        /* ---------- Floating decorative shapes ---------- */
        .cine-shape {
          position: absolute;
          z-index: 1;
          border-radius: 9999px;
          pointer-events: none;
          mix-blend-mode: multiply;
          opacity: calc(var(--p, 0) * 0.7);
          will-change: transform;
        }
        .cine-shape-1 {
          top: 14%; right: 8%;
          width: 280px; height: 280px;
          background: radial-gradient(circle at 30% 30%, rgba(212,32,43,0.18), transparent 70%);
          transform: translate3d(calc(var(--d, 0) * 90px), calc(var(--d, 0) * -50px), 0)
                     scale(calc(0.85 + var(--p, 0) * 0.25));
          transition: transform 0.05s linear;
          animation: cine-float 14s ease-in-out infinite;
        }
        .cine-shape-2 {
          bottom: 16%; left: 6%;
          width: 220px; height: 220px;
          background: radial-gradient(circle at 70% 70%, rgba(20,20,20,0.10), transparent 70%);
          transform: translate3d(calc(var(--d, 0) * -120px), calc(var(--d, 0) * 60px), 0)
                     scale(calc(0.9 + var(--p, 0) * 0.2));
          animation: cine-float 17s ease-in-out infinite reverse;
        }
        .cine-shape-3 {
          top: 30%; left: 38%;
          width: 140px; height: 140px;
          background: radial-gradient(circle at 50% 50%, rgba(255,200,80,0.20), transparent 70%);
          transform: translate3d(calc(var(--d, 0) * 60px), calc(var(--d, 0) * 80px), 0)
                     scale(calc(0.8 + var(--p, 0) * 0.4));
          animation: cine-float 11s ease-in-out infinite;
        }
        @keyframes cine-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 18px -22px; }
        }

        /* Subtle parallax foreground frame per scene */
        .cine-parallax {
          position: absolute;
          inset: 8vh 7vw;
          border: 1px solid rgba(20,20,20,0.08);
          z-index: 1;
          opacity: calc(var(--p, 0) * 0.85);
          transform: scale(calc(0.94 + var(--p, 0) * 0.06))
                     translate3d(calc(var(--d, 0) * 14px), 0, 0);
          transition: opacity 0.5s, transform 0.6s;
          pointer-events: none;
        }

        /* ---------- Reveal variants ---------- */
        .reveal-iris .cine-scene-inner { clip-path: circle(calc(var(--p, 0) * 130%) at 50% 50%); }
        .reveal-wipe .cine-scene-inner { clip-path: inset(0 calc((1 - var(--p, 0)) * 100%) 0 0); }
        .reveal-letters .cine-title { letter-spacing: calc(-0.025em + (1 - var(--p, 0)) * 0.06em); }
        .reveal-slide .cine-scene-inner { transform: translateX(calc((1 - var(--p, 0)) * 90px)); }
        .reveal-scale .cine-scene-inner {
          transform: scale(calc(0.9 + var(--p, 0) * 0.1));
          transform-origin: center;
        }
        .reveal-fade-out .cine-scene-inner { opacity: var(--p, 0); }

        .cine-spacer { width: 1px; pointer-events: none; }

        @media (max-width: 720px) {
          .cine-title { font-size: clamp(48px, 14vw, 96px); margin-bottom: 14px; }
          .cine-eyebrow { margin-bottom: 10px; }
          .cine-marquee { font-size: 60px; }
          .cine-shape-1 { width: 180px; height: 180px; }
          .cine-shape-2 { width: 140px; height: 140px; }
          .cine-shape-3 { width: 90px; height: 90px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cine-letter { animation: none; opacity: 1; filter: none; transform: none; }
          .cine-marquee-track, .cine-marquee-track.reverse { animation: none; }
          .cine-shape { animation: none; }
        }
      `}</style>
    </>
  );
}
