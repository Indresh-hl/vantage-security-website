import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'media', 'scroll-source');
const outDir = path.join(rootDir, 'public', 'sequence');
const manifestPath = path.join(outDir, 'manifest.json');

// Configurable via CLI flags: npm run build:frames -- --fps=24 --width=1600 --quality=78
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? 'true'];
  })
);
const FPS = Number(args.fps ?? 16);
const WIDTH = Number(args.width ?? 1440);
const QUALITY = Number(args.quality ?? 80);

if (!ffmpegPath) {
  console.error('ERROR: ffmpeg-static binary not found. Run `npm install -D ffmpeg-static`.');
  process.exit(1);
}

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

const videoFiles = fs
  .readdirSync(sourceDir)
  .filter((f) => /\.(mp4|mov|webm|mkv)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (videoFiles.length === 0) {
  console.log('\nNo source videos found in media/scroll-source/.');
  console.log('Drop either:');
  console.log('  • A single seamless video:   media/scroll-source/campus-sequence.mp4');
  console.log('  • Or 3 chained clips:        media/scroll-source/clip-1.mp4, clip-2.mp4, clip-3.mp4');
  console.log('Then re-run: npm run build:frames\n');
  process.exit(0);
}

// Clear previously extracted frames so frame indices are always exact 1..N
for (const existing of fs.readdirSync(outDir)) {
  if (/^frame_\d+\.webp$/i.test(existing)) {
    fs.unlinkSync(path.join(outDir, existing));
  }
}

console.log(`Found ${videoFiles.length} source video(s): ${videoFiles.join(', ')}`);
console.log(`Extracting WebP scroll sequence @ ${FPS} fps, width ${WIDTH}px, quality ${QUALITY}...`);

let inputVideo = path.join(sourceDir, videoFiles[0]);
let tempConcatVideo = null;

try {
  if (videoFiles.length > 1) {
    // Normalize all clips to identical resolution/fps and stitch seamlessly into one continuous stream
    tempConcatVideo = path.join(outDir, '_stitched_temp.mp4');
    const ffmpegArgs = [];
    for (const file of videoFiles) {
      ffmpegArgs.push('-i', path.join(sourceDir, file));
    }

    const filterParts = videoFiles.map(
      (_, i) =>
        `[${i}:v]fps=${FPS},scale=${WIDTH}:-2:flags=lanczos,setsar=1,format=yuv420p[v${i}]`
    );
    const concatInputs = videoFiles.map((_, i) => `[v${i}]`).join('');
    const filterComplex = `${filterParts.join(';')};${concatInputs}concat=n=${videoFiles.length}:v=1:a=0[outv]`;

    ffmpegArgs.push(
      '-filter_complex',
      filterComplex,
      '-map',
      '[outv]',
      '-an',
      '-c:v',
      'libx264',
      '-crf',
      '16',
      '-pix_fmt',
      'yuv420p',
      '-y',
      tempConcatVideo
    );

    console.log('Stitching clips into a single continuous stream...');
    execFileSync(ffmpegPath, ffmpegArgs, { stdio: 'inherit' });
    inputVideo = tempConcatVideo;
  }

  // Extract ultra-crisp compressed WebP frames for 60fps HTML5 Canvas GSAP scrubbing
  const outputPattern = path.join(outDir, 'frame_%04d.webp');
  execFileSync(
    ffmpegPath,
    [
      '-i',
      inputVideo,
      '-an',
      '-vf',
      `fps=${FPS},scale=${WIDTH}:-2:flags=lanczos`,
      '-c:v',
      'libwebp',
      '-quality',
      String(QUALITY),
      '-compression_level',
      '4',
      '-y',
      outputPattern,
    ],
    { stdio: 'inherit' }
  );

  const frames = fs
    .readdirSync(outDir)
    .filter((f) => /^frame_\d+\.webp$/i.test(f))
    .sort();

  const totalBytes = frames.reduce(
    (sum, f) => sum + fs.statSync(path.join(outDir, f)).size,
    0
  );

  const manifest = {
    frameCount: frames.length,
    fps: FPS,
    width: WIDTH,
    format: 'webp',
    pattern: '/sequence/frame_{index}.webp',
    padLength: 4,
    generatedAt: new Date().toISOString(),
    sourceFiles: videoFiles,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log(`\n✓ Built ${frames.length} WebP frames (${(totalBytes / (1024 * 1024)).toFixed(2)} MB total)`);
  console.log(`✓ Updated public/sequence/manifest.json — Apple Canvas scrubber is now ACTIVE!\n`);
} finally {
  if (tempConcatVideo && fs.existsSync(tempConcatVideo)) {
    fs.unlinkSync(tempConcatVideo);
  }
}
