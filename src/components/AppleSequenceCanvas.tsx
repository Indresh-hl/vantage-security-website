import { useEffect, useRef, useState, type MutableRefObject } from 'react';

export interface SequenceManifest {
  frameCount: number;
  fps: number;
  width: number;
  format: string;
  pattern: string;
  padLength: number;
}

interface AppleSequenceCanvasProps {
  manifest: SequenceManifest;
  /** Scrubbed scroll progress [0..1] written by GSAP ScrollTrigger */
  progressRef: MutableRefObject<number>;
  /** Static fallback frame ratio for prefers-reduced-motion / mobile */
  staticProgress?: number;
  /** Cover fills the cinematic frame edge-to-edge; contain preserves full uncropped bounds */
  fit?: 'cover' | 'contain';
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function buildFrameUrl(manifest: SequenceManifest, zeroBasedIndex: number) {
  const num = String(zeroBasedIndex + 1).padStart(manifest.padLength, '0');
  return manifest.pattern.replace('{index}', num);
}

/**
 * Apple-style 60fps Retina HTML5 Canvas WebP Image Sequence Scrubber.
 * - Loads Frame 1 instantly, then prioritizes sparse keyframes (every 6th frame) so rapid scrubbing
 *   never flashes blank, and backfills remaining frames in parallel off the main thread.
 * - Renders full-bleed photorealistic 16:9 frames cleanly at crisp Retina DPI without blend-mode washing.
 */
export function AppleSequenceCanvas({
  manifest,
  progressRef,
  staticProgress,
  fit = 'cover',
}: AppleSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadedPct, setLoadedPct] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || manifest.frameCount <= 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const total = manifest.frameCount;
    const frames: Array<HTMLImageElement | null> = new Array(total).fill(null);
    let cancelled = false;
    let loadedCount = 0;
    let lastDrawnIndex = -1;
    let canvasW = 0;
    let canvasH = 0;

    // Resize canvas to crisp Hi-DPI (capped at 2x for 60fps GPU safety)
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = parent.clientWidth || 1280;
      const cssH = parent.clientHeight || 720;
      canvasW = Math.round(cssW * dpr);
      canvasH = Math.round(cssH * dpr);
      canvas.width = canvasW;
      canvas.height = canvasH;
      lastDrawnIndex = -1;
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const drawFrame = (img: HTMLImageElement) => {
      if (!img.naturalWidth || !img.naturalHeight || !canvasW || !canvasH) return;
      ctx.fillStyle = '#06080C';
      ctx.fillRect(0, 0, canvasW, canvasH);

      const scale =
        fit === 'cover'
          ? Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight)
          : Math.min(canvasW / img.naturalWidth, canvasH / img.naturalHeight);

      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const dx = (canvasW - drawW) * 0.5;
      const dy = (canvasH - drawH) * 0.5;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    const findNearestLoaded = (targetIdx: number): { idx: number; img: HTMLImageElement } | null => {
      const exact = frames[targetIdx];
      if (exact) return { idx: targetIdx, img: exact };
      for (let offset = 1; offset < total; offset++) {
        if (targetIdx - offset >= 0 && frames[targetIdx - offset]) {
          return { idx: targetIdx - offset, img: frames[targetIdx - offset]! };
        }
        if (targetIdx + offset < total && frames[targetIdx + offset]) {
          return { idx: targetIdx + offset, img: frames[targetIdx + offset]! };
        }
      }
      return null;
    };

    // Progressive load queue: Frame 0 -> every 6th keyframe -> last frame -> backfill all
    const loadOrder: number[] = [];
    const seen = new Set<number>();
    const pushIdx = (i: number) => {
      if (!seen.has(i) && i >= 0 && i < total) {
        seen.add(i);
        loadOrder.push(i);
      }
    };
    pushIdx(0);
    for (let i = 0; i < total; i += 6) pushIdx(i);
    pushIdx(total - 1);
    for (let i = 0; i < total; i++) pushIdx(i);

    let cursor = 0;
    const loadNext = () => {
      if (cancelled || cursor >= loadOrder.length) return;
      const idx = loadOrder[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.src = buildFrameUrl(manifest, idx);

      const onDone = () => {
        if (cancelled) return;
        frames[idx] = img;
        loadedCount += 1;
        if (loadedCount === total || loadedCount % 12 === 0) {
          setLoadedPct(Math.round((loadedCount / total) * 100));
        }
        if (idx === 0 && lastDrawnIndex === -1) {
          drawFrame(img);
          lastDrawnIndex = 0;
        }
        loadNext();
      };

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(onDone).catch(onDone);
        } else {
          onDone();
        }
      };
      img.onerror = () => {
        if (!cancelled) loadNext();
      };
    };

    const concurrency = Math.min(8, loadOrder.length);
    for (let w = 0; w < concurrency; w++) loadNext();

    let smoothFrame = (staticProgress ?? progressRef.current) * (total - 1);
    let rafId = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const p = staticProgress !== undefined ? staticProgress : clamp01(progressRef.current);
      const targetFrame = p * (total - 1);
      smoothFrame += (targetFrame - smoothFrame) * 0.18;

      const wantedIdx = Math.max(0, Math.min(total - 1, Math.round(smoothFrame)));
      const found = findNearestLoaded(wantedIdx);
      if (found && found.idx !== lastDrawnIndex) {
        drawFrame(found.img);
        lastDrawnIndex = found.idx;
      }
    };

    tick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [fit, manifest, progressRef, staticProgress]);

  return (
    <div className="pointer-events-none relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-label="Scroll-scrubbed photorealistic Vantage Security architectural sequence"
      />

      {loadedPct > 0 && loadedPct < 100 && (
        <div className="pointer-events-none absolute right-6 bottom-3 z-20 rounded-full bg-black/55 px-2.5 py-1 font-mono-tech text-[9px] font-semibold tracking-[0.14em] text-white/80 uppercase backdrop-blur-sm">
          LOADING {loadedPct}%
        </div>
      )}
    </div>
  );
}
