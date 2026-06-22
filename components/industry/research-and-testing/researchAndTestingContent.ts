/** Research and Testing industry page content and structure */

export {
  HOME_CONTENT_CLASS as RT_SECTION_SHELL,
  HOME_TEXT_WIDTH as RT_CONTENT_WIDTH,
} from "@/components/home/HomeContent";

export const RT_HERO = {
  heroImage: "/industry/research-hero.jpg",
  logoSrc: "/logo-transparent.png",
  logoAlt: "Trinity Engineering",
  title: "Research And Testing",
  subtitle: "Finding The Right Answers Starts With Asking The Right Questions.",
} as const;

export const RT_SECTION_1 = {
  id: "forensic-testing",
  eyebrow: "Research and Controlled Testing in Forensic Engineering",
  title: "Why Should a Forensic Firm Run Its Own Tests?",
  paragraphs: [
    "Most forensic conclusions in the insurance restoration industry rest on field observation — what an inspector finds on a specific roof, on a specific day, after a specific event. That observation is essential, but it is only as reliable as the reference framework behind it.",
    "How do you know what a genuine hail impact looks like on a particular shingle type? How do you distinguish manufacturing variation from storm damage, or functional damage from cosmetic marring? How do you know whether a repair is actually feasible without disturbing the surrounding roof? You know because someone tested it under controlled conditions.",
    "At Trinity, research and testing is not a marketing add-on — it is the foundation that makes our field determinations defensible. Field inspection tells us what happened on a given roof. Controlled testing tells us what should happen, what can happen, and what the physical evidence actually means. The two reinforce each other, and the second is what separates an opinion from a conclusion."
  ],
  imageSrc: "/industry/hail-cannon-stand.png",
  imageAlt: "Trinity Ice-Projectile Cannon (TIPC v1.0) test setup with shingle board target",
} as const;

export const RT_SECTION_2 = {
  id: "impact-testing",
  sectionTitle: "Controlled Impact Testing",
  blocks: [
    {
      eyebrow: "industry-leading experience",
      paragraphs: [
        "One of the central challenges in forensic roof evaluation is distinguishing real hail impact from the many conditions that mimic it — mechanical marring, foot traffic, manufacturing blisters, and ordinary weathering. The only way to build a reliable reference for that distinction is to create known impacts under controlled conditions and document exactly what they produce."
      ]
    },
    {
      title: "trinity ice-projectile cannon (TIPC v1.0)",
      paragraphs: [
        "Trinity uses a pneumatic impact apparatus — a hail cannon — to do precisely this. The cannon propels ice spheres (or calibrated projectiles) of known diameter at controlled, repeatable kinetic energy levels, simulating hailstones across the range of sizes encountered in real storms. Because diameter and velocity are both controlled, each impact represents a known energy at the moment of contact, and the resulting damage can be correlated directly to that energy."
      ]
    },
    {
      eyebrow: "practice what you preach",
      paragraphs: [
        "This produces something field observation alone never can: a documented relationship between a specific impact energy and the specific signature it leaves on a specific roofing material. When an inspector later examines a shingle in the field, that controlled reference is what allows a confident reading of whether an impact is consistent with hail, what size of hail it implies, and whether the damage is functional or cosmetic. Controlled testing turns \"this looks like hail\" into \"this is consistent with a documented impact of this magnitude on this material.\""
      ]
    }
  ],
  imageSrc: "/industry/hail-cannon.jpg",
  imageAlt: "Calibrated ice sphere impact locations marked with chalk on a composition shingle test panel",
} as const;

export const RT_SECTION_3 = {
  id: "desaturation-testing",
  sectionTitle: "Desaturation Testing of Asphalt Composition Shingles",
  blocks: [
    {
      title: "shingles are made in layers",
      paragraphs: [
        "Asphalt composition shingles are not a single material — they are a layered composite of a reinforcing fiberglass mat, an asphalt binder saturating and coating that mat, and a surface of mineral granules. In a forensic evaluation, the question that often carries significance is whether a suspected impact actually compromised the shingle's structure — that is, whether it caused a catastrophic failure — or whether it only affected the surface, indicating potential damage that is not catastrophic. The fiberglass mat is the reinforcing layer that governs the shingle's integrity, and a true hail impact of sufficient energy will fracture it. The problem is that the mat is buried inside the asphalt, where it cannot be examined directly."
      ]
    },
    {
      eyebrow: "looking inside",
      paragraphs: [
        "Desaturation testing solves that. It is a laboratory procedure in which a shingle sample is treated to dissolve away the asphalt binder, leaving only the bare fiberglass mat behind. With the asphalt removed, the mat can be inspected closely and directly for fracturing. A fractured mat is the definitive signature of functional damage — it means the impact broke the shingle's reinforcing layer at the time of the storm. An intact mat, by contrast, indicates that whatever marked the surface did not actually compromise the shingle's integrity."
      ]
    },
    {
      eyebrow: "why does mat fracture matter?",
      paragraphs: [
        "This is one of the clearest distinctions a forensic evaluation can draw, and it is frequently at the center of a claim. Surface bruising, granule displacement, and cosmetic marring can all resemble impact damage from above, but only a mat fracture establishes that functional loss occurred at the moment of the event. By desaturating a sample and examining the mat itself, Trinity can determine — directly, rather than inferentially — whether a storm produced genuine functional damage or only surface effects. That is the difference between a determination grounded in physical evidence and one based on surface appearance alone."
      ]
    }
  ],
  imageSrc: "/industry/fiberglass-mat.jpg",
  imageAlt: "Dissolved shingle mat sample under light table showing fiberglass structure and fractured strands",
} as const;

