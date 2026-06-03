/** Fortified page copy — aligned to Figma Fortified tab */

/** Layout matches Claims tab exactly */
export {
  CLAIMS_CONTENT_WIDTH as FORTIFIED_CONTENT_WIDTH,
  CLAIMS_SECTION_SHELL as FORTIFIED_SECTION_SHELL,
} from "../claims/claimsContent";

/** Same horizontal text inset as Claims steep / two-column rows */
export const FORTIFIED_TAB_TEXT_INSET_LEFT =
  "px-4 sm:px-6 md:px-8 lg:pl-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";

export const FORTIFIED_TAB_TWO_COL_TEXT_IMAGE_LEFT =
  "px-4 sm:px-6 md:px-8 lg:pl-10 lg:pr-8 xl:pl-12 xl:pr-10";

export const FORTIFIED_TAB_TWO_COL_TEXT_IMAGE_RIGHT =
  `${FORTIFIED_TAB_TEXT_INSET_LEFT} lg:pr-10 xl:pr-12`;

export const FORTIFIED_HERO = {
  heroImage: "/fortified-hero.png",
  heroImageObjectPosition: "center center",
  title: "FORTIFIED Roof™ Eligibility Solutions",
  subtitle:
    "Trinity Engineering specializes in resolving FORTIFIED Roof™ eligibility issues that block many homes from IBHS designation. We assess complex conditions and deliver targeted engineering design solutions to bring the property into compliance. As the leading provider of these specialized services, we help homeowners, roofers, and contractors achieve designations efficiently, to receive the benefits of the Fortified Roof™ program.",
  primaryCta: { label: "Grant Programs", href: "#fortified-steps" },
  secondaryCta: { label: "Non-Grant Programs", href: "/contact" },
  logoImage: "/fortified-logo.png",
} as const;

export const FORTIFIED_SOLUTIONS = {
  title: "Solutions For FORTIFIED Roof™ Eligibility Issues",
  subtitle:
    "These Situations Are Outside The Normal Installation Method Requirements And An Engineer Is Needed:",
  columnLeft: [
    "ROOF-TOP DECK POST CONNECTIONS",
    "WALKABLE FLAT ROOFS",
    "HANDRAILS THROUGH FLAT ROOFS",
    "ATYPICAL RAFTERS (TIMBERS)",
    "ISOLATE INELIGIBLE ROOF OR DECK",
  ],
  columnRight: [
    "ROOF-TOP DECK CLEARANCE",
    "RE-FRAMING INELIGIBLE ROOFS",
    "ROUND ROOFS",
    "ROOF-TOP EQUIPMENT",
    "KNEE-WALLS ON ROOF",
  ],
} as const;

export const FORTIFIED_STANDARD = {
  title: "Standard Solutions",
  paragraphs: [
    "We have worked closely with IBHS to develop a set of standardized solutions for these common eligibility issues.",
    "While every project is unique, we have created solutions that cover the range of issues we commonly encounter. For cases outside the ranges covered by these designs, we can provide custom answers.",
    "We also actively work to train contractors and evaluators to properly install and document these solutions. This enables your team to succeed.",
    "Contact us to see whether your contractor and evaluator are Trinity-Certified for your specific eligibility issue.",
  ],
  imageSrc: "/fortified-page-deck.png",
  imageAlt: "Engineer inspecting residential deck and roof framing",
} as const;

export const FORTIFIED_STRAIGHTFORWARD = {
  title: "Straight-Forward Answers Simple Solutions",
  paragraphs: [
    "There are times where the modifications required will be outside your desired budget. We will always be up front with you and coordinate with your contractor, so you can make the best decision for your property.",
    "When multiple solutions are possible, we will let you decide which you'd prefer.",
  ],
  bullets: ["Total Transparency", "Up-Front Pricing", "Neutral Third Party"],
  imageSrc: "/fortified-page-aerial.png",
  imageAlt: "Aerial view of a complex residential roof",
} as const;

export type FortifiedStepParagraph =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "italic"; text: string }
  | {
      kind: "link";
      before: string;
      linkLabel: string;
      linkHref: string;
      after: string;
    };

