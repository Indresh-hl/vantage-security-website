import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface TacticalCampusCanvasProps {
  /** Continuous scroll progress 0..1 across all 6 services */
  progressRef: React.MutableRefObject<number>;
  /** Active service index 0..5 */
  activeIndex: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface BuildingSpec {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  floors: number;
  accent?: boolean;
  label?: string;
}

const BUILDINGS: BuildingSpec[] = [
  // Main Central Headquarters Tower
  { x: -1.15, y: -1.35, w: 2.3, d: 1.75, h: 2.55, floors: 6, accent: true, label: 'SOC HQ' },
  // West Executive Wing
  { x: -3.25, y: -0.75, w: 1.55, d: 2.05, h: 1.35, floors: 3 },
  // East Operations / R&D Wing
  { x: 1.65, y: -0.95, w: 1.65, d: 2.15, h: 1.65, floors: 4 },
  // Front South Gatehouse Pavilion
  { x: -0.68, y: 2.65, w: 1.36, d: 0.62, h: 0.56, floors: 1, label: 'GATE 01' },
];

// Camera choreography targets per active security service (0..5)
const CAMERA_PRESETS = [
  { yaw: 0.72, zoom: 1.0, panX: 0, panY: 16 }, // 01 Manned Guarding: full perimeter patrol
  { yaw: 0.54, zoom: 1.18, panX: -12, panY: -44 }, // 02 Access Control: zoom toward South Gatehouse & perimeter fence
  { yaw: 0.92, zoom: 1.08, panX: 10, panY: 22 }, // 03 24/7 CCTV & SOC: elevated view of tower cams -> SOC spire
  { yaw: 0.44, zoom: 1.12, panX: 38, panY: -18 }, // 04 Executive & VIP: tracking curved executive avenue & portico
  { yaw: 0.78, zoom: 0.96, panX: 0, panY: 10 }, // 05 Site Risk Audits: full LiDAR sonar blueprint scan
  { yaw: 0.64, zoom: 0.88, panX: 0, panY: 4 }, // 06 Rapid Mobile Patrol & QRT: wide orbital corridor loop
];

const AUDIT_NODES: Vec3[] = [
  { x: -3.9, y: -2.9, z: 0.1 },
  { x: 3.9, y: -2.9, z: 0.1 },
  { x: 3.9, y: 2.9, z: 0.1 },
  { x: -3.9, y: 2.9, z: 0.1 },
  { x: -2.5, y: 0.5, z: 1.35 },
  { x: 2.4, y: 0.1, z: 1.65 },
];

const CAMERA_TOWERS: Vec3[] = [
  { x: -3.85, y: -2.85, z: 0.95 },
  { x: 3.85, y: -2.85, z: 0.95 },
  { x: 3.85, y: 2.85, z: 0.95 },
  { x: -3.85, y: 2.85, z: 0.95 },
  { x: -2.4, y: -0.2, z: 1.5 },
  { x: 2.5, y: -0.1, z: 1.8 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Studio-craft 60fps Retina HTML5 Canvas 3D Isometric Tactical Campus & Security Command Visualizer.
 * Dynamically orbits, zooms, and live-animates each of Vantage Security's 6 disciplines on a
 * multi-wing glass corporate headquarters complex synchronized seamlessly to Lenis smooth scroll.
 */
export function TacticalCampusCanvas({
  progressRef,
  activeIndex,
}: TacticalCampusCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1200;
    let height = 420;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    let isVisible = true;

    // Smoothly interpolated live camera & layer weights (so Lenis flicks & transitions feel liquid)
    const cam = {
      yaw: CAMERA_PRESETS[0].yaw,
      zoom: CAMERA_PRESETS[0].zoom,
      panX: CAMERA_PRESETS[0].panX,
      panY: CAMERA_PRESETS[0].panY,
    };
    const layerWeights = [1, 0, 0, 0, 0, 0];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(320, Math.floor(rect.width));
      height = Math.max(260, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    const renderFrame = (nowMs: number) => {
      const t = prefersReducedMotion ? 0 : nowMs * 0.001;
      const idx = activeIndexRef.current;
      const targetPreset = CAMERA_PRESETS[idx] ?? CAMERA_PRESETS[0];

      // Subtle continuous breathing yaw drift layered over smooth camera transition
      const gentleDrift = prefersReducedMotion ? 0 : Math.sin(t * 0.35) * 0.045;
      const scrollNudge = (progressRef.current - 0.5) * 0.14;

      cam.yaw = lerp(cam.yaw, targetPreset.yaw + gentleDrift + scrollNudge, 0.055);
      cam.zoom = lerp(cam.zoom, targetPreset.zoom, 0.055);
      cam.panX = lerp(cam.panX, targetPreset.panX, 0.055);
      cam.panY = lerp(cam.panY, targetPreset.panY, 0.055);

      for (let i = 0; i < 6; i += 1) {
        layerWeights[i] = lerp(layerWeights[i], i === idx ? 1 : 0, 0.08);
      }

      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width / 15.5, height / 7.8) * cam.zoom;
      const cx = width * 0.5 + cam.panX;
      const cy = height * 0.56 + cam.panY;
      const cosY = Math.cos(cam.yaw);
      const sinY = Math.sin(cam.yaw);
      const tilt = 0.46; // Isometric architectural elevation pitch

      const project = (x: number, y: number, z = 0) => {
        const rx = x * cosY - y * sinY;
        const ry = x * sinY + y * cosY;
        return {
          sx: cx + rx * scale,
          sy: cy + ry * scale * tilt - z * scale * 0.92,
          depth: ry,
        };
      };

      // 1. Subtle Ambient Radial Floor Spotlight beneath the 3D Campus
      const bgGlow = ctx.createRadialGradient(
        cx,
        cy + 10,
        scale * 0.6,
        cx,
        cy + 10,
        scale * 6.8
      );
      bgGlow.addColorStop(0, 'rgba(234, 88, 12, 0.13)');
      bgGlow.addColorStop(0.42, 'rgba(56, 70, 92, 0.11)');
      bgGlow.addColorStop(1, 'rgba(6, 8, 12, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Crisp Isometric Architectural Ground Grid (-5.5 .. +5.5)
      ctx.lineWidth = 1;
      for (let g = -5; g <= 5; g += 1) {
        const isPerimeterLine = Math.abs(g) === 4;
        ctx.strokeStyle = isPerimeterLine
          ? 'rgba(255, 255, 255, 0.09)'
          : 'rgba(255, 255, 255, 0.045)';

        const a1 = project(g, -4, 0);
        const a2 = project(g, 4, 0);
        ctx.beginPath();
        ctx.moveTo(a1.sx, a1.sy);
        ctx.lineTo(a2.sx, a2.sy);
        ctx.stroke();

        if (Math.abs(g) <= 4) {
          const b1 = project(-5, g, 0);
          const b2 = project(5, g, 0);
          ctx.beginPath();
          ctx.moveTo(b1.sx, b1.sy);
          ctx.lineTo(b2.sx, b2.sy);
          ctx.stroke();
        }
      }

      // 3. Outer QRT Patrol Ring Road (Rounded Isometric Loop)
      const drawLoop = (rx: number, ry: number, stroke: string, lineW: number, dash: number[] = []) => {
        ctx.save();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineW;
        ctx.setLineDash(dash);
        ctx.beginPath();
        const pts = [
          project(-rx, -ry, 0),
          project(rx, -ry, 0),
          project(rx, ry, 0),
          project(-rx, ry, 0),
        ];
        ctx.moveTo(pts[0].sx, pts[0].sy);
        for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].sx, pts[i].sy);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      };

      // Outer highway perimeter band
      drawLoop(4.85, 3.75, 'rgba(255, 255, 255, 0.075)', 1.2, [8, 8]);
      // Inner compound perimeter wall footprint
      drawLoop(3.95, 2.95, 'rgba(255, 255, 255, 0.22)', 1.5);

      // Subtle glowing inner courtyard plaza fill
      const plaza = [
        project(-3.95, -2.95, 0),
        project(3.95, -2.95, 0),
        project(3.95, 2.95, 0),
        project(-3.95, 2.95, 0),
      ];
      ctx.fillStyle = 'rgba(20, 26, 36, 0.45)';
      ctx.beginPath();
      ctx.moveTo(plaza[0].sx, plaza[0].sy);
      plaza.forEach((p) => ctx.lineTo(p.sx, p.sy));
      ctx.closePath();
      ctx.fill();

      // Executive Arrival Roadway from South Gatehouse up into Courtyard
      const roadStart = project(0, 4.9, 0);
      const roadGate = project(0, 2.95, 0);
      const roadPlaza = project(0, 0.85, 0);
      const roadWest = project(-1.85, 0.85, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = scale * 0.36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(roadStart.sx, roadStart.sy);
      ctx.lineTo(roadGate.sx, roadGate.sy);
      ctx.lineTo(roadPlaza.sx, roadPlaza.sy);
      ctx.lineTo(roadWest.sx, roadWest.sy);
      ctx.stroke();

      // Center hairline avenue lane marking
      ctx.save();
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.35)';
      ctx.lineWidth = 1.1;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.moveTo(roadStart.sx, roadStart.sy);
      ctx.lineTo(roadPlaza.sx, roadPlaza.sy);
      ctx.lineTo(roadWest.sx, roadWest.sy);
      ctx.stroke();
      ctx.restore();

      // 4. LAYER 02 — ACCESS CONTROL & PERIMETER LASER FENCE MESH (behind/around buildings)
      const wAccess = layerWeights[1];
      if (wAccess > 0.02) {
        const fenceH = 0.42;
        const corners = [
          [-3.95, -2.95],
          [3.95, -2.95],
          [3.95, 2.95],
          [-3.95, 2.95],
        ];
        // Elevated glowing laser perimeter strands
        for (let strand = 1; strand <= 2; strand += 1) {
          const z = (fenceH * strand) / 2;
          ctx.strokeStyle = `rgba(234, 88, 12, ${(0.42 * wAccess).toFixed(3)})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          corners.forEach(([x, y], i) => {
            const p = project(x, y, z);
            if (i === 0) ctx.moveTo(p.sx, p.sy);
            else ctx.lineTo(p.sx, p.sy);
          });
          ctx.closePath();
          ctx.stroke();
        }
        // Translucent vertical energy curtain along perimeter
        for (let i = 0; i < 4; i += 1) {
          const [x1, y1] = corners[i];
          const [x2, y2] = corners[(i + 1) % 4];
          const b1 = project(x1, y1, 0);
          const b2 = project(x2, y2, 0);
          const t2 = project(x2, y2, fenceH);
          const t1 = project(x1, y1, fenceH);
          ctx.fillStyle = `rgba(234, 88, 12, ${(0.08 * wAccess).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(b1.sx, b1.sy);
          ctx.lineTo(b2.sx, b2.sy);
          ctx.lineTo(t2.sx, t2.sy);
          ctx.lineTo(t1.sx, t1.sy);
          ctx.closePath();
          ctx.fill();
        }

        // Biometric RFID credential wave rings pulsing at Main Gatehouse
        const gateCenter = project(0, 2.95, 0.2);
        for (let ring = 0; ring < 3; ring += 1) {
          const phase = (t * 0.75 + ring * 0.33) % 1;
          const r = scale * (0.28 + phase * 1.15);
          ctx.strokeStyle = `rgba(251, 146, 60, ${((1 - phase) * 0.75 * wAccess).toFixed(3)})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(gateCenter.sx, gateCenter.sy, r, r * tilt, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 5. LAYER 05 — SITE RISK & PSARA AUDITS (360° LiDAR Blueprint Sonar Ring)
      const wAudit = layerWeights[4];
      if (wAudit > 0.02) {
        const origin = project(0, 0, 0.05);
        const sweepAngle = t * 1.15;
        const maxR = scale * 4.4;

        // Expanding spherical LiDAR pulse rings
        for (let k = 0; k < 2; k += 1) {
          const pulse = (t * 0.45 + k * 0.5) % 1;
          const r = maxR * pulse;
          ctx.strokeStyle = `rgba(234, 88, 12, ${((1 - pulse) * 0.65 * wAudit).toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(origin.sx, origin.sy, r, r * tilt, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Sweeping volumetric radar sector pie on ground plane
        ctx.save();
        ctx.translate(origin.sx, origin.sy);
        ctx.scale(1, tilt);
        const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, maxR);
        grad.addColorStop(0, `rgba(234, 88, 12, ${(0.32 * wAudit).toFixed(3)})`);
        grad.addColorStop(1, `rgba(234, 88, 12, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxR, sweepAngle - 0.58, sweepAngle);
        ctx.closePath();
        ctx.fill();

        // Crisp leading laser arm
        ctx.strokeStyle = `rgba(251, 146, 60, ${(0.85 * wAudit).toFixed(3)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sweepAngle) * maxR, Math.sin(sweepAngle) * maxR);
        ctx.stroke();
        ctx.restore();
      }

      // 6. Depth-Sorted 3D Isometric Extruded Glass Headquarters Buildings
      const sortedBuildings = [...BUILDINGS].sort((a, b) => {
        const da = project(a.x + a.w / 2, a.y + a.d / 2, 0).depth;
        const db = project(b.x + b.w / 2, b.y + b.d / 2, 0).depth;
        return da - db;
      });

      const drawBox = (b: BuildingSpec) => {
        const x0 = b.x;
        const x1 = b.x + b.w;
        const y0 = b.y;
        const y1 = b.y + b.d;

        const b00 = project(x0, y0, 0);
        const b10 = project(x1, y0, 0);
        const b11 = project(x1, y1, 0);
        const b01 = project(x0, y1, 0);

        const t00 = project(x0, y0, b.h);
        const t10 = project(x1, y0, b.h);
        const t11 = project(x1, y1, b.h);
        const t01 = project(x0, y1, b.h);

        // Ground contact shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
        ctx.beginPath();
        ctx.moveTo(b00.sx + 4, b00.sy + 4);
        ctx.lineTo(b10.sx + 4, b10.sy + 4);
        ctx.lineTo(b11.sx + 4, b11.sy + 4);
        ctx.lineTo(b01.sx + 4, b01.sy + 4);
        ctx.closePath();
        ctx.fill();

        const faces = [
          {
            pts: [b01, b11, t11, t01],
            depth: (b01.depth + b11.depth) * 0.5,
            fillTop: b.accent ? '#242D3C' : '#1B222E',
            fillBot: '#0B0E15',
            linePts: [
              [x0, y1],
              [x1, y1],
            ],
          },
          {
            pts: [b10, b11, t11, t10],
            depth: (b10.depth + b11.depth) * 0.5,
            fillTop: b.accent ? '#1B2331' : '#141923',
            fillBot: '#080B10',
            linePts: [
              [x1, y0],
              [x1, y1],
            ],
          },
          {
            pts: [b00, b01, t01, t00],
            depth: (b00.depth + b01.depth) * 0.5,
            fillTop: b.accent ? '#1E2736' : '#151B25',
            fillBot: '#090C11',
            linePts: [
              [x0, y0],
              [x0, y1],
            ],
          },
          {
            pts: [b00, b10, t10, t00],
            depth: (b00.depth + b10.depth) * 0.5,
            fillTop: '#131822',
            fillBot: '#080A0F',
            linePts: [
              [x0, y0],
              [x1, y0],
            ],
          },
        ].sort((f1, f2) => f1.depth - f2.depth);

        // Draw only front-facing walls (highest 2 depths) for crisp architectural occlusion
        faces.slice(2).forEach((face) => {
          const grad = ctx.createLinearGradient(
            face.pts[2].sx,
            face.pts[2].sy,
            face.pts[0].sx,
            face.pts[0].sy
          );
          grad.addColorStop(0, face.fillTop);
          grad.addColorStop(1, face.fillBot);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(face.pts[0].sx, face.pts[0].sy);
          ctx.lineTo(face.pts[1].sx, face.pts[1].sy);
          ctx.lineTo(face.pts[2].sx, face.pts[2].sy);
          ctx.lineTo(face.pts[3].sx, face.pts[3].sy);
          ctx.closePath();
          ctx.fill();

          // Architectural illuminated glass floorplate stripes
          ctx.strokeStyle = b.accent
            ? 'rgba(255, 255, 255, 0.14)'
            : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 0.85;
          for (let fl = 1; fl < b.floors; fl += 1) {
            const fz = (b.h * fl) / b.floors;
            const fa = project(face.linePts[0][0], face.linePts[0][1], fz);
            const fb = project(face.linePts[1][0], face.linePts[1][1], fz);
            ctx.beginPath();
            ctx.moveTo(fa.sx, fa.sy);
            ctx.lineTo(fb.sx, fb.sy);
            ctx.stroke();
          }

          ctx.strokeStyle = b.accent
            ? 'rgba(255, 255, 255, 0.24)'
            : 'rgba(255, 255, 255, 0.13)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // Roof Plane with subtle specular architectural sheen
        const roofGrad = ctx.createLinearGradient(t00.sx, t00.sy, t11.sx, t11.sy);
        roofGrad.addColorStop(0, b.accent ? '#313C4E' : '#232B39');
        roofGrad.addColorStop(1, b.accent ? '#1D2430' : '#151A24');
        ctx.fillStyle = roofGrad;
        ctx.beginPath();
        ctx.moveTo(t00.sx, t00.sy);
        ctx.lineTo(t10.sx, t10.sy);
        ctx.lineTo(t11.sx, t11.sy);
        ctx.lineTo(t01.sx, t01.sy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = b.accent
          ? 'rgba(251, 146, 60, 0.45)'
          : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = b.accent ? 1.25 : 0.9;
        ctx.stroke();

        // Central SOC Spire Antenna on Main Headquarters Tower
        if (b.accent) {
          const spireBase = project(0, -0.45, b.h);
          const spireTip = project(0, -0.45, b.h + 0.95);
          ctx.strokeStyle = 'rgba(255,255,255,0.65)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(spireBase.sx, spireBase.sy);
          ctx.lineTo(spireTip.sx, spireTip.sy);
          ctx.stroke();

          // Glowing SOC beacon halo
          const pulse = 0.65 + 0.35 * Math.sin(t * 2.8);
          const spireGlow = ctx.createRadialGradient(
            spireTip.sx,
            spireTip.sy,
            1,
            spireTip.sx,
            spireTip.sy,
            18
          );
          spireGlow.addColorStop(0, `rgba(251, 146, 60, ${pulse.toFixed(2)})`);
          spireGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = spireGlow;
          ctx.beginPath();
          ctx.arc(spireTip.sx, spireTip.sy, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(spireTip.sx, spireTip.sy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      sortedBuildings.forEach(drawBox);

      // 7. LAYER 01 — MANNED GUARDING (4 Officer Patrols with Volumetric Sweeping Light Cones)
      const wGuard = layerWeights[0];
      if (wGuard > 0.02) {
        const patrolWaypoints: [Vec3, Vec3][] = [
          [
            { x: -3.55, y: 2.55, z: 0.06 },
            { x: -1.1, y: 2.55, z: 0.06 },
          ],
          [
            { x: 1.1, y: 2.55, z: 0.06 },
            { x: 3.55, y: 2.55, z: 0.06 },
          ],
          [
            { x: -3.55, y: -2.45, z: 0.06 },
            { x: -3.55, y: 1.85, z: 0.06 },
          ],
          [
            { x: 3.55, y: -2.45, z: 0.06 },
            { x: 3.55, y: 1.85, z: 0.06 },
          ],
        ];

        patrolWaypoints.forEach(([pA, pB], gIdx) => {
          const phase = (Math.sin(t * 0.65 + gIdx * 1.45) + 1) * 0.5;
          const gx = lerp(pA.x, pB.x, phase);
          const gy = lerp(pA.y, pB.y, phase);
          const pos = project(gx, gy, 0.14);

          // Volumetric flashlight / observation cone rotating calmly
          const coneAngle = Math.sin(t * 1.2 + gIdx * 2) * 0.65 + (gIdx < 2 ? -Math.PI * 0.5 : 0);
          ctx.save();
          ctx.translate(pos.sx, pos.sy);
          ctx.scale(1, tilt);
          const cGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, scale * 1.25);
          cGrad.addColorStop(0, `rgba(251, 146, 60, ${(0.52 * wGuard).toFixed(3)})`);
          cGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, scale * 1.25, coneAngle - 0.36, coneAngle + 0.36);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Biometric shift-verified ripple ring
          const ringP = (t * 0.6 + gIdx * 0.25) % 1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${((1 - ringP) * 0.55 * wGuard).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(
            pos.sx,
            pos.sy,
            scale * (0.14 + ringP * 0.38),
            scale * (0.14 + ringP * 0.38) * tilt,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();

          // Crisp Officer Marker Node
          ctx.fillStyle = `rgba(234, 88, 12, ${wGuard.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(pos.sx, pos.sy, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255, 255, 255, ${wGuard.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(pos.sx, pos.sy, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 8. LAYER 03 — 24/7 CCTV & SOC MONITORING (Tower Cones + Parabolic Data Arcs to SOC Spire)
      const wSoc = layerWeights[2];
      if (wSoc > 0.02) {
        const spireTip = project(0, -0.45, 3.5);

        CAMERA_TOWERS.forEach((tower, cIdx) => {
          const base = project(tower.x, tower.y, 0);
          const top = project(tower.x, tower.y, tower.z);

          // Slim optical mast
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.35 * wSoc).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(base.sx, base.sy);
          ctx.lineTo(top.sx, top.sy);
          ctx.stroke();

          // Panning ground surveillance footprint cone
          const pan = Math.sin(t * 0.85 + cIdx * 1.1) * 0.65;
          const targetX = tower.x * 0.35 + Math.cos(pan) * 0.85;
          const targetY = tower.y * 0.35 + Math.sin(pan) * 0.85;
          const fLeft = project(targetX - 0.55, targetY - 0.35, 0);
          const fRight = project(targetX + 0.55, targetY + 0.35, 0);

          const fovGrad = ctx.createLinearGradient(top.sx, top.sy, fLeft.sx, fLeft.sy);
          fovGrad.addColorStop(0, `rgba(251, 146, 60, ${(0.34 * wSoc).toFixed(3)})`);
          fovGrad.addColorStop(1, 'rgba(234, 88, 12, 0.02)');
          ctx.fillStyle = fovGrad;
          ctx.beginPath();
          ctx.moveTo(top.sx, top.sy);
          ctx.lineTo(fLeft.sx, fLeft.sy);
          ctx.lineTo(fRight.sx, fRight.sy);
          ctx.closePath();
          ctx.fill();

          // Curved Parabolic Encrypted Data Link Arc from Camera -> Central SOC Spire (United Carriers globe vibe!)
          const midX = (top.sx + spireTip.sx) * 0.5;
          const midY = Math.min(top.sy, spireTip.sy) - scale * 0.72;
          ctx.strokeStyle = `rgba(234, 88, 12, ${(0.36 * wSoc).toFixed(3)})`;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(top.sx, top.sy);
          ctx.quadraticCurveTo(midX, midY, spireTip.sx, spireTip.sy);
          ctx.stroke();

          // Traveling Glowing Encrypted Data Packet along the parabolic arc
          const u = (t * 0.55 + cIdx * 0.17) % 1;
          const inv = 1 - u;
          const px = inv * inv * top.sx + 2 * inv * u * midX + u * u * spireTip.sx;
          const py = inv * inv * top.sy + 2 * inv * u * midY + u * u * spireTip.sy;

          ctx.fillStyle = `rgba(255, 255, 255, ${(0.95 * wSoc).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, 2.7, 0, Math.PI * 2);
          ctx.fill();

          // Camera head node
          ctx.fillStyle = `rgba(234, 88, 12, ${wSoc.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(top.sx, top.sy, 3.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 9. LAYER 04 — EXECUTIVE & VIP PROTECTION (Glowing Escort Corridor + Diamond Convoy Formation)
      const wVip = layerWeights[3];
      if (wVip > 0.02) {
        const routePts: Vec3[] = [
          { x: 0, y: 4.8, z: 0.08 },
          { x: 0, y: 2.95, z: 0.08 },
          { x: 0, y: 0.85, z: 0.08 },
          { x: -1.85, y: 0.85, z: 0.08 },
          { x: -1.85, y: 0.1, z: 0.08 },
        ];
        const projectedRoute = routePts.map((pt) => project(pt.x, pt.y, pt.z));

        // Glowing illuminated VIP escort avenue ribbon
        ctx.save();
        ctx.strokeStyle = `rgba(234, 88, 12, ${(0.72 * wVip).toFixed(3)})`;
        ctx.lineWidth = 3.2;
        ctx.shadowColor = 'rgba(234, 88, 12, 0.7)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        projectedRoute.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        });
        ctx.stroke();
        ctx.restore();

        // Interpolate VIP diamond convoy along polyline
        const sampleRoute = (uRaw: number) => {
          const u = Math.max(0, Math.min(1, uRaw));
          const segCount = routePts.length - 1;
          const scaled = u * segCount;
          const sIdx = Math.min(segCount - 1, Math.floor(scaled));
          const frac = scaled - sIdx;
          return project(
            lerp(routePts[sIdx].x, routePts[sIdx + 1].x, frac),
            lerp(routePts[sIdx].y, routePts[sIdx + 1].y, frac),
            0.14
          );
        };

        const convoyProgress = (t * 0.24) % 1;
        const vipPos = sampleRoute(convoyProgress);
        const leadPos = sampleRoute(convoyProgress + 0.085);
        const rearPos = sampleRoute(convoyProgress - 0.085);

        // Protective VIP shield perimeter ellipse
        ctx.strokeStyle = `rgba(251, 146, 60, ${(0.65 * wVip).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(vipPos.sx, vipPos.sy, scale * 0.65, scale * 0.65 * tilt, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Lead & Rear Escort Units
        [leadPos, rearPos].forEach((ep) => {
          ctx.fillStyle = `rgba(234, 88, 12, ${wVip.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(ep.sx, ep.sy, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // Principal VIP Diamond Marker
        ctx.fillStyle = `rgba(255, 255, 255, ${wVip.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(vipPos.sx, vipPos.sy - 7);
        ctx.lineTo(vipPos.sx + 7, vipPos.sy);
        ctx.lineTo(vipPos.sx, vipPos.sy + 7);
        ctx.lineTo(vipPos.sx - 7, vipPos.sy);
        ctx.closePath();
        ctx.fill();
      }

      // 10. LAYER 05 (FOREGROUND PINGS) — Audit Blind-Spot Verification Reticles
      if (wAudit > 0.02) {
        AUDIT_NODES.forEach((node, nIdx) => {
          const p = project(node.x, node.y, node.z);
          const verified = Math.sin(t * 1.4 + nIdx * 1.1) > -0.1;
          const col = verified
            ? `rgba(52, 211, 153, ${wAudit.toFixed(3)})`
            : `rgba(251, 146, 60, ${wAudit.toFixed(3)})`;

          ctx.strokeStyle = col;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 9, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 11. LAYER 06 — RAPID MOBILE PATROL & QRT (Orbital Highway Patrol Trails + <90s Dispatch Ping)
      const wQrt = layerWeights[5];
      if (wQrt > 0.02) {
        const loopCorners: [number, number][] = [
          [-4.85, -3.75],
          [4.85, -3.75],
          [4.85, 3.75],
          [-4.85, 3.75],
        ];
        const sampleOrbital = (uWrap: number) => {
          const u = ((uWrap % 1) + 1) % 1;
          const s = u * 4;
          const i = Math.floor(s) % 4;
          const f = s - Math.floor(s);
          const a = loopCorners[i];
          const b = loopCorners[(i + 1) % 4];
          return project(lerp(a[0], b[0], f), lerp(a[1], b[1], f), 0.1);
        };

        // Highlight outer patrol corridor
        drawLoop(4.85, 3.75, `rgba(234, 88, 12, ${(0.34 * wQrt).toFixed(3)})`, 2);

        // 3 QRT Vehicles orbiting with luminous motion comet trails
        for (let v = 0; v < 3; v += 1) {
          const headU = (t * 0.14 + v / 3) % 1;
          ctx.beginPath();
          for (let step = 0; step <= 14; step += 1) {
            const pt = sampleOrbital(headU - step * 0.008);
            if (step === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          ctx.strokeStyle = `rgba(251, 146, 60, ${(0.82 * wQrt).toFixed(3)})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          const head = sampleOrbital(headU);
          ctx.fillStyle = `rgba(255, 255, 255, ${wQrt.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(head.sx, head.sy, 4.2, 0, Math.PI * 2);
          ctx.fill();

          // Live GPS Response Radius Ring around lead QRT
          if (v === 0) {
            const rPhase = (t * 0.7) % 1;
            ctx.strokeStyle = `rgba(234, 88, 12, ${((1 - rPhase) * 0.8 * wQrt).toFixed(3)})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(
              head.sx,
              head.sy,
              scale * (0.25 + rPhase * 1.15),
              scale * (0.25 + rPhase * 1.15) * tilt,
              0,
              0,
              Math.PI * 2
            );
            ctx.stroke();
          }
        }
      }

    };

    const loop = (ts: number) => {
      if (isVisible) {
        renderFrame(ts);
      }
      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [prefersReducedMotion, progressRef]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
