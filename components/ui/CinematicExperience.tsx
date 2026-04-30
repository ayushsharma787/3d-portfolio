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
    // ---------- Cursor-reactive color field ----------
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

    // Light palette (always 80–100% lightness)
    const palette = [
      { h: 32, s: 70, l: 94 },  // warm cream
      { h: 290, s: 55, l: 95 }, // pale lavender
      { h: 18, s: 80, l: 93 },  // soft peach
      { h: 150, s: 50, l: 95 }, // mint ivory
      { h: 210, s: 60, l: 95 }, // sky paper
      { h: 340, s: 60, l: 95 }, // blush
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
    let sceneBlend = 0; // 0..1 between sceneIdx and sceneIdx+1

    const render = () => {
      t += 0.004;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const a = palette[sceneIdx % palette.length];
      const b = palette[(sceneIdx + 1) % palette.length];
      const lerp = (x: number, y: number, k: number) => x + (y - x) * k;
      const breath = (Math.sin(t * 1.3) + 1) * 0.5; // 0..1 slow breathing

      const baseH = lerp(a.h, b.h, sceneBlend) + Math.sin(t * 0.7) * 6;
      const baseS = lerp(a.s, b.s, sceneBlend);
      const baseL = lerp(a.l, b.l, sceneBlend) + breath * 1.2; // stays light

      // Background gradient: two soft radials drifting slowly
      const drift1X = w * (0.2 + 0.1 * Math.sin(t * 0.6));
      const drift1Y = h * (0.3 + 0.08 * Math.cos(t * 0.5));
      const drift2X = w * (0.8 + 0.1 * Math.cos(t * 0.4));
      const drift2Y = h * (0.7 + 0.09 * Math.sin(t * 0.7));

      // Solid base wash
      ctx.fillStyle = `hsl(${baseH}, ${baseS}%, ${Math.min(baseL, 99)}%)`;
      ctx.fillRect(0, 0, w, h);

      // Drifting radial 1
      const g1 = ctx.createRadialGradient(drift1X, drift1Y, 0, drift1X, drift1Y, Math.max(w, h) * 0.7);
      g1.addColorStop(0, `hsla(${baseH + 30}, ${baseS}%, 96%, 0.9)`);
      g1.addColorStop(1, `hsla(${baseH + 30}, ${baseS}%, 96%, 0)`);
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Drifting radial 2
      const g2 = ctx.createRadialGradient(drift2X, drift2Y, 0, drift2X, drift2Y, Math.max(w, h) * 0.6);
      g2.addColorStop(0, `hsla(${baseH - 40}, ${baseS}%, 94%, 0.85)`);
      g2.addColorStop(1, `hsla(${baseH - 40}, ${baseS}%, 94%, 0)`);
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Cursor glow — soft complementary light hue
      const glowHue = glowHues[sceneIdx % glowHues.length] + Math.sin(t * 0.9) * 12;
      const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 360);
      glow.addColorStop(0, `hsla(${glowHue}, 75%, 88%, 0.85)`);
      glow.addColorStop(0.45, `hsla(${glowHue}, 75%, 92%, 0.35)`);
      glow.addColorStop(1, `hsla(${glowHue}, 75%, 95%, 0)`);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // Subtle grain to keep things organic
      // (cheap pseudo-grain via small overlay alpha — skip per-pixel for perf)

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // ---------- Scroll = movie timeline ----------
    // We DO use real scroll (with a tall spacer) because the user mentioned
    // GSAP ScrollTrigger and scroll progress mapping. Scroll position drives
    // the scene index and intra-scene progress; nothing visually translates
    // up — scenes are fixed and crossfade.
    const scenes = sceneRefs.current.filter(Boolean) as HTMLDivElement[];
    const sceneCount = scenes.length;

    const updateScenes = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0; // 0..1
      const scaled = p * (sceneCount - 1);
      sceneIdx = Math.min(Math.floor(scaled), sceneCount - 1);
      sceneBlend = scaled - sceneIdx;

      // Update progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }

      scenes.forEach((el, i) => {
        const d = i - scaled; // negative=passed, positive=upcoming
        const ad = Math.abs(d);
        // Visible only within ±1.05 distance
        const opacity = ad < 1 ? 1 - ad : 0;
        const scale = 1 + d * 0.06; // upcoming larger, leaving smaller
        const blur = ad < 1 ? ad * 6 : 6;
        const ty = d * 24; // gentle parallax
        el.style.opacity = String(Math.max(opacity, 0));
        el.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.pointerEvents = ad < 0.5 ? "auto" : "none";

        // Per-scene intra progress for layered children
        const localP = Math.max(0, Math.min(1, 1 - ad));
        el.style.setProperty("--p", String(localP));
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
      {/* Fixed light color-field canvas */}
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

      {/* Logo, top-left */}
      <div className="cine-logo">
        <RaymondMark />
      </div>

      {/* Progress timeline (cinematic film strip line) */}
      <div className="cine-progress">
        <div className="cine-progress-bar" ref={progressBarRef} />
      </div>

      {/* Pinned scenes */}
      <div className="cine-stage" aria-hidden={false}>
        {scenes.map((s, i) => (
          <section
            key={i}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className={`cine-scene reveal-${s.reveal}`}
            data-index={i}
          >
            <div className="cine-scene-inner">
              <div className="cine-eyebrow">{s.eyebrow}</div>
              <h2 className="cine-title">
                {s.title.split(" ").map((word, wi) => (
                  <span className="cine-word" key={wi} style={{ ["--wi" as any]: wi }}>
                    {word}
                    {wi < s.title.split(" ").length - 1 ? " " : ""}
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
        ))}
      </div>

      {/* Tall spacer drives scroll-as-timeline */}
      <div className="cine-spacer" style={{ height: `${scenes.length * 100}vh` }} />

      <style jsx global>{`
        :root {
          --cine-ink: #1a1a1a;
          --cine-ink-soft: #3a3a3a;
        }
        html, body { background: #fdf8ee; }
        body { color: var(--cine-ink); }

        /* Hide all the legacy site chrome if anything leaks through */
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
        .rm-tagline {
          font-style: italic;
          font-weight: 500;
          font-size: 18px;
          letter-spacing: 0.01em;
        }
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
          background: rgba(26,26,26,0.06);
          z-index: 40;
          pointer-events: none;
        }
        .cine-progress-bar {
          height: 100%;
          width: 100%;
          transform-origin: 0% 50%;
          transform: scaleX(0);
          background: linear-gradient(90deg, #1a1a1a, #d4202b);
          transition: transform 0.15s linear;
        }

        /* ---------- Scenes ---------- */
        .cine-stage {
          position: fixed;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }
        .cine-scene {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0;
          will-change: opacity, transform, filter;
          padding: 6vh 8vw;
          pointer-events: none;
        }
        .cine-scene-inner {
          max-width: 980px;
          width: 100%;
          text-align: left;
          position: relative;
          z-index: 2;
        }
        .cine-eyebrow {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.45em;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--cine-ink-soft);
          margin-bottom: 24px;
          opacity: calc(var(--p, 0) * 1);
          transform: translateY(calc((1 - var(--p, 0)) * 16px));
          transition: opacity 0.6s, transform 0.6s;
        }
        .cine-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          color: var(--cine-ink);
          font-size: clamp(44px, 8vw, 128px);
          line-height: 0.96;
          letter-spacing: -0.02em;
          margin: 0 0 28px;
        }
        .cine-word {
          display: inline-block;
          opacity: 0;
          filter: blur(14px);
          transform: translateY(40px);
          animation: cine-word-in 1.1s cubic-bezier(.16,1,.3,1) forwards;
          animation-delay: calc(var(--wi) * 0.12s + 0.15s);
        }
        @keyframes cine-word-in {
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        .cine-body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(17px, 1.5vw, 22px);
          line-height: 1.55;
          color: var(--cine-ink-soft);
          max-width: 640px;
          opacity: calc(var(--p, 0) * 1);
          transform: translateY(calc((1 - var(--p, 0)) * 22px));
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .cine-rule {
          margin-top: 36px;
          width: calc(var(--p, 0) * 220px);
          height: 2px;
          background: linear-gradient(90deg, #1a1a1a, transparent);
          transition: width 0.3s linear;
        }
        .cine-meta {
          margin-top: 20px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          font-weight: 500;
          text-transform: uppercase;
          color: rgba(26,26,26,0.55);
        }

        /* Subtle parallax foreground frame per scene */
        .cine-parallax {
          position: absolute;
          inset: 8vh 8vw;
          border: 1px solid rgba(26,26,26,0.08);
          z-index: 1;
          opacity: calc(var(--p, 0) * 0.9);
          transform: scale(calc(0.96 + var(--p, 0) * 0.04));
          transition: opacity 0.5s, transform 0.6s;
          pointer-events: none;
        }

        /* ---------- Reveal variants ---------- */
        .reveal-iris .cine-scene-inner {
          clip-path: circle(calc(var(--p, 0) * 120%) at 50% 50%);
        }
        .reveal-wipe .cine-scene-inner {
          clip-path: inset(0 calc((1 - var(--p, 0)) * 100%) 0 0);
        }
        .reveal-letters .cine-title { letter-spacing: calc(-0.02em + (1 - var(--p, 0)) * 0.05em); }
        .reveal-slide .cine-scene-inner {
          transform: translateX(calc((1 - var(--p, 0)) * 80px));
        }
        .reveal-scale .cine-scene-inner {
          transform: scale(calc(0.92 + var(--p, 0) * 0.08));
          transform-origin: center;
        }
        .reveal-fade-out .cine-scene-inner { opacity: var(--p, 0); }

        /* ---------- Spacer (invisible, drives scroll) ---------- */
        .cine-spacer { width: 1px; pointer-events: none; }

        @media (prefers-reduced-motion: reduce) {
          .cine-word { animation: none; opacity: 1; filter: none; transform: none; }
        }
      `}</style>
    </>
  );
}
