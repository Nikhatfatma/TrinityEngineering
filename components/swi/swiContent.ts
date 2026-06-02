/** SWI page copy — aligned to Figma SWI tab */

export const SWI_SECTION_SHELL =
  "mx-auto w-full max-w-[1440px] min-w-0 px-4 sm:px-6 md:px-8 lg:px-8";

export const SWI_CONTENT_WIDTH = "mx-auto w-full max-w-5xl min-w-0";

/** Same horizontal text inset as Claims tab (centered max-w-5xl column) */
export const SWI_TAB_TEXT_INSET_LEFT =
  "px-4 sm:px-6 md:px-8 lg:pl-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";

export const SWI_TAB_TWO_COL_TEXT_IMAGE_LEFT =
  "px-4 sm:px-6 md:px-8 lg:pl-10 lg:pr-8 xl:pl-12 xl:pr-10";

export const SWI_TAB_TWO_COL_TEXT_IMAGE_RIGHT =
  `${SWI_TAB_TEXT_INSET_LEFT} lg:pr-10 xl:pr-12`;

export const SWI_HERO = {
  titleLightLine1: "Weather Reporting",
  titleLightLine2: "Built To",
  titleBoldLine: "Withstand Scrutiny.",
  subtitle:
    "Forensic-grade hail and severe weather analysis for insurance claims — backed by named, reproducible government datasets and a methodology transparent enough for any deposition.",
  primaryCta: { label: "See How It Works", href: "#methodology" },
  secondaryCta: { label: "Request a Report", href: "#get-started" },
} as const;

export const SWI_PROBLEM = {
  titleLine1: "Black-box data",
  titleLine2: "loses in court.",
  intro:
    "Commercial weather products are built on proprietary algorithms — convenient for claims processing, catastrophic when a plaintiff's attorney asks how the number was derived.",
  approachLabel: "Standard Industry Approach",
  featureTitle: "Proprietary Models & Black-Box Scores",
  body:
    "Many weather data products in the insurance industry derive their scores from undisclosed algorithms. When deposed, the expert cannot name an underlying source — only a vendor product. That distinction can matter enormously to a federal judge evaluating expert methodology.",
  warning:
    "Courts have excluded weather expert testimony where methodology was not independently verifiable",
  imageSrc: "/swi-problem.png",
  imageAlt: "Magnifying glass on redacted methodology document",
} as const;

export const SWI_SOLUTION = {
  titleLine1: "Named Sources. Reproducible Methods.",
  titleLine2: "No Secrets.",
  eyebrow: "Severe Weather Intelligence™",
  paragraphs: [
    "Every data point in an SWI report traces back to a publicly accessible, peer-reviewed government dataset. The interpolation methodology is documented step by step. Any qualified expert can replicate the analysis independently.",
  ],
  compliance: "Built from the ground up for Daubert compliance",
  imageSrc: "/swi-nexrad.png",
  imageAlt: "NEXRAD radar dome at sunset",
} as const;

