/** Education page copy — aligned to Figma Education tab */

export {
  CLAIMS_CONTENT_WIDTH as EDUCATION_CONTENT_WIDTH,
  CLAIMS_SECTION_SHELL as EDUCATION_SECTION_SHELL,
} from "../claims/claimsContent";

export const EDUCATION_HERO = {
  logoImage: "/education/education-logo.png",
  title: "The education the industry needs",
  subtitle: "Sign up for one of our advanced training classes on a forensic engineering topic that suits the needs of you and your team! Join us in-person or via online webinar",
  heroImage: "/education/hero-bg.jpg",
} as const;

export const EDUCATION_COURSES = [
  {
    number: "1",
    title: "Advanced Property Claims Training",
    description: "Many new, and even some experienced adjusters have only received the training their company provides on their role. Let our team of experts educate your team on the whole claims picture: the parties involved and their interests, the processes around each moving part within the claims process, and learn damage identification tips from the industry’s leading experts. Our training staff has 60+ years of combined experience in the insurance restoration industry. Contact us to learn more about Claims Process training, and we’d be happy to teach our structured course, or tailor a Claims Process course specifically to meet the training needs of your staff.",
    imageSrc: "/education/classroom-training.jpg",
    imageAlt: "Advanced Property Claims Training in classroom session",
  },
  {
    number: "2",
    title: "Infrared Thermography Training",
    instructor: "Matthew Brodeur",
    description: "Thermography is often critical to a claim inspection — and just as often misused. Qualitative thermography lives or dies on image interpretation, and reading a radiometric image correctly takes real training, not just a camera. This course is instructed by Matthew Brodeur, a certified Level III thermographer and head of Trinity's in-house thermography program structured in accordance with SNT-TC-1A. He teaches teams how to properly capture and interpret radiometric imagery for residential and commercial property inspections — so thermography sharpens the inspection rather than clouding it.",
    imageSrc: "/education/infrared-training.png",
    imageAlt: "Infrared Thermography Training with thermal imaging analysis",
  },
  {
    number: "3",
    title: "Drone Technology",
    instructor: "Scott Beaudry",
    description: "Drones are a powerful inspection tool and a poor inspection replacement. Too many operators use them to substitute for physically getting on a roof; Trinity's position is that you master the inspection first, then let technology assist. Instructed by Scott Beaudry and Matthew Brodeur — both FAA Part 107 certified UAS pilots — this course covers proper drone use in claims inspections: flight operation, which imagery actually serves an inspection, and how your team can earn their own FAA Part 107 certification.",
    imageSrc: "/education/drone-training.jpg",
    imageAlt: "Drone Technology claims inspection training course",
  },
  {
    number: "4",
    title: "Interpreting Weather Data",
    instructor: "Matthew Brodeur",
    description: "Instructed by Matthew Brodeur, this course covers SWI™, Trinity's proprietary storm-data analysis software. Teams learn each of SWI's core components — where each data source is derived from, what every data point means, and why it matters to a claim — alongside general weather-software instruction and foundational meteorological training. The goal is to make your team fluent in the data behind a storm claim, not just the output.",
    imageSrc: "/education/swi-logo.png",
    imageAlt: "Interpreting Weather Data with SWI storm-data analysis software",
  },
  {
    number: "5",
    title: "Construction Materials and Methods",
    instructor: "Cody Williams",
    description: "An introduction to how buildings are actually put together — the materials and methods behind residential and commercial construction — and why that knowledge is foundational to sound claims handling. The course also maps the various parties' roles and responsibilities and frames how construction knowledge fits into the claims process. Instructed by Joseph Tamilio and Cody Williams.",
    imageSrc: "/education/materials-methods.jpg",
    imageAlt: "Construction Materials and Methods site inspection training",
  },
  {
    number: "6",
    title: "Wind & Hail: Genuine Damage vs Fraud",
    instructor: "Cody Williams",
    description: "Not all roof damage is what it appears to be. This course trains teams to distinguish genuine wind and hail damage from intentional mechanical damage — fraud. The focus is primarily asphalt shingle roofs, where the distinction is most consequential, though the principles extend to other roofing types. Instructed by Cody Williams and/or Scott Beaudry.",
    imageSrc: "/education/wind-hail.png",
    imageAlt: "Wind and Hail genuine damage vs mechanical fraud training course",
  },
] as const;

export const EDUCATION_QUOTE = {
  text: "If you can't explain it simply, you don't understand it well enough",
  author: "Richard Feynman",
  description: "Our expert training staff has a gift for breaking down even the most complex concepts into something approachable — making them not just easy to learn, but genuinely enjoyable. True mastery of a subject shows in the ability to teach it, and our team has earned both the art and the hands-on experience of the insurance restoration industry through years of real-world claims work. Let us share that expertise with your team. Email us today at claims@trinitypllc.com for any training-related questions, and let's build a session around what your team needs most.",
  cta: { label: "Submit Inspection", href: "/submit-inspection" },
} as const;
