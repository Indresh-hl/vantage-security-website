import { useEffect, useState, type MutableRefObject } from 'react';
import { AppleSequenceCanvas, type SequenceManifest } from './AppleSequenceCanvas';

interface StudioCinemaCampusProps {
  /** Scrubbed scroll progress [0..1] written by GSAP ScrollTrigger */
  progressRef: MutableRefObject<number>;
  /** Static preview progress for mobile / reduced-motion */
  staticProgress?: number;
  /** Canvas framing mode */
  fit?: 'cover' | 'contain';
}

/**
 * Photorealistic Architectural Campus Cinema:
 * - Automatically activates the 60fps Apple-style WebP HTML5 Canvas scrubber (`AppleSequenceCanvas`)
 *   using `public/sequence/manifest.json` built from `Vantage_Security_Final_Master.mp4`.
 * - Falls back gracefully to a static high-resolution campus aerial if frames are absent.
 */
export function StudioCinemaCampus({
  progressRef,
  staticProgress,
  fit = 'cover',
}: StudioCinemaCampusProps) {
  const [sequenceManifest, setSequenceManifest] = useState<SequenceManifest | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/sequence/manifest.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SequenceManifest | null) => {
        if (active && data && data.frameCount > 0) {
          setSequenceManifest(data);
        }
      })
      .catch(() => {
        // Remain on clean static fallback
      });
    return () => {
      active = false;
    };
  }, []);

  const hasWebpSequence = sequenceManifest !== null && sequenceManifest.frameCount > 0;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#06080C] select-none"
      aria-label="Photorealistic Vantage Security 3D architectural campus walkthrough synced to scroll"
    >
      {hasWebpSequence && sequenceManifest ? (
        <AppleSequenceCanvas
          manifest={sequenceManifest}
          progressRef={progressRef}
          staticProgress={staticProgress}
          fit={fit}
        />
      ) : (
        <img
          src="/images/campus-beat1-aerial.jpg"
          alt="Top aerial view of the Vantage Security protected corporate campus"
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}
    </div>
  );
}
