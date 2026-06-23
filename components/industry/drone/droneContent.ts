/** Drone Technology industry page — copy aligned to Figma, layout aligned to Infrared/Claims/SWI tabs */

export {
  HOME_CONTENT_CLASS as DRONE_SECTION_SHELL,
  HOME_TEXT_WIDTH as DRONE_CONTENT_WIDTH,
} from "@/components/home/HomeContent";

export {
  SWI_IMAGE_BLOCK_CLASS as DRONE_IMAGE_BLOCK_CLASS,
  SWI_TAB_TWO_COL_TEXT_IMAGE_LEFT as DRONE_TAB_TWO_COL_TEXT_IMAGE_LEFT,
  SWI_TAB_TWO_COL_TEXT_IMAGE_RIGHT as DRONE_TAB_TWO_COL_TEXT_IMAGE_RIGHT,
} from "@/components/swi/swiContent";

export const DRONE_HERO = {
  heroImage: "/industry/drone-hero-new.jpg",
  logoSrc: "/industry/drone-hero-logo.png",
  logoAlt: "FAA Part 107 Certified – Trinity Engineering",
  title: "Supplementing The Inspection,\nNever Replacing It",
  subtitle: "The Role Of Drone Technology In A Thorough Field Inspection",
} as const;

export const DRONE_PROBLEM = {
  id: "problem-section",
  eyebrow: "Leveraging technology for a more thorough inspection process",
  title: "",
  paragraphs: [
    "In the insurance restoration industry, the credibility of a forensic engineering report rests on one thing: the thoroughness of the field evaluation behind it. At Trinity, our position on drone technology is straightforward.",
    "Unmanned aerial systems (UAS) are a powerful documentation and reconnaissance tool, but they are a supplement to direct physical inspection — not a substitute for it. The distinction matters, and understanding why requires a closer look at both what drones do well and what they cannot do at all.",
    "A drone captures imagery. A forensic inspection captures evidence. Those are not the same thing, and conflating them is where a lot of lower-quality field work goes wrong.",
  ],
  aerialImageSrc: "/industry/drone-aerial-farm.jpg",
  aerialImageAlt: "Aerial drone view of a large agricultural facility roof complex",
} as const;

export const DRONE_TECHNOLOGY = {
  id: "technology-section",
  title: "What a Drone Actually Sees — and What It Doesn't",
  diagramImageSrc: "/industry/drone-aerial-shingles.jpg",
  diagramImageAlt: "Aerial drone view of residential roof shingles showing damage pattern detail",
  blocks: [
    {
      eyebrow: "the technology",
      paragraphs: [
        "Modern inspection-grade drones carry high-resolution sensors capable of producing detailed imagery from controlled standoff distances. A platform equipped with a 20-megapixel sensor and a mechanical or electronic shutter can resolve surface features at sub-millimeter ground sample distance (GSD) when flown at appropriate altitudes. With nadir (straight-down) and oblique flight patterns, the same flight can document slope geometry, overall roof condition, and the spatial relationship between damage patterns and roof features such as ridges, valleys, penetrations, and field areas.",
        "This is genuinely useful. Aerial documentation provides:",
        "• Wide-area context that a roof-level photograph cannot. An oblique image showing an entire slope, with damage to shingles or other roofing materials, vents, and ridge caps visible in a single frame, establishes spatial relationships that are tedious to convey from the surface alone.",
        "• Safe reconnaissance of steep, high, or compromised structures, where stepping onto the surface introduces unacceptable risk to the inspector or further damage to an already-weakened assembly.",
        "• Repeatable, georeferenced flight paths that allow consistent documentation across return visits or across a large-loss portfolio of structures.",
        "• Orthomosaic and photogrammetric outputs — stitched, scaled composites and 3D models built from overlapping images — that can support measurement and slope-area calculations.",
      ],
    },
    {
      eyebrow: "boots on the ground.... and on the roof",
      paragraphs: [
        "But here is what a drone fundamentally cannot do, and why it will never close the loop on a forensic determination:",
        "A drone cannot feel a soft spot underfoot that signals deck deterioration. It cannot lift a shingle tab to evaluate seal-strip integrity, mat condition, or the presence of a fracture beneath an impact. It cannot distinguish, with the certainty a determination requires, between a hail impact and mechanical surface marring, a manufacturing blister, or foot traffic. It cannot perform a brittleness test on aged shingles. It cannot weather-test the back side of a fracture or assess whether a mat has actually separated. And it cannot apply the tactile, multi-sensory judgment of a trained inspector standing on the assembly, reading the roof the way it is actually read.",
        "The most consequential forensic indicators — weathering of exposed asphalt and fiberglass, debris accumulation in impact dents, the condition of underlayment between adjacent shingles, the deterioration of exposed sealant strips — are evaluated up close, by hand, on the surface. These are the indicators that separate recent storm-created damage from long-term, pre-existing wear. No aerial sensor resolves that distinction. A drone can tell you where to look. It takes an engineer on the roof to tell you what it is.",
      ],
    },
  ],
} as const;

