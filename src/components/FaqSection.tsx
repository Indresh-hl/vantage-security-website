import { ArrowRight, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { AGENCY_INFO, FAQS } from '../data/agencyContent';
import { ConcaveCurveCap } from './ConcaveCurveCap';
import { ChromaticText } from './GlassReveal';
import { ScrambleText } from './ScrambleText';
import { TextReveal } from './TextReveal';

export function FaqSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative z-20 text-[#0E1117]"
    >
      {/* Seamless Pure-CSS Planetary Obsidian-to-White Dome Horizon */}
      <ConcaveCurveCap
        target="white"
        from="obsidian"
        className="-mb-px h-[36vh] sm:h-[42vh] lg:h-[48vh]"
      />

      <div className="bg-white pt-16 pb-24 sm:pt-22 sm:pb-28 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
            {/* Left Sticky Title Column */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <TextReveal
                  id="faq-heading"
                  as="h2"
                  theme="light"
                  lines={['F.A.Q']}
                  className="font-display text-[clamp(2.2rem,4.2vw,3.5rem)] leading-none font-bold tracking-[-0.03em] uppercase"
                />
                <ChromaticText
                  theme="light"
                  muted
                  delay={0.18}
                  className="mt-5 max-w-xs text-sm leading-relaxed"
                >
                  Straightforward answers on Karnataka PSARA compliance, vetting, and
                  rapid site mobilization.
                </ChromaticText>
              </div>
            </div>

            {/* Center Native <details> Accordion */}
            <div className="faq-accordion divide-y divide-[#0E1117]/12 border-t border-b border-[#0E1117]/12 lg:col-span-6">
              {FAQS.map((item, idx) => (
                <motion.div
                  key={item.index}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, y: 16, filter: 'blur(8px)' }
                  }
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '0px 0px -14% 0px', amount: 0.2 }}
                  transition={{
                    duration: 0.85,
                    delay: idx * 0.06,
                    ease: [0.16, 0.72, 0.28, 1],
                  }}
                  className="will-change-[transform,opacity,filter]"
                >
                  <details className="group">
                    <summary className="flex items-start gap-4 py-6 text-left transition-colors hover:text-[#3A404B] sm:gap-6">
                      <span className="mt-1 inline-flex shrink-0 items-center gap-2 font-mono-tech text-xs text-[#525B6A]">
                        <Plus
                          className="faq-plus h-4 w-4 text-[#0E1117]"
                          aria-hidden="true"
                        />
                        <span>{item.index}</span>
                      </span>
                      <span className="text-base leading-snug font-semibold text-[#0E1117] group-hover:text-[#3A404B] sm:text-lg">
                        {item.question}
                      </span>
                    </summary>
                    <div className="pb-6 pl-12 text-sm leading-relaxed text-[#525B6A] sm:pl-16 sm:text-[15px]">
                      {item.answer}
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>

            {/* Right Direct Dispatch Prompt */}
            <div className="lg:col-span-3">
              <div className="rounded-sm border border-[#0E1117]/10 bg-[#F4F6F9] p-6 lg:sticky lg:top-28">
                <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#2B303A] uppercase">
                  24/7 COMMAND DESK
                </p>
                <p className="mt-2 text-sm font-medium text-[#0E1117]">
                  Still have site-specific compliance or SLA questions?
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#525B6A]">
                  Speak directly with our Mysuru operations officers—no call centers, no
                  automated loops.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href="#assessment"
                    className="inline-flex items-center gap-2 font-nav text-xs font-bold tracking-[0.12em] text-[#0E1117] uppercase transition-colors hover:text-[#EA580C]"
                  >
                    <ScrambleText text="BOOK SITE ASSESSMENT" />
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={AGENCY_INFO.dispatchPhoneHref}
                    className="font-mono-tech text-xs text-[#525B6A] underline decoration-[#0E1117]/25 underline-offset-4 hover:text-[#0E1117]"
                  >
                    {AGENCY_INFO.dispatchPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
