/**
 * Removes baked-in black borders from building-type icon PNGs and normalizes padding.
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const files = [
  "building-type-single-family.png",
  "building-type-multi-unit.png",
  "building-type-commercial.png",
];

for (const file of files) {
  const input = path.join(publicDir, file);
  const trimmed = await sharp(input)
    .trim({ threshold: 12, background: { r: 255, g: 255, b: 255, alpha: 255 } })
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  const pad = Math.round(Math.max(meta.width, meta.height) * 0.03);

  await sharp(trimmed)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    })
    .png()
    .toFile(input);

  console.log(`Trimmed ${file}`);
}