export const DRONE_QUALITY = {
  id: "quality-section",
  title: "Quality Matters: All Drone Work Is NOT Equal",
  operatorImageSrc: "/industry/drone-operator.jpg",
  operatorImageAlt: "FAA-certified Trinity Engineering drone operator controlling UAS inspection flight",
  blocks: [
    {
      eyebrow: "professionalism in drone work",
      paragraphs: [
        "There is a meaningful gap between a contractor snapping aerial photos and a properly executed forensic aerial documentation protocol. Quality drone work depends on:",
        "• Licensed, current operation. Commercial UAS work requires an FAA Part 107 Remote Pilot Certificate, airspace awareness, and compliance with applicable flight restrictions. This is non-negotiable and is the baseline below which \"drone footage\" carries no professional weight.",
        "• Adequate sensor resolution and stable capture. Image quality, lighting, and standoff distance directly govern whether an image can support any conclusion at all.",
        "• Disciplined flight planning. Consistent overlap, appropriate altitude for the required GSD, and both nadir and oblique coverage are what separate documentation from snapshots.",
        "• Honest characterization. Aerial imagery is presented as what it is — context and reconnaissance — and is never asked to carry a determination it cannot support.",
      ],
    },
  ],
} as const;

export const DRONE_APPROACH = {
  id: "approach-section",
  title: "Trinity's Approach to Leveraging Technology",
  trainingImageSrc: "/industry/drone-training.jpg",
  trainingImageAlt: "Trinity Engineering engineer reviewing drone component overview during training session",
  approachBlocks: [
    {
      eyebrow: "the right tools for the right job",
      paragraphs: [
        "We adopt the best available technology because our clients deserve the most complete, defensible documentation we can produce — and because staying ahead of the field is how Trinity has earned its reputation as one of the most trusted providers in the insurance restoration industry. Quality drone documentation is part of that.",
      ],
    },
    {
      eyebrow: "quality work enhanced by quality tools",
      paragraphs: [
        "But technology, for us, is always in service of the work — never a shortcut around it. We have built our standing on detailed, hands-on forensic evaluation performed by trained engineers on the structure, and that does not change because the toolkit improves. The drone makes our documentation more complete and our reconnaissance safer and smarter. The engineer on the roof, doing the close, methodical, physical evaluation we have always done, is what makes the determination sound.",
      ],
    },
    {
      eyebrow: "always our best",
      paragraphs: [
        "That is the balance we hold: the best technology available, in support of the same rigorous, professional inspection our clients have always counted on. The tools get better, the commitment to thoroughness stays where it always has, at the forefront of our inspection process for each and every inspection.",
      ],
    },
  ],
} as const;

export const DRONE_CTA = {
  id: "contact-section",
  backgroundImage: "/industry/drone-cta-bg.png",
  title: "Better instruments, the same standard",
  paragraphs: [
    "At Trinity Engineering, our position on technology is simple: the best tools available, in service of the most rigorous inspection process available. We adopt new methods because thoroughness demands it, not because the technology is impressive. The rigorous standard that has defined our work since the beginning isn't changed by the tools we carry, it is advanced and upheld by them.",
  ],
  emailLead: "Email us today at",
  email: "claims@trinitypllc.com",
  emailSuffix: "for case studies and other sUAS related information",
  cta: { label: "Submit Inspection", href: "/submit-inspection" },
} as const;
