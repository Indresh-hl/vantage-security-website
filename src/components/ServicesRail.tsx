import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView, useReducedMotion } from 'motion/react';
import { SERVICES, type ServiceItem } from '../data/agencyContent';
import { ChromaticText, GlassReveal } from './GlassReveal';
import { ScrambleText } from './ScrambleText';
import { StudioCinemaCampus } from './StudioCinemaCampus';
import { TextReveal } from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

const CAMERA_BEATS = [
  { label: 'AERIAL PERIMETER · 120° APPROACH' },
  { label: 'GATE 01 · VEHICLE VERIFICATION' },
  { label: 'SITE CONTROL · LIVE MONITORING' },
  { label: 'FULL CAMPUS · CLOUD OVERWATCH' },
];

const TWO_LINE_TITLES: Record<string, [string, string]> = {
  'corporate-guarding': ['MANNED', 'GUARDING'],
  'access-control': ['ACCESS', 'CONTROL'],
  'cctv-soc': ['24/7 SOC', 'MONITORING'],
  'executive-protection': ['EXECUTIVE', 'PROTECTION'],
  'risk-assessments': ['SITE RISK', '& AUDITS'],
  'mobile-response': ['RAPID QRT', 'PATROL'],
};

/**
 * Crisp 9x8 architectural dot-matrix SVG icons matching the editorial rail language.
 */
const DOT_PATTERNS: Record<ServiceItem['icon'], string[]> = {
  shield: [
    '..xxxxx..',
    '.xxxxxxx.',
    '.xx...xx.',
    '.xx.x.xx.',
    '.xx...xx.',
    '..xx.xx..',
    '...xxx...',
    '....x....',
  ],
  scan: [
    'xx.....xx',
    'x.......x',
    '..xxxxx..',
    '..x...x..',
    '..xxxxx..',
    'x.......x',
    'xx.....xx',
    '.........',
  ],
  cctv: [
    '...xxx...',
    '.xx...xx.',
    'x..xxx..x',
    'x.x.x.x.x',
    'x..xxx..x',
    '.xx...xx.',
    '...xxx...',
    '....x....',
  ],
  userCheck: [
    '...xxx...',
    '...xxx...',
    '....x....',
    '.xxxxxxx.',
    'xx..x..xx',
    'xx.....xx',
    '..xx.xx..',
    '..xx.xx..',
  ],
  clipboard: [
    '..xxxxx..',
    '.x..x..x.',
    '.x.....x.',
    '.x.xxx.x.',
    '.x.xxx.x.',
    '.x.x...x.',
    '.xxxxxxx.',
    '.........',
  ],
  radio: [
    '...xxx...',
    '.xx...xx.',
    'x..xxx..x',
    '..x...x..',
    '....x....',
    '...xxx...',
    '..x...x..',
    '.x.....x.',
  ],
};

