import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface SceneWashTransitionProps {
  direction: 'dark-to-light' | 'light-to-dark';
  eyebrow?: string;
}

export function SceneWashTransition({ direction, eyebrow }: SceneWashTransitionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Tight, continuous curved cobalt horizon sweep with ZERO dead blank viewport pause
  const domeY = useTransform(scrollYProgress, [0, 0.65, 1], ['55%', '0%', '-15%']);
  const domeScaleX = useTransform(scrollYProgress, [0, 0.7, 1], [1.15, 1.85, 2.35]);
  const labelOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.85], [0, 1, 0]);

  const isToLight = direction === 'dark-to-light';

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className={`h-24 w-full ${
          isToLight ? 'horizon-dark-to-light' : 'horizon-light-to-dark'
        }`}
      />
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative flex h-40 w-full items-center justify-center overflow-hidden sm:h-52 lg:h-64 ${
        isToLight ? 'bg-[#06080C]' : 'bg-white'
      }`}
    >
      {/* Curved Charcoal Atmospheric Horizon Dome */}
      <motion.div
        style={{ y: domeY, scaleX: domeScaleX }}
        className={`pointer-events-none absolute inset-x-[-25%] -bottom-[55%] h-[155%] rounded-[100%_100%_0_0] will-change-transform ${
          isToLight
            ? 'bg-[radial-gradient(62%_74%_at_50%_88%,#FFFFFF_0%,#FFFFFF_45%,#D4D8DF_64%,#5A6270_80%,rgba(35,39,47,0)_100%)] shadow-[0_-28px_110px_rgba(90,98,112,0.55)]'
            : 'bg-[radial-gradient(62%_74%_at_50%_88%,#06080C_0%,#06080C_46%,#23272F_66%,#5A6270_82%,rgba(212,216,223,0)_100%)] shadow-[0_-28px_110px_rgba(43,48,58,0.55)]'
        }`}
      />

      {eyebrow && (
        <motion.span
          style={{ opacity: labelOpacity }}
          className={`relative z-10 font-mono-tech text-[10px] tracking-[0.22em] uppercase sm:text-[11px] ${
            isToLight ? 'text-[#2B303A]' : 'text-[#CBD5E1]'
          }`}
        >
          {eyebrow}
        </motion.span>
      )}

      {/* Clean floor seam */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t ${
          isToLight ? 'from-white to-transparent' : 'from-[#06080C] to-transparent'
        }`}
      />
    </div>
  );
}
