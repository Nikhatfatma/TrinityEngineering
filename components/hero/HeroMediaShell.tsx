"use client";

import HeroImageBackground from "@/components/hero/HeroImageBackground";
import HeroVideoBackground from "@/components/hero/HeroVideoBackground";

type HeroMediaShellProps = {
  /** When set, shows this image instead of the shared hero video. */
  imageSrc?: string;
  imageObjectPosition?: string;
  /** Figma-matched heavy dark overlay — all main tab heroes. */
  strongShade?: boolean;
};

/** Hero background shell — video or static image, both use .hero-media-grid black shade. */
export default function HeroMediaShell({
  imageSrc,
  imageObjectPosition,
  strongShade = false,
}: HeroMediaShellProps = {}) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {imageSrc ? (
        <HeroImageBackground
          src={imageSrc}
          objectPosition={imageObjectPosition}
          strongShade={strongShade}
        />
      ) : (
        <HeroVideoBackground strongShade={strongShade} />
      )}
    </div>
  );
}
