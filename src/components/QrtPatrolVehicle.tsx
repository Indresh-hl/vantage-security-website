import { useId } from 'react';
import { motion, type MotionValue } from 'motion/react';

interface QrtPatrolVehicleProps {
  wheelRotate: MotionValue<number> | number;
  /** Subtle chassis braking nose-dive / acceleration squat in degrees */
  chassisPitch?: MotionValue<number> | number;
  /** Subtle vertical suspension travel in SVG units */
  chassisY?: MotionValue<number> | number;
  /** Illuminate tactical roof strobe & headlight beam */
  activeBeacon?: boolean;
  /** Show volumetric headlight projection cone */
  showHeadlight?: boolean;
}

/**
 * Studio-grade side-elevation technical illustration of a Vantage Security Armored QRT Patrol SUV.
 * Features multi-stop metallic body curvature, smoked architectural cabin glazing with interior depth,
 * contoured wheel arches, static Signal Amber brake calipers behind rotating 10-spoke forged alloy rims,
 * tactical roof lightbar, and optional scroll-driven suspension pitch.
 *
 * Coordinate bounds: x = 12..300, tire contact line at y = 106.
 */
export function QrtPatrolVehicle({
  wheelRotate,
  chassisPitch = 0,
  chassisY = 0,
  activeBeacon = true,
  showHeadlight = true,
}: QrtPatrolVehicleProps) {
  const uid = useId().replace(/:/g, '');
  const bodyGradId = `qrt-body-${uid}`;
  const lowerTrimGradId = `qrt-trim-${uid}`;
  const glassGradId = `qrt-glass-${uid}`;
  const rimGradId = `qrt-rim-${uid}`;
  const headlightGradId = `qrt-beam-${uid}`;
  const amberGlowId = `qrt-amber-${uid}`;

  const renderWheel = (cx: number, cy: number) => (
    <g transform={`translate(${cx}, ${cy})`}>
      {/* Deep recessed wheel-well cavity shadow */}
      <circle r="24.5" fill="#05070A" />
      {/* Sculpted tire rubber sidewall */}
      <circle r="22.8" fill="#12151C" stroke="#080A0F" strokeWidth="1.2" />
      <circle r="19.8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle r="16.2" fill="#0B0E14" stroke="#252B36" strokeWidth="1.2" />

      {/* Static ventilated brake rotor & Signal Amber caliper (stays fixed while rim rotates) */}
      <circle r="11.2" fill="#1E242E" stroke="#363E4D" strokeWidth="0.9" />
      <circle r="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="2 2.5" />
      <path
        d="M -11.5 -5.5 A 12 12 0 0 0 -11.5 5.5 L -8.2 4.2 A 9 9 0 0 1 -8.2 -4.2 Z"
        fill="#EA580C"
      />

      {/* Rotating 10-spoke machined titanium alloy rim */}
      <motion.g style={{ rotate: wheelRotate, originX: 0.5, originY: 0.5 }}>
        <circle r="15.2" fill="none" stroke={`url(#${rimGradId})`} strokeWidth="2.1" />
        {[0, 36, 72, 108, 144].map((angle) => (
          <line
            key={angle}
            x1="-14.4"
            y1="0"
            x2="14.4"
            y2="0"
            stroke={`url(#${rimGradId})`}
            strokeWidth="1.7"
            strokeLinecap="round"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Center forged hub cap with Signal Amber precision ring */}
        <circle r="4.8" fill="#11151C" stroke="#CBD5E1" strokeWidth="1.1" />
        <circle r="2.1" fill="#EA580C" />
      </motion.g>
    </g>
  );

  return (
    <g>
      <defs>
        {/* Multi-stop satin obsidian automotive metallic paint gradient */}
        <linearGradient id={bodyGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B4352" />
          <stop offset="18%" stopColor="#202530" />
          <stop offset="44%" stopColor="#12161E" />
          <stop offset="52%" stopColor="#29303D" />
          <stop offset="62%" stopColor="#0E1117" />
          <stop offset="100%" stopColor="#080A0F" />
        </linearGradient>

        {/* Brushed dark-titanium lower rocker & armor cladding */}
        <linearGradient id={lowerTrimGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262C37" />
          <stop offset="50%" stopColor="#171B23" />
          <stop offset="100%" stopColor="#0A0D12" />
        </linearGradient>

        {/* Smoked tinted architectural glass */}
        <linearGradient id={glassGradId} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="48%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Machined forged alloy specular gradient */}
        <linearGradient id={rimGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Volumetric LED headlight projection cone */}
        <linearGradient id={headlightGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFF7ED" stopOpacity="0.62" />
          <stop offset="28%" stopColor="#FDBA74" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
        </linearGradient>

        {/* Soft radial roof lightbar optical glow */}
        <radialGradient id={amberGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FB923C" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#EA580C" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft grounded ambient-occlusion tire contact shadow */}
      <ellipse cx="154" cy="106" rx="142" ry="5.2" fill="rgba(6,8,12,0.34)" />
      <ellipse cx="154" cy="106" rx="118" ry="2.6" fill="rgba(6,8,12,0.52)" />

      {/* Sprung Chassis Assembly (subtle brake nose-dive & acceleration squat) */}
      <motion.g
        style={{
          y: chassisY,
          rotate: chassisPitch,
          originX: 0.5,
          originY: 0.85,
        }}
      >
        {/* Volumetric LED Headlight Beam */}
        {showHeadlight && (
          <polygon
            points="290,52 440,28 440,94 290,64"
            fill={`url(#${headlightGradId})`}
          />
        )}

        {/* Roof Tactical Lightbar Ambient Aura */}
        {activeBeacon && (
          <ellipse cx="158" cy="14" rx="46" ry="18" fill={`url(#${amberGlowId})`} />
        )}

        {/* Tactical Roof Rack Rail & Communications Fin Antenna */}
        <path
          d="M 64 18 L 194 18 L 198 22 L 60 22 Z"
          fill="#1B2029"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.7"
        />
        <path d="M 52 21 L 64 14 L 68 21 Z" fill="#0E1117" />

        {/* Low-Profile Aerodynamic Tactical Lightbar */}
        <rect
          x="136"
          y="10.5"
          width="44"
          height="7.5"
          rx="2.5"
          fill="#161A22"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.8"
        />
        <rect
          x="141"
          y="12.2"
          width="15"
          height="4"
          rx="1.2"
          fill="#EA580C"
          opacity={activeBeacon ? 1 : 0.65}
        />
        <rect x="160" y="12.2" width="15" height="4" rx="1.2" fill="#F8FAFC" opacity="0.92" />

        {/* Sculpted Armored SUV Main Unibody */}
        <path
          d="M 22 72
             L 25 46
             L 32 42
             L 56 22
             L 202 22
             L 234 45
             L 285 48
             C 292 49 296 54 296 62
             L 296 78
             L 289 86
             L 262 86
             C 262 56 202 56 202 86
             L 106 86
             C 106 56 46 56 46 86
             L 24 86
             L 19 78 Z"
          fill={`url(#${bodyGradId})`}
          stroke="#07090D"
          strokeWidth="1.2"
        />

        {/* Upper Shoulder Crisp Specular Character Crease Line */}
        <path
          d="M 32 49 L 284 52"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="1.1"
          fill="none"
        />

        {/* Lower Armored Rocker Cladding & Machined Skid Steps */}
        <path
          d="M 105 74 L 203 74 L 203 86 L 105 86 Z"
          fill={`url(#${lowerTrimGradId})`}
        />
        <rect x="110" y="83" width="88" height="3.2" rx="1.2" fill="#475569" opacity="0.7" />
        {/* Front & Rear Brushed Aluminum Skid Plates */}
        <path d="M 266 80 L 295 77 L 291 86 L 264 86 Z" fill="#475569" />
        <path d="M 20 79 L 44 80 L 44 86 L 23 86 Z" fill="#334155" />

        {/* Tactical Front Bull-Bar Guard & Louvered Grille */}
        <rect x="292" y="55" width="7" height="23" rx="2" fill="#1F242E" stroke="#64748B" strokeWidth="0.9" />
        <line x1="294" y1="61" x2="298" y2="61" stroke="#94A3B8" strokeWidth="1" />
        <line x1="294" y1="67" x2="298" y2="67" stroke="#94A3B8" strokeWidth="1" />
        <line x1="294" y1="73" x2="298" y2="73" stroke="#94A3B8" strokeWidth="1" />

        {/* Flared Matte-Carbon Wheel Arch Eyebrows */}
        <path
          d="M 44 86 C 44 53 108 53 108 86"
          fill="none"
          stroke="#272E3A"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M 200 86 C 200 53 264 53 264 86"
          fill="none"
          stroke="#272E3A"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        {/* Smoked Glazed 3-Zone Architectural Cabin Windows */}
        {/* Rear Cargo Quarter Glass */}
        <path
          d="M 43 43 L 62 26 L 103 26 L 103 43 Z"
          fill={`url(#${glassGradId})`}
          stroke="#0A0D12"
          strokeWidth="1.2"
        />
        {/* Rear Passenger Window */}
        <path
          d="M 109 26 L 161 26 L 161 44 L 109 44 Z"
          fill={`url(#${glassGradId})`}
          stroke="#0A0D12"
          strokeWidth="1.2"
        />
        {/* Front Driver Door & Windshield Rake */}
        <path
          d="M 167 26 L 198 26 L 226 45 L 167 45 Z"
          fill={`url(#${glassGradId})`}
          stroke="#0A0D12"
          strokeWidth="1.2"
        />

        {/* Subtle Interior Headrest Silhouettes inside Smoked Glass */}
        <rect x="122" y="34" width="9" height="9" rx="2.5" fill="#090C11" opacity="0.55" />
        <rect x="176" y="33" width="10" height="10" rx="2.5" fill="#090C11" opacity="0.6" />

        {/* Diagonal Specular Studio Reflections Across Cabin Windows */}
        <polygon points="72,26 84,26 73,43 61,43" fill="#FFFFFF" opacity="0.16" />
        <polygon points="128,26 144,26 131,44 115,44" fill="#FFFFFF" opacity="0.18" />
        <polygon points="184,26 198,26 184,45 170,45" fill="#FFFFFF" opacity="0.24" />

        {/* Sculpted Aerodynamic Side Mirror */}
        <path
          d="M 212 42 L 224 41 C 227 41 228 45 225 47 L 213 47 Z"
          fill="#262C37"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.7"
        />

        {/* Hairline Door Panel Shutlines & Flush Recessed Handles */}
        <line x1="164" y1="45" x2="164" y2="73" stroke="rgba(255,255,255,0.12)" strokeWidth="0.9" />
        <line x1="106" y1="45" x2="106" y2="73" stroke="rgba(255,255,255,0.12)" strokeWidth="0.9" />
        <rect x="118" y="51" width="12" height="2.6" rx="1.2" fill="#64748B" />
        <rect x="174" y="51" width="12" height="2.6" rx="1.2" fill="#64748B" />

        {/* Tapered Signal Amber Precision Tactical Livery Stripe */}
        <path
          d="M 30 62 L 280 62"
          stroke="#EA580C"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M 110 65.8 L 198 65.8"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.8"
        />

        {/* Crisp Side Door Command Typography */}
        <text
          x="154"
          y="58.5"
          textAnchor="middle"
          fill="#CBD5E1"
          fontSize="6.6"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="700"
          letterSpacing="1.8"
        >
          VANTAGE · QRT-04
        </text>

        {/* Matrix LED Headlight Assembly */}
        <path
          d="M 278 51 L 294 52 L 294 58 L 281 58 Z"
          fill="#F8FAFC"
        />
        <rect x="282" y="59" width="11" height="2" rx="0.8" fill="#FDBA74" />

        {/* Signature LED Tail-Lamp Bar */}
        <path d="M 22 48 L 30 48 L 29 59 L 21 59 Z" fill="#EA580C" />
        <rect x="21" y="50" width="4" height="6" rx="1" fill="#FB923C" />
      </motion.g>

      {/* Unsprung Forged Alloy Wheel Assemblies (locked strictly to y=83 road datum) */}
      {renderWheel(76, 83)}
      {renderWheel(232, 83)}
    </g>
  );
}
