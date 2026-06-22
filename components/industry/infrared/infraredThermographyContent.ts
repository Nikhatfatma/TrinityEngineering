/** Infrared Thermography industry page — copy aligned to Figma, layout aligned to Claims/SWI/Fortified tabs */

export {
  HOME_CONTENT_CLASS as IR_SECTION_SHELL,
  HOME_TEXT_WIDTH as IR_CONTENT_WIDTH,
} from "@/components/home/HomeContent";

export {
  SWI_IMAGE_BLOCK_CLASS as IR_IMAGE_BLOCK_CLASS,
  SWI_TAB_TWO_COL_TEXT_IMAGE_LEFT as IR_TAB_TWO_COL_TEXT_IMAGE_LEFT,
  SWI_TAB_TWO_COL_TEXT_IMAGE_RIGHT as IR_TAB_TWO_COL_TEXT_IMAGE_RIGHT,
} from "@/components/swi/swiContent";

export const IR_HERO = {
  heroImage: "/industry/infrared-hero.png",
  logoSrc: "/industry/infrared-certified-logo.png",
  logoAlt: "Trinity Engineering Certified Thermographer",
  title: "Seeing What The Eye Cannot",
  subtitle: "Infrared Thermography in Forensic Field Inspections",
} as const;

export const IR_TOOLS = {
  id: "tools-section",
  eyebrow: "Tools for finding what's hidden",
  title: "Can you see behind walls?",
  paragraphs: [
    "Some of the most consequential conditions a forensic inspection has to document are the ones you cannot see. Water tracking behind a wall, saturated insulation above a ceiling, a slow plumbing leak that has been wicking through framing for weeks — by the time these conditions are visible to the naked eye, they have usually been developing for a long time. Infrared thermography gives a trained inspector a way to find them earlier, map them more completely, and document them more honestly.",
    "At Trinity, infrared thermography has become a core part of how we approach water losses, leak detection, and certain structural evaluations. As with every tool in our kit, the principle is the same: it sharpens and supplements the physical inspection. It does not replace the engineer who has to interpret what the camera is actually showing.",
  ],
  comparisonImageSrc: "/industry/infrared-comparison.png",
  comparisonImageAlt:
    "Side-by-side comparison of a wall in visible light and infrared thermal imaging",
} as const;

export const IR_MEASURING = {
  id: "measuring-section",
  title: "What an Infrared Camera is Actually Measuring",
  diagramImageSrc: "/industry/infrared-diagram.png",
  diagramImageAlt: "Diagram showing how an infrared camera collects and processes thermal radiation",
  blocks: [
    {
      eyebrow: "does the camera see moisture?",
      paragraphs: [
        "This is the part most people get wrong, so it's worth being precise.",
        "objects above absolute 0 emit thermal radiation",
        "An infrared camera does not see moisture, and it does not see through walls. What it detects is emitted thermal radiation — the long-wave infrared energy that every surface above absolute zero gives off. The camera converts that radiation into a thermal image, where temperature differences across a surface appear as differences in color or brightness.",
      ],
    },
    {
      eyebrow: "thermal anomaly, not 'moisture'",
      paragraphs: [
        "Moisture shows up indirectly. Wet materials behave differently from dry ones thermally — they hold and release heat at a different rate, a property related to their thermal mass and to the cooling effect of evaporative loss at the surface. So when a section of drywall is damp, it will often read as a different temperature than the dry material around it. The camera isn't seeing the water. It's seeing the thermal anomaly the water creates. That is a critical distinction, and it's the reason infrared findings always have to be confirmed.",
      ],
    },
    {
      eyebrow: "recognizing the pattern",
      paragraphs: [
        "The patterns matter as much as the temperatures. Active water intrusion tends to produce irregular, often plume-shaped or pooling thermal signatures that follow the path of gravity and the structure of the assembly. A reading that's perfectly rectangular and aligned with framing is more likely a missing-insulation issue or a thermal bridge — a path of higher conductivity through the assembly, like a stud or a metal fastener — than it is a leak. Reading those patterns correctly is the skill. The camera just makes the patterns visible.",
      ],
    },
  ],
} as const;

export const IR_CONFIRMATION = {
  id: "confirmation-section",
  title: "Confirmation is NOT Optional",
  imageSrc: "/industry/infrared-moisture-meter.png",
  imageAlt: "Forensic inspector using a moisture meter to confirm infrared findings on a wall",
  blocks: [
    {
      eyebrow: "ir cameras do not 'see' moisture",
      paragraphs: [
        "Because infrared identifies anomalies rather than moisture itself, a thermal image alone proves nothing. A cold spot on a wall could be a leak. It could also be a draft, a thermal bridge, a recently cooled surface, or a difference in material. This is why responsible thermographic practice always pairs the camera with a moisture meter — a contact or non-contact instrument that gives an actual quantitative moisture reading at the location the camera flagged.",
      ],
    },
    {
      eyebrow: "trusting the process",
      paragraphs: [
        "The workflow is sequential and it matters: the infrared camera surveys quickly and points to where to look, and the moisture meter confirms whether what was flagged is genuinely wet. One finds the candidates; the other verifies them. A report that leans on thermal imagery without confirmation is making a claim the technology cannot, by itself, support.",
      ],
    },
    {
      eyebrow: "no delta-t, no thermography",
      paragraphs: [
        "It's also worth noting that infrared survey quality depends on conditions. The camera needs a temperature delta — a thermal gradient — between the wet and dry areas to detect anything at all. A surface that has reached thermal equilibrium with its surroundings may hide a real problem. Time of day, recent HVAC operation, solar loading on an exterior wall, and ambient conditions all influence what a survey can and cannot reveal. A competent operator accounts for these; an inexperienced one mistakes a poor survey window for an absence of damage.",
      ],
    },
  ],
} as const;

