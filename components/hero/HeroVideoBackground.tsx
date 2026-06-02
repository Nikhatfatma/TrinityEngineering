"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HERO_VIDEO_FALLBACK_IMAGE,
  HERO_VIDEO_MP4,
  HERO_VIDEO_MOV,
} from "./heroVideoConfig";

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    if (video.readyState >= 2) {
      void video.play().catch(() => {});
    }
  }, [reduceMotion]);

  useEffect(() => {
    tryPlay();
  }, [tryPlay]);

  if (reduceMotion) {
    return (
      <img
        src={HERO_VIDEO_FALLBACK_IMAGE}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <>
      <img
        src={HERO_VIDEO_FALLBACK_IMAGE}
        alt=""
        className={`pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-300 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={tryPlay}
        onCanPlay={tryPlay}
        onPlaying={() => setIsPlaying(true)}
        className={`pointer-events-none absolute inset-0 z-[2] h-full w-full object-cover transition-opacity duration-300 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
        <source src={HERO_VIDEO_MOV} type="video/quicktime" />
      </video>
    </>
  );
}
