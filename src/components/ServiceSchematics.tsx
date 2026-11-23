import { motion, useReducedMotion } from 'motion/react';
import type { ServiceItem } from '../data/agencyContent';

interface ServiceSchematicProps {
  icon: ServiceItem['icon'];
  size?: 'badge' | 'stage';
  active?: boolean;
}

/**
 * Custom architectural vector animations for all 6 Vantage Security disciplines.
 * Renders cleanly in both compact card badges and the live featured stage above ServicesRail.
 */
export function ServiceSchematic({
  icon,
  size = 'badge',
  active = true,
}: ServiceSchematicProps) {
  const prefersReducedMotion = useReducedMotion();
  const animate = active && !prefersReducedMotion;
  const dims = size === 'stage' ? 'h-24 w-40 sm:h-28 sm:w-48' : 'h-12 w-12';

  switch (icon) {
    /* 01 / Corporate & Campus Guarding — Uniformed officer + calm surveillance light sweep */
    case 'shield':
      return (
        <svg viewBox="0 0 120 72" className={dims} aria-hidden="true">
          <defs>
            <linearGradient id="guard-beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Ground datum line */}
          <line x1="10" y1="62" x2="110" y2="62" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          {/* Sweeping perimeter surveillance cone */}
          <motion.g
            style={{ transformOrigin: '36px 28px' }}
            animate={animate ? { rotate: [-14, 14, -14] } : { rotate: 0 }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <polygon points="36,28 106,12 106,46" fill="url(#guard-beam)" />
            <line
              x1="36"
              y1="28"
              x2="106"
              y2="28"
              stroke="#EA580C"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.7"
            />
          </motion.g>
          {/* Architectural Security Officer Figure */}
          <circle cx="30" cy="20" r="5" fill="#FFFFFF" />
          <rect x="24" y="13.5" width="12" height="2.4" rx="1" fill="#EA580C" />
          <path d="M 22 30 C 22 26 26 25 30 25 C 34 25 38 26 38 30 L 36 47 L 24 47 Z" fill="#FFFFFF" />
          <rect x="25" y="47" width="4" height="15" rx="1" fill="#CBD5E1" />
          <rect x="31" y="47" width="4" height="15" rx="1" fill="#CBD5E1" />
          {/* Perimeter Checkpoint Post */}
          <line x1="94" y1="22" x2="94" y2="62" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
          <motion.circle
            cx="94"
            cy="22"
            r="3.2"
            fill="#EA580C"
            animate={animate ? { opacity: [0.4, 1, 0.4], scale: [0.9, 1.25, 0.9] } : undefined}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      );

    /* 02 / Access Control & Perimeter — Biometric turnstile blades + RFID pulse wave */
    case 'scan':
      return (
        <svg viewBox="0 0 120 72" className={dims} aria-hidden="true">
          <line x1="12" y1="60" x2="108" y2="60" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          {/* Left & Right Turnstile Stanchions */}
          <rect x="24" y="24" width="14" height="36" rx="2" fill="rgba(255,255,255,0.12)" stroke="#FFFFFF" strokeWidth="1.3" />
          <rect x="82" y="24" width="14" height="36" rx="2" fill="rgba(255,255,255,0.12)" stroke="#FFFFFF" strokeWidth="1.3" />
          {/* Animated Retracting Glass Gate Blades */}
          <motion.rect
            x="38"
            y="30"
            width="21"
            height="24"
            rx="1"
            fill="rgba(234,88,12,0.25)"
            stroke="#EA580C"
            strokeWidth="1.2"
            animate={animate ? { scaleX: [1, 0.18, 0.18, 1] } : { scaleX: 1 }}
            style={{ transformOrigin: '38px 42px' }}
            transition={{ duration: 3.2, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.rect
            x="61"
            y="30"
            width="21"
            height="24"
            rx="1"
            fill="rgba(234,88,12,0.25)"
            stroke="#EA580C"
            strokeWidth="1.2"
            animate={animate ? { scaleX: [1, 0.18, 0.18, 1] } : { scaleX: 1 }}
            style={{ transformOrigin: '82px 42px' }}
            transition={{ duration: 3.2, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Biometric Credential Wave Pulse (compositor-only scale + opacity, fixed SVG r) */}
          <motion.circle
            cx="60"
            cy="18"
            r="14"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            style={{ transformOrigin: '60px 18px' }}
            animate={animate ? { scale: [0.3, 1.15], opacity: [0.9, 0] } : { scale: 0.6, opacity: 0.5 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <circle cx="60" cy="18" r="3" fill="#EA580C" />
        </svg>
      );

    /* 03 / 24/7 CCTV & SOC Monitoring — Dual panning dome cameras + live telemetry bars */
    case 'cctv':
      return (
        <svg viewBox="0 0 120 72" className={dims} aria-hidden="true">
          <defs>
            <linearGradient id="cctv-fov" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="12" y1="14" x2="108" y2="14" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
          {/* Left Panning Camera */}
          <g transform="translate(36, 14)">
            <motion.g
              style={{ transformOrigin: '0px 4px' }}
              animate={animate ? { rotate: [-18, 22, -18] } : { rotate: 0 }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <polygon points="0,8 -18,52 24,52" fill="url(#cctv-fov)" />
              <path d="M -7 2 A 7 7 0 0 0 7 2 Z" fill="#FFFFFF" />
              <circle cx="0" cy="6" r="2" fill="#EA580C" />
            </motion.g>
          </g>
          {/* Right Panning Camera */}
          <g transform="translate(84, 14)">
            <motion.g
              style={{ transformOrigin: '0px 4px' }}
              animate={animate ? { rotate: [20, -20, 20] } : { rotate: 0 }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <polygon points="0,8 -24,52 18,52" fill="url(#cctv-fov)" />
              <path d="M -7 2 A 7 7 0 0 0 7 2 Z" fill="#FFFFFF" />
              <circle cx="0" cy="6" r="2" fill="#EA580C" />
            </motion.g>
          </g>
          {/* SOC Signal Baseline */}
          <motion.circle
            cx="60"
            cy="52"
            r="3"
            fill="#EA580C"
            animate={animate ? { opacity: [0.35, 1, 0.35] } : undefined}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      );

    /* 04 / Executive & VIP Protection — Escort diamond moving cleanly along secure corridor */
    case 'userCheck':
      return (
        <svg viewBox="0 0 120 72" className={dims} aria-hidden="true">
          {/* Advance Route Polyline */}
          <path
            d="M 14 52 L 42 52 L 58 24 L 106 24"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <motion.path
            d="M 14 52 L 42 52 L 58 24 L 106 24"
            fill="none"
            stroke="#EA580C"
            strokeWidth="2"
            initial={{ pathLength: 0.25 }}
            animate={animate ? { pathLength: [0.15, 1, 0.15] } : { pathLength: 0.7 }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Flanking Escort Formation Ring */}
          <motion.g
            animate={animate ? { x: [0, 32, 0], y: [0, -14, 0] } : undefined}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="44" cy="44" r="13" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="2 2" />
            <polygon points="44,36 51,44 44,52 37,44" fill="#FFFFFF" />
            <circle cx="44" cy="44" r="2.6" fill="#EA580C" />
          </motion.g>
          {/* Destination Venue Node */}
          <circle cx="106" cy="24" r="4" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
        </svg>
      );

    /* 05 / Site Risk & Vulnerability Audits — Architectural radar sweep scanning campus grid */
    case 'clipboard':
      return (
        <svg viewBox="0 0 120 72" className={dims} aria-hidden="true">
          <defs>
            <linearGradient id="radar-slice" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Concentric Audit Rings */}
          <circle cx="60" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <circle cx="60" cy="36" r="18" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <circle cx="60" cy="36" r="8" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
          <line x1="26" y1="36" x2="94" y2="36" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="60" y1="6" x2="60" y2="66" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Rotating Radar Arm */}
          <motion.g
            style={{ transformOrigin: '60px 36px' }}
            animate={animate ? { rotate: 360 } : { rotate: 45 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          >
            <path d="M 60 36 L 60 8 A 28 28 0 0 1 86 26 Z" fill="url(#radar-slice)" />
            <line x1="60" y1="36" x2="60" y2="8" stroke="#EA580C" strokeWidth="1.6" />
          </motion.g>
          {/* Detected & Audited Blind-Spot Nodes */}
          <circle cx="74" cy="24" r="2.6" fill="#FFFFFF" />
          <circle cx="44" cy="46" r="2.6" fill="#EA580C" />
          <circle cx="60" cy="36" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    /* 06 / Rapid Mobile Patrol & QRT — GPS loop with live response pulse beacon */
    case 'radio':
    default:
      return (
        <svg viewBox="0 0 120 72" className={dims} aria-hidden="true">
          {/* Campus Patrol Perimeter Circuit */}
          <rect
            x="22"
            y="14"
            width="76"
            height="44"
            rx="10"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
          />
          {/* Corner Waypoints */}
          {[
            [22, 24],
            [98, 24],
            [98, 48],
            [22, 48],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="2.5" fill="rgba(255,255,255,0.55)" />
          ))}
          {/* Live Moving QRT GPS Beacon (compositor-only scale + opacity pulse, fixed SVG r) */}
          <motion.g
            animate={
              animate
                ? {
                    x: [0, 76, 76, 0, 0],
                    y: [0, 0, 44, 44, 0],
                  }
                : undefined
            }
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <motion.circle
              cx="22"
              cy="14"
              r="12"
              fill="none"
              stroke="#EA580C"
              strokeWidth="1.2"
              style={{ transformOrigin: '22px 14px' }}
              animate={animate ? { scale: [0.35, 1.15], opacity: [0.9, 0] } : { scale: 0.65, opacity: 0.4 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <circle cx="22" cy="14" r="4" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.2" />
          </motion.g>
          {/* Central SOC Dispatch Core */}
          <rect x="52" y="28" width="16" height="16" rx="2" fill="rgba(255,255,255,0.08)" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx="60" cy="36" r="2.2" fill="#FFFFFF" />
        </svg>
      );
  }
}
