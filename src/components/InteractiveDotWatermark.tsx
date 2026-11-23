import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface DotParticle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heat: number;
  nx: number; // normalized 0..1 horizontal position for clean left-to-right optical wave reveal
}

interface InteractiveDotWatermarkProps {
  text: string;
}

/**
 * Full edge-to-edge heavy Unbounded Black (900) high-density interactive halftone dot-matrix
 * matching the bold display typography of the landing page. Enters with a smooth left-to-right
 * optical wave sweep on scroll and responds with a crisp Signal Amber + charcoal magnetic ripple.
 */
export function InteractiveDotWatermark({ text }: InteractiveDotWatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots: DotParticle[] = [];
    let rafId = 0;
    let resizeRafId = 0;
    let width = 0;
    let height = 0;
    let isDisposed = false;

    const pointer = { x: -9999, y: -9999, active: false };
    let hasTriggeredReveal = Boolean(prefersReducedMotion);
    let revealStartTime = 0;
    let revealProgress = prefersReducedMotion ? 1 : 0;

    const buildDots = () => {
      const rect = container.getBoundingClientRect();
      const nextWidth = Math.max(300, Math.floor(rect.width - 16));
      if (nextWidth === width && dots.length > 0) return;

      width = nextWidth;
      height = Math.max(92, Math.min(230, Math.floor(width * 0.145)));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rasterize heavy Unbounded Black (900) matching the bold hero display style, edge-to-edge (~96% width)
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      const upper = text.toUpperCase();
      let fontSize = Math.floor(width * 0.088);
      const makeFont = (sz: number) => `900 ${sz}px "Unbounded", "Inter", system-ui, sans-serif`;
      offCtx.font = makeFont(fontSize);

      // Measure width and scale precisely to 96% of container width so letters span boldly edge-to-edge
      const measured = offCtx.measureText(upper).width;
      const maxWidth = width * 0.96;
      if (measured > 0) {
        fontSize = Math.floor(fontSize * (maxWidth / measured));
        offCtx.font = makeFont(fontSize);
      }

      // Slight vertical stretch gives towering architectural presence matching giant editorial wordmarks
      const vStretch = Math.min(1.36, (height * 0.78) / Math.max(fontSize * 0.74, 1));

      offCtx.save();
      offCtx.translate(width / 2, height / 2);
      offCtx.scale(1, Math.max(1.06, vStretch));
      offCtx.fillStyle = '#000000';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(upper, 0, fontSize * 0.04);
      offCtx.restore();

      const imageData = offCtx.getImageData(0, 0, width, height).data;
      // High-density crisp halftone matrix (much finer & fuller than sparse dots)
      const step = width < 480 ? 3 : width < 960 ? 4 : 5;
      const nextDots: DotParticle[] = [];

      for (let y = 2; y < height - 2; y += step) {
        for (let x = 2; x < width - 2; x += step) {
          const alpha = imageData[(y * width + x) * 4 + 3];
          if (alpha > 96) {
            nextDots.push({
              ox: x,
              oy: y,
              x,
              y,
              vx: 0,
              vy: 0,
              heat: 0,
              nx: x / width,
            });
          }
        }
      }
      dots = nextDots;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      if (!hasTriggeredReveal && !prefersReducedMotion) return;
      const radius = width < 480 ? 1.15 : width < 960 ? 1.48 : 1.75;
      ctx.fillStyle = 'rgba(14, 17, 23, 0.24)';
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        ctx.beginPath();
        ctx.arc(d.ox, d.oy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      if (isDisposed) return;
      ctx.clearRect(0, 0, width, height);

      if (hasTriggeredReveal && revealProgress < 1) {
        const elapsed = now - revealStartTime;
        const t = Math.min(elapsed / 1650, 1);
        revealProgress = 1 - Math.pow(1 - t, 2.6);
      }

      const baseRadius = width < 480 ? 1.15 : width < 960 ? 1.48 : 1.75;
      const influenceRadius = width < 640 ? 64 : 112;
      let needsAnotherFrame = pointer.active || (hasTriggeredReveal && revealProgress < 1);

      // Wavefront position sweeps slightly past 1.0 so trailing dots finish cleanly
      const waveHead = revealProgress * 1.24;

      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];

        // Individual dot reveal progress (0 -> 1) along the smooth left-to-right optical wave
        const localReveal = prefersReducedMotion
          ? 1
          : Math.max(0, Math.min(1, (waveHead - d.nx) / 0.24));

        if (localReveal <= 0.005) continue;

        const easedReveal = 1 - Math.pow(1 - localReveal, 3);
        const revealOffsetY = (1 - easedReveal) * 18;
        // Brief optical luminous sheen right as the wavefront passes over each column of dots
        const waveSheen = localReveal < 1 ? Math.sin(localReveal * Math.PI) : 0;

        if (pointer.active && localReveal > 0.7) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < influenceRadius * influenceRadius && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const proximity = 1 - dist / influenceRadius;
            const force = proximity * 5.6;
            d.vx += (dx / dist) * force;
            d.vy += (dy / dist) * force;
            d.heat = Math.min(1, d.heat + proximity * 0.34);
          }
        }

        // Crisp magnetic spring return toward exact origin grid
        d.vx += (d.ox - d.x) * 0.13;
        d.vy += (d.oy - d.y) * 0.13;
        d.vx *= 0.76;
        d.vy *= 0.76;
        d.x += d.vx;
        d.y += d.vy;
        d.heat *= 0.89;

        if (
          Math.abs(d.vx) > 0.02 ||
          Math.abs(d.vy) > 0.02 ||
          Math.abs(d.ox - d.x) > 0.05 ||
          Math.abs(d.oy - d.y) > 0.05 ||
          d.heat > 0.015
        ) {
          needsAnotherFrame = true;
        }

        const r = baseRadius * (0.3 + easedReveal * 0.7) + d.heat * 1.15 + waveSheen * 0.45;

        if (d.heat > 0.04) {
          // Crisp charcoal-to-Signal Amber magnetic glow near cursor core
          const rCol = Math.round(14 + d.heat * (234 - 14));
          const gCol = Math.round(17 + d.heat * (88 - 17));
          const bCol = Math.round(23 + d.heat * (12 - 23));
          const alpha = (0.34 + d.heat * 0.64) * easedReveal;
          ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha.toFixed(3)})`;
        } else if (waveSheen > 0.08) {
          const alpha = (0.24 + waveSheen * 0.36) * easedReveal;
          ctx.fillStyle = `rgba(58, 64, 75, ${alpha.toFixed(3)})`;
        } else {
          const alpha = 0.24 * easedReveal;
          ctx.fillStyle = `rgba(14, 17, 23, ${alpha.toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y + revealOffsetY, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (needsAnotherFrame) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const kickLoop = () => {
      if (!rafId && !prefersReducedMotion && !isDisposed) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion || !hasTriggeredReveal) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      kickLoop();
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
      kickLoop();
    };

    const init = () => {
      if (isDisposed) return;
      buildDots();
      if (prefersReducedMotion) {
        drawStatic();
      } else if (hasTriggeredReveal) {
        kickLoop();
      }
    };

    // Explicitly load Unbounded 900 before rasterizing so the halftone matrix never falls back to system font
    const loadFonts = async () => {
      try {
        if (document.fonts?.load) {
          await document.fonts.load('900 110px "Unbounded"');
        }
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Proceed with available font gracefully
      }
      init();
    };

    void loadFonts();

    // Clean scroll-triggered left-to-right optical wave reveal when footer comes into view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasTriggeredReveal) {
            hasTriggeredReveal = true;
            revealStartTime = performance.now();
            revealProgress = 0;
            kickLoop();
            intersectionObserver.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.2 }
    );
    intersectionObserver.observe(container);

    const resizeObserver = new ResizeObserver(() => {
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        buildDots();
        if (prefersReducedMotion || revealProgress >= 1) {
          drawStatic();
        } else if (hasTriggeredReveal) {
          kickLoop();
        }
      });
    });
    resizeObserver.observe(container);

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      isDisposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [prefersReducedMotion, text]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="w-full overflow-hidden border-t border-[#0E1117]/10 px-2 pt-8 pb-5 select-none sm:px-4 sm:pt-10 sm:pb-6"
    >
      <canvas ref={canvasRef} className="mx-auto block cursor-crosshair" />
    </div>
  );
}
