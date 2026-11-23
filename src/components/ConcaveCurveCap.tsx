import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface ConcaveCurveCapProps {
  /** Surface color of the incoming section below the atmospheric horizon */
  target: 'white' | 'obsidian';
  /** Outgoing solid surface color behind the horizon ('transparent' only over pinned photos) */
  from?: 'transparent' | 'white' | 'obsidian' | 'carbon';
  /**
   * 'bowl' = giant concave U-bowl (∪) curving higher at left/right flanks with dark center dip
   *          (exact match for Hero -> About in 115602.mp4 & screenshots 1-3).
   * 'dome' = convex planetary horizon dome (∩) arching upward in the center.
   */
  shape?: 'dome' | 'bowl';
  /** Height of the horizon band */
  className?: string;
}

const FROM_BG_CLASS: Record<NonNullable<ConcaveCurveCapProps['from']>, string> = {
  transparent: '',
  white: 'bg-white',
  obsidian: 'bg-[#06080C]',
  carbon: 'bg-[#090C11]',
};

/**
 * Pure CSS Mathematical Atmospheric Horizon Transition (ZERO SVG blur clipping, ZERO straight cut lines).
 *
 * - 'bowl' geometry proof (`112% 84% at 50% -10%`):
 *   Top-center (50%, 0%) r = 11.9% < 48% -> 0.00% transparent.
 *   Top-left/right corners (0%, 0% & 100%, 0%) r = 46.1% < 48% -> 0.00% transparent (ZERO top cut line).
 *   Left & right flanks sweep cleanly UPWARD while dark Hero space dips deep into the middle (exact ∪ bowl).
 *   Bottom edge (0%..100%, 100%) r >= 131% > 95% -> 100.00% pure solid #FFFFFF (ZERO bottom seam).
 *
 * - 'dome' geometry proof (`128% 88% at 50% 108%`):
 *   Entire top edge r >= 122% > 94% -> 0.00% transparent.
 *   Entire bottom edge r <= 40.1% < 43% -> 100.00% pure solid target color.
 */
export function ConcaveCurveCap({
  target,
  from = 'transparent',
  shape = 'dome',
  className = '',
}: ConcaveCurveCapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Subtle vertical breathing on scroll while keeping top fade strictly 0% alpha
  const curveScaleY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shape === 'bowl' ? [1.06, 1.0, 0.88] : [1.04, 0.98, 0.86]
  );

  const isToWhite = target === 'white';

  const gradientBg =
    shape === 'bowl'
      ? // Exact Concave U-Bowl (∪) matching 115602.mp4 00:01-00:05 & screenshots 1-3 in Vantage's Obsidian + Signal Amber palette
        'radial-gradient(112% 84% at 50% -10%, rgba(6, 8, 12, 0) 0%, rgba(6, 8, 12, 0) 46%, rgba(67, 20, 7, 0.48) 57%, rgba(194, 65, 12, 0.84) 68%, #EA580C 76%, #FB923C 84%, #FFEDD5 91%, #FFFFFF 96%, #FFFFFF 100%)'
      : isToWhite
        ? 'radial-gradient(128% 88% at 50% 108%, #FFFFFF 0%, #FFFFFF 43%, #FFF7ED 54%, #FDBA74 64%, #EA580C 73%, rgba(124, 45, 18, 0.48) 82%, rgba(6, 8, 12, 0) 94%)'
        : 'radial-gradient(128% 88% at 50% 108%, #06080C 0%, #06080C 43%, #1A0D0A 54%, #7C2D12 63%, #EA580C 72%, rgba(251, 146, 60, 0.42) 82%, rgba(255, 255, 255, 0) 94%)';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none relative w-full overflow-x-clip select-none ${FROM_BG_CLASS[from]} ${className}`}
    >
      <motion.div
        style={
          prefersReducedMotion
            ? { background: gradientBg }
            : {
                background: gradientBg,
                scaleY: curveScaleY,
                transformOrigin: 'bottom center',
              }
        }
        className="h-full w-full will-change-transform"
      />
      {/* Bright-white lower skirt theme probe so scroll-up floating header stays dark ink over the white mist edge */}
      {isToWhite && (
        <div
          data-nav-theme="light"
          className={`pointer-events-none absolute inset-x-0 bottom-0 ${
            shape === 'bowl' ? 'h-[33%]' : 'h-[42%]'
          }`}
        />
      )}
      {/* Non-transformed 8px floor seal prevents 0.5px subpixel bleed under GPU scaleY */}
      <div
        className={`absolute inset-x-0 -bottom-px h-2 ${
          isToWhite ? 'bg-white' : 'bg-[#06080C]'
        }`}
      />
    </div>
  );
}
