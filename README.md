# Vantage Security — Mysuru Website

Corporate security web experience for **Vantage Security** (Mysuru, Karnataka), built with React 19, TypeScript, Tailwind CSS v4, GSAP ScrollTrigger, Lenis smooth scrolling, Motion, and an Apple-style 60fps HTML5 Canvas WebP scroll-scrubbed 3D campus sequence.

## Key Features
- **3D Campus Scroll Cinema & Horizontal Services Rail:** 241-frame Retina WebP sequence (`public/sequence/`) scrubbed smoothly via GSAP ScrollTrigger, transitioning through a 3D obsidian perspective turn and volumetric white cloud bloom.
- **Standards & Licenses Verification Spine:** Pure-white 3-column architectural showcase featuring a sticky editorial headline, a gliding emerald **Green Verified Shield** with vertical stacked `V-E-R-I-F-I-E-D` chromatic reveal, and PSARA / ISO / SOC credential milestones.
- **Modern Web & Accessibility First:** Compositor-only scroll transforms, native CSS scroll-driven progressive enhancement, and full `prefers-reduced-motion` support.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Updating the Scroll Video Sequence

Drop a master MP4 into `media/scroll-source/campus-sequence.mp4` and run:

```bash
npm run build:frames
```

This extracts optimized WebP frames into `public/sequence/` and updates `public/sequence/manifest.json`.
