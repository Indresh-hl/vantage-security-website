import { type ReactNode, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface GlassRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  immediate?: boolean;
}

/**
 * Optical frosted-glass de-blur reveal for media frames, cards, and layout containers.
 * Waits until the element enters the comfortable viewing zone (-14% bottom margin).
 */
export function GlassReveal({
  children,
  className = '',
  delay = 0,
  y = 20,
  blur = 8,
  immediate = false,
}: GlassRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px -14% 0px',
    amount: 0.16,
  });
  const isRevealed = immediate || inView;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y,
        filter: `blur(${blur}px)`,
        scale: 0.992,
      }}
      animate={
        isRevealed
          ? {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
            }
          : {
              opacity: 0,
              y,
              filter: `blur(${blur}px)`,
              scale: 0.992,
            }
      }
      transition={{
        duration: 1.05,
        delay,
        ease: [0.16, 0.72, 0.28, 1],
      }}
      className={`will-change-[transform,opacity,filter] ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ChromaticTextProps {
  children: ReactNode;
  theme?: 'dark' | 'light';
  muted?: boolean;
  className?: string;
  delay?: number;
  duration?: number;
  immediate?: boolean;
  trigger?: boolean;
  as?: 'p' | 'span' | 'div';
}

/**
 * Slow, hypnotic left-to-right luminous Signal Amber-to-ink chromatic text sweep
 * for paragraphs, eyebrows, horizontal cards, and footer copy.
 */
export function ChromaticText({
  children,
  theme = 'dark',
  muted = false,
  className = '',
  delay = 0,
  duration = 1.8,
  immediate = false,
  trigger,
  as = 'p',
}: ChromaticTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px -15% 0px',
    amount: 0.2,
  });
  const isRevealed = immediate || (trigger !== undefined ? trigger : inView);
  const [settled, setSettled] = useState(false);

  const finalInk =
    theme === 'dark'
      ? muted
        ? '#CBD5E1'
        : '#FFFFFF'
      : muted
        ? '#525B6A'
        : '#0E1117';

  if (prefersReducedMotion) {
    const Tag = as;
    return (
      <Tag className={className} style={{ color: finalInk }}>
        {children}
      </Tag>
    );
  }

  const gradient =
    theme === 'dark'
      ? `linear-gradient(90deg, ${finalInk} 0%, ${finalInk} 32%, #FDBA74 41%, #EA580C 51%, rgba(234,88,12,0.32) 59%, rgba(234,88,12,0) 67%, rgba(234,88,12,0) 100%)`
      : `linear-gradient(90deg, ${finalInk} 0%, ${finalInk} 32%, #FB923C 41%, #EA580C 51%, rgba(234,88,12,0.28) 59%, rgba(234,88,12,0) 67%, rgba(234,88,12,0) 100%)`;

  const MotionTag = as === 'span' ? motion.span : as === 'div' ? motion.div : motion.p;

  return (
    <MotionTag
      ref={ref as never}
      className={`${as === 'p' ? 'block' : ''} ${className}`}
    >
      <motion.span
        className="inline-block will-change-[background-position,transform,filter]"
        style={
          settled
            ? { color: finalInk }
            : {
                backgroundImage: gradient,
                backgroundSize: '330% 100%',
                backgroundRepeat: 'no-repeat',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }
        }
        initial={{ backgroundPosition: '100% 0%', y: 10, filter: 'blur(4px)' }}
        animate={
          isRevealed
            ? { backgroundPosition: '0% 0%', y: 0, filter: 'blur(0px)' }
            : { backgroundPosition: '100% 0%', y: 10, filter: 'blur(4px)' }
        }
        onAnimationComplete={() => {
          if (isRevealed) setSettled(true);
        }}
        transition={{
          backgroundPosition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
          y: { duration: Math.min(duration * 0.55, 1.15), delay, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: Math.min(duration * 0.5, 1.05), delay, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {children}
      </motion.span>
    </MotionTag>
  );
}
