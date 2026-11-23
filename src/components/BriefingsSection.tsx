import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BRIEFINGS } from '../data/agencyContent';
import { ConcaveCurveCap } from './ConcaveCurveCap';
import { ChromaticText } from './GlassReveal';
import { ScrambleText } from './ScrambleText';
import { TextReveal } from './TextReveal';

/**
 * Editorial Security Advisories section matching United Carriers Image 6 middle alignment:
 * - Centered middle column (lg:col-start-4 lg:col-span-6) for both the 2-line display title
 *   (line 1 muted, line 2 crisp white) and the compact hairline briefing rows below.
 * - Right column (lg:col-start-10 lg:col-span-3) for concise intro copy, rounded pill CTA,
 *   and clean borderless crossfading thumbnail visual.
 */
export function BriefingsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const activeBriefing = BRIEFINGS[activeIndex];

  return (
    <section
      id="briefings"
      aria-labelledby="briefings-heading"
      className="relative z-20 text-white"
    >
      {/* Seamless Pure-CSS Planetary White-to-Obsidian Dome Horizon (Image 5) */}
      <ConcaveCurveCap
        target="obsidian"
        from="white"
        className="-mb-px h-[38vh] sm:h-[44vh] lg:h-[52vh]"
      />

      <div className="bg-[#06080C] pt-16 pb-28 sm:pt-24 sm:pb-32 lg:pt-28 lg:pb-40">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {/* Top Row: Middle-Aligned Display Heading + Right-Aligned Blurb & Pill CTA (Image 6) */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6 lg:col-start-4">
              <TextReveal
                id="briefings-heading"
                as="h2"
                theme="dark"
                mutedLines={[0]}
                lines={["WHAT'S SHAPING", 'RISK TODAY']}
                className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] font-bold tracking-[-0.03em] uppercase"
              />
            </div>

            <div className="lg:col-span-3 lg:col-start-10 lg:pt-2">
              <ChromaticText
                theme="dark"
                muted
                delay={0.22}
                className="max-w-[240px] text-xs leading-[1.65] sm:text-[13px]"
              >
                Stay ahead of security standards across Karnataka — from PSARA governance
                to 24/7 perimeter telemetry.
              </ChromaticText>
              <div className="mt-6">
                <a
                  href="#assessment"
                  className="inline-flex items-center justify-center rounded-full border border-white/22 px-6 py-2.5 font-nav text-[10.5px] font-bold tracking-[0.16em] text-white uppercase transition-colors duration-200 hover:border-[#EA580C] hover:bg-[#EA580C] hover:text-white"
                >
                  <ScrambleText text="VIEW ALL" />
                </a>
              </div>
            </div>
          </div>

          {/* Lower Row: Centered Hairline Advisory List + Clean Borderless Right Preview Thumbnail (Image 6) */}
          <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6 lg:col-start-4">
              {BRIEFINGS.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <motion.article
                    key={item.id}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 16, filter: 'blur(6px)' }
                    }
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '0px 0px -12% 0px', amount: 0.2 }}
                    transition={{
                      duration: 0.85,
                      delay: idx * 0.08,
                      ease: [0.16, 0.72, 0.28, 1],
                    }}
                    className={`border-b transition-colors duration-300 will-change-[transform,opacity,filter] ${
                      isActive ? 'border-white/90' : 'border-white/12'
                    }`}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onFocus={() => setActiveIndex(idx)}
                      onClick={() => setActiveIndex(idx)}
                      aria-expanded={isActive}
                      className="flex w-full cursor-pointer items-end justify-between gap-6 py-5 text-left sm:py-6"
                    >
                      <div className="min-w-0">
                        <span className="block font-mono-tech text-[9.5px] tracking-[0.16em] text-slate-500 uppercase">
                          {item.date}
                        </span>
                        <h3
                          className={`mt-1.5 truncate font-sans text-sm font-semibold tracking-[-0.01em] transition-colors duration-200 sm:text-[15.5px] ${
                            isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 font-mono-tech text-[9.5px] tracking-[0.16em] uppercase transition-colors duration-200 ${
                          isActive ? 'text-[#FB923C]' : 'text-slate-500'
                        }`}
                      >
                        {item.category}
                      </span>
                    </button>
                  </motion.article>
                );
              })}
            </div>

            {/* Clean Borderless Right Editorial Preview Visual (Image 6) */}
            <div className="lg:col-span-3 lg:col-start-10">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#0E1117]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeBriefing.id}
                    src={activeBriefing.image}
                    alt={activeBriefing.alt}
                    loading="lazy"
                    width={960}
                    height={600}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
