"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HERO_VIDEO_FALLBACK_IMAGE,
  HERO_VIDEO_MP4,
} from "./heroVideoConfig";
import {
  getConnectionTier,
  subscribeConnectionTier,
} from "./heroVideoConnection";

type StaticFallbackReason = "slow-connection" | "error";

type HeroVideoBackgroundProps = {
  strongShade?: boolean;
};

const MEDIA_LAYER = "transition-opacity duration-200";

export default function HeroVideoBackground({ strongShade = false }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [staticFallback, setStaticFallback] = useState<StaticFallbackReason | null>(
    null,
  );

  const gridClass = `hero-media-grid${strongShade ? " hero-media-grid--strong-shade" : ""}`;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (getConnectionTier() === "slow") {
      setStaticFallback("slow-connection");
    }
    return subscribeConnectionTier((nextTier) => {
      if (nextTier === "slow") {
        setStaticFallback("slow-connection");
      }
    });
  }, []);

  const useStaticOnly = reduceMotion || staticFallback !== null;

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || useStaticOnly) return;

    video.muted = true;

    void video
      .play()
      .then(() => {
        setVideoActive(true);
      })
      .catch((err: DOMException) => {
        if (err.name === "AbortError") {
          window.requestAnimationFrame(startPlayback);
        }
      });
  }, [useStaticOnly]);

  useEffect(() => {
    if (useStaticOnly) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const onReady = () => startPlayback();
    const onPlaying = () => setVideoActive(true);
    const onError = () => setStaticFallback("error");

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    if (video.readyState >= 2) {
      startPlayback();
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
    };
  }, [useStaticOnly, startPlayback]);

  const strongShadeLayer = strongShade ? <div className="hero-media-strong-shade" aria-hidden /> : null;

  if (useStaticOnly) {
    return (
      <div className={gridClass}>
        <img src={HERO_VIDEO_FALLBACK_IMAGE} alt="" className={MEDIA_LAYER} />
        {strongShadeLayer}
      </div>
    );
  }

  return (
    <div className={gridClass}>
      <img
        src={HERO_VIDEO_FALLBACK_IMAGE}
        alt=""
        className={`${MEDIA_LAYER} transition-opacity duration-200 ${
          videoActive ? "opacity-0" : "opacity-100"
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
        onLoadedData={startPlayback}
        onCanPlay={startPlayback}
        onPlaying={() => setVideoActive(true)}
        onError={() => setStaticFallback("error")}
        className={`${MEDIA_LAYER} transition-opacity duration-200 ${
          videoActive ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
      </video>
      {strongShadeLayer}
    </div>
  );
}
