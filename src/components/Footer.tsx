import { useState } from 'react';
import { ArrowUpRight, Pause, Play, ShieldCheck } from 'lucide-react';
import { AGENCY_INFO, NAV_LINKS, SECTORS, SERVICES } from '../data/agencyContent';
import { ConcaveCurveCap } from './ConcaveCurveCap';
import { ChromaticText, GlassReveal } from './GlassReveal';
import { InteractiveDotWatermark } from './InteractiveDotWatermark';
import { ScrambleText } from './ScrambleText';

export function Footer() {
  const [marqueeTab, setMarqueeTab] = useState<'sectors' | 'services'>('sectors');
  const [marqueePaused, setMarqueePaused] = useState(false);

  const marqueeItems =
    marqueeTab === 'sectors'
      ? SECTORS.map((s) => s.name)
      : SERVICES.map((s) => s.title);

  return (
    <footer className="relative z-20 text-[#0E1117]">
      {/* Unmistakable, tall 50vh sculptural planetary dark-to-white concave U-horizon into the last page */}
      <ConcaveCurveCap
        target="white"
        from="carbon"
        className="-mb-px h-[38vh] sm:h-[44vh] lg:h-[50vh]"
      />

      <div className="bg-white pt-16 sm:pt-22 lg:pt-26">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Top Multi-Column Sitemap & PSARA Governance Row */}
        <GlassReveal>
        <div className="grid grid-cols-1 gap-10 border-b border-[#0E1117]/12 pb-16 lg:grid-cols-12">
          {/* Brand Summary with Chromatic Luminous Sweep */}
          <div className="lg:col-span-3">
            <ChromaticText
              theme="light"
              duration={1.25}
              className="font-brand text-xs tracking-[0.2em] uppercase sm:text-sm"
            >
              {AGENCY_INFO.brand}
            </ChromaticText>
            <ChromaticText
              theme="light"
              muted
              delay={0.14}
              duration={1.3}
              className="mt-2.5 max-w-xs text-sm leading-relaxed"
            >
              One accountable Karnataka command. Every layer of protection.
            </ChromaticText>

            <div className="mt-6">
              <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
                STATUTORY LICENSE
              </p>
              <ChromaticText
                theme="light"
                delay={0.22}
                className="mt-1 font-mono-tech text-xs font-medium"
              >
                {AGENCY_INFO.licenseNo}
              </ChromaticText>
            </div>
          </div>

          {/* Sitemap Columns with Kinetic Scramble Hover */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
                NAVIGATION
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {NAV_LINKS.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[#0E1117] transition-colors hover:text-[#3A404B]"
                    >
                      <ScrambleText text={link.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
                CAPABILITIES
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  'Corporate Guarding',
                  'Access Control',
                  '24/7 SOC Monitoring',
                  'Executive Protection',
                ].map((label) => (
                  <li key={label}>
                    <a
                      href="#services"
                      className="text-[#0E1117] transition-colors hover:text-[#3A404B]"
                    >
                      <ScrambleText text={label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
                RESOURCES
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#briefings" className="text-[#0E1117] hover:text-[#3A404B]">
                    <ScrambleText text="Security Briefings" />
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-[#0E1117] hover:text-[#3A404B]">
                    <ScrambleText text="PSARA F.A.Q" />
                  </a>
                </li>
                <li>
                  <a href="#assessment" className="text-[#0E1117] hover:text-[#3A404B]">
                    <ScrambleText text="Site Risk Audit" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Statutory Compliance Credentials Block */}
          <div className="lg:col-span-4">
            <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
              GOVERNANCE &amp; STATUTORY ASSURANCE
            </p>
            <p className="mt-2.5 text-xs leading-relaxed text-[#525B6A]">
              Licensed by the Controlling Authority, Home Department, Government of Karnataka
              under PSARA 2005. Full EPF, ESIC, and Karnataka Police verification records
              provided monthly.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['PSARA KA', 'ISO 9001', 'EPF / ESIC', '24/7 SOC'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-sm border border-[#0E1117]/15 bg-[#F4F6F9] px-2.5 py-1 font-mono-tech text-[10px] font-medium text-[#0E1117]"
                >
                  <ShieldCheck className="h-3 w-3 text-[#2B303A]" aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
        </GlassReveal>

        {/* Interactive Reference-Inspired Marquee Strip with WCAG Pause/Play Control */}
        <div className="border-b border-[#0E1117]/12 py-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-sm border border-[#0E1117]/15 p-0.5">
              <button
                type="button"
                onClick={() => setMarqueeTab('sectors')}
                className={`rounded-sm px-3 py-1 font-mono-tech text-[10px] tracking-[0.14em] uppercase transition-colors ${
                  marqueeTab === 'sectors'
                    ? 'bg-[#0E1117] text-white'
                    : 'text-[#525B6A] hover:text-[#0E1117]'
                }`}
              >
                Sectors
              </button>
              <button
                type="button"
                onClick={() => setMarqueeTab('services')}
                className={`rounded-sm px-3 py-1 font-mono-tech text-[10px] tracking-[0.14em] uppercase transition-colors ${
                  marqueeTab === 'services'
                    ? 'bg-[#0E1117] text-white'
                    : 'text-[#525B6A] hover:text-[#0E1117]'
                }`}
              >
                Services
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMarqueePaused((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#0E1117]/15 px-3 py-1 font-mono-tech text-[10px] tracking-[0.14em] text-[#0E1117] uppercase transition-colors hover:bg-[#F4F6F9]"
            >
              {marqueePaused ? (
                <>
                  <Play className="h-3 w-3" aria-hidden="true" />
                  <span>Play Ticker</span>
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3" aria-hidden="true" />
                  <span>Pause Ticker</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-hidden">
            <div className={`footer-marquee-track ${marqueePaused ? 'is-paused' : ''}`}>
              {[0, 1].map((dup) => (
                <div
                  key={dup}
                  aria-hidden={dup === 1}
                  className="flex shrink-0 items-center gap-8 pr-8"
                >
                  {marqueeItems.map((label) => (
                    <a
                      key={`${dup}-${label}`}
                      href={marqueeTab === 'sectors' ? '#sectors' : '#services'}
                      tabIndex={dup === 1 ? -1 : undefined}
                      className="flex items-center gap-8 font-display text-2xl font-bold tracking-[-0.02em] text-[#0E1117]/35 transition-colors hover:text-[#1F242C] sm:text-3xl"
                    >
                      <span>{label}</span>
                      <span className="text-base text-[#0E1117]/20" aria-hidden="true">
                        ·
                      </span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mysuru Command Headquarters Block */}
        <div className="grid grid-cols-1 gap-8 border-b border-[#0E1117]/12 py-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <img
              src="/images/hq-mysuru.jpg"
              alt="Vantage Security Command Headquarters in Gokulam, Mysuru, Karnataka"
              loading="lazy"
              width={480}
              height={300}
              className="aspect-[16/10] w-full rounded-sm object-cover grayscale-[25%]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-6">
            <div>
              <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
                COMMAND HEADQUARTERS
              </p>
              <ChromaticText theme="light" delay={0.08} className="mt-2 text-sm font-medium">
                {AGENCY_INFO.hqAddressLine1}
                <br />
                {AGENCY_INFO.hqAddressLine2}
              </ChromaticText>
              <a
                href="#assessment"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2B303A] hover:text-[#EA580C] hover:underline"
              >
                <ScrambleText text="Schedule HQ Briefing" />
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <div>
              <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
                DIRECT COMMAND DESK
              </p>
              <ChromaticText theme="light" delay={0.14} className="mt-2 text-sm font-medium">
                <a href={`mailto:${AGENCY_INFO.email}`} className="hover:text-[#EA580C]">
                  {AGENCY_INFO.email}
                </a>
              </ChromaticText>
              <ChromaticText
                theme="light"
                delay={0.2}
                className="mt-2 font-mono-tech text-sm font-semibold"
              >
                <a href={AGENCY_INFO.dispatchPhoneHref} className="hover:text-[#EA580C]">
                  {AGENCY_INFO.dispatchPhone}
                </a>
              </ChromaticText>
              <p className="mt-2 text-xs text-[#525B6A]">{AGENCY_INFO.officeHours}</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
              OPERATIONAL CORRIDORS
            </p>
            <ChromaticText theme="light" delay={0.18} className="mt-2 text-sm leading-relaxed">
              {AGENCY_INFO.coverageCities.join(' / ')}
            </ChromaticText>
            <p className="mt-2 text-xs text-[#525B6A]">
              GPS-tracked Quick Response Teams across Karnataka.
            </p>
          </div>
        </div>

        {/* Legal Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-8 font-mono-tech text-[10px] tracking-[0.12em] text-[#525B6A] uppercase">
          <span>© 2026 {AGENCY_INFO.brand} PVT. LTD. ALL RIGHTS RESERVED.</span>
          <span>PSARA LICENSED · GOVERNMENT OF KARNATAKA</span>
        </div>
      </div>

      {/* Signature Heavy Unbounded Black High-Density Interactive Halftone Dot-Matrix */}
      <InteractiveDotWatermark text={AGENCY_INFO.brand} />
      </div>
    </footer>
  );
}