export const IR_LEVERAGE = {
  id: "leverage-section",
  title: "How Does Trinity Leverage Infrared Technology?",
  intro:
    "Trinity certifies its thermographers through an in-house certification program structured in accordance with ASNT Recommended Practice No. SNT-TC-1A (2020) — the industry-standard framework for employer-based qualification and certification of nondestructive testing personnel. Under this program, Trinity defines the training requirements, administers qualifying examinations, and issues certification at four levels (Level 0 through Level III), with each level carrying progressively greater responsibilities for collecting findings, reviewing results, and managing the program. Certification levels are aligned with ASNT/ANSI CP-105 and ISO 18436-7, placing Trinity's inspectors within a recognized international framework for infrared thermography.",
  applications: [
    {
      title: "Water Losses",
      subtitle: "How far did the water travel, and what's actually been affected?",
      body: "Infrared lets an inspector map the extent of intrusion across walls, ceilings, and floors far more completely than visual inspection alone, identifying affected areas that show no surface staining yet. This produces a more accurate scope — neither overstating damage that isn't there nor missing saturation that is.",
    },
    {
      title: "Leak Detection/Diagnostic Analysis",
      subtitle: "For active or intermittent leaks",
      body: "Thermal patterns help trace water back toward its source by following the signature along the path it has taken through the assembly. This is particularly valuable for plumbing failures and roof or envelope intrusions where the visible evidence is far from the actual point of entry.",
    },
    {
      title: "Forensic Structural Evaluations",
      subtitle: "Directing our engineers to the right places",
      body: "When a structural failure or distress event is under investigation — whether a rafter failure, truss separation, wall system compromise, or foundation-related movement — IR can reveal patterns that are not visible to the naked eye. Active moisture intrusion through failed connections or breached assemblies will produce distinct thermal signatures at framing members, sheathing, and bearing points, helping to establish whether water infiltration contributed to a loss of structural capacity over time. Thermal bridging anomalies can expose areas where the structural assembly has been compromised, altered, or improperly repaired — conditions that may have predated or directly contributed to a failure event. In post-storm structural investigations specifically, IR can help differentiate between pre-existing conditions and event-related damage by mapping thermal patterns against the directionality and intensity of the storm. The camera doesn't replace the hands-on forensic evaluation — but in a structural context, it directs the engineer to the right places and, critically, creates a documented thermal record of conditions at the time of inspection.",
    },
  ],
} as const;

export const IR_QUALITY = {
  id: "quality-section",
  title: "Quality, Limits, and the Trinity Position",
  trainingImageSrc: "/industry/infrared-training.png",
  trainingImageAlt:
    "Trinity Engineering infrared thermography training session for field inspectors",
  blocks: [
    {
      eyebrow: "infrared work varies in quality",
      paragraphs: [
        "Infrared work, like any specialized method, varies enormously in quality.",
      ],
    },
    {
      eyebrow: "sound thermographic practice",
      paragraphs: [
        "Sound thermographic practice depends on a trained operator who understands radiation physics and assembly behavior, an appropriate survey window with a real thermal gradient, systematic confirmation with moisture metering, and honest reporting that characterizes thermal findings as what they are. Handing someone a thermal camera does not make the output forensically meaningful any more than handing someone a stethoscope makes them a physician.",
      ],
    },
    {
      eyebrow: "why we invest in infrared",
      paragraphs: [
        "We invest in infrared thermography because it lets us document water and structural conditions more completely, more accurately, and earlier than the eye alone allows — and giving our clients the most thorough, defensible evaluation available is exactly how Trinity has earned its standing in the insurance restoration industry.",
      ],
    },
    {
      eyebrow: "the camera does not write the report",
      paragraphs: [
        "But the camera does not write the report. It finds the questions; our engineers answer them. Every thermal anomaly is confirmed, every pattern is interpreted in the context of how the assembly actually behaves, and every finding rests on the same detailed, hands-on evaluation that has defined our work from the beginning. The technology makes us faster and our documentation more complete. The commitment to thoroughness behind the determination is unchanged, and that's the balance we hold across everything we do.",
      ],
    },
  ],
} as const;

export const IR_CTA = {
  id: "contact-section",
  backgroundImage: "/infrared-cta-bg.jpg",
  title: "Better instruments, the same standard",
  paragraphs: [
    "At Trinity Engineering, our position on technology is simple: the best tools available, in service of the most rigorous inspection process available. We adopt new methods because thoroughness demands it, not because the technology is impressive. The rigorous standard that has defined our work since the beginning isn't changed by the tools we carry, it is advanced and upheld by them.",
  ],
  emailLead: "Email us today at",
  email: "claims@trinitypllc.com",
  emailSuffix: "for case studies and other IR related information",
  cta: { label: "Submit Inspection", href: "/submit-inspection" },
} as const;
