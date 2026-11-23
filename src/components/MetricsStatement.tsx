import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { HERO_METRICS, type MetricItem } from '../data/agencyContent';
import { ConcaveCurveCap } from './ConcaveCurveCap';
import { ChromaticText, GlassReveal } from './GlassReveal';
import { ScrambleText } from './ScrambleText';
import { TextReveal } from './TextReveal';

function AnimatedMetric({ item, index }: { item: MetricItem; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px -15% 0px',
    amount: 0.25,
  });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(
    prefersReducedMotion ? item.value : 0
  );

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplayValue(item.value);
      return;
    }

    const durationMs = 1550;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(item.value * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(item.value);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, item.value, prefersReducedMotion]);

  const formatted =
    item.decimals !== undefined
      ? displayValue.toFixed(item.decimals)
      : Math.round(displayValue).toLocaleString('en-IN');

  return (
    <motion.div
      ref={ref}
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y: 20, filter: 'blur(6px)' }
      }
      animate={
        inView || prefersReducedMotion
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 20, filter: 'blur(6px)' }
      }
      transition={{ duration: 0.95, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[#0E1117]/10 pb-14 will-change-[transform,opacity,filter] last:border-b-0 sm:pb-16"
    >
      {/* Giant Bold Unbounded Geometric Display Numeral scaled boldly across right corner */}
      <div className="font-display text-[clamp(3.75rem,8vw,7.5rem)] leading-[0.94] font-bold tracking-[-0.045em] whitespace-nowrap text-[#0E1117] tabular-nums">
        {item.prefix ?? ''}
        {formatted}
        <span>{item.suffix}</span>
      </div>

      {/* Slow, Smooth, Exact-Width Chromatic Orange-to-Ink Reveal Directly Below Each Number */}
      <ChromaticText
        theme="light"
        muted
        trigger={inView}
        delay={0.32}
        duration={2.65}
        className="mt-4 text-[15px] font-medium sm:text-base"
      >
        {item.label}
      </ChromaticText>
    </motion.div>
  );
}

export function MetricsStatement() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      // Pull directly over pinned Hero runway so the tall Concave U-Bowl (∪) sweeps cleanly into white About
      className={
        prefersReducedMotion
          ? 'relative z-20 bg-white text-[#0E1117]'
          : 'relative z-20 -mt-[90vh] text-[#0E1117] lg:-mt-[104vh]'
      }
    >
      {/* Pure-CSS Zero-Line Giant Concave U-Bowl (∪) Sweeping Over Pinned Hero */}
      {!prefersReducedMotion && (
        <ConcaveCurveCap
          target="white"
          from="transparent"
          shape="bowl"
          className="-mb-px h-[74vh] sm:h-[78vh] lg:h-[82vh]"
        />
      )}

      {/* White Canvas Body — Edge-to-Edge Proportions & Wide Open Middle Gutter matching Reference Image 3 */}
      <div data-nav-theme="light" className="bg-white">
        <div className="mx-auto w-full px-5 pt-2 pb-24 sm:px-8 sm:pt-4 sm:pb-32 lg:px-9 lg:pt-4 lg:pb-36">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,38%)_1fr_minmax(0,37.5%)] lg:gap-0">
            {/* Sticky Left Column (38%, hugging left edge cleanly with strict 4-line headline) */}
            <div className="lg:sticky lg:top-28 lg:col-start-1 lg:self-start">
              <GlassReveal y={14} blur={8} className="mb-10 max-w-[270px]">
                <div className="overflow-hidden rounded-[2px] border border-[#0E1117]/8 bg-[#F4F6F9]">
                  <img
                    src="/images/lobby-access.jpg"
                    alt="Minimalist modern corporate lobby equipped with brushed-steel biometric turnstiles"
                    loading="lazy"
                    width={540}
                    height={405}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </GlassReveal>

              <TextReveal
                id="about-heading"
                as="h2"
                theme="light"
                mutedLines={[0, 1]}
                duration={2.05}
                lines={['WE SECURE', 'ASSETS.', 'WE OWN', 'THE RESPONSE.']}
                className="font-display text-[clamp(2rem,3.35vw,3.35rem)] leading-[1.04] font-bold tracking-[-0.035em] whitespace-nowrap uppercase"
              />
            </div>

            {/* Right Column (pushed boldly toward right corner at ~62.5% with wide open middle gutter!) */}
            <div className="flex flex-col lg:col-start-3 lg:pt-1">
              <div className="max-w-[560px] space-y-6 pb-20 sm:pb-24">
                <ChromaticText
                  theme="light"
                  delay={0.08}
                  duration={2.15}
                  className="text-[19px] leading-[1.42] font-medium sm:text-[22px]"
                >
                  With every security layer under one PSARA-licensed command, your facility
                  operates the way modern enterprises demand: predictably, transparently, and
                  without excuses.
                </ChromaticText>
                <ChromaticText
                  theme="light"
                  delay={0.28}
                  duration={2.15}
                  className="text-[19px] leading-[1.42] font-medium sm:text-[22px]"
                >
                  No finger-pointing between vendors. No ghost shifts or missed handoffs.
                  Just one accountable Mysuru team from perimeter gate to boardroom.
                </ChromaticText>
                <div className="pt-5">
                  <a
                    href="#standards"
                    className="inline-flex items-center gap-2 rounded-full border border-[#0E1117]/22 px-7 py-3.5 font-nav text-[10.5px] font-semibold tracking-[0.1em] text-[#0E1117] uppercase transition-colors duration-200 hover:border-[#EA580C] hover:bg-[#EA580C] hover:text-white"
                  >
                    <ScrambleText text="LEARN MORE ABOUT US" />
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Oversized Numbers Positioned Boldly Toward Right Corner (matches Image 3 exact hierarchy) */}
              <div className="mt-10 space-y-14 pt-6 sm:mt-14 sm:space-y-16">
                <div className="border-b border-[#0E1117]/15 pb-3.5">
                  <ChromaticText
                    theme="light"
                    muted
                    duration={2.1}
                    className="text-xs font-medium tracking-[0.02em] sm:text-[13px]"
                  >
                    From countless shifts, accountability emerges
                  </ChromaticText>
                </div>

                {HERO_METRICS.map((item, idx) => (
                  <AnimatedMetric key={item.label} item={item} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
