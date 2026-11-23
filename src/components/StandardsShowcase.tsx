import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, BadgeCheck, Cpu, FileCheck2, ShieldCheck } from 'lucide-react';
import { useInView, useReducedMotion } from 'motion/react';
import { AGENCY_INFO } from '../data/agencyContent';
import { ChromaticText } from './GlassReveal';
import { TextReveal } from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

interface LicenseStandardItem {
  index: string;
  tag: string;
  figure: string;
  titleLines: [string, string];
  summary: string;
  badge: string;
  icon: typeof ShieldCheck;
}

const STANDARD_LICENSES: LicenseStandardItem[] = [
  {
    index: '01',
    tag: 'STATUTORY AUTHORITY',
    figure: 'PSARA 2005',
    titleLines: ['KARNATAKA STATE', 'PSARA LICENSED'],
    summary:
      'Active Controlling Authority license issued by the Home Department, Government of Karnataka. Full statutory verification furnished before day-one mobilization.',
    badge: AGENCY_INFO.licenseNo,
    icon: ShieldCheck,
  },
  {
    index: '02',
    tag: '24/7 MYSURU SOC',
    figure: '< 90 SEC',
    titleLines: ['LIVE ALARM', 'VERIFICATION'],
    summary:
      'Timestamped multi-camera alarm verification and instant senior operations escalation—zero unverified false dispatches across Karnataka facilities.',
    badge: 'DUAL-REDUNDANT COMMAND',
    icon: Activity,
  },
  {
    index: '03',
    tag: 'VETTED WORKFORCE',
    figure: '100%',
    titleLines: ['POLICE-VERIFIED', 'SECURITY FORCE'],
    summary:
      'Every officer completes Karnataka Police antecedent clearance, 160-hour PSARA academy certification, and biometric shift attendance logging.',
    badge: '160-HR ACADEMY CERTIFIED',
    icon: BadgeCheck,
  },
  {
    index: '04',
    tag: 'ZERO SUBCONTRACTING',
    figure: 'ISO 9001',
    titleLines: ['DIRECT PAYROLL', 'EPF & ESIC'],
    summary:
      'ISO 9001:2015 aligned SOPs with 100% direct-payroll officers and monthly audit-ready statutory wage, EPF, ESIC, and GST compliance packs.',
    badge: 'ISO 9001:2015 AUDITED',
    icon: FileCheck2,
  },
  {
    index: '05',
    tag: 'INTEGRATED SYSTEMS',
    figure: 'ONVIF / VMS',
    titleLines: ['ENTERPRISE ACCESS', '& CCTV READY'],
    summary:
      'Native command integration with Hikvision, Genetec, Milestone, and Honeywell perimeter sensors, ANPR boom barriers, and biometric turnstiles.',
    badge: 'HIKVISION · GENETEC · HONEYWELL',
    icon: Cpu,
  },
];

/**
 * Pure-white 3-column architectural Standards & Licenses showcase inspired by United Carriers:
 * - Left (sticky): Bold editorial heading with Orange Premium Reveal + official PSARA dossier footer
 * - Center (vertical obsidian verification spine): Gliding Green Verified Shield + Vertical Downward Text
 *   with Verified Green Chromatic Reveal (top-to-bottom emerald sweep matching the signature orange reveal)
 * - Right (scrolling stack): All 5 Standards & Licenses with Orange Premium Chromatic Reveal
 */
