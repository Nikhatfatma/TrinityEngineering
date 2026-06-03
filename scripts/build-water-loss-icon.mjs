/**
 * Builds inspection-type-water-loss.png: blue house + pipe leak overlay.
 * Sized to match other inspection-type icons (~153×180 content on 400×220).
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const assetsDir = path.join(
  "C:",
  "Users",
  "pc",
  ".cursor",
  "projects",
  "c-Users-pc-Downloads-TrinityEngineering",
  "assets",
);

const HOUSE_SOURCE = path.join(
  assetsDir,
  "c__Users_pc_AppData_Roaming_Cursor_User_workspaceStorage_a8843f336ef0939e089130a034f54f27_images_image-9c9f4828-3148-44bd-827f-c13c304ab3e9.png",
);
const PIPE_SOURCE = path.join(
  assetsDir,
  "c__Users_pc_AppData_Roaming_Cursor_User_workspaceStorage_a8843f336ef0939e089130a034f54f27_images_image-0b0d0906-246a-411f-a3a0-4566d95bd414.png",
);

/** Same canvas + content scale as inspection-type-storm-damage.png etc. */
const CANVAS_W = 400;
const CANVAS_H = 220;
const ART_MAX_W = 128;
const ART_MAX_H = 152;

const PIPE_SCALE_W = 1.05;
const PIPE_SCALE_H = 0.85;
const PIPE_SIDE_CROP = 0.14;

async function stripBlackBorder(buffer) {
  try {
    buffer = await sharp(buffer)
      .trim({ threshold: 20, background: { r: 0, g: 0, b: 0, alpha: 255 } })
      .toBuffer();
  } catch {
    /* no black border */
  }
  return buffer;
}

async function trimWhite(buffer) {
  return sharp(buffer)
    .trim({ threshold: 15, background: { r: 255, g: 255, b: 255, alpha: 255 } })
    .toBuffer();
}

async function trimInk(buffer) {
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
      if (data[i + 3] > 20 && data[i] < 80) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return sharp(buffer)
    .extract({
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    })
    .png()
    .toBuffer();
}

async function cropSidePipeArms(buffer, sidePct) {
  const { width, height } = await sharp(buffer).metadata();
  const pad = Math.round(width * sidePct);
  return sharp(buffer)
    .extract({
      left: pad,
      top: 0,
      width: width - pad * 2,
      height,
    })
    .png()
    .toBuffer();
}

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

  return sharp(buffer).extract({ left, top, width, height }).png().toBuffer();
}

let houseBuf = await stripBlackBorder(await sharp(HOUSE_SOURCE).png().toBuffer());
houseBuf = await trimWhite(houseBuf);

let pipeBuf = await trimInk(await sharp(PIPE_SOURCE).ensureAlpha().png().toBuffer());
pipeBuf = await cropSidePipeArms(pipeBuf, PIPE_SIDE_CROP);

const houseFit = await sharp(houseBuf)
  .resize(ART_MAX_W, ART_MAX_H, { fit: "inside", withoutEnlargement: false })
  .png()
  .toBuffer();

const { width: houseW, height: houseH } = await sharp(houseFit).metadata();

const targetPipeH = Math.round(houseH * PIPE_SCALE_H);
const maxPipeW = Math.round(houseW * PIPE_SCALE_W);

const pipeFit = await sharp(pipeBuf)
  .resize(maxPipeW, targetPipeH, {
    fit: "inside",
    withoutEnlargement: false,
  })
  .png()
  .toBuffer();

const { width: pipeW, height: pipeH } = await sharp(pipeFit).metadata();
const workW = houseW;
const workH = houseH;
const pipeLeft = Math.round((workW - pipeW) / 2);
const pipeTop = Math.round(houseH * 0.12);

const composed = await sharp({
  create: {
    width: workW,
    height: workH,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([
    { input: houseFit, left: 0, top: 0 },
    { input: pipeFit, left: pipeLeft, top: pipeTop },
  ])
  .png()
  .toBuffer();

const cropped = await cropToContent(composed);
const fitted = await sharp(cropped)
  .resize(ART_MAX_W, ART_MAX_H, { fit: "inside", withoutEnlargement: false })
  .png()
  .toBuffer();

const { width: fitW, height: fitH } = await sharp(fitted).metadata();
const left = Math.round((CANVAS_W - fitW) / 2);
const top = Math.round((CANVAS_H - fitH) / 2);

const out = path.join(publicDir, "inspection-type-water-loss.png");
await sharp({
  create: {
    width: CANVAS_W,
    height: CANVAS_H,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{ input: fitted, left, top }])
  .png()
  .toFile(out);

console.log(`Wrote ${out} (canvas ${CANVAS_W}×${CANVAS_H}, art ${fitW}×${fitH})`);
