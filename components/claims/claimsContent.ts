/** Claims page copy — aligned to Figma Claims tab */

/** Shared horizontal layout — same left/right inset for all Claims sections */
export const CLAIMS_SECTION_SHELL =
  "mx-auto w-full max-w-[1440px] min-w-0 px-4 sm:px-6 md:px-8 lg:px-8";

export const CLAIMS_CONTENT_WIDTH = "mx-auto w-full max-w-5xl";

export const CLAIMS_HERO = {
  titleLine1: "Forensic Engineering",
  titleLine2: "For Property Claims",
  subtitle:
    "Independent, defensible engineering determinations for the insurance restoration industry. Every inspection is performed by a licensed professional engineer and peer reviewed before we send you the inspection report. Our reports are built on evidence-based findings and transparent methodology. We deliver the highest level of quality and professionalism combined with the fastest turnaround in the industry.",
  primaryCta: { label: "Learn More", href: "#steep-and-high-reports" },
  secondaryCta: { label: "Submit Inspection", href: "/submit-inspection" },
} as const;

export const CLAIMS_STEEP_SECTION = {
  title: "Steep And High Experts",
  introBoldPhrase: "no exceptions",
  intro:
    "We access every roof we are assigned to inspect, no exceptions. Safety is our top priority, so our team is expertly trained in accessing steep and high roofs with no compromise in quality or safety. In the rare event that any portion of a roof is truly inaccessible, we utilize drone technology to fill the hands-on documentation gaps.",
  rows: [
    {
      id: "roof-access",
      eyebrow: "Roof access on every job",
      title: "Steep and High Roofs accessed directly",
      paragraphs: [
        "Many industry professionals have gone the way of substituting a hands-on inspection with a drone flyover. We are committed to leveraging technology as a supplement to direct inspection — never a replacement for it. Repairability, fastener condition, test-square sampling, and many other aspects of a proper inspection simply cannot be evaluated from the air, so our team physically accesses the roof on every assignment. The findings in your report come from direct, hands-on observation — not from interpreting a photo.",
      ],
      imageSrc: "/claims-steep-high.png",
      imageAlt: "Steep and high roof inspection with aerial lift at residential property",
      imageLeft: true,
    },
    {
      id: "drone-heights",
      eyebrow: "Drones for hard-to-reach places",
      title: "Inaccessible roof facets documented thoroughly",
      paragraphs: [
        "Our certified FAA Part 107 unmanned aircraft pilots thoroughly document any portion of a roof that genuinely cannot be reached by hand. High-resolution aerial imagery closes the documentation gap rather than leaving it to assumption, so every facet of the roof is accounted for and nothing goes unexamined.",
      ],
      imageSrc: "/claims-inaccessible.png",
      imageAlt: "Drone documenting church steeple and inaccessible roof facets",
      imageLeft: false,
    },
  ],
} as const;

