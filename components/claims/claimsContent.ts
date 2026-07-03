/** Claims page copy — aligned to Figma Claims tab */

/** Shared horizontal layout — same left/right inset for all Claims sections */
export const CLAIMS_SECTION_SHELL =
  "mx-auto w-full max-w-[1440px] min-w-0 px-4 sm:px-6 md:px-8 lg:px-8";

export const CLAIMS_CONTENT_WIDTH = "mx-auto w-full max-w-5xl min-w-0";

export const CLAIMS_HERO = {
  eyebrow: "THE TRUSTED, INDEPENDENT, UNBIASED THIRD-PARTY EXPERTS",
  title: "Forensic Inspections",
  subtitle:
    "Storm damage, structural, water loss, large or complex loss, small fire, component, and other claim types",
  cta: { label: "Submit Inspection", href: "/submit-inspection" },
} as const;

export const CLAIMS_STEEP_SECTION = {
  title: "Complete Inspections & Expert Witness\nClaims Support Service",
  introBoldPhrase: "",
  intro: "",
  imageSrc: "/claims-steep-high.png",
  imageAlt: "Steep and high roof inspection with aerial lift at residential property",
  blocks: [
    {
      title: "PHYSICAL CHARACTERISTICS",
      paragraphs: [
        "A forensic engineer’s primary job is to document the physical characteristics observed, and state what sources or mechanisms are consistent with those observations.",
        "We provide advanced training to identify the physical characteristics that are consistent with natural, accidental, and even intentional damages. Every report will provide photos of the physical characteristics and discussion of what could have caused the observations: whether hail, wind, fire, or manipulation."
      ]
    },
    {
      title: "Fastest Industry Turnaround Uncompromising quality",
      paragraphs: [
        "Our advanced training, standardized inspection and documentation process, and proprietary report generation systems, along with our scheduling and route optimization systems, enable us to schedule inspections and turnaround more thorough reports and documentation faster than ever."
      ]
    },
    {
      title: "DIRECT ACCESS - NO LADDER ASSISTS",
      paragraphs: [
        "Our engineers are trained to safely access even the most challenging roofs. We have the tools and training to completely document every facet and component of the structure."
      ]
    },
    {
      title: "DRONES SUPPLEMENT - NEVER REPLACE direct Access",
      paragraphs: [
        "Many professionals substitute directly inspecting the roof with only a drone flyover. We leverage technology only as a supplement with direct inspection — never a replacement. Inaccessible areas such as steeples or bell-towers are examples of drone needs, and all other accessible portions would still be inspected with direct access of the engineer.",
        "Repairability, fastener condition, test-square sampling, and many other aspects of a proper inspection cannot be evaluated by drone."
      ]
    },
    {
      title: "interior leaks and sources",
      paragraphs: [
        "We pride ourselves on finding the exact sources of interior leaks. Photos of the leak entry point or other source, along with the indicators of duration or recency, and the full extents and any other information relevant to an interior damage claim is provided. Our goal is to provide you the information to correctly adjust any claim."
      ]
    },
    {
      title: "ADVANCED INFRARED ANALYSIS",
      paragraphs: [
        "We perform infrared thermographic analysis for every interior leak assessment and water loss evaluation. Our engineers are certified thermographers and will thoroughly document and explain the interpretations of the thermal imaging. We provide real answers, substantiated with moisture readings and in depth inspection, to pin-point leak sources and extents, even across multiple stories."
      ]
    },
    {
      title: "COMPLETE ASSESSMENT",
      paragraphs: [
        "Every square foot of the structure envelope and roof is inspected and documented. Ground level items are thoroughly photographed and itemization of all damages are included on every inspection.",
        "Wind, hail, unintentional mechanical damage or vandalism damages are documented to every component and the entire roof.",
        "We provide test square photos only as an example of the full roof inspection performed. We never limit our inspection solely to the test square area."
      ]
    },
    {
      title: "TOTAL CONFIDENCE & TOTAL TRANSPARENCY",
      paragraphs: [
        "We will never discuss findings with a secondary party before presenting them to our client. We are also 100% committed to total transparency.",
        "With client permission, any good faith question from another party will be answered completely and clearly, with references and substantiation. We strive to answer every question you or your clients will have before they are even asked. Follow-up questions give you or your clients the opportunity to clarify any loss, or make a coverage determination, so we will always prioritize the questions you have on any report."
      ]
    },
    {
      title: "START TO FINISH CLAIMS SUPPORT",
      paragraphs: [
        "From initial consult, to inspection and reporting, follow-up questions, and even litigation, our engineers will provide the professionalism, accuracy, and impartiality needed to support all claims services requests.",
        "It is never our place to make a coverage decision or to force a claim decision one way or another. Our goal is always to provide the information you need to make the right call, every time."
      ]
    }
  ]
} as const;

