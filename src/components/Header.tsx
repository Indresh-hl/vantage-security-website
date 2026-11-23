import { useEffect, useRef, useState } from 'react';
import { Menu, Phone, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { AGENCY_INFO, NAV_LINKS } from '../data/agencyContent';
import { ScrambleText } from './ScrambleText';

function useIstClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

const DROPDOWN_LINKS = [{ label: 'Home', href: '#' }, ...NAV_LINKS];

export function Header() {
  const istTime = useIstClock();
  const prefersReducedMotion = useReducedMotion();
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [floatingTheme, setFloatingTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();
  // Line-masked upward clip on initial Hero header matching 115602.mp4 frames 00:00 -> 00:01 & 00:17 -> 00:18
  const heroNavClipY = useTransform(scrollY, [0, 210], ['0%', '-115%']);
  const heroNavOpacity = useTransform(scrollY, [0, 185], [1, 0]);
  const heroHeaderPointerEvents = useTransform(scrollY, (v) => (v < 175 ? 'auto' : 'none'));

  // Scroll-direction-aware floating header:
  // - Hidden completely while scrolling DOWN (unobstructed viewport)
  // - Glides cleanly in ONLY when scrolling BACK UP, adapting contrast over white vs dark sections
  useEffect(() => {
    const detectSurfaceTheme = () => {
      const probeY = 38;
      const lightSections = document.querySelectorAll<HTMLElement>('[data-nav-theme="light"]');
      for (const el of lightSections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          return 'light' as const;
        }
      }
      return 'dark' as const;
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (currentY < 190) {
        setShowFloatingBar(false);
        setMenuOpen(false);
      } else if (delta < -5) {
        setShowFloatingBar(true);
      } else if (delta > 5) {
        setShowFloatingBar(false);
        setMenuOpen(false);
      }

      setFloatingTheme(detectSurfaceTheme());
      lastScrollYRef.current = currentY;
    };

    lastScrollYRef.current = window.scrollY;
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close compact dropdown on Escape or outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen]);

  const isLightSurface = floatingTheme === 'light';

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#06080C]"
      >
        Skip to main content
      </a>

      {/* Top Command Telemetry Strip + Editorial Hero Header (scrollY < 185px) */}
      <motion.header
        style={
          prefersReducedMotion
            ? undefined
            : { opacity: heroNavOpacity, pointerEvents: heroHeaderPointerEvents }
        }
        className="fixed inset-x-0 top-0 z-30 will-change-transform"
      >
        {/* Micro-telemetry strip */}
        <div className="border-b border-white/10 bg-[#06080C]/75 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 font-mono-tech text-[10px] tracking-[0.14em] text-slate-200 uppercase">
              <span className="inline-flex items-center gap-1.5 text-white">
                <span className="telemetry-dot h-1.5 w-1.5 rounded-full bg-[#EA580C]" aria-hidden="true" />
                24/7 SOC ACTIVE
              </span>
              <span className="hidden text-white/25 sm:inline">|</span>
              <span className="hidden sm:inline">PSARA KARNATAKA · {AGENCY_INFO.licenseNo}</span>
            </div>

            <div className="flex items-center gap-4 font-mono-tech text-[10px] tracking-[0.14em] text-slate-200 uppercase">
              <span className="hidden md:inline">MYSURU HQ · {istTime || '--:--:--'} IST</span>
              <span className="hidden text-white/25 md:inline">|</span>
              <a
                href={AGENCY_INFO.dispatchPhoneHref}
                className="inline-flex items-center gap-1.5 text-white transition-colors hover:text-[#FB923C]"
              >
                <Phone className="h-3 w-3 text-white/75" aria-hidden="true" />
                <span>DISPATCH {AGENCY_INFO.dispatchPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Hero Editorial Navigation Row */}
        <div className="mx-auto flex max-w-[1440px] items-start justify-between px-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
          {/* Left: Bold Pure-White Geometric Brand Wordmark (matches UNITEDCARRIERS visual weight in Image 2) */}
          <div className="overflow-hidden">
            <motion.a
              href="#"
              style={prefersReducedMotion ? undefined : { y: heroNavClipY }}
              className="group inline-flex items-center gap-2.5 text-white will-change-transform"
              aria-label="Vantage Security — Home"
            >
              <ShieldCheck
                className="h-5 w-5 text-white transition-colors group-hover:text-[#EA580C]"
                strokeWidth={2.2}
                aria-hidden="true"
              />
              <span className="font-brand text-[13px] leading-none font-bold tracking-[0.04em] text-white uppercase sm:text-[15px]">
                {AGENCY_INFO.brand}
              </span>
            </motion.a>
          </div>

          {/* Center-Left Stacked Pure Bright White Unbounded Navigation — tight vertical rhythm */}
          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="flex overflow-hidden leading-none">
                  <motion.a
                    href={link.href}
                    style={prefersReducedMotion ? undefined : { y: heroNavClipY }}
                    className="group inline-flex items-center gap-2 py-[1px] font-nav text-[10.5px] leading-none font-normal tracking-[0.08em] text-white uppercase transition-colors hover:text-[#FB923C] will-change-transform"
                  >
                    <ScrambleText
                      text={link.label.toUpperCase()}
                      className="group-hover:translate-x-1"
                    />
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Crisp Pure White Pill CTA */}
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.a
              href="#assessment"
              style={prefersReducedMotion ? undefined : { y: heroNavClipY }}
              className="hidden rounded-full bg-white px-6 py-2.5 font-nav text-[11px] font-bold tracking-[0.12em] text-[#06080C] uppercase transition-colors duration-200 hover:bg-[#EA580C] hover:text-white will-change-transform sm:inline-flex"
            >
              <ScrambleText text="REQUEST ASSESSMENT" />
            </motion.a>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#06080C]/75 text-white backdrop-blur-sm transition-colors hover:border-white lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Scroll-Up Adaptive Transparent Floating Header + Compact Dropdown Panel (exact match to Image 5!) */}
      <AnimatePresence>
        {(showFloatingBar || menuOpen) && (
          <motion.nav
            aria-label="Floating scroll-up navigation"
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 top-0 z-40"
          >
            <div className="mx-auto flex max-w-[1440px] items-start justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
              {/* Left: Bold Unbounded Brand Monogram (`VS`) */}
              <a
                href="#"
                aria-label="Vantage Security — Back to top"
                className={`pointer-events-auto inline-flex items-center pt-1 font-brand text-[14px] leading-none font-bold tracking-[0.04em] uppercase transition-colors duration-300 ${
                  isLightSurface ? 'text-[#0E1117]' : 'text-white'
                }`}
              >
                VS
              </a>

              {/* Center-Left: `•••• MENU` Trigger & Anchored Compact Dark Dropdown Card (Image 5 exact design!) */}
              <div ref={dropdownRef} className="pointer-events-auto relative">
                {!menuOpen ? (
                  <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open navigation menu"
                    aria-expanded={false}
                    className={`group inline-flex cursor-pointer items-center gap-2.5 pt-1 font-nav text-[10.5px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
                      isLightSurface
                        ? 'text-[#0E1117] hover:text-[#EA580C]'
                        : 'text-white hover:text-[#FB923C]'
                    }`}
                  >
                    <span aria-hidden="true" className="inline-flex items-center gap-1">
                      {[0, 1, 2, 3].map((dot) => (
                        <span
                          key={dot}
                          className={`h-[3px] w-[3px] rounded-full transition-colors duration-200 ${
                            isLightSurface
                              ? 'bg-[#0E1117] group-hover:bg-[#EA580C]'
                              : 'bg-white group-hover:bg-[#EA580C]'
                          }`}
                        />
                      ))}
                    </span>
                    <ScrambleText text="MENU" autoOnMount />
                  </button>
                ) : (
                  /* Anchored Compact Architectural Dark Dropdown Card matching United Carriers Image 5 */
                  <motion.div
                    role="dialog"
                    aria-label="Site navigation menu"
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: -12, scaleY: 0.94 }
                    }
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, y: -10, scaleY: 0.94 }
                    }
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'top center' }}
                    className="-mt-4 w-[250px] overflow-hidden bg-[#121418]/96 px-6 pt-5 pb-6 text-white shadow-[0_24px_64px_rgba(0,0,0,0.52)] backdrop-blur-xl sm:w-[272px]"
                  >
                    {/* Top Row: Dot-Ring Close Trigger (`CLOSE`) */}
                    <div className="border-b border-white/10 pb-4">
                      <button
                        type="button"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-flex cursor-pointer items-center gap-2.5 font-nav text-[11px] font-bold tracking-[0.16em] text-white uppercase transition-colors hover:text-[#FB923C]"
                      >
                        <span
                          aria-hidden="true"
                          className="grid h-3.5 w-3.5 grid-cols-2 place-items-center gap-[2px]"
                        >
                          {[0, 1, 2, 3].map((d) => (
                            <span
                              key={d}
                              className="h-[2.5px] w-[2.5px] rounded-full bg-white transition-colors group-hover:bg-[#EA580C]"
                            />
                          ))}
                        </span>
                        <span>CLOSE</span>
                      </button>
                    </div>

                    {/* Vertical Stacked Navigation List in crisp Unbounded */}
                    <ul className="mt-5 flex flex-col gap-3">
                      {DROPDOWN_LINKS.map((link, idx) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`inline-block font-nav text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 ${
                              idx === 0
                                ? 'text-white hover:text-[#FB923C]'
                                : 'text-white/62 hover:text-white'
                            }`}
                          >
                            <ScrambleText text={link.label.toUpperCase()} />
                          </a>
                        </li>
                      ))}
                    </ul>

                    {/* Compact Bottom Direct Contact Footer */}
                    <div className="mt-8 border-t border-white/10 pt-4">
                      <p className="font-mono-tech text-[9px] tracking-[0.16em] text-slate-400 uppercase">
                        CONNECT WITH US:
                      </p>
                      <a
                        href={`mailto:${AGENCY_INFO.email}`}
                        className="mt-1.5 block font-sans text-xs font-medium text-white transition-colors hover:text-[#FB923C]"
                      >
                        {AGENCY_INFO.email}
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Center-Right: Subtle Command Telemetry Micro-Label */}
              <div
                className={`pointer-events-auto hidden pt-1.5 font-mono-tech text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 md:block ${
                  isLightSurface ? 'text-[#0E1117]/80' : 'text-white/90'
                }`}
              >
                <a href={AGENCY_INFO.dispatchPhoneHref} className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" aria-hidden="true" />
                  <span>24/7 SOC · MYSURU HQ</span>
                </a>
              </div>

              {/* Far Right: Adaptive Solid Pill CTA */}
              <a
                href="#assessment"
                className={`pointer-events-auto whitespace-nowrap rounded-full px-5 py-2.5 font-nav text-[11px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 sm:px-6 ${
                  isLightSurface
                    ? 'bg-[#0E1117] text-white hover:bg-[#EA580C]'
                    : 'bg-white text-[#06080C] hover:bg-[#EA580C] hover:text-white'
                }`}
              >
                <ScrambleText text="SITE AUDIT" autoOnMount />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
