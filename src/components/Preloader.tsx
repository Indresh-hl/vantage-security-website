import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AGENCY_INFO } from '../data/agencyContent';

type PreloaderPhase = 'charging' | 'contract' | 'iris' | 'done';

function getStatusMessage(progress: number) {
  if (progress < 32) return { step: '01', text: 'VERIFYING PERIMETER' };
  if (progress < 66) return { step: '02', text: 'SOC TELEMETRY ONLINE' };
  if (progress < 96) return { step: '03', text: 'LOCKING ACCESS LAYERS' };
  return { step: 'OK', text: 'PROTECTION ACTIVE' };
}

export function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<PreloaderPhase>(() =>
    prefersReducedMotion ? 'done' : 'charging'
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('done');
      return;
    }

    // Deliberate, unhurried ~1.95s activation cadence so viewers feel safety loading cleanly
    const chargeDuration = 1920;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const t = Math.max(0, Math.min((now - start) / chargeDuration, 1));
      // Smooth cubic ease-in-out with crisp lock at 100%
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.max(0, Math.min(100, Math.round(eased * 100))));
      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    const tContract = window.setTimeout(() => setPhase('contract'), 2180);
    const tIris = window.setTimeout(() => setPhase('iris'), 2560);
    const tDone = window.setTimeout(() => setPhase('done'), 3260);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(tContract);
      window.clearTimeout(tIris);
      window.clearTimeout(tDone);
    };
  }, [prefersReducedMotion]);

  if (phase === 'done') return null;

  const status = getStatusMessage(progress);
  const isProtected = progress >= 96;
  const ringRadius = 60;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress / 100);

  return (
    <AnimatePresence>
      <motion.div
        key="perimeter-preloader"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'iris' ? 0 : 1 }}
        transition={{
          duration: phase === 'iris' ? 0.68 : 0.28,
          delay: phase === 'iris' ? 0.08 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Deep Obsidian Frosted Veil dissolving smoothly as the iris opens */}
        <motion.div
          className="absolute inset-0 bg-[#06080C]"
          animate={
            phase === 'iris'
              ? {
                  opacity: 0,
                  backdropFilter: 'blur(0px)',
                }
              : {
                  opacity: 1,
                  backdropFilter: 'blur(20px)',
                }
          }
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Expanding Concentric Precision Radar Rings + Warm Ambient Halo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={
            phase === 'contract'
              ? { scale: 0.56, opacity: 0.14 }
              : phase === 'iris'
                ? { scale: 2.5, opacity: 0 }
                : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.16)_0%,rgba(234,88,12,0.03)_48%,transparent_72%)] blur-2xl" />

          {[230, 400, 590, 820].map((size, idx) => (
            <motion.span
              key={size}
              initial={{ scale: 0.84, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.82,
                delay: idx * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ width: size, height: size }}
              className="absolute rounded-full border border-white/[0.065]"
            />
          ))}

          {/* Calm Optical Radar Cone Sweep */}
          <div
            className="preloader-radar-sweep absolute h-[590px] w-[590px] rounded-full opacity-55"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(234,88,12,0.22) 0deg, rgba(255,255,255,0.09) 24deg, transparent 70deg, transparent 360deg)',
            }}
          />
        </motion.div>

        {/* Frosted-Glass Iris Lens Orb — contracts cleanly then blooms wide to unveil the Hero */}
        <motion.div
          className="relative z-20 flex items-center justify-center rounded-full border border-white/22"
          style={{
            background:
              'radial-gradient(circle at 30% 26%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 44%, rgba(234,88,12,0.16) 78%, rgba(6,8,12,0.28) 100%)',
            boxShadow:
              'inset 0 1px 28px rgba(255,255,255,0.2), 0 0 72px rgba(234,88,12,0.22)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
          }}
          initial={{ width: 164, height: 164, opacity: 0, scale: 0.84 }}
          animate={
            phase === 'charging'
              ? { width: 164, height: 164, opacity: 1, scale: 1 }
              : phase === 'contract'
                ? { width: 78, height: 78, opacity: 1, scale: 0.96 }
                : { width: 78, height: 78, opacity: 0, scale: 28 }
          }
          transition={{
            duration: phase === 'iris' ? 0.7 : 0.38,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* SVG Circular Perimeter Activation Ring + Shield Fill */}
          <motion.div
            className="relative flex h-full w-full items-center justify-center"
            animate={{
              opacity: phase === 'charging' ? 1 : 0,
              scale: phase === 'charging' ? 1 : 0.62,
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 140 140" className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={ringRadius}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
              />
              <circle
                cx="70"
                cy="70"
                r={ringRadius}
                fill="none"
                stroke={isProtected ? '#EA580C' : '#FDBA74'}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                className="transition-colors duration-300"
              />
            </svg>

            {/* Geometric Shield Emblem Filling With Progress */}
            <div className="relative flex flex-col items-center justify-center gap-1.5">
              <svg viewBox="0 0 36 42" className="h-10 w-10">
                <defs>
                  <clipPath id="preloader-shield-fill">
                    <rect
                      x="0"
                      y={42 - (progress / 100) * 42}
                      width="36"
                      height={(progress / 100) * 42}
                    />
                  </clipPath>
                </defs>
                <path
                  d="M18 3L31 8.4V19.6C31 28.4 25.3 35.6 18 39C10.7 35.6 5 28.4 5 19.6V8.4L18 3Z"
                  fill="rgba(255,255,255,0.04)"
                  stroke="rgba(255,255,255,0.34)"
                  strokeWidth="1.4"
                />
                <path
                  d="M18 3L31 8.4V19.6C31 28.4 25.3 35.6 18 39C10.7 35.6 5 28.4 5 19.6V8.4L18 3Z"
                  fill="rgba(234,88,12,0.28)"
                  stroke="#EA580C"
                  strokeWidth="1.6"
                  clipPath="url(#preloader-shield-fill)"
                />
                <path
                  d="M13.2 20.8L16.5 24.1L23.2 16.8"
                  fill="none"
                  stroke={isProtected ? '#FFFFFF' : 'rgba(255,255,255,0.58)'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="font-mono-tech text-xs font-semibold tracking-[0.18em] text-white tabular-nums">
                {String(progress).padStart(2, '0')}%
              </span>
            </div>
          </motion.div>

          {/* Luminous Signal Amber Core during Glass Orb Contraction */}
          <motion.span
            className="absolute h-3.5 w-3.5 rounded-full bg-[#EA580C] shadow-[0_0_32px_rgba(234,88,12,0.95)]"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: phase === 'contract' ? 1 : 0,
              scale: phase === 'contract' ? 1.2 : 0.4,
            }}
            transition={{ duration: 0.24 }}
          />
        </motion.div>

        {/* Live Safety-Loading Status & Brand Telemetry Below Center Orb */}
        <motion.div
          className="absolute top-[calc(50%+112px)] z-20 flex flex-col items-center gap-3 text-center"
          animate={
            phase === 'charging'
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: -14, filter: 'blur(8px)' }
          }
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/14 bg-white/[0.05] px-4 py-1.5 backdrop-blur-md">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                isProtected
                  ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                  : 'bg-[#EA580C] shadow-[0_0_12px_rgba(234,88,12,0.9)]'
              }`}
            />
            <span className="font-mono-tech text-[10px] font-medium tracking-[0.22em] text-white uppercase">
              {status.step} // {status.text}
            </span>
          </div>

          <span className="font-brand text-xs tracking-[0.28em] text-white/75 uppercase">
            {AGENCY_INFO.brand}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
