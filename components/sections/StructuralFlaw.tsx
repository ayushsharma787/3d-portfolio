"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import { flaw } from "@/lib/content";
import { MaskText } from "@/components/ui/Cinematic";
import { Reveal } from "@/components/ui/Scroll";

/**
 * The Structural Flaw — editorial, monochrome rebuild.
 * Left half: a tight, controlled, numbered pipeline (BLACK).
 * Center: a violent fracture at Point of Sale (RED accent).
 * Right half: post-break identity touchpoints, drifting apart (OUTLINED, ink).
 */
export default function StructuralFlaw() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const tearProgress = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);
  const ghostX = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const shards = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return {
          dx: Math.cos(a) * (60 + (i % 4) * 22),
          dy: Math.sin(a) * (40 + (i % 3) * 20),
          rot: (i % 2 ? 1 : -1) * (20 + i * 4),
          delay: 0.9 + i * 0.022,
          size: 5 + (i % 4) * 3,
          // Strict mono palette: ink + a single red accent
          color: i % 5 === 0 ? "#d4202b" : i % 2 === 0 ? "#141414" : "#3a3a3a",
        };
      }),
    []
  );
  const threads = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2 + 0.2;
        const r1 = 30 + (i % 3) * 10;
        const r2 = r1 + 60 + (i % 4) * 22;
        return {
          x1: 100 + Math.cos(a) * r1,
          y1: 100 + Math.sin(a) * r1,
          x2: 100 + Math.cos(a) * r2,
          y2: 100 + Math.sin(a) * r2,
          delay: 1.0 + i * 0.04,
          color: i % 4 === 0 ? "#d4202b" : "#141414",
        };
      }),
    []
  );

  return (
    <section
      ref={ref}
      id="flaw"
      className="relative isolate min-h-screen w-full overflow-hidden bg-[#fdf8ee] py-32 text-[#141414]"
    >
      {/* Giant ghost numeral parallax */}
      <motion.div
        style={{ x: ghostX }}
        className="pointer-events-none absolute -right-10 top-10 select-none font-serif text-[26vw] font-black leading-none text-[#141414]/[0.04]"
        aria-hidden
      >
        03
      </motion.div>

      {/* Subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Header strip — editorial 12-col asymmetric */}
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <div className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#141414]/60">
                {flaw.eyebrow}
              </div>
            </Reveal>
            <div className="mt-3 h-[2px] w-16 bg-[#141414]" />
          </div>
          <h2 className="col-span-12 font-serif text-[clamp(40px,7.5vw,116px)] font-extrabold leading-[0.95] tracking-[-0.02em] text-[#141414] md:col-span-9">
            <MaskText text="The pipeline that breaks at the point of sale." />
          </h2>
        </div>

        {/* Section sub-heads, two columns of context labels */}
        <div className="mt-14 grid grid-cols-12 gap-6 border-y border-[#141414]/15 py-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#141414]/55">
          <div className="col-span-6">A · Controlled</div>
          <div className="col-span-6 text-right">B · Released → Lost</div>
        </div>

        {/* Pipeline */}
        <div className="relative mt-16" style={{ perspective: 1400 }}>
          {/* Long ink rail across the controlled half */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "0% 50%" }}
            className="absolute left-0 right-1/2 top-1/2 h-[3px] -translate-y-1/2 bg-[#141414]"
            aria-hidden
          />
          {/* Dashed fracture rail across the released half */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: "0% 50%",
              backgroundImage:
                "repeating-linear-gradient(90deg, #141414 0 8px, transparent 8px 16px)",
            }}
            className="absolute left-1/2 right-0 top-1/2 h-[3px] -translate-y-1/2 opacity-60"
            aria-hidden
          />

          <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-6">
            {/* PRE — controlled cards, tight industrial */}
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {flaw.pre.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, y: 32, rotateX: 14 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{
                    delay: 0.4 + i * 0.18,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative aspect-[4/5] border-2 border-[#141414] bg-white"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Step number */}
                  <div className="absolute left-3 top-3 font-serif text-[11px] font-bold tracking-[0.3em] text-[#141414]/60">
                    0{i + 1}
                  </div>
                  {/* Inner pinstripe */}
                  <div
                    className="absolute inset-2 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #141414 0 1px, transparent 1px 8px)",
                    }}
                  />
                  {/* Label */}
                  <div className="absolute inset-0 flex items-end p-3">
                    <div className="font-serif text-[14px] font-bold leading-tight text-[#141414] md:text-[16px]">
                      {p}
                    </div>
                  </div>
                  {/* Bottom pulse bar */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ delay: 0.7 + i * 0.18, duration: 0.6 }}
                    style={{ transformOrigin: "0% 50%" }}
                    className="absolute inset-x-2 bottom-2 h-[2px] bg-[#141414]"
                  />
                </motion.div>
              ))}
            </div>

            {/* TEAR — fracture point */}
            <div className="relative h-56 w-full md:h-64 md:w-56">
              <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
                {/* solid ink slab (controlled side terminator) */}
                <motion.path
                  d="M40 60 L160 60 L160 140 L40 140 Z"
                  fill="#141414"
                  initial={{ scaleY: 0.96 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  style={{ transformOrigin: "100px 100px" }}
                />
                {/* jagged red tear */}
                <motion.path
                  d="M100 30 L92 70 L108 95 L88 120 L112 160 L100 185"
                  stroke="#d4202b"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                {/* shrapnel — black + sparing red */}
                {shards.map((s, i) => (
                  <motion.rect
                    key={i}
                    x="98"
                    y="98"
                    width={s.size}
                    height={s.size * 0.4}
                    fill={s.color}
                    initial={{ x: 98, y: 98, opacity: 0, rotate: 0 }}
                    whileInView={{
                      x: 98 + s.dx,
                      y: 98 + s.dy,
                      opacity: [0, 1, 0.85],
                      rotate: s.rot,
                    }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{
                      duration: 1.2,
                      delay: s.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))}
                {/* radiating threads */}
                {threads.map((t, i) => (
                  <motion.line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={t.x2}
                    y2={t.y2}
                    stroke={t.color}
                    strokeOpacity="0.85"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.85 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.8, delay: t.delay }}
                  />
                ))}
                {/* central red flash */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="6"
                  fill="#d4202b"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: [0, 2.4, 0] }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.9, delay: 0.85 }}
                />
              </svg>

              <motion.div
                style={{ opacity: tearProgress }}
                className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4202b]"
              >
                Point of Sale · Break
              </motion.div>
            </div>

            {/* POST — drifted, outlined identity touchpoints */}
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {flaw.post.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, x: 40, y: 30, rotate: -3 }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: i === 0 ? -2 : i === 1 ? 1.5 : -1,
                  }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{
                    delay: 1.6 + i * 0.18,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 1.04, rotate: 0 }}
                  className="flex flex-col items-center justify-center gap-3 rounded-none border border-[#141414]/30 bg-white/70 p-4 backdrop-blur-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#141414] bg-white text-[#141414]">
                    <PostIcon kind={p} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#141414] md:text-xs">
                    {p}
                  </div>
                  <div className="h-px w-6 bg-[#141414]/30" />
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/50">
                    Untracked
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Captions — strict mono with one red rule */}
          <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            <Reveal delay={0.2}>
              <div className="relative pl-6">
                <span className="absolute left-0 top-0 h-full w-[3px] bg-[#141414]" />
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#141414]/60">
                  Inside the wall
                </div>
                <p className="font-serif text-[20px] leading-[1.35] text-[#141414] md:text-[26px]">
                  {flaw.preCaption}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="relative pl-6">
                <span className="absolute left-0 top-0 h-full w-[3px] bg-[#d4202b]" />
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4202b]">
                  After the break
                </div>
                <p className="font-serif text-[20px] leading-[1.35] text-[#141414] md:text-[26px]">
                  {flaw.postCaption}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Footer marker */}
        <div className="mt-16 flex items-center justify-between border-t border-[#141414]/15 pt-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#141414]/45">
          <span>04 · The Blind Spot</span>
          <span>↓ continue</span>
        </div>
      </div>
    </section>
  );
}

function PostIcon({ kind }: { kind: string }) {
  if (kind === "Fit") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="6" r="2.4" />
        <path d="M9 11h6l-1 8h-4l-1-8z" />
      </svg>
    );
  }
  if (kind === "Occasion") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h11l3 3v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
