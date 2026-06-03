type HeroImageBackgroundProps = {
  src: string;
  /** Fine-tune crop — e.g. "center 40%" to avoid dark edges at the top. */
  objectPosition?: string;
  /** SWI / Fortified — Figma-matched heavy dark overlay */
  strongShade?: boolean;
};

/** Static hero background image with black shade (.hero-media-grid). */
export default function HeroImageBackground({
  src,
  objectPosition = "center center",
  strongShade = false,
}: HeroImageBackgroundProps) {
  return (
    <div className={`hero-media-grid${strongShade ? " hero-media-grid--strong-shade" : ""}`}>
      <img
        src={src}
        alt=""
        className="block h-full w-full min-h-full min-w-full object-cover"
        style={{ objectPosition }}
      />
      {strongShade ? <div className="hero-media-strong-shade" aria-hidden /> : null}
    </div>
  );
}
