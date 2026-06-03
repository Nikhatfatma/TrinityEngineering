/** Shared hero background video — used on Home, Claims, SWI, Fortified, Careers */

/** Compressed H.264 MP4 (1080p, 24fps, faststart) — preferred for web */
export const HERO_VIDEO_MP4 = "/hero-video.mp4";

/** Original MOV — kept for asset reference; not loaded in the browser (static fallback used instead) */
export const HERO_VIDEO_MOV = "/Trinity%20Engineering%20Hero%20Video%20VER2.mov";

/** Static fallback — poster, slow connection, reduced motion, and load errors */
export const HERO_VIDEO_FALLBACK_IMAGE = "/hero-background.png";

/** If video has not buffered within this time, show static image */
export const HERO_VIDEO_LOAD_TIMEOUT_MS = 20000;

/** Treat 3g / downlink below this (Mbps) as slow */
export const HERO_VIDEO_SLOW_DOWNLINK_MBPS = 1.5;
