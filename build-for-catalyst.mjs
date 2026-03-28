import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const NEXT_DIR = path.join(process.cwd(), '.next');
const SRC_DIR = path.join(NEXT_DIR, 'standalone');
const DEST_DIR = path.join(process.cwd(), 'catalyst_build');

console.log('🧹 Cleaning previous ".next" cache to prevent Windows/OneDrive lock errors...');
if (fs.existsSync(NEXT_DIR)) {
  fs.rmSync(NEXT_DIR, { recursive: true, force: true });
}

console.log('🏗️ Running "next build"...');
try {
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed! Please check the output above.');
  process.exit(1);
}

// Delete existing build folder
if (fs.existsSync(DEST_DIR)) {
  fs.rmSync(DEST_DIR, { recursive: true, force: true });
}

console.log('📦 Packaging standalone build...');

// 1. Copy standalone directory
fs.cpSync(SRC_DIR, DEST_DIR, { recursive: true });

// 2. Copy public directory
const publicDir = path.join(process.cwd(), 'public');
const destPublicDir = path.join(DEST_DIR, 'public');
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, destPublicDir, { recursive: true });
}

// 3. Copy static folder
const staticDir = path.join(process.cwd(), '.next', 'static');
const destStaticDir = path.join(DEST_DIR, '.next', 'static');
if (fs.existsSync(staticDir)) {
  fs.cpSync(staticDir, destStaticDir, { recursive: true });
}

// 4. Create app-config.json for AppSail in the destination folder
const appConfig = {
  "command": "node server.js",
  "build_path": ".",
  "stack": "node20",
  "memory": 1024,
  "env_variables": {
    "PORT": "${X_ZOHO_CATALYST_LISTEN_PORT}",
    "HOSTNAME": "0.0.0.0"
  }
};
fs.writeFileSync(
  path.join(DEST_DIR, 'app-config.json'),
  JSON.stringify(appConfig, null, 2)
);

console.log('✅ Catalyst build package created successfully at "catalyst_build"!');
