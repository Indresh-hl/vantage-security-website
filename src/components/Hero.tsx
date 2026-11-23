import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ChromaticText } from './GlassReveal';
import { ScrambleText } from './ScrambleText';
import { TextReveal } from './TextReveal';

export function Hero() {
  const runwayRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  // Scroll 0% -> 28%: Line-by-line masked upward clip-wipe matching 002310.mp4 frame 00:11
  const eyebrowY = useTransform(scrollYProgress, [0, 0.22, 1], ['0%', '-115%', '-115%']);
  const line1Y = useTransform(scrollYProgress, [0.02, 0.24, 1], ['0%', '-115%', '-115%']);
  const line2Y = useTransform(scrollYProgress, [0.04, 0.26, 1], ['0%', '-115%', '-115%']);
  const line3Y = useTransform(scrollYProgress, [0.06, 0.28, 1], ['0%', '-115%', '-115%']);
  const subY = useTransform(scrollYProgress, [0.06, 0.28, 1], ['0%', '-115%', '-115%']);
  const ctaY = useTransform(scrollYProgress, [0.08, 0.3, 1], ['0%', '-125%', '-125%']);
  const ctaOpacity = useTransform(scrollYProgress, [0.08, 0.28, 1], [1, 0, 0]);
  const contentPointerEvents = useTransform(scrollYProgress, (v) =>
    v < 0.26 ? 'auto' : 'none'
  );

  // Architectural HQ stays pinned and smoothly zooms/tilts while feathered U-gradient sweeps up
  const imageScale = useTransform(scrollYProgress, [0, 0.55, 1], [1.02, 1.18, 1.34]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, -1.1]);

  // Subtle Signal Amber rim glow expanding while scrolling into the feathered U-gradient
  const amberGlowOpacity = useTransform(scrollYProgress, [0.08, 0.48, 0.9], [0, 0.68, 0.2]);
  const amberGlowScale = useTransform(scrollYProgress, [0.08, 0.92], [0.75, 1.72]);

  if (prefersReducedMotion) {
    return (
      <section
        aria-labelledby="hero-heading"
        className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-[#06080C] pt-36 pb-14 sm:pt-44 sm:pb-20"
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <img
            src="/images/hero-hq.jpg"
            alt="Dusk architectural view of a modern glass-and-concrete corporate headquarters campus secured by Vantage Security in Karnataka"
            fetchPriority="high"
            width={1920}
            height={1080}
            className="h-full w-full object-cover object-[68%_center] sm:object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#06080C]/92 via-[#06080C]/50 to-[#06080C]/15"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#06080C] via-transparent to-[#06080C]/55"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <p className="mb-3.5 font-nav text-sm font-semibold tracking-[0.2em] text-white/90 uppercase sm:text-[15px]">
              ONE ACCOUNTABLE COMMAND
            </p>
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.2rem,4.9vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.03em] text-white uppercase"
            >
              EVERY
              <br />
              LAYER OF
              <br />
              PROTECTION
            </h1>
            <p className="mt-5 max-w-[340px] text-[13px] leading-[1.6] text-slate-300/90">
              Corporate guarding, biometric access control, and 24/7 SOC monitoring,
              unified across Karnataka under one PSARA-licensed command.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a
                href="#assessment"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-nav text-[11px] font-bold tracking-[0.14em] text-[#06080C] uppercase"
              >
                Request Site Assessment
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center rounded-full border border-white/25 bg-[#06080C]/60 px-6 py-3.5 font-nav text-[11px] font-bold tracking-[0.14em] text-white uppercase"
              >
                Our Services
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={runwayRef}
      aria-labelledby="hero-heading"
      className="relative z-10 h-[195vh] w-full bg-[#06080C] lg:h-[210vh]"
    >
      {/* Pinned Viewport Stage */}
      <div className="sticky top-0 flex h-[100svh] w-full flex-col justify-end overflow-hidden bg-[#06080C] pt-36 pb-12 sm:pt-44 sm:pb-16 lg:pb-20">
        {/* Layer 1: Full-Bleed Architectural HQ tied directly to scroll */}
        <motion.div
          style={{
            scale: imageScale,
            y: imageY,
            rotate: imageRotate,
          }}
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        >
          <img
            src="/images/hero-hq.jpg"
            alt="Dusk architectural view of a modern glass-and-concrete corporate headquarters campus secured by Vantage Security in Karnataka"
            fetchPriority="high"
            width={1920}
            height={1080}
            className="h-full w-full object-cover object-[68%_center] sm:object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#06080C]/92 via-[#06080C]/48 to-[#06080C]/12"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#06080C] via-transparent to-[#06080C]/55"
          />
        </motion.div>

        {/* Layer 2: Line-by-Line Masked Upward Wipe on Scroll (0% -> 28%) */}
        <motion.div
          style={{ pointerEvents: contentPointerEvents }}
          className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"
        >
          <div className="max-w-xl lg:max-w-[48%]">
            {/* Bigger Crisp Eyebrow ('ONE ACCOUNTABLE COMMAND' at 15px) — Chromatic Amber Sweep */}
            <div className="mb-3.5 overflow-hidden">
              <motion.div style={{ y: eyebrowY }} className="will-change-transform">
                <ChromaticText
                  theme="dark"
                  immediate
                  delay={2.55}
                  duration={1.65}
                  className="font-nav text-sm font-semibold tracking-[0.2em] uppercase sm:text-[15px]"
                >
                  ONE ACCOUNTABLE COMMAND
                </ChromaticText>
              </motion.div>
            </div>

            {/* Balanced 3-Line Display Stack — Unhurried Luminous Amber-to-White Sweep on Load + Masked Upward Clip on Scroll */}
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.15rem,4.7vw,4.55rem)] leading-[1.03] font-bold tracking-[-0.03em] text-white uppercase"
            >
              <span className="block overflow-hidden">
                <motion.span style={{ y: line1Y }} className="block will-change-transform">
                  <TextReveal as="p" theme="dark" immediate delay={2.65} duration={1.9} lines={['EVERY']} />
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span style={{ y: line2Y }} className="block will-change-transform">
                  <TextReveal as="p" theme="dark" immediate delay={2.88} duration={1.9} lines={['LAYER OF']} />
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span style={{ y: line3Y }} className="block will-change-transform">
                  <TextReveal as="p" theme="dark" immediate delay={3.12} duration={1.95} lines={['PROTECTION']} />
                </motion.span>
              </span>
            </h1>

            {/* Tighter Subtitle — Smooth Chromatic Sweep */}
            <div className="mt-5 overflow-hidden">
              <motion.div style={{ y: subY }} className="will-change-transform">
                <ChromaticText
                  theme="dark"
                  muted
                  immediate
                  delay={3.35}
                  duration={1.85}
                  className="max-w-[340px] text-[13px] leading-[1.6]"
                >
                  Corporate guarding, biometric access control, and 24/7 SOC monitoring —
                  unified across Karnataka under one PSARA command.
                </ChromaticText>
              </motion.div>
            </div>

            {/* Dual Pill CTAs */}
            <div className="mt-7 overflow-hidden py-1">
              <motion.div
                style={{ y: ctaY, opacity: ctaOpacity }}
                className="will-change-transform"
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.95, delay: 3.55, ease: [0.16, 0.72, 0.28, 1] }}
                  className="flex flex-wrap items-center gap-3.5 will-change-[transform,opacity,filter]"
                >
                  <a
                    href="#assessment"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-nav text-[11px] font-bold tracking-[0.14em] text-[#06080C] uppercase transition-colors duration-200 hover:bg-[#EA580C] hover:text-white"
                  >
                    <ScrambleText text="REQUEST SITE ASSESSMENT" />
                    <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#services"
                    className="inline-flex items-center rounded-full border border-white/25 bg-[#06080C]/60 px-6 py-3.5 font-nav text-[11px] font-bold tracking-[0.14em] text-white uppercase backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white hover:text-[#06080C]"
                  >
                    <ScrambleText text="OUR SERVICES" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Subtle Expanding Signal Amber Rim Glow */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: amberGlowOpacity,
            scale: amberGlowScale,
          }}
          className="pointer-events-none absolute -top-[14%] right-[-10%] z-20 h-[72vh] w-[72vh] rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.45)_0%,rgba(234,88,12,0.14)_45%,rgba(6,8,12,0)_74%)] blur-2xl will-change-transform"
        />
      </div>
    </section>
  );
}