export function StandardsShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shieldPayloadRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  const sectionInView = useInView(sectionRef, {
    once: true,
    margin: '0px 0px -15% 0px',
  });

  useEffect(() => {
    const section = sectionRef.current;
    const payload = shieldPayloadRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(
            STANDARD_LICENSES.length - 1,
            Math.floor(p * STANDARD_LICENSES.length)
          );
          setActiveIdx((prev) => (prev === idx ? prev : idx));

          // Gentle compositor-only vertical glide of the Verified Green Shield payload inside the sticky spine
          if (payload) {
            const glideY = (p - 0.5) * 90;
            payload.style.transform = `translate3d(0, ${glideY.toFixed(1)}px, 0)`;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleY(${Math.max(0.06, p).toFixed(4)})`;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="standards"
      data-nav-theme="light"
      aria-labelledby="standards-heading"
      className="relative z-20 bg-white text-[#0E1117]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ─── LEFT COLUMN (4 cols): Sticky Editorial Heading with Orange Premium Reveal ─── */}
          <div className="pt-20 lg:col-span-4 lg:pt-0">
            <div className="flex flex-col justify-between gap-12 lg:sticky lg:top-0 lg:h-screen lg:py-24 xl:py-28">
              <div>
                <p className="mb-4 font-mono-tech text-[11px] font-semibold tracking-[0.2em] text-[#EA580C] uppercase">
                  03 / STANDARDS &amp; LICENSES
                </p>
                <TextReveal
                  id="standards-heading"
                  as="h2"
                  theme="light"
                  accent="orange"
                  mutedLines={[0]}
                  lines={['DISCIPLINED BY', 'PROTOCOL.', 'VERIFIED IN', 'REAL TIME.']}
                  className="font-display text-[clamp(1.85rem,2.6vw,2.75rem)] leading-[1.06] font-bold tracking-[-0.03em] whitespace-nowrap uppercase"
                />
              </div>

              <div className="max-w-sm space-y-5">
                <ChromaticText
                  theme="light"
                  muted
                  delay={0.28}
                  className="text-sm leading-[1.7] sm:text-[15px]"
                >
                  With every license, police antecedent record, and statutory filing verified
                  under one command, your facility protection runs predictably, transparently, and
                  without excuses.
                </ChromaticText>

                {/* Clean Official PSARA Statutory Footer Stamp */}
                <div className="border-t border-[#0E1117]/12 pt-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]"
                      aria-hidden="true"
                    />
                    <span className="font-mono-tech text-[10.5px] font-bold tracking-[0.14em] text-[#0E1117] uppercase">
                      {AGENCY_INFO.licenseNo}
                    </span>
                  </div>
                  <p className="mt-1 font-mono-tech text-[9.5px] tracking-[0.1em] text-[#525B6A] uppercase">
                    HOME DEPT. · GOVERNMENT OF KARNATAKA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── CENTER COLUMN (4 cols): Vertical Spine with Big Green Verified Shield & Stacked V-E-R-I-F-I-E-D Green Reveal ─── */}
          <div className="relative lg:col-span-4">
            {/* Desktop Full-Height Obsidian Vertical Spine (matches reference black vertical corridor) */}
            <div className="relative mx-auto hidden h-full w-[164px] bg-[#0B0D11] lg:block xl:w-[184px]">
              {/* Recessed hairline side lanes */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-3.5 w-px bg-white/[0.06]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-3.5 w-px bg-white/[0.06]"
              />

              {/* Center Dashed Guide Line + Scroll-Linked Verified Emerald Beam */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 border-l border-dashed border-white/14"
              />
              <div
                ref={progressBarRef}
                aria-hidden="true"
                style={{ transform: 'scaleY(0.06)' }}
                className="verified-spine-beam pointer-events-none absolute inset-y-0 left-1/2 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.75)] will-change-transform"
              />

              {/* Sticky Center Payload: Big Green Verified Shield + Stacked Upright V-E-R-I-F-I-E-D Heading Letters */}
              <div className="sticky top-0 flex h-screen flex-col items-center justify-center py-12">
                <div
                  ref={shieldPayloadRef}
                  className="relative z-10 flex flex-col items-center gap-6 will-change-transform"
                >
                  {/* Large Luminous Green Verified Shield Emblem */}
                  <div className="relative flex items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="verified-shield-ring pointer-events-none absolute -inset-4 rounded-3xl border border-emerald-400/55"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-9 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.42)_0%,rgba(16,185,129,0.1)_52%,transparent_76%)]"
                    />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-emerald-400/80 bg-[#071D15] text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.55),inset_0_1px_16px_rgba(52,211,153,0.22)]">
                      <ShieldCheck className="h-12 w-12 stroke-[2.1] drop-shadow-[0_0_14px_rgba(52,211,153,0.75)]" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Bold Stacked Upright Letters V-E-R-I-F-I-E-D with Glassy Premium Vertical Green Reveal */}
                  <div className="relative rounded-2xl bg-[#0B0D11] px-5 py-4 select-none">
                    <TextReveal
                      as="div"
                      theme="dark"
                      accent="green"
                      direction="vertical"
                      trigger={sectionInView}
                      duration={1.55}
                      stagger={0.12}
                      delay={0.1}
                      lines={['V', 'E', 'R', 'I', 'F', 'I', 'E', 'D']}
                      className="font-display text-center text-[clamp(2rem,2.75vw,2.65rem)] leading-[0.98] font-bold tracking-[-0.02em] uppercase drop-shadow-[0_0_20px_rgba(16,185,129,0.28)]"
                    />
                  </div>

                  {/* Active Standard Counter Pill */}
                  <div className="rounded-full border border-emerald-400/40 bg-[#0B0D11] px-3.5 py-1 font-mono-tech text-[10.5px] font-bold tracking-[0.18em] text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.22)]">
                    {String(activeIdx + 1).padStart(2, '0')} /{' '}
                    {String(STANDARD_LICENSES.length).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Compact Verified Green Shield Banner */}
            <div className="flex items-center justify-between gap-4 rounded-xl bg-[#0B0D11] px-5 py-5 text-white lg:hidden">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-emerald-400/75 bg-[#071D15] text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.45)]">
                  <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <TextReveal
                    as="p"
                    theme="dark"
                    accent="green"
                    direction="horizontal"
                    trigger={sectionInView}
                    duration={1.8}
                    lines={['VERIFIED']}
                    className="font-display text-xl font-bold tracking-[0.12em] uppercase"
                  />
                  <p className="mt-0.5 font-mono-tech text-[10px] tracking-[0.14em] text-emerald-300/75 uppercase">
                    PSARA LICENSED · 100% POLICE VETTED
                  </p>
                </div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.95)]" />
            </div>
          </div>

          {/* ─── RIGHT COLUMN (4 cols): Scrolling Standards & Licenses with Orange Premium Reveal ─── */}
          <div className="pb-24 lg:col-span-4 lg:py-[22vh]">
            <div className="space-y-20 lg:space-y-36">
              {STANDARD_LICENSES.map((item, idx) => {
                const Icon = item.icon;
                const isCurrent = idx === activeIdx;
                return (
                  <article
                    key={item.index}
                    className="group relative flex flex-col items-start border-l-2 border-[#0E1117]/10 pl-6 transition-colors duration-300 lg:border-l-0 lg:pl-2"
                  >
                    {/* Minimalist Architectural Icon + Index Row */}
                    <div className="mb-5 flex items-center gap-3.5">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-colors duration-300 ${
                          isCurrent
                            ? 'border-[#EA580C]/45 bg-[#EA580C]/[0.07] text-[#EA580C]'
                            : 'border-[#0E1117]/12 bg-[#F8FAFC] text-[#0E1117]'
                        }`}
                      >
                        <Icon className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-mono-tech text-[10px] font-bold tracking-[0.18em] text-[#EA580C] uppercase">
                          {item.index} / {item.tag}
                        </p>
                        <p className="font-mono-tech text-[11px] font-semibold tracking-[0.1em] text-[#525B6A] uppercase">
                          {item.figure}
                        </p>
                      </div>
                    </div>

                    {/* Title with Signature ORANGE Premium Chromatic Reveal */}
                    <TextReveal
                      as="h3"
                      theme="light"
                      accent="orange"
                      duration={1.75}
                      lines={item.titleLines}
                      className="font-display text-[clamp(1.3rem,1.9vw,1.75rem)] leading-[1.12] font-bold tracking-[-0.025em] uppercase"
                    />

                    {/* Description with Subtle Orange-to-Slate Chromatic Sweep */}
                    <ChromaticText
                      theme="light"
                      muted
                      delay={0.18}
                      duration={1.65}
                      className="mt-4 max-w-sm text-sm leading-[1.7] sm:text-[14.5px]"
                    >
                      {item.summary}
                    </ChromaticText>

                    {/* Crisp Statutory Code Stamp */}
                    <div className="mt-5 inline-flex items-center gap-2 rounded-sm border border-[#0E1117]/10 bg-[#F4F6F9] px-3 py-1.5 font-mono-tech text-[10px] font-semibold tracking-[0.12em] text-[#0E1117]/80 uppercase">
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      />
                      <span>{item.badge}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
