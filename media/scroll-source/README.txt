VANTAGE SECURITY — APPLE-STYLE SCROLL VIDEO DROP FOLDER
=======================================================

Drop your continuous scroll video(s) into this folder:
  Option A (Single MP4):      campus-sequence.mp4
  Option B (3 Chained Clips): clip-1.mp4, clip-2.mp4, clip-3.mp4

Then run from the project root:
  npm run build:frames

FFmpeg will automatically stitch multiple clips (if more than 1), convert to
optimized WebP frames in public/sequence/, update public/sequence/manifest.json,
and immediately activate the 60fps Apple-style HTML5 Canvas scroll scrubber!
