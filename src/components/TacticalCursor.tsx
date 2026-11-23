import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function TacticalCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'default' | 'interactive' | 'hidden'>('default');

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const ringX = useSpring(rawX, { stiffness: 360, damping: 32, mass: 0.4 });
  const ringY = useSpring(rawY, { stiffness: 360, damping: 32, mass: 0.4 });

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-cursor="orb-zone"]')) {
        setMode('hidden');
      } else if (
        target?.closest('a, button, summary, input, select, textarea, label, [data-cursor="interactive"]')
      ) {
        setMode('interactive');
      } else {
        setMode('default');
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const isInteractive = mode === 'interactive';
  const isHidden = mode === 'hidden' || !visible;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: ringX, y: ringY }}
      animate={{
        opacity: isHidden ? 0 : 1,
        scale: isInteractive ? 1.38 : 1,
      }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed top-0 left-0 z-[70] -mt-5 -ml-5 h-10 w-10 mix-blend-difference"
    >
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90 overflow-visible">
        {/* Subtle base reticle ring */}
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.25"
        />
        {/* Live scroll-progress arc mirroring United Carriers cursor ring */}
        <motion.circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.65"
          strokeLinecap="round"
          style={{ pathLength: smoothProgress }}
        />
      </svg>
      {/* Center tactical precision dot */}
      <motion.span
        animate={{ scale: isInteractive ? 0.5 : 1 }}
        transition={{ duration: 0.18 }}
        className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
    </motion.div>
  );
}
