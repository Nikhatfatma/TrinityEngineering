/**
 * Optimizes hero-background.png for faster static fallback delivery.
 * Usage: node scripts/optimize-hero-poster.mjs
 */
import { unlink } from "fs/promises";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const poster = path.join(__dirname, "..", "public", "hero-background.png");
const temp = `${poster}.tmp`;

await sharp(poster)
  .resize(1920, null, { fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(temp);

await sharp(temp).toFile(poster);
await unlink(temp);

console.log("Optimized hero-background.png");