export const SWI_METHODOLOGY = {
  id: "methodology",
  title: "Five layers of corroborating evidence.",
  intro:
    "SWI doesn't rely on a single data stream. Each report synthesizes four independent government data sources with Trinity's own empirical data layer into a single, unified forensic finding.",
  steps: [
    {
      number: "1",
      eyebrow: "NOAA Storm Events Database",
      title: "On-the-Ground Event Records",
      description:
        "The gold standard in forensic evidence: on-site, PE-verified empirical data collected across thousands of inspections by Trinity's qualified forensic engineers. Hail dents and spatter, collateral wind and hail damage, and impact damage to roofing materials — all documented in person, at the property. Radar can be inconsistent, and some counties have coverage gaps where no trained spotters are nearby; ground-truth field data fills those gaps. This proprietary layer is the defensibility core of Severe Weather Intelligence™.",
      tags: ["5K+ records", "2021 – present", "PE-Verified", "Empirical data"],
    },
    {
      number: "2",
      eyebrow: "NOAA NEXRAD Level-3 HDA — SWDI",
      title: "Doppler Radar Corroboration",
      description:
        "A 10-year NEXRAD Level-3 Hail Detection Algorithm dataset — over 7.2 million radar-derived hail detections across the contiguous U.S. — pulled directly from NOAA's Severe Weather Data Inventory. When a storm event is recorded on the ground, we cross-reference it against what 159 WSR-88D radar sites actually detected in the same grid cell at the same time.",
      tags: ["7.2M radar detections", "NEXRAD WSR-88D network", "CONUS coverage", "NOAA SWDI sourced"],
    },
    {
      number: "3",
      eyebrow: "ASOS Station Data — Visual Crossing API",
      title: "Spatial Interpolation from Real Stations",
      description:
        "Wind speed, temperature, and atmospheric conditions at the property are estimated using Inverse Distance Weighting interpolation across nearby Automated Surface Observing System stations — real physical instruments, not modeled data. IDW assigns weighted influence to each surrounding station based on distance, producing a defensible site-specific estimate with a documented confidence metric.",
      tags: ["Real ASOS instruments", "IDW interpolation", "Haversine distance", "Confidence-scored"],
    },
    {
      number: "4",
      eyebrow: "NOAA SPC — Storm Prediction Center",
      title: "Mesoscale Discussion Corroboration",
      description:
        "SPC Mesoscale Discussions are issued by NOAA's Storm Prediction Center when atmospheric conditions are evolving toward organized severe weather. Each SWI report retrieves and links any MCDs active on the date of loss — providing a fifth, independent government-issued confirmation that severe weather conditions were present at the regional scale.",
      tags: ["SPC MCD archive", "Date-of-loss lookup", "NOAA issued", "Publicly verifiable"],
    },
    {
      number: "5",
      eyebrow: "Trinity Engineering on-site inspection data",
      title: "PE-Verified Empirical Evidence",
      description:
        "The gold standard in forensic evidence: on-site, PE-verified empirical data collected across thousands of inspections by Trinity's qualified forensic engineers. Hail dents and spatter, collateral wind and hail damage, and impact damage to roofing materials - all documented in person, at the property. Radar can be inconsistent, and some counties have coverage gaps where no trained spotters are nearby; ground-truth field data fills those gaps. This proprietary layer is the defensibility core of Severe Weather Intelligence™.",
      tags: ["5k+ Records", "2021-Present", "PE-Verified", "Empirical Data"],
    },
  ],
} as const;

export const SWI_STATS = {
  titleLine1: "Built for the deposition room,",
  titleLine2: "not just the desk.",
  intro:
    "The Federal Rules of Evidence require that expert testimony be based on sufficient facts or data and a reliable methodology. SWI was designed with those exact standards in mind — every number has a citation, every methodology has a name.",
  items: [
    { value: "5", label: "Independent government data sources per report" },
    { value: "10yr", label: "NEXRAD radar archive accessed per analysis" },
    { value: "7.2M", label: "Radar hail detections in our corroboration database" },
    { value: "0", label: "Proprietary black-box scores — every input is named" },
  ],
  quote:
    "The expert cannot merely assert that a black box produced the number. Under Daubert, the court must be able to evaluate the underlying methodology.",
  citation: "Kumho Tire Co. v. Carmichael, 526 U.S. 137 (1999)",
} as const;

export const SWI_SOURCES = {
  title: "Every source, named and public.",
  intro:
    "SWI reports include a full data provenance section listing each source by name, access method, and retrieval date. Any opposing expert can independently verify the inputs.",
  items: [
    {
      name: "NOAA Storm Events DB",
      description:
        "National Weather Service verified ground-truth records of all severe weather events, including hail diameter, location, and time. Publicly downloadable at ncdc.noaa.gov.",
    },
    {
      name: "NOAA SWDI / NEXRAD HDA",
      description:
        "Level-3 Hail Detection Algorithm output from the WSR-88D NEXRAD network, accessed via NOAA's Severe Weather Data Inventory REST API.",
    },
    {
      name: "ASOS / Visual Crossing",
      description:
        "Hourly surface observations from FAA/NOAA Automated Surface Observing Stations, retrieved via Visual Crossing's historical weather API with timestamped station IDs.",
    },
    {
      name: "IEM LSR Archive",
      description:
        "Iowa Environmental Mesonet Local Storm Reports — timestamped ground-truth observations submitted by NWS-trained spotters and emergency managers, providing human-verified corroboration of storm events at the surface level.",
    },
    {
      name: "NOAA SPC MCD",
      description:
        "Storm Prediction Center Mesoscale Discussions — government-issued severe weather assessments retrieved for the date of loss and linked directly in each report.",
    },
  ],
} as const;

export const SWI_CTA = {
  id: "get-started",
  eyebrow: "Get Started",
  titleLine1: "Request a forensic",
  titleLine2: "weather report.",
  subtitle:
    "SWI reports are produced by Trinity Engineering as a professional service — not a downloadable app. Contact us with a property address and date of loss, and we'll deliver a defensible, citation-backed forensic weather analysis.",
  cta: { label: "Contact Trinity Engineering", href: "/contact" },
} as const;
