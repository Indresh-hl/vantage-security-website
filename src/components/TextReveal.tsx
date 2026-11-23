import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface TextRevealProps {
  lines: string[];
  mutedLines?: number[];
  theme?: 'dark' | 'light';
  /** Luminous chromatic sweep tint: signature Signal Amber ('orange') or Verified Emerald ('green') */
  accent?: 'orange' | 'green';
  /** Sweep axis: left-to-right ('horizontal') or top-to-bottom ('vertical' for downward text) */
  direction?: 'horizontal' | 'vertical';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  id?: string;
  delay?: number;
  /** Per-line / per-letter stagger delay in seconds */
  stagger?: number;
  immediate?: boolean;
  /** Optional external trigger (used by horizontal Services cards or scroll-synced tracks) */
  trigger?: boolean;
  /** Duration of the slow, hypnotic luminous chromatic sweep per line */
  duration?: number;
}

/**
 * Unhurried, silky Luminous Chromatic Typography Reveal (Signal Amber Orange or Verified Emerald Green).
 * Triggers only once the element comfortably enters the viewer's reading zone (-16% bottom margin)
 * so headlines never finish revealing off-screen before you scroll to them.
 */
export function TextReveal({
  lines,
  mutedLines = [],
  theme = 'dark',
  accent = 'orange',
  direction = 'horizontal',
  className = '',
  as = 'h2',
  id,
  delay = 0,
  stagger = 0.2,
  immediate = false,
  trigger,
  duration = 1.9,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(containerRef, {
    once: true,
    margin: '0px 0px -16% 0px',
    amount: 0.2,
  });
  const isRevealed = immediate || (trigger !== undefined ? trigger : inView);
  const [settledLines, setSettledLines] = useState<Record<number, boolean>>({});
  const Tag = as;

  const isVertical = direction === 'vertical';
  const baseColor =
    accent === 'green'
      ? theme === 'dark'
        ? '#34D399'
        : '#059669'
      : theme === 'dark'
        ? '#FFFFFF'
        : '#0E1117';
  const mutedColor =
    accent === 'green'
      ? theme === 'dark'
        ? 'rgba(52, 211, 153, 0.45)'
        : 'rgba(5, 150, 105, 0.42)'
      : theme === 'dark'
        ? 'rgba(255, 255, 255, 0.44)'
        : 'rgba(14, 17, 23, 0.30)';

  const makeChromaticGradient = (finalInk: string) => {
    const deg = isVertical ? '180deg' : '90deg';
    if (accent === 'green') {
      return theme === 'dark'
        ? `linear-gradient(${deg}, ${finalInk} 0%, ${finalInk} 30%, #ECFDF5 40%, #10B981 51%, rgba(16,185,129,0.38) 60%, rgba(16,185,129,0) 69%, rgba(16,185,129,0) 100%)`
        : `linear-gradient(${deg}, ${finalInk} 0%, ${finalInk} 30%, #6EE7B7 40%, #059669 51%, rgba(5,150,105,0.30) 60%, rgba(5,150,105,0) 69%, rgba(5,150,105,0) 100%)`;
    }
    return theme === 'dark'
      ? `linear-gradient(${deg}, ${finalInk} 0%, ${finalInk} 32%, #FDBA74 41%, #EA580C 51%, rgba(234,88,12,0.34) 59%, rgba(234,88,12,0) 67%, rgba(234,88,12,0) 100%)`
      : `linear-gradient(${deg}, ${finalInk} 0%, ${finalInk} 32%, #FB923C 41%, #EA580C 51%, rgba(234,88,12,0.28) 59%, rgba(234,88,12,0) 67%, rgba(234,88,12,0) 100%)`;
  };

  return (
    <Tag ref={containerRef} id={id} className={className}>
      {lines.map((line, index) => {
        const isMuted = mutedLines.includes(index);
        const finalColor = isMuted ? mutedColor : baseColor;
        const lineDelay = delay + index * stagger;

        if (prefersReducedMotion) {
          return (
            <span key={`${line}-${index}`} className="block" style={{ color: finalColor }}>
              {line}
            </span>
          );
        }

        const startPos = isVertical ? '0% 100%' : '100% 0%';
        const endPos = '0% 0%';

        return (
          <span key={`${line}-${index}`} className="block pb-[0.04em]">
            <motion.span
              className="inline-block will-change-[background-position,transform,filter]"
              style={
                settledLines[index]
                  ? { color: finalColor }
                  : {
                      backgroundImage: makeChromaticGradient(finalColor),
                      backgroundSize: isVertical ? '100% 330%' : '330% 100%',
                      backgroundRepeat: 'no-repeat',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    }
              }
              initial={{
                backgroundPosition: startPos,
                y: isVertical ? -12 : 16,
                filter: 'blur(6px)',
              }}
              animate={
                isRevealed
                  ? {
                      backgroundPosition: endPos,
                      y: 0,
                      filter: 'blur(0px)',
                    }
                  : {
                      backgroundPosition: startPos,
                      y: isVertical ? -12 : 16,
                      filter: 'blur(6px)',
                    }
              }
              onAnimationComplete={() => {
                if (isRevealed && !settledLines[index]) {
                  setSettledLines((prev) => ({ ...prev, [index]: true }));
                }
              }}
              transition={{
                backgroundPosition: {
                  duration,
                  delay: lineDelay,
                  ease: [0.16, 0.72, 0.28, 1],
                },
                y: {
                  duration: duration * 0.65,
                  delay: lineDelay,
                  ease: [0.16, 0.72, 0.28, 1],
                },
                filter: {
                  duration: duration * 0.6,
                  delay: lineDelay,
                  ease: [0.16, 0.72, 0.28, 1],
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
