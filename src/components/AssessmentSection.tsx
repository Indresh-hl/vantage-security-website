import { type FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { AGENCY_INFO, ASSESSMENT_SERVICES } from '../data/agencyContent';
import { ConcaveCurveCap } from './ConcaveCurveCap';
import { ChromaticText, GlassReveal } from './GlassReveal';
import { ScrambleText } from './ScrambleText';
import { TextReveal } from './TextReveal';

interface SubmissionRecord {
  refId: string;
  name: string;
  organization: string;
  city: string;
  services: string[];
}

export function AssessmentSection() {
  const prefersReducedMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const announcerRef = useRef<HTMLDivElement | null>(null);
  const ctaZoneRef = useRef<HTMLDivElement | null>(null);

  const [orbActive, setOrbActive] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Corporate & Campus Guarding',
    'Site Risk & PSARA Audit',
  ]);
  const [submission, setSubmission] = useState<SubmissionRecord | null>(null);

  // Cascading spring chain for the signature cursor-following orb + multi-ghost motion trail
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  const leadX = useSpring(targetX, { stiffness: 260, damping: 24, mass: 0.45 });
  const leadY = useSpring(targetY, { stiffness: 260, damping: 24, mass: 0.45 });

  const ghost1X = useSpring(leadX, { stiffness: 200, damping: 22, mass: 0.55 });
  const ghost1Y = useSpring(leadY, { stiffness: 200, damping: 22, mass: 0.55 });

  const ghost2X = useSpring(ghost1X, { stiffness: 155, damping: 21, mass: 0.65 });
  const ghost2Y = useSpring(ghost1Y, { stiffness: 155, damping: 21, mass: 0.65 });

  const ghost3X = useSpring(ghost2X, { stiffness: 120, damping: 20, mass: 0.75 });
  const ghost3Y = useSpring(ghost2Y, { stiffness: 120, damping: 20, mass: 0.75 });

  const ghost4X = useSpring(ghost3X, { stiffness: 95, damping: 19, mass: 0.85 });
  const ghost4Y = useSpring(ghost3Y, { stiffness: 95, damping: 19, mass: 0.85 });

  // Sync ARIA aria-invalid and dynamic aria-describedby with :user-invalid (Modern Web Guidance)
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    let announceTimer: number | undefined;
    let announcedField: HTMLElement | null = null;
    const flagged = new WeakSet<Element>();
    const announced = new WeakSet<Element>();

    const linkError = (el: HTMLElement, shown: boolean) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const ids = (el.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter((id) => id && id !== errorId);
      if (shown) ids.push(errorId);
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
      else el.removeAttribute('aria-describedby');
    };

    const announceError = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      const errorId = el.dataset.error;
      if (!errorId || !announcerRef.current) return;
      const errorEl = document.getElementById(errorId);
      if (!errorEl) return;
      const labelText = el.labels?.[0]?.textContent?.trim() ?? '';
      window.clearTimeout(announceTimer);
      announcerRef.current.textContent = '';
      announcedField = el;
      announceTimer = window.setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = `${labelText ? `${labelText}: ` : ''}${errorEl.textContent?.trim() ?? ''}`;
        }
      }, 450);
    };

    const syncAria = (target: EventTarget | null, announce = false) => {
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        )
      ) {
        return;
      }
      if (!target.dataset.error) return;

      const supportsUserInvalid = CSS.supports('selector(:user-invalid)');
      const invalid = supportsUserInvalid
        ? target.matches(':user-invalid')
        : target.classList.contains('user-invalid-fallback');

      if (invalid) {
        if (announce && !announced.has(target)) {
          announceError(target);
          announced.add(target);
        }
        target.setAttribute('aria-invalid', 'true');
        linkError(target, true);
        flagged.add(target);
      } else if (flagged.has(target) || target.getAttribute('aria-invalid') !== 'true') {
        target.setAttribute('aria-invalid', 'false');
        linkError(target, false);
        flagged.delete(target);
        announced.delete(target);
        if (announcedField === target && announcerRef.current) {
          window.clearTimeout(announceTimer);
          announcerRef.current.textContent = '';
        }
      }
    };

    form.querySelectorAll('input[data-error], select[data-error], textarea[data-error]').forEach((el) => {
      el.setAttribute('aria-invalid', 'false');
    });

    const onBlur = (e: Event) => {
      const target = e.target;
      if (
        !CSS.supports('selector(:user-invalid)') &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement)
      ) {
        target.classList.toggle('user-invalid-fallback', !target.validity.valid);
      }
      syncAria(target, true);
    };

    const onInput = (e: Event) => {
      const target = e.target;
      if (
        !CSS.supports('selector(:user-invalid)') &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement) &&
        target.classList.contains('user-invalid-fallback')
      ) {
        target.classList.toggle('user-invalid-fallback', !target.validity.valid);
      }
      if (target instanceof HTMLElement && target.hasAttribute('aria-invalid')) {
        syncAria(target, false);
      }
    };

    const onInvalid = (e: Event) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        if (!CSS.supports('selector(:user-invalid)')) {
          target.classList.add('user-invalid-fallback');
        }
        announced.add(target);
        syncAria(target, false);
      }
    };

    form.addEventListener('blur', onBlur, true);
    form.addEventListener('input', onInput);
    form.addEventListener('change', onBlur, true);
    form.addEventListener('invalid', onInvalid, true);

    return () => {
      window.clearTimeout(announceTimer);
      form.removeEventListener('blur', onBlur, true);
      form.removeEventListener('input', onInput);
      form.removeEventListener('change', onBlur, true);
      form.removeEventListener('invalid', onInvalid, true);
    };
  }, [submission]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
    );
  };

  const handleZonePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    targetX.set(relX);
    targetY.set(relY);
    setOrbActive(true);
  };

  const handleZonePointerLeave = () => {
    setOrbActive(false);
    targetX.set(0);
    targetY.set(0);
  };

  const focusForm = () => {
    formCardRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
    window.setTimeout(() => firstInputRef.current?.focus(), 350);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(':invalid');
      firstInvalid?.focus();
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const refDigits = String(Math.floor(1000 + Math.random() * 9000));
    setSubmission({
      refId: `VS-MYS-2026-${refDigits}`,
      name: String(data.get('fullName') ?? ''),
      organization: String(data.get('organization') ?? ''),
      city: String(data.get('city') ?? 'Mysuru'),
      services: selectedServices.length ? selectedServices : ['General Site Risk Assessment'],
    });
    window.requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    });
  };

  return (
    <section
      id="assessment"
      aria-labelledby="assessment-heading"
      className="relative z-20 text-white"
    >
      {/* Seamless Pure-CSS Planetary White-to-Obsidian Dome Horizon */}
      <ConcaveCurveCap
        target="obsidian"
        from="white"
        className="-mb-px h-[36vh] sm:h-[42vh] lg:h-[48vh]"
      />

      {/* Polite screen-reader live region for post-interaction validation errors */}
      <div ref={announcerRef} aria-live="polite" className="visually-hidden" />

      {/* STAGE 1: Dedicated Full-Width Concentric CTA Stage with Edge-to-Edge Pure Signal Amber Orb */}
      <div
        ref={ctaZoneRef}
        data-cursor="orb-zone"
        onPointerMove={handleZonePointerMove}
        onPointerLeave={handleZonePointerLeave}
        onClick={focusForm}
        className="relative flex min-h-[72vh] w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#06080C] px-5 py-24 text-center radar-rings sm:min-h-[78vh] sm:px-8 sm:py-28 lg:min-h-[82vh] lg:px-12"
      >
        {/* Subtle Ambient Warm Center Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.14)_0%,rgba(234,88,12,0.04)_45%,transparent_72%)] blur-2xl"
        />

        {/* Full-Stage Edge-to-Edge Motion-Blur Trailing Signal Amber Orbs (Desktop pointer following) */}
        {!prefersReducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex"
          >
            <motion.span
              style={{ x: ghost4X, y: ghost4Y }}
              animate={{ opacity: orbActive ? 0.16 : 0, scale: orbActive ? 1.2 : 0.7 }}
              transition={{ duration: 0.28 }}
              className="absolute h-32 w-32 rounded-full bg-[#EA580C] blur-2xl"
            />
            <motion.span
              style={{ x: ghost3X, y: ghost3Y }}
              animate={{ opacity: orbActive ? 0.26 : 0, scale: orbActive ? 1.1 : 0.75 }}
              transition={{ duration: 0.25 }}
              className="absolute h-30 w-30 rounded-full bg-[#EA580C] blur-lg"
            />
            <motion.span
              style={{ x: ghost2X, y: ghost2Y }}
              animate={{ opacity: orbActive ? 0.38 : 0, scale: orbActive ? 1.04 : 0.8 }}
              transition={{ duration: 0.22 }}
              className="absolute h-28 w-28 rounded-full bg-[#F97316] blur-[6px]"
            />
            <motion.span
              style={{ x: ghost1X, y: ghost1Y }}
              animate={{ opacity: orbActive ? 0.56 : 0, scale: orbActive ? 1.0 : 0.85 }}
              transition={{ duration: 0.2 }}
              className="absolute h-28 w-28 rounded-full bg-[#EA580C] blur-[2px]"
            />
            <motion.div
              style={{ x: leadX, y: leadY }}
              animate={{ opacity: orbActive ? 0.98 : 0, scale: orbActive ? 1 : 0.8 }}
              transition={{ duration: 0.18 }}
              className="absolute z-20 flex h-28 w-28 items-center justify-center rounded-full border border-white/25 bg-[radial-gradient(circle_at_30%_25%,#FB923C_0%,#EA580C_62%,#C2410C_100%)] text-center font-nav text-[11px] leading-tight font-bold tracking-[0.12em] text-white uppercase shadow-[0_0_64px_rgba(234,88,12,0.62)]"
            >
              BOOK
              <br />
              SITE AUDIT
            </motion.div>
          </div>
        )}

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
          <p className="mb-5 font-mono-tech text-[11px] tracking-[0.22em] text-[#B4BCC8] uppercase">
            ZERO-OBLIGATION SITE AUDIT · MYSURU &amp; KARNATAKA
          </p>

          <TextReveal
            id="assessment-heading"
            as="h2"
            theme="dark"
            lines={['READY TO SECURE', 'YOUR PERIMETER?']}
            className="font-display text-[clamp(2.2rem,5.2vw,4.5rem)] leading-[1.03] font-bold tracking-[-0.03em] uppercase"
          />

          <ChromaticText
            theme="dark"
            muted
            delay={0.22}
            duration={1.3}
            className="mt-6 max-w-md text-sm leading-relaxed sm:text-base"
          >
            No call centers. Direct Mysuru operations officers and a PSARA-ready site
            risk proposal within 48 hours.
          </ChromaticText>

          {/* Accessible fallback/keyboard/touch circular CTA (yields smoothly on desktop while active pointer orb takes over) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              focusForm();
            }}
            className={`mt-10 flex h-26 w-26 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_25%,#FB923C_0%,#EA580C_62%,#C2410C_100%)] text-center font-nav text-[11px] leading-tight font-bold tracking-[0.12em] text-white uppercase shadow-[0_0_56px_rgba(234,88,12,0.52)] transition-all duration-200 hover:scale-105 sm:h-28 sm:w-28 ${
              orbActive ? 'md:opacity-0' : 'opacity-100'
            }`}
          >
            BOOK
            <br />
            SITE AUDIT
          </button>

          <span className="mt-10 font-mono-tech text-[10px] tracking-[0.2em] text-slate-500 uppercase">
            CLICK ANYWHERE TO JUMP TO SITE BRIEF ↓
          </span>
        </div>
      </div>

      {/* STAGE 2: Cleanly Separated Architectural Assessment Form Section */}
      <div className="relative border-t border-white/10 bg-[#090C11] pt-24 pb-24 sm:pt-30 sm:pb-28 lg:pt-36 lg:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto mb-10 flex max-w-5xl flex-wrap items-center justify-between gap-4">
            <span className="font-mono-tech text-[11px] tracking-[0.18em] text-[#B4BCC8] uppercase">
              05 / DIRECT SITE RISK BRIEF · PSARA KARNATAKA
            </span>
            <span className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-400 uppercase">
              CONFIDENTIAL · NDA PROTECTED · 48H PROPOSAL SLA
            </span>
          </div>

          <GlassReveal>
            <div
              ref={formCardRef}
              className="mx-auto max-w-5xl rounded-sm border border-white/12 bg-[#0E1117]/92 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-10 lg:p-12"
            >
          {submission ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-start gap-6 py-4"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 font-mono-tech text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ASSESSMENT BRIEF LOGGED · {submission.refId}
              </div>

              <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-white uppercase sm:text-3xl">
                Thank you, {submission.name}. Our Mysuru Command Desk has received your request.
              </h3>

              <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                A senior Field Operations Officer assigned to <strong className="text-white">{submission.city}</strong> will
                contact you within 4 business hours to confirm your walkthrough for{' '}
                <strong className="text-white">{submission.organization}</strong> and share our
                Karnataka PSARA license dossier.
              </p>

              <div className="flex flex-wrap gap-2">
                {submission.services.map((srv) => (
                  <span
                    key={srv}
                    className="rounded-sm border border-white/15 bg-white/5 px-3 py-1 font-mono-tech text-[11px] text-slate-200"
                  >
                    {srv}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmission(null)}
                  className="rounded-full border border-white/25 px-5 py-2.5 font-display text-xs font-bold tracking-[0.1em] text-white uppercase transition-colors hover:bg-white hover:text-[#06080C]"
                >
                  <ScrambleText text="SUBMIT ANOTHER SITE" />
                </button>
                <a
                  href={AGENCY_INFO.dispatchPhoneHref}
                  className="font-mono-tech text-xs text-[#CBD5E1] underline underline-offset-4"
                >
                  Urgent Deployment? Call 24/7 Dispatch: {AGENCY_INFO.dispatchPhone}
                </a>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h3 className="font-display text-xl font-extrabold tracking-[-0.015em] text-white uppercase sm:text-2xl">
                    Site Risk Assessment &amp; Guarding Quote
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    All inquiries are handled confidentially under NDA by our Mysuru operations desk.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 font-mono-tech text-[10px] tracking-[0.14em] text-slate-300 uppercase">
                  <ShieldCheck className="h-4 w-4 text-[#9CA3AF]" aria-hidden="true" />
                  <span>PSARA LICENSED · KARNATAKA</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div className="assessment-field">
                  <label htmlFor="fullName" className="block text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                    Full Name *
                  </label>
                  <span id="fullName-hint" className="mt-1 block text-xs text-slate-400">
                    Operations lead, facility manager, or authorized signatory
                  </span>
                  <input
                    ref={firstInputRef}
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    aria-describedby="fullName-hint"
                    data-error="fullName-error"
                    placeholder="e.g., Siddharth Rao"
                    className="mt-2 w-full rounded-sm border border-white/18 bg-[#06080C] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#9CA3AF] focus:outline-none"
                  />
                  <div id="fullName-error" className="field-error mt-1.5 items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" role="img" aria-label="Error" />
                    <span>Please enter your full name (at least 2 characters).</span>
                  </div>
                </div>

                {/* Organization */}
                <div className="assessment-field">
                  <label htmlFor="organization" className="block text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                    Company / Campus Name *
                  </label>
                  <span id="org-hint" className="mt-1 block text-xs text-slate-400">
                    Corporate park, plant, hospital, institution, or estate
                  </span>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="organization"
                    aria-describedby="org-hint"
                    data-error="org-error"
                    placeholder="e.g., Chamundi Precision Works"
                    className="mt-2 w-full rounded-sm border border-white/18 bg-[#06080C] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#9CA3AF] focus:outline-none"
                  />
                  <div id="org-error" className="field-error mt-1.5 items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" role="img" aria-label="Error" />
                    <span>Please enter the name of your organization or facility.</span>
                  </div>
                </div>

                {/* Work Email */}
                <div className="assessment-field">
                  <label htmlFor="workEmail" className="block text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                    Work Email *
                  </label>
                  <span id="email-hint" className="mt-1 block text-xs text-slate-400">
                    Format: name@company.in — proposal &amp; PSARA credentials sent here
                  </span>
                  <input
                    id="workEmail"
                    name="workEmail"
                    type="email"
                    required
                    autoComplete="email"
                    aria-describedby="email-hint"
                    data-error="email-error"
                    placeholder="name@company.in"
                    className="mt-2 w-full rounded-sm border border-white/18 bg-[#06080C] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#9CA3AF] focus:outline-none"
                  />
                  <div id="email-error" className="field-error mt-1.5 items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" role="img" aria-label="Error" />
                    <span>Enter a valid work email address in the format name@company.in.</span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="assessment-field">
                  <label htmlFor="phone" className="block text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                    Direct Phone / Mobile *
                  </label>
                  <span id="phone-hint" className="mt-1 block text-xs text-slate-400">
                    10-digit Indian mobile or STD landline (e.g., +91 98450 12345)
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    pattern="[\+\d\s\-]{10,16}"
                    aria-describedby="phone-hint"
                    data-error="phone-error"
                    placeholder="+91 98450 00000"
                    className="mt-2 w-full rounded-sm border border-white/18 bg-[#06080C] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#9CA3AF] focus:outline-none"
                  />
                  <div id="phone-error" className="field-error mt-1.5 items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" role="img" aria-label="Error" />
                    <span>Enter a valid 10–16 character phone number using digits, spaces, or +.</span>
                  </div>
                </div>

                {/* Site Location / Region */}
                <div className="assessment-field">
                  <label htmlFor="city" className="block text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                    Primary Site Location *
                  </label>
                  <span id="city-hint" className="mt-1 block text-xs text-slate-400">
                    Select your Karnataka operational corridor
                  </span>
                  <select
                    id="city"
                    name="city"
                    required
                    defaultValue="Mysuru"
                    aria-describedby="city-hint"
                    data-error="city-error"
                    className="mt-2 w-full rounded-sm border border-white/18 bg-[#06080C] px-4 py-3 text-sm text-white transition-colors focus:border-[#9CA3AF] focus:outline-none"
                  >
                    <option value="Mysuru">Mysuru (City / Hebbal / Hootagalli)</option>
                    <option value="Nanjangud">Nanjangud Industrial Corridor</option>
                    <option value="Bengaluru">Bengaluru (Electronic City / Whitefield / Peenya)</option>
                    <option value="Mangaluru">Mangaluru &amp; Coastal Karnataka</option>
                    <option value="Hubballi-Dharwad">Hubballi-Dharwad &amp; North Karnataka</option>
                    <option value="Multi-Site Karnataka">Multi-Site Pan-Karnataka</option>
                  </select>
                  <div id="city-error" className="field-error mt-1.5 items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" role="img" aria-label="Error" />
                    <span>Please select a primary site location.</span>
                  </div>
                </div>

                {/* Estimated Guarding / Facility Scale */}
                <div className="assessment-field">
                  <label htmlFor="facilityType" className="block text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                    Facility Classification *
                  </label>
                  <span id="facility-hint" className="mt-1 block text-xs text-slate-400">
                    Helps assign the right sector specialist to your audit
                  </span>
                  <select
                    id="facilityType"
                    name="facilityType"
                    required
                    defaultValue="Corporate / IT Campus"
                    aria-describedby="facility-hint"
                    data-error="facility-error"
                    className="mt-2 w-full rounded-sm border border-white/18 bg-[#06080C] px-4 py-3 text-sm text-white transition-colors focus:border-[#9CA3AF] focus:outline-none"
                  >
                    <option value="Corporate / IT Campus">Corporate Office / IT Tech Park</option>
                    <option value="Industrial / Manufacturing">Industrial Plant / Manufacturing</option>
                    <option value="Educational / Healthcare">University Campus / Hospital</option>
                    <option value="Hospitality / Private Estate">Hospitality / Private Estate</option>
                    <option value="Executive / Event Detail">Executive / VIP Close Protection</option>
                  </select>
                  <div id="facility-error" className="field-error mt-1.5 items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" role="img" aria-label="Error" />
                    <span>Please select a facility classification.</span>
                  </div>
                </div>
              </div>

              {/* Service Scope Selection */}
              <fieldset>
                <legend className="text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                  Required Security Scope
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {ASSESSMENT_SERVICES.map((service) => {
                    const checked = selectedServices.includes(service);
                    return (
                      <label
                        key={service}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-sm border px-3.5 py-2.5 text-xs transition-colors ${
                          checked
                            ? 'border-[#9CA3AF] bg-[#3A404B]/35 text-white'
                            : 'border-white/14 bg-[#06080C] text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService(service)}
                          className="h-3.5 w-3.5 accent-[#646C79]"
                        />
                        <span>{service}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Additional Notes */}
              <div className="assessment-field">
                <label htmlFor="notes" className="block text-xs font-semibold tracking-[0.06em] text-slate-200 uppercase">
                  Site Overview &amp; Target Mobilization Date (Optional)
                </label>
                <span id="notes-hint" className="mt-1 block text-xs text-slate-400">
                  Share shift requirements, approximate headcount, or existing CCTV infrastructure
                </span>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  aria-describedby="notes-hint"
                  placeholder="e.g., 24/7 perimeter coverage for 2 gates + reception access control starting next month..."
                  className="mt-2 w-full rounded-sm border border-white/18 bg-[#06080C] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#9CA3AF] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <p className="font-mono-tech text-[11px] text-slate-400">
                  RESPONSE SLA: &lt; 4 BUSINESS HOURS · 24/7 EMERGENCY LINE {AGENCY_INFO.dispatchPhone}
                </p>
                <button
                  type="submit"
                  className="rounded-full bg-white px-7 py-3.5 font-nav text-xs font-bold tracking-[0.14em] text-[#06080C] uppercase transition-colors duration-200 hover:bg-[#EA580C] hover:text-white"
                >
                  <ScrambleText text="REQUEST SITE ASSESSMENT" />
                </button>
              </div>
            </form>
          )}
            </div>
          </GlassReveal>
        </div>
      </div>
    </section>
  );
}
