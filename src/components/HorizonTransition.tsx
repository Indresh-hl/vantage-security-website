import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface HorizonTransitionProps {
  direction: 'dark-to-light' | 'light-to-dark';
}

export function HorizonTransition({ direction }: HorizonTransitionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Curved planetary horizon arc rises & flattens as user scrolls through the transition
  const arcY = useTransform(scrollYProgress, [0, 0.55, 1], ['48%', '4%', '-12%']);
  const arcScaleX = useTransform(scrollYProgress, [0, 0.65, 1], [1.15, 1.55, 2.2]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.45, 0.9], [0.55, 1, 0.85]);

  if (direction === 'dark-to-light') {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="relative h-44 w-full overflow-hidden bg-[#06080C] sm:h-60 lg:h-80"
      >
        {/* Atmospheric deep cobalt bloom rising behind the horizon dome */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: glowOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_75%_at_50%_100%,rgba(90,98,112,0.65)_0%,rgba(43,48,58,0.42)_42%,rgba(6,8,12,0)_78%)]"
        />

        {/* Rising luminous curved horizon dome transitioning obsidian -> charcoal -> crisp white */}
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: arcY,
                  scaleX: arcScaleX,
                }
          }
          className="pointer-events-none absolute inset-x-[-20%] -bottom-[55%] h-[145%] rounded-[100%_100%_0_0] bg-[radial-gradient(62%_75%_at_50%_92%,#FFFFFF_0%,#FFFFFF_46%,#D4D8DF_65%,#5A6270_80%,rgba(35,39,47,0)_100%)] shadow-[0_-24px_110px_rgba(90,98,112,0.55)] will-change-transform"
        />

        {/* Crisp white floor seam so the next white section connects with zero hairline gap */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-44 w-full overflow-hidden bg-white sm:h-60 lg:h-80"
    >
      {/* Atmospheric cobalt glow preceding the obsidian canvas */}
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_75%_at_50%_100%,rgba(90,98,112,0.58)_0%,rgba(43,48,58,0.35)_45%,rgba(255,255,255,0)_78%)]"
      />

      {/* Rising curved obsidian dome transitioning crisp white -> charcoal -> deep obsidian */}
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                y: arcY,
                scaleX: arcScaleX,
              }
        }
        className="pointer-events-none absolute inset-x-[-20%] -bottom-[55%] h-[145%] rounded-[100%_100%_0_0] bg-[radial-gradient(62%_75%_at_50%_92%,#06080C_0%,#06080C_48%,#23272F_68%,#5A6270_82%,rgba(212,216,223,0)_100%)] shadow-[0_-24px_110px_rgba(43,48,58,0.55)] will-change-transform"
      />

      {/* Crisp obsidian floor seam */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#06080C] to-transparent" />
    </div>
  );
}
