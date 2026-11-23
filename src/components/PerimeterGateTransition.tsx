import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { QrtPatrolVehicle } from './QrtPatrolVehicle';

type GateStage = 'approaching' | 'scanning' | 'cleared' | 'deployed';

/**
 * Beat 1 of the Hybrid Services Sequence:
 * Studio-grade multi-plane architectural vector animation showing the Vantage QRT Armored Patrol SUV
 * braking into a cantilevered ANPR/LiDAR corporate gatehouse, undergoing live biometric scan,
 * raising the counterweighted hydraulic boom barrier, and continuing seamlessly into Beat 2 (ServicesRail).
 */
export function PerimeterGateTransition() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<GateStage>('approaching');
  const [speedKmh, setSpeedKmh] = useState(24);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Vehicle glides smoothly to ANPR induction line (bumper at x=495, 47px before boom tip at x=542) -> pauses for scan -> accelerates cleanly through open gate
  const vehicleX = useTransform(
    scrollYProgress,
    [0, 0.28, 0.48, 0.94, 1],
    [-320, 196, 204, 1260, 1340]
  );
  const wheelRotate = useTransform(
    scrollYProgress,
    [0, 0.28, 0.48, 0.94, 1],
    [0, 590, 602, 1820, 1910]
  );

  // Authentic suspension physics: subtle nose-dip on braking into checkpoint, neutral on scan, subtle rear squat accelerating out
  const chassisPitch = useTransform(
    scrollYProgress,
    [0, 0.22, 0.28, 0.34, 0.48, 0.56, 0.72, 1],
    [0, 0.3, 1.35, 0, 0, -1.1, -0.25, 0]
  );
  const chassisY = useTransform(
    scrollYProgress,
    [0, 0.26, 0.32, 0.48, 0.56, 0.7, 1],
    [0, 1.4, 0, 0, -0.8, 0, 0]
  );

  // Hydraulic boom barrier pivots cleanly upward (~76deg) from right pedestal collar
  const barrierRotate = useTransform(scrollYProgress, [0, 0.36, 0.54, 1], [0, 0, 76, 76]);

  // Volumetric LiDAR scan beam & frosted-glass telemetry verification HUD
  const scanBeamOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.3, 0.46, 0.54],
    [0, 0.96, 0.96, 0]
  );
  const scanLineY = useTransform(scrollYProgress, [0.26, 0.46], [190, 344]);
  const hudOpacity = useTransform(scrollYProgress, [0.28, 0.35, 0.56, 0.66], [0, 1, 1, 0]);
  const hudY = useTransform(scrollYProgress, [0.28, 0.35], [10, 0]);

  // Subtle architectural parallax layers
  const skylineX = useTransform(scrollYProgress, [0, 1], [16, -24]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ['5%', '-14%']);
  const cctvPan = useTransform(scrollYProgress, [0, 0.42, 0.9], [-20, 2, 24]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.26) {
      setStage('approaching');
      setSpeedKmh(Math.max(4, Math.round(24 - v * 78)));
    } else if (v < 0.47) {
      setStage('scanning');
      setSpeedKmh(0);
    } else if (v < 0.76) {
      setStage('cleared');
      setSpeedKmh(Math.min(28, Math.round((v - 0.47) * 96)));
    } else {
      setStage('deployed');
      setSpeedKmh(28);
    }
  });

  const stageTelemetry = {
    approaching: {
      code: 'GATE 01 // APPROACHING CHECKPOINT',
      pillColor: 'bg-[#0E1117] text-white',
      dotColor: 'bg-[#EA580C]',
    },
    scanning: {
      code: 'ANPR & LIDAR SCAN IN PROGRESS',
      pillColor: 'bg-[#EA580C] text-white',
      dotColor: 'bg-white',
    },
    cleared: {
      code: 'PSARA ID VERIFIED · BARRIER RAISED',
      pillColor: 'bg-emerald-700 text-white',
      dotColor: 'bg-emerald-300',
    },
    deployed: {
      code: 'DISPATCHING INTO 06 SECURITY LAYERS ↓',
      pillColor: 'bg-[#0E1117] text-white',
      dotColor: 'bg-[#EA580C]',
    },
  }[stage];

  const isCleared = stage === 'cleared' || stage === 'deployed';

  // Clean responsive / reduced-motion architectural stage for mobile & accessibility
  const StaticMobileStage = (
    <div className="relative overflow-hidden bg-white pt-10">
      <div className="mx-auto max-w-[1440px] px-5 pb-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
          <span>PERIMETER GATE 01 · ANPR CHECKPOINT</span>
          <span className="text-[#EA580C]">PSARA VERIFIED · CLEARANCE OPEN</span>
        </div>
      </div>

      <svg
        viewBox="0 0 1200 390"
        className="block h-auto w-full"
        role="img"
        aria-label="Detailed architectural schematic of a Vantage Security QRT SUV passing through an ANPR corporate gatehouse"
      >
        <rect x="0" y="0" width="1200" height="316" fill="#FFFFFF" />
        {/* Corporate Campus Skyline Elevation */}
        <path
          d="M 860 316 L 860 94 L 1170 94 L 1170 316 M 915 94 L 915 316 M 975 94 L 975 316 M 1035 94 L 1035 316 M 1095 94 L 1095 316"
          fill="#F8FAFC"
          stroke="rgba(14,17,23,0.12)"
          strokeWidth="1.2"
        />
        {/* Gatehouse */}
        <rect x="815" y="196" width="166" height="120" fill="#0E1117" />
        <rect x="800" y="182" width="196" height="15" fill="#1F242E" />
        <rect x="832" y="214" width="102" height="48" fill="#1E293B" />
        <polygon points="862,214 888,214 868,262 842,262" fill="#FFFFFF" opacity="0.22" />
        {/* Raised Boom Barrier */}
        <g transform="translate(700, 272) rotate(72)">
          <rect x="-152" y="-4.5" width="152" height="9" rx="2" fill="#0E1117" />
          <rect x="-136" y="-4.5" width="18" height="9" fill="#FFFFFF" />
          <rect x="-98" y="-4.5" width="18" height="9" fill="#EA580C" />
          <rect x="-60" y="-4.5" width="18" height="9" fill="#FFFFFF" />
          <rect x="-24" y="-4.5" width="14" height="9" fill="#EA580C" />
        </g>
        <rect x="684" y="258" width="32" height="58" rx="3" fill="#0E1117" />
        <circle cx="700" cy="272" r="4.5" fill="#10B981" />
        {/* Detailed QRT SUV */}
        <g transform="translate(260, 210)">
          <QrtPatrolVehicle wheelRotate={0} activeBeacon showHeadlight />
        </g>
        <rect x="0" y="316" width="1200" height="74" fill="#06080C" />
      </svg>
    </div>
  );

  if (prefersReducedMotion) {
    return StaticMobileStage;
  }

  return (
    <div className="relative bg-[#06080C]">
      {/* Mobile / Tablet */}
      <div className="lg:hidden">{StaticMobileStage}</div>

      {/* Desktop Studio-Grade Pinned Scroll-Driven Gatehouse Sequence */}
      <div ref={containerRef} className="relative hidden h-[170vh] bg-white lg:block">
        <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-white pt-20">
          {/* Top Minimal Telemetry Strip */}
          <div className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-12 pt-4">
            <div className="flex items-center gap-6">
              <div className="font-mono-tech text-xs font-bold tracking-[0.16em] text-[#0E1117] tabular-nums">
                {String(speedKmh).padStart(2, '0')} KM/H
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono-tech text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 ${stageTelemetry.pillColor}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${stageTelemetry.dotColor}`} />
                <span>{stageTelemetry.code}</span>
              </div>
            </div>

            <div className="flex items-center gap-5 font-mono-tech text-[10px] tracking-[0.16em] text-[#525B6A] uppercase">
              <span>PSARA CHECKPOINT · MYSURU HQ</span>
              <span className="h-3 w-px bg-[#0E1117]/15" aria-hidden="true" />
              <span className="text-[#0E1117]">01 / PERIMETER ENTRY</span>
            </div>
          </div>

          {/* Giant Architectural Watermark */}
          <motion.div
            aria-hidden="true"
            style={{ x: watermarkX }}
            className="pointer-events-none absolute inset-x-0 top-[18%] z-0 select-none whitespace-nowrap font-display text-[10.5vw] leading-none font-black tracking-[-0.04em] text-[#0E1117]/[0.04] uppercase will-change-transform"
          >
            PERIMETER COMMAND · PSARA
          </motion.div>

          {/* Main Studio-Detailed Architectural Vector Scene */}
          <div className="relative z-10 mt-auto w-full">
            <svg
              viewBox="0 0 1200 440"
              preserveAspectRatio="xMidYMax slice"
              className="block h-[70vh] min-h-[400px] max-h-[580px] w-full"
              role="img"
              aria-label="Scroll-animated architectural scene showing a Vantage Security armored QRT patrol SUV clearing a LiDAR corporate gatehouse"
            >
              <defs>
                {/* Volumetric ANPR LiDAR Scan Curtain */}
                <linearGradient id="lidar-curtain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA580C" stopOpacity="0.38" />
                  <stop offset="55%" stopColor="#F97316" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </linearGradient>
                {/* Architectural Gatehouse Fascia Gradient */}
                <linearGradient id="gatehouse-wall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A1F28" />
                  <stop offset="100%" stopColor="#090C11" />
                </linearGradient>
                {/* Awning LED Downlight Cone */}
                <linearGradient id="awning-light" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.36" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
                {/* Corporate Glass Tower Sky Reflection */}
                <linearGradient id="campus-glass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F1F5F9" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
                {/* Road Subtle Sheen */}
                <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12161E" />
                  <stop offset="16%" stopColor="#06080C" />
                  <stop offset="100%" stopColor="#06080C" />
                </linearGradient>
              </defs>

              {/* Plane 1 (Parallax Far Background): Modern Glass Corporate HQ Elevation */}
              <motion.g style={{ x: skylineX }} className="will-change-transform">
                {/* Far Campus Wing */}
                <rect
                  x="930"
                  y="74"
                  width="275"
                  height="278"
                  fill="url(#campus-glass)"
                  stroke="rgba(14,17,23,0.12)"
                  strokeWidth="1.2"
                />
                {/* Crisp Architectural Glass Mullions */}
                <g stroke="rgba(14,17,23,0.09)" strokeWidth="1">
                  {[114, 154, 194, 234, 274, 314].map((gy) => (
                    <line key={gy} x1="930" y1={gy} x2="1205" y2={gy} />
                  ))}
                  {[985, 1040, 1095, 1150].map((gx) => (
                    <line key={gx} x1={gx} y1="74" x2={gx} y2="352" />
                  ))}
                </g>
                {/* Cantilever Roof Trim */}
                <rect x="920" y="68" width="285" height="7" fill="#CBD5E1" />
                {/* Distant Perimeter Sensor Fence & Lighting Bollards */}
                <g stroke="rgba(14,17,23,0.12)" strokeWidth="1">
                  <line x1="0" y1="316" x2="540" y2="316" strokeDasharray="5 5" />
                  <line x1="0" y1="332" x2="540" y2="332" />
                  {[60, 145, 230, 315, 400, 485].map((px) => (
                    <g key={px}>
                      <line x1={px} y1="304" x2={px} y2="352" />
                      <circle cx={px} cy="304" r="2.2" fill="rgba(14,17,23,0.22)" />
                    </g>
                  ))}
                </g>
              </motion.g>

              {/* Plane 2: Engineered ANPR / LiDAR Steel Cantilever Gantry */}
              <g>
                {/* Vertical Structural Mast Column */}
                <rect x="688" y="142" width="16" height="210" fill="#181C24" />
                <rect x="692" y="142" width="4" height="210" fill="#2D3442" />
                {/* Cantilever Steel Beam Truss */}
                <path
                  d="M 332 142 L 826 142 L 826 158 L 348 158 Z"
                  fill="#0E1117"
                />
                <line x1="348" y1="146" x2="824" y2="146" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                {/* Structural Gusset Bracket */}
                <polygon points="688,158 656,158 688,190" fill="#232833" />

                {/* Dual Overhead Optical ANPR & LiDAR Scanner Pod */}
                <rect x="386" y="158" width="76" height="17" rx="2.5" fill="#1F242E" stroke="#334155" strokeWidth="1" />
                <rect x="396" y="163" width="18" height="6" rx="1" fill="#0B0E14" />
                <rect x="434" y="163" width="18" height="6" rx="1" fill="#0B0E14" />
                <circle cx="424" cy="175" r="4.5" fill={isCleared ? '#10B981' : '#EA580C'} />
                <text
                  x="424"
                  y="133"
                  textAnchor="middle"
                  fill="#525B6A"
                  fontSize="8.8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  letterSpacing="1.8"
                >
                  ANPR // LIDAR VERIFICATION GANTRY
                </text>
              </g>

              {/* Plane 2B: Volumetric LiDAR Scan Curtain + Frosted Verification HUD Card */}
              <motion.g style={{ opacity: scanBeamOpacity }}>
                <polygon
                  points="412,178 436,178 524,350 318,350"
                  fill="url(#lidar-curtain)"
                />
                <motion.line
                  x1="336"
                  x2="508"
                  y1={scanLineY}
                  y2={scanLineY}
                  stroke="#EA580C"
                  strokeWidth="2.2"
                  strokeDasharray="8 4"
                />
              </motion.g>

              {/* Live Floating Frosted Telemetry HUD Card during Scan/Clearance */}
              <motion.g style={{ opacity: hudOpacity, y: hudY }}>
                <rect
                  x="130"
                  y="152"
                  width="210"
                  height="64"
                  rx="4"
                  fill="#0E1117"
                  fillOpacity="0.92"
                  stroke={isCleared ? '#10B981' : '#EA580C'}
                  strokeWidth="1.2"
                />
                <circle cx="146" cy="169" r="3.5" fill={isCleared ? '#10B981' : '#EA580C'} />
                <text
                  x="157"
                  y="172"
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  letterSpacing="1.2"
                >
                  {isCleared ? 'CLEARANCE GRANTED' : 'SCANNING CREDENTIAL'}
                </text>
                <text
                  x="144"
                  y="191"
                  fill="#94A3B8"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="0.8"
                >
                  UNIT: KA-09-VS-0412 · QRT-04
                </text>
                <text
                  x="144"
                  y="205"
                  fill={isCleared ? '#6EE7B7' : '#FDBA74'}
                  fontSize="7.6"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="1"
                >
                  {isCleared ? 'PSARA LICENSE · VERIFIED OK' : 'SOC BIOMETRIC MATCH · 99.8%'}
                </text>
                {/* Connector Pointer Line down toward QRT Hood */}
                <polyline
                  points="340,184 368,184 392,232"
                  fill="none"
                  stroke={isCleared ? '#10B981' : '#EA580C'}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </motion.g>

              {/* Plane 3: Brushed-Aluminum Architectural Gatehouse Pavilion ('COMMAND POST 01') */}
              <g>
                {/* Main Facade */}
                <rect x="816" y="206" width="180" height="146" fill="url(#gatehouse-wall)" />
                {/* Architectural Louver Side Fin Accent */}
                <g stroke="rgba(255,255,255,0.08)" strokeWidth="1.2">
                  {[220, 230, 240, 250, 260, 270, 280, 290, 300, 310].map((ly) => (
                    <line key={ly} x1="964" y1={ly} x2="988" y2={ly} />
                  ))}
                </g>
                {/* Cantilever Roof Slab + Brushed Fascia Lip */}
                <rect x="788" y="190" width="224" height="16" fill="#232833" />
                <rect x="788" y="203" width="224" height="3" fill="#475569" />
                {/* Subtle Awning LED Downlight Cone illuminating Officer Post */}
                <polygon points="794,206 814,206 824,352 778,352" fill="url(#awning-light)" opacity="0.22" />

                {/* Recessed Smoked Command Observation Window */}
                <rect x="832" y="222" width="116" height="58" rx="1.5" fill="#1E293B" stroke="#334155" strokeWidth="1.2" />
                {/* Illuminated Dual SOC Telemetry Consoles inside Booth */}
                <rect x="844" y="254" width="38" height="20" rx="1.5" fill="#0A0D12" stroke="#475569" strokeWidth="0.8" />
                <rect x="848" y="258" width="18" height="3" fill="#EA580C" opacity="0.9" />
                <rect x="848" y="264" width="26" height="2" fill="#38BDF8" opacity="0.5" />
                <rect x="890" y="254" width="38" height="20" rx="1.5" fill="#0A0D12" stroke="#475569" strokeWidth="0.8" />
                <circle cx="909" cy="264" r="5" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.8" />
                {/* Specular Window Reflection */}
                <polygon points="866,222 894,222 872,280 844,280" fill="#FFFFFF" opacity="0.18" />

                {/* Panning Roof PTZ Dome Camera */}
                <g transform="translate(804, 206)">
                  <rect x="-4" y="0" width="8" height="7" fill="#475569" />
                  <motion.g style={{ rotate: cctvPan, originX: 0.5, originY: 0 }}>
                    <path d="M -8.5 7 A 8.5 8.5 0 0 0 8.5 7 Z" fill="#0E1117" stroke="#475569" strokeWidth="0.8" />
                    <circle cx="0" cy="11.5" r="2.2" fill="#EA580C" />
                  </motion.g>
                </g>

                {/* Crisp Brushed Plaque Signage */}
                <rect x="832" y="296" width="116" height="22" rx="1.5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <text
                  x="890"
                  y="310"
                  textAnchor="middle"
                  fill="#CBD5E1"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  letterSpacing="2.2"
                >
                  COMMAND POST 01
                </text>
              </g>

              {/* Refined Proportioned Uniformed Security Officer at Gatehouse Post */}
              <g transform="translate(778, 256)">
                <ellipse cx="0" cy="96" rx="14" ry="3" fill="rgba(6,8,12,0.28)" />
                {/* Peaked Cap & Head */}
                <circle cx="0" cy="13" r="7.5" fill="#1E242E" />
                <path d="M -9 8 L 9 8 L 7 2.5 L -7 2.5 Z" fill="#0E1117" />
                <rect x="-11" y="7.5" width="17" height="2.2" rx="1" fill="#06080C" />
                <rect x="-2.5" y="4.5" width="5" height="2" rx="0.6" fill="#EA580C" />
                {/* Tailored Uniform Shoulders, Jacket & Arms */}
                <path
                  d="M -14 27 C -14 21 -7 20 0 20 C 7 20 14 21 14 27 L 16 54 L 10 54 L 9 34 L 9 56 L -9 56 L -9 34 L -10 54 L -16 54 Z"
                  fill="#0E1117"
                />
                {/* Crisp Dress Shirt Collar, Tie & Reflective Vest Accent */}
                <polygon points="-4,20 4,20 0,32" fill="#F8FAFC" />
                <polygon points="-1.4,22 1.4,22 1,35 0,38 -1,35" fill="#1E293B" />
                <rect x="-13" y="21.5" width="5.5" height="2.2" rx="0.8" fill="#EA580C" />
                <rect x="7.5" y="21.5" width="5.5" height="2.2" rx="0.8" fill="#EA580C" />
                {/* Shoulder Radio Mic LED */}
                <circle cx="-6" cy="28" r="1.5" fill="#10B981" />
                {/* Tailored Trousers & Boots */}
                <rect x="-8.5" y="56" width="7.2" height="36" rx="1.5" fill="#161A22" />
                <rect x="1.3" y="56" width="7.2" height="36" rx="1.5" fill="#161A22" />
                <rect x="-9.5" y="90" width="8.5" height="5" rx="1.5" fill="#06080C" />
                <rect x="1.3" y="90" width="8.5" height="5" rx="1.5" fill="#06080C" />
              </g>

              {/* Hydraulic Articulated Boom Barrier Arm (right collar welded dead-center at 700, 306) */}
              <g transform="translate(700, 306)">
                <motion.g
                  style={{
                    rotate: barrierRotate,
                    originX: 1,
                    originY: 0.5,
                  }}
                >
                  <rect x="-158" y="-5" width="158" height="10" rx="2.5" fill="#0E1117" />
                  <rect x="-144" y="-5" width="19" height="10" fill="#F8FAFC" />
                  <rect x="-106" y="-5" width="19" height="10" fill="#EA580C" />
                  <rect x="-68" y="-5" width="19" height="10" fill="#F8FAFC" />
                  <rect x="-30" y="-5" width="18" height="10" fill="#EA580C" />
                  {/* Subtle top metallic bevel highlight */}
                  <line x1="-156" y1="-3.5" x2="-4" y2="-3.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
                </motion.g>
              </g>

              {/* Engineered Hydraulic Boom Pedestal Housing */}
              <g>
                <rect x="683" y="286" width="34" height="66" rx="3" fill="#0E1117" stroke="#2D3442" strokeWidth="1.2" />
                <rect x="681" y="282" width="38" height="6" rx="1.5" fill="#232833" />
                {/* Recessed Vertical Status LED Bar */}
                <rect x="690" y="298" width="20" height="22" rx="2" fill="#181C24" />
                <circle cx="700" cy="309" r="5" fill={isCleared ? '#10B981' : '#EA580C'} />
                <rect x="687" y="346" width="26" height="6" fill="#334155" />
              </g>

              {/* Plane 4: Studio-Detailed Armored QRT Patrol SUV locked to y=352 road datum */}
              <g transform="translate(0, 246)">
                <motion.g style={{ x: vehicleX }}>
                  <QrtPatrolVehicle
                    wheelRotate={wheelRotate}
                    chassisPitch={chassisPitch}
                    chassisY={chassisY}
                    activeBeacon
                    showHeadlight
                  />
                </motion.g>
              </g>

              {/* Plane 5: Architectural Obsidian Road Surface + Induction Loop Sensor Strip */}
              <rect x="0" y="352" width="1200" height="88" fill="url(#road-grad)" />
              <line x1="0" y1="352" x2="1200" y2="352" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

              {/* Crisp Precision Road Lane Dashes */}
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="28 22">
                <line x1="0" y1="392" x2="1200" y2="392" />
              </g>

              {/* Ground ANPR Induction Loop Stop Bar (turns amber -> emerald on verification) */}
              <rect
                x="502"
                y="359"
                width="7"
                height="58"
                rx="1.5"
                fill={isCleared ? '#10B981' : '#EA580C'}
                opacity="0.88"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
