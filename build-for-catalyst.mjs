import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const NEXT_DIR = path.join(process.cwd(), '.next');
const SRC_DIR = path.join(NEXT_DIR, 'standalone');
const DEST_DIR = path.join(process.cwd(), 'catalyst_build');

const RM_OPTS = { recursive: true, force: true, maxRetries: 5, retryDelay: 200 };

function sleepSync(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* wait */
  }
}

function removeDirSafe(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, RM_OPTS);
}

function copyEntrySync(src, dest) {
  const stat = fs.lstatSync(src);

  if (stat.isSymbolicLink()) {
    const linkTarget = fs.readlinkSync(src);
    const resolved = path.resolve(path.dirname(src), linkTarget);
    if (!fs.existsSync(resolved)) return;
    copyEntrySync(resolved, dest);
    return;
  }

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyEntrySync(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDirRobust(src, dest, label = 'directory') {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing ${label}: ${src}`);
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      removeDirSafe(dest);
      fs.cpSync(src, dest, {
        recursive: true,
        force: true,
        dereference: true,
        verbatimSymlinks: false,
      });
      return;
    } catch (error) {
      removeDirSafe(dest);

      if (attempt < 3) {
        console.warn(
          `⚠️ Copy attempt ${attempt} failed (${error.code || error.message}). Retrying...`,
        );
        sleepSync(400 * attempt);
        continue;
      }

      console.warn('⚠️ fs.cpSync failed; falling back to manual copy...');
      try {
        removeDirSafe(dest);
        copyEntrySync(src, dest);
        return;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  }
}

console.log('🧹 Cleaning previous ".next" cache to prevent Windows/OneDrive lock errors...');
removeDirSafe(NEXT_DIR);

console.log('🏗️ Running "next build"...');
try {
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed! Please check the output above.');
  process.exit(1);
}

if (!fs.existsSync(SRC_DIR)) {
  console.error(`❌ Standalone output not found at "${SRC_DIR}". Check next.config "output: 'standalone".`);
  process.exit(1);
}

console.log('📦 Packaging standalone build...');

// 1. Copy standalone directory
copyDirRobust(SRC_DIR, DEST_DIR, 'standalone build');

// 2. Copy public directory
const publicDir = path.join(process.cwd(), 'public');
const destPublicDir = path.join(DEST_DIR, 'public');
if (fs.existsSync(publicDir)) {
  copyDirRobust(publicDir, destPublicDir, 'public assets');
}

// 3. Copy static folder
const staticDir = path.join(process.cwd(), '.next', 'static');
const destStaticDir = path.join(DEST_DIR, '.next', 'static');
if (fs.existsSync(staticDir)) {
  fs.mkdirSync(path.dirname(destStaticDir), { recursive: true });
  copyDirRobust(staticDir, destStaticDir, 'Next static assets');
}

// 4. Create app-config.json for AppSail in the destination folder
const appConfig = {
  command: 'node server.js',
  build_path: '.',
  stack: 'node20',
  memory: 1024,
  env_variables: {
    PORT: '${X_ZOHO_CATALYST_LISTEN_PORT}',
    HOSTNAME: '0.0.0.0',
  },
};
fs.writeFileSync(path.join(DEST_DIR, 'app-config.json'), JSON.stringify(appConfig, null, 2));

console.log('✅ Catalyst build package created successfully at "catalyst_build"!');