export const CLAIMS_PROCESS = {
  title: "Five Steps To Completing An Inspection Request",
  intro:
    "Our expert staff completes every request from start to finish with the highest levels of quality and efficiency",
  steps: [
    {
      number: "1",
      eyebrow: "trinitypllc.com",
      title: "Submit an Inspection through our online portal",
      description:
        "The gold standard in forensic evidence: on-site, PE-verified empirical data collected across thousands of inspections by Trinity's qualified forensic engineers. Hail dents and spatter, collateral wind and hail damage, and impact damage to roofing materials — all documented in person, at the property. Radar can be inconsistent, and some counties have coverage gaps where no trained spotters are nearby; ground-truth field data fills those gaps. This proprietary layer is the defensibility core of Severe Weather Intelligence™.",
      tags: ["5K+ records", "2021 – present", "PE-Verified", "Empirical data"],
    },
    {
      number: "2",
      eyebrow: "Expert scheduling staff",
      title: "We will schedule the inspection directly, first contact within 24 hours",
      description:
        "A 10-year NEXRAD Level-3 Hail Detection Algorithm dataset — over 7.2 million radar-derived hail detections across the contiguous U.S. — pulled directly from NOAA's Severe Weather Data Inventory. When a storm event is recorded on the ground, we cross-reference it against what 159 WSR-88D radar sites actually detected in the same grid cell at the same time.",
      tags: ["7.2M radar detections", "NEXRAD WSR-88D network", "CONUS coverage", "NOAA SWDI sourced"],
    },
    {
      number: "3",
      eyebrow: "No rubber stamps - PE's perform inspections directly",
      title: "Licensed Professional Engineer will perform an on-site inspection",
      description:
        "Wind speed, temperature, and atmospheric conditions at the property are estimated using Inverse Distance Weighting interpolation across nearby Automated Surface Observing System stations — real physical instruments, not modeled data. IDW assigns weighted influence to each surrounding station based on distance, producing a defensible site-specific estimate with a documented confidence metric.",
      tags: ["Real ASOS instruments", "IDW interpolation", "Haversine distance", "Confidence-scored"],
    },
    {
      number: "4",
      eyebrow: "20+K Inspection experience on every single job",
      title: "Once each report is written, it is subjected to peer review - our expert team collaborates on every job",
      description:
        "SPC Mesoscale Discussions are issued by NOAA's Storm Prediction Center when atmospheric conditions are evolving toward organized severe weather. Each SWI report retrieves and links any MCDs active on the date of loss — providing a fifth, independent government-issued confirmation that severe weather conditions were present at the regional scale.",
      tags: ["SPC MCD archive", "Date-of-loss lookup", "NOAA issued", "Publicly verifiable"],
    },
    {
      number: "5",
      eyebrow: "Fastest turnaround in the industry",
      title: "Your report is emailed to you and any specified recipients",
      description:
        "The gold standard in forensic evidence: on-site, PE-verified empirical data collected across thousands of inspections by Trinity's qualified forensic engineers. Hail dents and spatter, collateral wind and hail damage, and impact damage to roofing materials - all documented in person, at the property. Radar can be inconsistent, and some counties have coverage gaps where no trained spotters are nearby; ground-truth field data fills those gaps. This proprietary layer is the defensibility core of Severe Weather Intelligence™.",
      tags: ["5k+ Records", "2021-Present", "PE-Verified", "Empirical Data"],
    },
  ],
} as const;

export const CLAIMS_STATS = {
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

export const CLAIMS_SOURCES = {
  title: "Every source, named and public.",
  intro:
    "SWI reports include a full data provenance section listing each source by name, access method, and retrieval date. Any opposing expert can independently verify the inputs.",
  items: [
    {
      name: "NOAA Storm Events DB",
      description:
        "National Weather Service verified ground-truth records of all severe weather events, including hail diameter, location, and time. Publicly downloadable at ncdc.noaa.gov.",
      status: "Active",
    },
    {
      name: "NOAA SWDI / NEXRAD HDA",
      description:
        "Level-3 Hail Detection Algorithm output from the WSR-88D NEXRAD network, accessed via NOAA's Severe Weather Data Inventory REST API.",
      status: "Active",
    },
    {
      name: "ASOS / Visual Crossing",
      description:
        "Hourly surface observations from FAA/NOAA Automated Surface Observing Stations, retrieved via Visual Crossing's historical weather API with timestamped station IDs.",
      status: "Active",
    },
    {
      name: "IEM LSR Archive",
      description:
        "Iowa Environmental Mesonet Local Storm Reports — timestamped ground-truth observations submitted by NWS-trained spotters and emergency managers, providing human-verified corroboration of storm events at the surface level.",
      status: "Active",
    },
    {
      name: "NOAA SPC MCD",
      description:
        "Storm Prediction Center Mesoscale Discussions — government-issued severe weather assessments retrieved for the date of loss and linked directly in each report.",
      status: "Active",
    },
  ],
} as const;

export const CLAIMS_CTA = {
  eyebrow: "Get Started",
  titleLine1: "Request a forensic",
  titleLine2: "weather report.",
  subtitle:
    "SWI reports are produced by Trinity Engineering as a professional service — not a downloadable app. Contact us with a property address and date of loss, and we'll deliver a defensible, citation-backed forensic weather analysis.",
  cta: { label: "Contact Trinity Engineering", href: "/contact" },
} as const;
