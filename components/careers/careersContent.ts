/** Careers page copy — aligned to Figma Careers tab */

export {
  CLAIMS_CONTENT_WIDTH as CAREERS_CONTENT_WIDTH,
  CLAIMS_SECTION_SHELL as CAREERS_SECTION_SHELL,
} from "../claims/claimsContent";

export const CAREERS_HERO = {
  eyebrow: "Veritatis et quasi architecto beatae",
  titleLine1: "Lorem ipsum dolor",
  titleLine2: "sit amet",
  description:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  secondaryCta: { label: "Submit Inspection", href: "/submit-inspection" },
} as const;

export const CAREERS_INTRO = {
  title:
    "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et",
  imageSrc: "/careers-intro.png",
  imageAlt: "Engineers reviewing blueprints on a construction site",
  footerLink: { label: "Excepteur sint occaecat", href: "#careers-grid" },
  blocks: [
    {
      heading: "DOLORE MAGNA ALIQUA. UT",
      paragraphs: [
        "enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ],
      bullets: [],
    },
    {
      heading: "SED UT PERSPICIATIS UNDE",
      paragraphs: [
        "omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,",
      ],
      bullets: [
        "sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,",
        "sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam",
      ],
    },
    {
      heading: "ALIQUAM QUAERAT VOLUPTATEM.",
      paragraphs: [
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
      ],
      bullets: [
        "Quis autem vel eum iure reprehenderit qui in ea voluptate",
        "velit esse quam nihil molestiae consequatur, vel illum qui dolorem",
        'eum fugiat quo voluptas nulla pariatur?"',
      ],
    },
    {
      heading: "UNSURPASSED COST CERTAINTY & FLEXIBILITY",
      paragraphs: [
        "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud",
      ],
      bullets: [
        "exercitation ullamco laboris nisi ut aliquip ex ea commoda consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      ],
    },
  ],
} as const;

export const CAREERS_ACHIEVEMENTS = {
  eyebrow: "TRINITY BY THE NUMBERS",
  items: [
    {
      rank: "#1",
      text: "Fortified design solution provider in the US",
      imageSrc: "/careers-achievement-1.png",
      imageAlt: "#1 Fortified design solution provider in the US",
      stars: 3,
    },
    {
      rank: "#5",
      text: "officia deserunt mollit anim id est laborum.",
      imageSrc: "/careers-achievement-5.png",
      imageAlt: "#5 officia deserunt mollit anim id est laborum.",
      stars: 3,
    },
  ],
} as const;

export const CAREERS_BRAND = {
  logoSrc: "/careers-brand-seal.png",
  logoAlt: "Trinity Engineering seal",
  title:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
  subtitle: "totam rem aperiam, eaque",
} as const;

export const CAREERS_GRID = {
  id: "careers-grid",
  eyebrow: "IPSA QUAE AB ILLO INVENTORE",
  cards: [
    {
      title: "Lorem ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi",
      imageSrc: "/careers-grid-roof.png",
      imageAlt: "Storm damaged residential roof",
    },
    {
      title: "Lorem ipsum",
      description:
        "ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      imageSrc: "/careers-grid-roof.png",
      imageAlt: "Storm damaged residential roof",
    },
    {
      title: "Lorem ipsum",
      description:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      imageSrc: "/careers-grid-roof.png",
      imageAlt: "Storm damaged residential roof",
    },
    {
      title: "Lorem ipsum",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,",
      imageSrc: "/careers-grid-roof.png",
      imageAlt: "Storm damaged residential roof",
    },
    {
      title: "Lorem ipsum",
      description:
        "eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      imageSrc: "/careers-grid-roof.png",
      imageAlt: "Storm damaged residential roof",
    },
    {
      title: "Lorem ipsum",
      description:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla",
      imageSrc: "/careers-grid-roof.png",
      imageAlt: "Storm damaged residential roof",
    },
  ],
} as const;