export const RT_SECTION_4 = {
  id: "repairability-evaluation",
  sectionTitle: "Repairability Evaluation and Repair Research: The TRI Method",
  blocks: [
    {
      eyebrow: "the problem",
      paragraphs: [
        "A recurring and consequential question in restoration is deceptively simple: can the damage I'm looking at be repaired, or must the damaged component or system be replaced? The answer is not a matter of preference — it is a matter of physical fact, and getting it right requires a standardized methodology rather than the subjectivity that comes with individual opinions and assumptions."
      ]
    },
    {
      eyebrow: "The TRI Method solution",
      paragraphs: [
        "Trinity has developed a methodology known as TRI, Trinity Repairability Index, to solve the issue of repairability by accounting for the complexity of repairing a roofing system, which is always addressed through TRI as an interconnected system rather than an assortment of individual components. Trinity conducts hands-on repairability research to determine, not whether a roof is or isn't repairable, but how repairable a roofing system is, if at all. The TRI method establishes a scoring system for the most important considerations on a roof when attempting to repair it: Age, Condition, Pliability, and Separability. Once these conditions are evaluated and scored by a certified TRI Evaluator, a report is written to detail our findings and provide a score for the roof, and for certain levels of service, a repair prescription for the roof in question. We know how complex a roof repair can get and we want to account for that in a standardized way, without over-complicating, but also without oversimplifying."
      ]
    }
  ],
  imageSrc: "/industry/repairability-calculator.png",
  imageAlt: "Trinity Repairability Calculator scorecard and roof condition assessment report",
} as const;

export const RT_SECTION_5 = {
  id: "the-trinity-way",
  sectionTitle: "The Trinity Way",
  blocks: [
    {
      eyebrow: "pushing forward",
      paragraphs: [
        "Beyond these core areas, Trinity's research extends across the range of questions forensic engineering in this industry actually has to answer: how different materials and assemblies respond to the forces they encounter, how construction methods affect performance and failure, and how to reliably distinguish event-related damage from pre-existing and age-related conditions. The common thread is methodology — controlled inputs, documented procedures, and repeatable results — because a conclusion is only as strong as the method that produced it."
      ]
    },
    {
      eyebrow: "belief in research",
      paragraphs: [
        "We invest in research and controlled testing because field inspection, however thorough, is strongest when it stands on a foundation of demonstrated, repeatable science. Knowing what a documented impact produces, how a material actually ages, and whether a repair is genuinely feasible is what allows our field determinations to be stated with confidence rather than hedged as opinion — and that rigor is a large part of why Trinity is among the most trusted providers in the insurance restoration industry."
      ]
    },
    {
      eyebrow: "excellence is in our dna",
      paragraphs: [
        "This is the same principle that runs through everything we do. The best tools and the best science exist to support the detailed, hands-on forensic evaluation our work has always been built on — never to replace it. Our testing program does not substitute for the engineer in the field; it sharpens that engineer's judgment and backs every determination with evidence. Better science, the same standard. The thoroughness behind the conclusion is exactly where it has always been — now with the controlled research to prove it."
      ]
    }
  ],
  imageSrc: "/training-main.png",
  imageAlt: "Trinity engineers performing mock roof installation and framing inspections in training facility",
} as const;

export const RT_SECTION_6 = {
  id: "proven-not-observed",
  title: "Proven, Not just observed",
  paragraphs: [
    "Most firms in this industry only ever observe and report. Trinity tests. We run controlled impact testing, desaturation analysis, and repairability research because knowing what the physical evidence actually means requires more than looking at it — it requires proving it. That commitment to demonstrated, repeatable science is what turns a field opinion into a defensible conclusion, and it is a large part of why Trinity is among the most trusted providers in the insurance restoration industry."
  ],
  email: "claims@trinitypllc.com",
  emailLead: "Email us today at",
  emailSuffix: "for case studies and other research and testing information",
} as const;
