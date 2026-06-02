/**
 * Removes black borders and excess white padding from inspection-type icon PNGs.
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const files = [
  "inspection-type-storm-damage.png",
  "inspection-type-structural-loss.png",
  "inspection-type-large-complex-loss.png",
  "inspection-type-interior-water-loss.png",
  "inspection-type-lightning-damage.png",
  "inspection-type-vandalism.png",
  "inspection-type-chimney-fire-collapse.png",
  "inspection-type-component-failure.png",
  "inspection-type-hvac-electrical.png",
  "inspection-type-small-fire.png",
];

for (const file of files) {
  const input = path.join(publicDir, file);
  const output = path.join(publicDir, `${file}.tmp.png`);
  let buffer = await sharp(input).toBuffer();

  try {
    buffer = await sharp(buffer)
      .trim({ threshold: 12, background: { r: 0, g: 0, b: 0, alpha: 255 } })
      .toBuffer();
  } catch {
    /* no black border to trim */
  }

  buffer = await sharp(buffer)
    .trim({ threshold: 12, background: { r: 255, g: 255, b: 255, alpha: 255 } })
    .toBuffer();

  const meta = await sharp(buffer).metadata();
  const pad = Math.round(Math.max(meta.width, meta.height) * 0.03);

  await sharp(buffer)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    })
    .png()
    .toFile(output);

  const fs = await import("fs/promises");
  await fs.rm(input, { force: true });
  await fs.rename(output, input);

  console.log(`Trimmed ${file}`);
}
