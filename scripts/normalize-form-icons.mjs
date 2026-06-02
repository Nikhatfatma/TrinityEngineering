/**
 * Normalizes building-type and inspection-type form icons.
 * Building: wide artwork on 400×220 canvas.
 * Inspection: tight crop, larger 400×250 canvas — big icons, no top crop.
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const BUILDING_CANVAS_W = 400;
const BUILDING_CANVAS_H = 220;
const BUILDING_ART_W = 360;
const BUILDING_ART_H = 180;

const INSPECTION_CANVAS_W = 400;
const INSPECTION_CANVAS_H = 250;
/** ~6px top/bottom safe zone on 250px canvas */
const INSPECTION_ART_W = 396;
const INSPECTION_ART_H = 238;

async function trimIcon(buffer) {
  try {
    buffer = await sharp(buffer)
      .trim({ threshold: 12, background: { r: 0, g: 0, b: 0, alpha: 255 } })
      .toBuffer();
  } catch {
    /* no black border */
  }

  return sharp(buffer)
    .trim({ threshold: 15, background: { r: 255, g: 255, b: 255, alpha: 255 } })
    .toBuffer();
}

/** Crop to the painted pixels so square icons fill the card like wide building icons */
async function cropToContent(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const a = data[i + 3];
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (a > 10 && !(r > 250 && g > 250 && b > 250)) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX <= minX || maxY <= minY) return buffer;

  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.015);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const width = Math.min(info.width - left, maxX - minX + 1 + pad * 2);
  const height = Math.min(info.height - top, maxY - minY + 1 + pad * 2);

  return sharp(buffer).extract({ left, top, width, height }).toBuffer();
}

async function normalizeToCanvas(
  file,
  canvasW,
  canvasH,
  artW,
  artH,
  tightCrop = false,
) {
  const input = path.join(publicDir, file);
  const output = path.join(publicDir, `${file}.tmp.png`);

  let buffer = await trimIcon(await sharp(input).toBuffer());
  if (tightCrop) {
    buffer = await cropToContent(buffer);
  }

  const fitted = await sharp(buffer)
    .resize(artW, artH, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  const fittedMeta = await sharp(fitted).metadata();
  const left = Math.round((canvasW - fittedMeta.width) / 2);
  const top = Math.round((canvasH - fittedMeta.height) / 2);

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: fitted, left, top }])
    .png()
    .toFile(output);

  await fs.rm(input, { force: true });
  await fs.rename(output, input);
  console.log(`Normalized ${file} (${canvasW}×${canvasH}, art ${artW}×${artH}${tightCrop ? ", tight" : ""})`);
}

const files = (await fs.readdir(publicDir)).filter(
  (f) => f.startsWith("building-type-") || f.startsWith("inspection-type-"),
);

for (const file of files) {
  if (file.startsWith("inspection-type-")) {
    await normalizeToCanvas(
      file,
      INSPECTION_CANVAS_W,
      INSPECTION_CANVAS_H,
      INSPECTION_ART_W,
      INSPECTION_ART_H,
      true,
    );
  } else {
    await normalizeToCanvas(
      file,
      BUILDING_CANVAS_W,
      BUILDING_CANVAS_H,
      BUILDING_ART_W,
      BUILDING_ART_H,
      false,
    );
  }
}
