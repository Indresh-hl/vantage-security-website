import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Unified inertial smooth scrolling (Lenis) frame-locked to GSAP ScrollTrigger via gsap.ticker.
 * Guarantees zero scroll stutter or desync across 3D Three.js camera splines, horizontal rails,
 * and Motion scroll reveals. Automatically disabled under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.082,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });

    document.documentElement.classList.add('lenis', 'lenis-smooth');

    // Sync Lenis virtual scroll position directly into GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Smoothly glide on in-page hash link clicks (#about, #services, #standards, #assessment, etc.)
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      if (href === '#') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.4 });
        return;
      }

      const dest = document.querySelector<HTMLElement>(href);
      if (dest) {
        e.preventDefault();
        lenis.scrollTo(dest, { duration: 1.45, offset: -12 });
      }
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      gsap.ticker.remove(onTick);
      document.removeEventListener('click', onAnchorClick);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return null;
}
