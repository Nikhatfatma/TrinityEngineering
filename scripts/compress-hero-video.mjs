/**
 * Re-compress hero background video for web (run from TrinityEngineering/).
 * Requires: npm install --no-save ffmpeg-static
 *
 * Usage: node scripts/compress-hero-video.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "public", "Trinity Engineering Hero Video VER2.mov");
const output = path.join(root, "public", "hero-video.mp4");

let ffmpeg;
try {
  ffmpeg = (await import("ffmpeg-static")).default;
} catch {
  console.error("Run: npm install --no-save ffmpeg-static");
  process.exit(1);
}

if (!existsSync(input)) {
  console.error("Missing input:", input);
  process.exit(1);
}

console.log("Compressing hero video (1080p, 24fps, H.264, faststart)…");
execFileSync(
  ffmpeg,
  [
    "-y",
    "-i",
    input,
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "27",
    "-preset",
    "slow",
    "-movflags",
    "+faststart",
    "-vf",
    "fps=24,scale=-2:1080",
    "-pix_fmt",
    "yuv420p",
    output,
  ],
  { stdio: "inherit" },
);
console.log("Wrote", output);