export const FORTIFIED_STEPS = {
  id: "fortified-steps",
  title: "The Steps To Resolving Any Eligibility Issue",
  intro:
    "We will walk you and your contractor through the following steps. Afterward, your roof can be replaced the same as any other roof.",
  steps: [
    {
      number: "1",
      eyebrow: "Site Inspection",
      heading: "Our Engineer Inspects the Roofing Components and Framing",
      paragraphs: [
        {
          kind: "text",
          text: "We will evaluate all of the following to ensure your roof can meet IBHS Home Standard and State Building Code Requirements.",
        },
      ],
      tags: [
        "Framing",
        "Sheathing",
        "Decks",
        "Roof-Mounted Equipment",
        "Atypical Rafters",
        "Walkable Flat Roofs",
        "Knee-walls",
      ],
    },
    {
      number: "2",
      eyebrow: "Eligibility & Recommendations Report",
      heading: "Your Contractor Will Provide an Estimate Using Our Initial Guidance",
      paragraphs: [
        {
          kind: "link",
          before:
            "Our report will include template details they can use to create an accurate price. You can then decide whether to move forward with those solutions. Verify on our website ",
          linkLabel: "here",
          linkHref: "/contact",
          after:
            " whether your contractor/roofer is already trained in your specific eligibility solution set.",
        },
        {
          kind: "text",
          text: "Some eligibility issues do not match our standard details. For these, we provide a custom solution for your particular roofing configuration.",
        },
        {
          kind: "bold",
          text: "For NCIUA Strengthen Your Roof Grant Program Applicants, all our services through this phase are covered by the Grant Program - you will not be responsible for any costs for our initial recommendations!",
        },
      ],
      tags: [
        "Initial Report",
        "Standard Details",
        "Custom Details",
        "Custom Verbiage",
        "Contractor Estimate",
      ],
    },
    {
      number: "3",
      eyebrow: "Day-of-Construction Remote Inspection",
      heading: "We Video-Conference With Your Contractor During Construction",
      paragraphs: [
        {
          kind: "text",
          text: "At each of the construction steps, your contractor will video-conference with us. We can also be available for immediate responses to solve unforeseen issues.",
        },
        {
          kind: "italic",
          text: "Your contractor will coordinate installation with us at least 2-business days in advance.",
        },
        {
          kind: "italic",
          text: "All installations require a day-of video conference. We cannot provide the ECF without confirming the installation.",
        },
      ],
      tags: [
        "Post Connections",
        "Framing Connections",
        "Sheathing Overlay & Nailers",
        "Handrail Retrofit",
        "Flat Roofing",
      ],
    },
    {
      number: "4",
      eyebrow: "Engineering Compliance Form (ECF)",
      heading: "We Send IBHS an ECF Confirming the Eligibility Issues are Resolved",
      paragraphs: [
        {
          kind: "text",
          text: "IBHS requires us to prepare a short report with the photos taken during the remote construction inspection.",
        },
        {
          kind: "text",
          text: "The remainder of your roof installation will proceed the same as any other FORTIFIED Roof™.",
        },
        {
          kind: "text",
          text: "IBHS is the final authority on all eligibility decisions; our guidance will incorporate their answers to your specific issues during step 1 but your roofer is responsible for all other FORTIFIED installation components.",
        },
        {
          kind: "text",
          text: "We cannot provide the ECF without 1) the remote day-of inspection and 2) the required photos of the installation.",
        },
      ],
      tags: [] as const,
    },
  ],
} as const;

export const FORTIFIED_EXPERIENCE = {
  titleLine1: "Experience you can rely on.",
  titleLine2: "answers when you need them.",
  eyebrow: "Forensic Defensibility",
  paragraphs: [
    "We keep you informed throughout the process. Every correspondence we will tell you the next steps, who is responsible, whether there is a fee, and the timeline for completion.",
    "You will never be charged a fee until you've been notified and agreed.",
    "For your contractor, we only ask for 2 days notice for scheduling the installation to ensure we can have an engineer available at the right times.",
  ],
  stats: [
    { value: "4", label: "States Served" },
    { value: "397", label: "Projects Completed" },
    { value: "5", label: "Years Experience" },
  ],
} as const;

export const FORTIFIED_CTA = {
  title: "Engineering designs don't have to be complicated or Expensive",
  body: "At Trinity Engineering, we specialize in quickly assessing IBHS FORTIFIED Roof™ eligibility issues and delivering clear engineering designs that resolve them. Our streamlined process makes it simple for homeowners, roofers, and contractors to achieve official FORTIFIED designation.",
  emailLead: "Email us with any questions:",
  email: "fortified@trinitypllc.com",
  backgroundImage: "/fortified-beach.png",
} as const;
