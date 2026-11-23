import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%/';

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Optional: trigger scramble once automatically on mount (e.g., sticky nav reveal) */
  autoOnMount?: boolean;
  /** Duration in milliseconds (default 460ms for silky time-based wave) */
  durationMs?: number;
}

export function ScrambleText({
  text,
  className = '',
  autoOnMount = false,
  durationMs = 460,
}: ScrambleTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);
  const lastGlyphSwapRef = useRef(0);

  const triggerScramble = useCallback(() => {
    if (prefersReducedMotion) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    const startTime = performance.now();
    lastGlyphSwapRef.current = 0;
    const preserve = new Set([' ', '·', '/', '&', '-', '→', '+']);
    const len = text.length;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Throttle random glyph swaps slightly (~34ms) for crisp, readable kinetic motion on 60/120/144Hz screens
      if (progress < 1 && now - lastGlyphSwapRef.current < 32) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }
      lastGlyphSwapRef.current = now;

      // Phase 1 (0 -> 0.25): scramble wave sweeps across the word
      // Phase 2 (0.25 -> 1.0): characters lock smoothly left-to-right into final text
      const waveHead = Math.min(len, Math.ceil((progress / 0.28) * len));
      const resolvedCount =
        progress <= 0.24 ? 0 : Math.floor(((progress - 0.24) / 0.76) * len);

      let next = '';
      for (let i = 0; i < len; i += 1) {
        const ch = text[i];
        if (preserve.has(ch) || i < resolvedCount || i >= waveHead) {
          next += ch;
        } else {
          const idx = Math.floor(Math.random() * GLYPHS.length);
          const glyph = GLYPHS[idx];
          const isLower = ch === ch.toLowerCase() && ch !== ch.toUpperCase();
          next += isLower ? glyph.toLowerCase() : glyph;
        }
      }

      setDisplay(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [durationMs, prefersReducedMotion, text]);

  useEffect(() => {
    setDisplay(text);
    if (autoOnMount && !prefersReducedMotion) {
      triggerScramble();
    }
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [autoOnMount, prefersReducedMotion, text, triggerScramble]);

  return (
    <span
      onPointerEnter={triggerScramble}
      onFocus={triggerScramble}
      className={`inline-block transition-transform duration-200 will-change-transform ${className}`}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {display}
      </span>
    </span>
  );
}