export const CLAIMS_DATE_OF_LOSS_SECTION = {
  title: "Date Of Loss Identification - Effective Policy Dates Questions",
  images: [
    { src: "/claims-nexrad-map.png", alt: "NEXRAD Recent Hail History Map" },
    { src: "/claims-dol-analysis.png", alt: "Date of Loss Analysis Data" }
  ],
  blocks: [
    {
      title: "reported date of loss vs actual",
      paragraphs: [
        "Many storms are clearly identified events. But many times, the reported date of loss does not align with the observed physical characteristics.",
        "Our team is trained in identifying the key empirical and research-backed evidence that can bracket potential dates of loss.",
        "We have gone even further by bringing all historical storm data in-house. More importantly, we have spent the last 6 years documenting on-site physical characteristics to corroborate actual storm events, including spatter and dent sizes throughout the eastern US. No other engineering firm provides this.",
        "Our Severe Weather Intelligence reporting pairs our on-site PE-verified measurements with every government-sourced ground truth data and the most advanced radar technology."
      ]
    },
    {
      title: "NAMED STORM eventS",
      paragraphs: [
        "Often, the question is raised whether damages are consistent with a specific named storm or other significant event such as a hurricane, tornado, or micro-burst. Even with these well documented storm swaths and wind speeds or destruction levels, the exact damages attributable to those storms are often complex.",
        "We compare on-site observations with known event data to determine what damages are consistent with that event, and which must have occurred prior to or afterward."
      ]
    }
  ]
} as const;

export const CLAIMS_STRUCTURAL_SECTION = {
  title: "Complete Structural Engineering Support",
  tags: [
    "Tree-Fall",
    "Vehicle Impact",
    "Fire Damage",
    "Explosion",
    "Basement Collapse",
    "Settlement/Subsidence",
    "Roof Collapse",
    "Wall Failure"
  ],
  imageSrc: "/claims-structural.jpg",
  imageAlt: "Structural damage showing collapsed block wall with soil intrusion",
  blocks: [
    {
      title: "Full Structural Suite",
      paragraphs: [
        "Our structural design and construction experts available, with extensive experience throughout every structure type we inspect. Regardless of the source of structural damages, we can provide a scope of loss, document whether Code-specific substantial damage has occurred, what level of repairs or modification is necessary, and we can provide designs for estimation or even full design of repairs.",
        "Our geotechnical expertise also enables us to evaluate and differentiate subsidence, settlement, heave and other soil-related damage sources."
      ]
    },
    {
      title: "Expedited inspections — accelerated report turnaround",
      paragraphs: [
        "Time is of the essence for structural answers after a significant loss. For you or your clients' home or business, every day matters. Down-time for a factory, service company, or your home impacts every aspect of recovery. We can expedite our time to inspect and prioritize your report's completion to get you the answers you need to finalize your claim and move forward with repairs.",
        "We understand the duty to mitigate losses can impact the ease of inspections. To ensure we can see every part of the structure, we coordinate with any contractor and property owners or managers to accommodate access at every stage."
      ]
    },
    {
      title: "Ask us about performing a TRI™ evaluation",
      paragraphs: [
        "For more information about having a certified TRI™ Evaluator perform a repairability assessment at a subject property, email us at claims@trinitypllc.com or simply submit a request through our online portal and see what a difference a standardized protocol can make. Don't oversimplify, and don't over-complicate, let us use the Trinity Repairability Index™ at one of your jobs, and our report will change the way you think about repairability."
      ]
    }
  ]
} as const;


export const CLAIMS_REPAIRABILITY_SECTION = {
  title: '"Is this roof repairable?" We have the right answer',
  imageSrc: "/repairability-main.png",
  imageAlt: "Trinity Repairability Index scorecard and calculator",
  blocks: [
    {
      title: "The Problem — the neutral unbiased answer",
      paragraphs: [
        "Trinity's TRI™ Method is the first unbiased, standardized solution to the repairability question that has plagued our industry for years. Our goal is to move the industry away from addressing repairability as a binary Pass/Fail decision and address the complexity of roof repair in an organized, repeatable way.",
        "While this industry has standardized processes for many aspects of storm damage claims, no other method solves the problem of determining roofing system repairability fairly.",
        "The TRI™ Method breaks down the complexity of a roofing system repair by analyzing and scoring 4 primary components:"
      ],
      listItems: [
        "Roof Age",
        "Granule Retention / Shingle Condition",
        "Lift Test / Pliability",
        "Mat Transfer / Separability"
      ]
    },
    {
      title: "roof repairs are difficult — Not Impossible",
      paragraphs: [
        "The complexity of a proper roof repair is often oversimplified by insurance carriers.",
        "Policyholder representatives respond by over-complicating. The reality is, roof repairs are difficult, but not usually impossible."
      ]
    },
    {
      title: "Ask us about performing a TRI™ evaluation",
      paragraphs: [
        "For more information about having a certified TRI™ Evaluator perform a repairability assessment at a subject property, email us at claims@trinitypllc.com or simply submit a request through our online portal and see what a difference a standardized protocol can make. Don't oversimplify, and don't over-complicate, let us use the Trinity Repairability Index™ at one of your jobs, and our report will change the way you think about repairability."
      ]
    }
  ]
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
  titleLine2: "Engineering Inspection.",
  subtitle: "Submit an inspection request and experience forensic engineering done right. We provide the most detailed analysis for every roof, every component, every claim—which is exactly why we're the name the industry relies on.",
  cta: { label: "Submit Inspection", href: "/submit-inspection" },
} as const;
