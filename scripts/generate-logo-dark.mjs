/**
 * Builds logo-navbar-dark.png from logo-white-bg-removed.png:
 * white outline text -> navy, blue wedges preserved.
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const src = path.join(publicDir, "logo-white-bg-removed.png");
const out = path.join(publicDir, "logo-navbar-dark.png");

const NAVY = { r: 0, g: 29, b: 61 }; // #001D3D

function isWhiteish(r, g, b, a) {
  if (a < 8) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // White outline + light anti-alias fringe around letters
  return max > 150 && max - min < 55;
}

function isBlueish(r, g, b, a) {
  if (a < 8) return false;
  return b > r + 15 && b > g && b > 80;
}

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];

  if (isWhiteish(r, g, b, a)) {
    data[i] = NAVY.r;
    data[i + 1] = NAVY.g;
    data[i + 2] = NAVY.b;
    data[i + 3] = 255;
  } else if (!isBlueish(r, g, b, a) && a > 8 && r + g + b < 120) {
    // faint dark pixels — keep
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(out);

console.log("Wrote", out, `${info.width}x${info.height}`);
