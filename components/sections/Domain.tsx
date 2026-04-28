"use client";

import { motion } from "framer-motion";
import { domain } from "@/lib/content";
import SectionLabel from "@/components/ui/SectionLabel";
import StatCounter from "@/components/ui/StatCounter";

export default function Domain() {
  return (
    <section id="domain" className="relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — stats on topographic */}
        <div className="pattern-topo relative px-6 py-32 md:px-16 md:py-40">
          <SectionLabel index={4}>The Domain</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-3 max-w-md font-serif text-3xl leading-tight text-navy md:text-4xl"
          >
            {domain.title}
          </motion.h2>

          <div className="mt-14 space-y-12">
            {domain.stats.map((s, i) => (
              <motion.div
                key={s.big}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div
                  className={`font-serif font-semibold tracking-tighter ${
                    i === 0 ? "text-olive" : "text-brown-dark"
                  } text-7xl md:text-8xl`}
                >
                  <StatCounter value={s.big} />
                </div>
                <p className="mt-3 max-w-md text-base text-navy/75 md:text-lg">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — pull quote on iso grid */}
        <div className="pattern-iso relative flex items-center px-6 py-32 md:px-16 md:py-40">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span className="absolute -left-3 -top-8 font-serif text-7xl text-navy/15 md:-left-6 md:text-9xl">
              &ldquo;
            </span>
            <p className="font-serif text-3xl leading-tight text-navy md:text-5xl lg:text-6xl">
              {domain.pullquote}
            </p>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