function DotMatrixIcon({
  icon,
  isActive,
}: {
  icon: ServiceItem['icon'];
  isActive: boolean;
}) {
  const rows = DOT_PATTERNS[icon];
  return (
    <svg
      width="36"
      height="32"
      viewBox="0 0 36 32"
      fill="none"
      aria-hidden="true"
      className={`mb-7 transition-colors duration-300 ${
        isActive ? 'text-[#EA580C]' : 'text-white/90 group-hover:text-[#EA580C]'
      }`}
    >
      {rows.map((row, rIdx) =>
        row.split('').map((cell, cIdx) =>
          cell === 'x' ? (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx * 4 + 0.6}
              y={rIdx * 4 + 0.6}
              width="2.6"
              height="2.6"
              rx="0.4"
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function ServiceColumn({
  service,
  isActive,
  isRevealed,
}: {
  service: ServiceItem;
  isActive: boolean;
  isRevealed: boolean;
}) {
  const titleLines = TWO_LINE_TITLES[service.id] ?? [service.title];

  return (
    <article className="group relative flex h-[230px] flex-col justify-center border-l border-white/14 px-12 transition-opacity duration-500 xl:px-16">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-[-1px] h-16 w-[2px] -translate-y-1/2 rounded-full transition-all duration-500 ${
          isActive ? 'bg-[#EA580C] opacity-100' : 'opacity-0'
        }`}
      />

      <DotMatrixIcon icon={service.icon} isActive={isActive} />

      <TextReveal
        as="h3"
        theme="dark"
        trigger={isRevealed}
        duration={1.55}
        lines={titleLines}
        className="font-display text-[19px] leading-[1.14] font-bold tracking-[-0.02em] uppercase xl:text-[22px]"
      />

      <ChromaticText
        theme="dark"
        muted
        trigger={isRevealed}
        delay={0.18}
        duration={1.55}
        className="mt-4 max-w-[285px] text-[13px] leading-[1.65] xl:text-[13.5px]"
      >
        {service.summary}
      </ChromaticText>
    </article>
  );
}

function DesktopServicesRail() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Compositor-only refs for the 3-act choreography:
  // Act 1: Split-screen Cinema (top 50vh) + Horizontal Rail (bottom 50vh)
  // Act 2: 3D Obsidian Perspective Turn (horizontal rail folds to black in 3D as cinema expands full-screen)
  // Act 3: Volumetric White Cloud Bloom -> seamless pure #FFFFFF into StandardsShowcase
  const cinemaWrapRef = useRef<HTMLDivElement | null>(null);
  const cinemaVignetteRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const railShellRef = useRef<HTMLDivElement | null>(null);
  const railContentRef = useRef<HTMLDivElement | null>(null);
  const railCtaRef = useRef<HTMLDivElement | null>(null);
  const cloudLeftRef = useRef<HTMLDivElement | null>(null);
  const cloudRightRef = useRef<HTMLDivElement | null>(null);
  const cloudTopRef = useRef<HTMLDivElement | null>(null);
  const cloudWhiteoutRef = useRef<HTMLDivElement | null>(null);
  const spineGuideRef = useRef<HTMLDivElement | null>(null);

  const videoProgressRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const [activeBeat, setActiveBeat] = useState(0);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [revealedUpTo, setRevealedUpTo] = useState(2);
  const [isWhiteCloudPhase, setIsWhiteCloudPhase] = useState(false);

  const railEntered = useInView(outerRef, {
    once: true,
    margin: '0px 0px -15% 0px',
  });

  useEffect(() => {
    const outer = outerRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!outer || !viewport || !track) return;

    const getScrollDistance = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth + 64);

    const applyVisualChoreography = (p: number) => {
      // Map page scroll [0..0.95] -> full 241-frame AI Master video [0..1]
      // Video hits aerial cloud swell around 0.80..1.00 right during Acts 2 & 3!
      videoProgressRef.current = clamp01(p / 0.94);

      const beat = p < 0.24 ? 0 : p < 0.48 ? 1 : p < 0.72 ? 2 : 3;
      setActiveBeat((prev) => (prev === beat ? prev : beat));

      // Horizontal service highlight runs during Act 1 (p: 0.08 -> 0.72)
      const srvNorm = clamp01((p - 0.1) / 0.6);
      const idx = Math.min(SERVICES.length - 1, Math.floor(srvNorm * SERVICES.length));
      setActiveServiceIdx((prev) => (prev === idx ? prev : idx));
      setRevealedUpTo((prev) => Math.max(prev, Math.min(SERVICES.length - 1, idx + 2)));

      const cloudLight = p > 0.9;
      setIsWhiteCloudPhase((prev) => (prev === cloudLight ? prev : cloudLight));

      if (prefersReducedMotion) return;

      // ─── ACT 2 (p = 0.70 -> 0.87): 3D HORIZONTAL-SCROLL-TO-BLACK PERSPECTIVE TURN ───
      // 1) Horizontal rail text & CTA dissolve cleanly into deep obsidian black
      const railFadeOut = smoothstep(0.69, 0.78, p);
      // 2) Obsidian rail panel tilts backward in 3D perspective & drops away as the cinema opens full-bleed
      const turn3D = smoothstep(0.73, 0.87, p);
      // 3) Cinema smoothly glides from top-half framing into dramatic 3D centered full-screen over black
      const cinemaCenterShift = (1 - turn3D) * -25; // vh
      const cinemaTilt = Math.sin(turn3D * Math.PI) * 14; // peaks at 14deg 3D perspective turn!
      const cinemaScale = 1 + turn3D * 0.06 + smoothstep(0.86, 0.98, p) * 0.1;

      if (railContentRef.current) {
        railContentRef.current.style.opacity = (1 - railFadeOut).toFixed(4);
        railContentRef.current.style.transform = `translate3d(0, ${(railFadeOut * 28).toFixed(1)}px, 0)`;
      }

      if (railCtaRef.current) {
        railCtaRef.current.style.opacity = (1 - railFadeOut).toFixed(4);
      }

      if (railShellRef.current) {
        // Horizontal rail turns obsidian-black and folds down in 3D space (compositor-only transform)
        const foldDeg = turn3D * 64;
        const dropVh = turn3D * 52;
        const zDepth = -turn3D * 140;
        railShellRef.current.style.transform = `perspective(1350px) translate3d(0, ${dropVh.toFixed(2)}vh, ${zDepth.toFixed(1)}px) rotateX(${foldDeg.toFixed(2)}deg)`;
        railShellRef.current.style.opacity = (1 - smoothstep(0.82, 0.89, p)).toFixed(4);
      }

      if (cinemaWrapRef.current) {
        cinemaWrapRef.current.style.transform = `perspective(1500px) translate3d(0, ${cinemaCenterShift.toFixed(2)}vh, 0) rotateX(${cinemaTilt.toFixed(2)}deg) scale(${cinemaScale.toFixed(4)})`;
      }

      if (cinemaVignetteRef.current) {
        // Deep 3D obsidian spatial framing peaks during the 3D turn, then clears as white clouds bloom
        const darkVignette = smoothstep(0.7, 0.82, p) * (1 - smoothstep(0.88, 0.95, p));
        cinemaVignetteRef.current.style.opacity = darkVignette.toFixed(4);
      }

      if (badgeRef.current) {
        badgeRef.current.style.opacity = (1 - smoothstep(0.84, 0.91, p)).toFixed(4);
      }

      // ─── ACT 3 (p = 0.84 -> 1.00): VOLUMETRIC CLOUD BLOOM TO PURE LUMINOUS #FFFFFF ───
      const cloudIn = smoothstep(0.84, 0.96, p);
      const whiteout = smoothstep(0.91, 0.985, p);

      if (cloudLeftRef.current) {
        cloudLeftRef.current.style.opacity = cloudIn.toFixed(4);
        cloudLeftRef.current.style.transform = `translate3d(${(-46 + cloudIn * 44).toFixed(2)}%, ${(10 - cloudIn * 10).toFixed(2)}%, 0) scale(${(0.92 + cloudIn * 0.34).toFixed(4)})`;
      }
      if (cloudRightRef.current) {
        cloudRightRef.current.style.opacity = cloudIn.toFixed(4);
        cloudRightRef.current.style.transform = `translate3d(${(46 - cloudIn * 44).toFixed(2)}%, ${(-8 + cloudIn * 8).toFixed(2)}%, 0) scale(${(0.92 + cloudIn * 0.34).toFixed(4)})`;
      }
      if (cloudTopRef.current) {
        cloudTopRef.current.style.opacity = (cloudIn * 0.95).toFixed(4);
        cloudTopRef.current.style.transform = `translate3d(0, ${(-42 + cloudIn * 42).toFixed(2)}%, 0) scale(${(0.95 + cloudIn * 0.3).toFixed(4)})`;
      }
      if (cloudWhiteoutRef.current) {
        cloudWhiteoutRef.current.style.opacity = whiteout.toFixed(4);
      }
      // Subtle center obsidian spine cap emerging at the bottom of the pure-white cloud bloom
      // to lead directly into the vertical Verified Green Shield corridor below!
      if (spineGuideRef.current) {
        const guideIn = smoothstep(0.94, 0.995, p);
        spineGuideRef.current.style.opacity = guideIn.toFixed(4);
        spineGuideRef.current.style.transform = `translate3d(-50%, ${((1 - guideIn) * 32).toFixed(1)}px, 0)`;
      }
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: prefersReducedMotion ? false : 0.75,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyVisualChoreography(self.progress);
          },
        },
      });

      if (!prefersReducedMotion) {
        // Horizontal rail completes smoothly across p = 0.05 -> 0.72, right before the 3D turn!
        tl.to(
          track,
          {
            x: () => -getScrollDistance(),
            ease: 'none',
            duration: 0.67,
          },
          0.05
        );
      }
    }, outer);

    applyVisualChoreography(0);

    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    ro.observe(viewport);
    ro.observe(track);

    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  const currentBeat = CAMERA_BEATS[activeBeat];
  const isGreenSensorBeat = activeBeat === 0 || activeBeat === 1;

  return (
    <div ref={outerRef} className="relative h-[760vh] bg-[#06080C]">
      <div
        ref={stickyRef}
        data-nav-theme={isWhiteCloudPhase ? 'light' : 'dark'}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#06080C]"
      >
        {/* FULL-SCREEN 100vh CINEMA CANVAS LAYER (centered in top 50vh during Act 1, expands full-screen in 3D during Act 2) */}
        <div
          ref={cinemaWrapRef}
          style={
            prefersReducedMotion
              ? { transform: 'translate3d(0, -25vh, 0)' }
              : { transform: 'perspective(1500px) translate3d(0, -25vh, 0)' }
          }
          className="absolute inset-0 h-screen w-full will-change-transform"
        >
          <StudioCinemaCampus
            progressRef={videoProgressRef}
            staticProgress={prefersReducedMotion ? 0.08 : undefined}
            fit="cover"
          />
        </div>

        {/* 3D OBSIDIAN SPATIAL VIGNETTE DURING ACT 2 TURN */}
        <div
          ref={cinemaVignetteRef}
          style={{ opacity: 0 }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 will-change-[opacity]"
          data-layer="obsidian-3d-vignette"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(ellipse 72% 68% at 50% 50%, rgba(6,8,12,0) 38%, rgba(6,8,12,0.72) 78%, rgba(6,8,12,0.98) 100%)',
            }}
          />
        </div>

        {/* MINIMAL TOP-LEFT LIVE TELEMETRY STATUS */}
        <div
          ref={badgeRef}
          className="pointer-events-none absolute top-[70px] left-6 z-20 will-change-[opacity] sm:left-9 lg:left-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#06080C]/65 px-3 py-1 font-mono-tech text-[10px] font-semibold tracking-[0.14em] text-white/90 uppercase backdrop-blur-md">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                isGreenSensorBeat
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                  : 'telemetry-dot bg-[#EA580C]'
              }`}
              aria-hidden="true"
            />
            <span>{currentBeat.label}</span>
          </div>
        </div>

        {/* BOTTOM HALF (50vh): OBSIDIAN HORIZONTAL SCROLL RAIL -> FOLDS BACK IN 3D TO BLACK IN ACT 2 */}
        <div
          ref={railShellRef}
          className="absolute inset-x-0 bottom-0 z-20 flex h-[50vh] origin-bottom flex-col justify-between border-t border-white/10 bg-[#0B0D11] text-white shadow-[0_-24px_60px_rgba(0,0,0,0.65)] will-change-[transform,opacity]"
        >
          <div
            ref={viewportRef}
            className="relative flex flex-1 items-center overflow-hidden"
          >
            <div ref={railContentRef} className="w-full will-change-[transform,opacity]">
              <div
                ref={trackRef}
                className="relative z-10 flex w-max items-center will-change-transform"
              >
                {/* Slide 0: Clean 3-Line Editorial Intro */}
                <div className="flex w-[100vw] shrink-0 items-center justify-between gap-12 px-8 lg:px-14 xl:px-20">
                  <div className="max-w-[780px]">
                    <TextReveal
                      id="services-heading"
                      as="h2"
                      theme="dark"
                      mutedLines={[2]}
                      trigger={railEntered}
                      lines={['EVERYTHING YOUR', 'SITE NEEDS.', 'UNDER ONE COMMAND.']}
                      className="font-display text-[clamp(2rem,3.15vw,3.1rem)] leading-[1.04] font-bold tracking-[-0.03em] whitespace-nowrap uppercase"
                    />
                  </div>

                  <div className="max-w-[370px] space-y-5">
                    <ChromaticText
                      theme="dark"
                      muted
                      trigger={railEntered}
                      delay={0.2}
                      className="text-[13.5px] leading-[1.68]"
                    >
                      From uniformed guarding and automated gate access to 24/7 SOC video
                      verification, we deliver disciplined protection across every perimeter.
                    </ChromaticText>
                    <ChromaticText
                      theme="dark"
                      muted
                      trigger={railEntered}
                      delay={0.34}
                      className="text-[13.5px] leading-[1.68]"
                    >
                      One PSARA-licensed Mysuru command means one accountable partner, zero
                      subcontracting, and total visibility from gatehouse to skyline.
                    </ChromaticText>
                  </div>
                </div>

                {/* Slides 1–6: Generously Spaced Open Hairline Columns */}
                <div className="flex items-center pr-24">
                  {SERVICES.map((service, idx) => (
                    <div key={service.id} className="w-[395px] shrink-0 xl:w-[445px]">
                      <ServiceColumn
                        service={service}
                        isActive={idx === activeServiceIdx}
                        isRevealed={railEntered && idx <= revealedUpTo}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            ref={railCtaRef}
            className="relative z-10 flex items-center justify-center pt-2 pb-7 will-change-[opacity]"
          >
            <a
              href="#assessment"
              className="inline-flex items-center justify-center rounded-full border border-white/22 px-7 py-2.5 font-nav text-[10.5px] font-medium tracking-[0.14em] text-white uppercase transition-colors duration-200 hover:border-[#EA580C] hover:bg-[#EA580C] hover:text-white"
            >
              <ScrambleText text="OUR SERVICES" />
            </a>
          </div>
        </div>

        {/* ─── ACT 3: LUMINOUS VOLUMETRIC WHITE CLOUD BLOOM INTO PURE #FFFFFF ─── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        >
          {/* Left volumetric cloud bank */}
          <div
            ref={cloudLeftRef}
            style={{
              opacity: 0,
              background:
                'radial-gradient(ellipse 68% 72% at 24% 52%, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 38%, rgba(241,245,249,0.58) 64%, rgba(255,255,255,0) 84%)',
            }}
            className="absolute -inset-[12%] will-change-[transform,opacity]"
          />

          {/* Right volumetric cloud bank */}
          <div
            ref={cloudRightRef}
            style={{
              opacity: 0,
              background:
                'radial-gradient(ellipse 68% 72% at 76% 48%, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 38%, rgba(241,245,249,0.58) 64%, rgba(255,255,255,0) 84%)',
            }}
            className="absolute -inset-[12%] will-change-[transform,opacity]"
          />

          {/* Upper atmospheric cloud crown */}
          <div
            ref={cloudTopRef}
            style={{
              opacity: 0,
              background:
                'radial-gradient(ellipse 80% 58% at 50% 18%, rgba(255,255,255,0.99) 0%, rgba(248,250,252,0.88) 45%, rgba(255,255,255,0) 82%)',
            }}
            className="absolute -inset-[10%] will-change-[transform,opacity]"
          />

          {/* Pure seamless #FFFFFF close-out connecting cleanly into StandardsShowcase */}
          <div
            ref={cloudWhiteoutRef}
            style={{ opacity: 0 }}
            className="absolute inset-0 bg-white will-change-[opacity]"
          />

          {/* Center Spine Lead-In Dock (aligns pixel-for-pixel with StandardsShowcase center spine) */}
          <div
            ref={spineGuideRef}
            style={{ opacity: 0 }}
            className="absolute bottom-0 left-1/2 flex h-24 w-[164px] flex-col items-center justify-end overflow-hidden rounded-t-2xl bg-[#0B0D11] xl:w-[184px] will-change-[transform,opacity]"
          >
            <span className="h-14 w-[2px] bg-gradient-to-b from-transparent via-emerald-400/80 to-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesRail() {
  const isDesktop = useIsDesktop();
  const mobileProgressRef = useRef(0.18);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative z-20 bg-[#06080C]"
    >
      {isDesktop ? (
        <DesktopServicesRail />
      ) : (
        <div>
          {/* Mobile / Tablet: Photorealistic Aerial Campus */}
          <div className="relative h-[300px] w-full overflow-hidden bg-[#06080C] sm:h-[360px]">
            <StudioCinemaCampus
              progressRef={mobileProgressRef}
              staticProgress={0.18}
              fit="cover"
            />
          </div>

          {/* Mobile / Tablet: Dark Services Band */}
          <div className="bg-[#0B0D11] px-5 py-16 text-white sm:px-8 sm:py-20">
            <div className="max-w-xl">
              <TextReveal
                id="services-heading"
                as="h2"
                theme="dark"
                mutedLines={[2]}
                lines={['EVERYTHING YOUR', 'SITE NEEDS.', 'UNDER ONE COMMAND.']}
                className="font-display text-2xl leading-[1.08] font-bold tracking-[-0.03em] uppercase sm:text-3xl"
              />
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {SERVICES.map((service, idx) => (
                <GlassReveal key={service.id} delay={idx * 0.06}>
                  <ServiceColumn service={service} isActive isRevealed />
                </GlassReveal>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3 font-nav text-xs font-medium tracking-[0.14em] text-white uppercase transition-colors hover:border-[#EA580C] hover:bg-[#EA580C]"
              >
                <ScrambleText text="OUR SERVICES" />
              </a>
            </div>
          </div>

          {/* Clean white cloud mist bridge into white StandardsShowcase on mobile */}
          <div
            aria-hidden="true"
            className="h-24 w-full bg-gradient-to-b from-[#0B0D11] via-[#E2E8F0] to-white"
          />
        </div>
      )}
    </section>
  );
}
