import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const servicesData: {
  [key: string]: {
    title: string;
    icon: string;
    tagline: string;
    description: string;
    features: string[];
    image: string;
  };
} = {
  "storm-damage": {
    title: "Storm Damage",
    icon: "cyclone",
    tagline: "Expert Hurricane & Wind Impact Analysis",
    description:
      "Our storm damage investigation team provides comprehensive forensic analysis of hurricane, wind, and hail damage to structures. Using advanced meteorological data and structural engineering principles, we deliver definitive assessments for insurance claims and litigation support.",
    features: [
      "Hurricane impact assessment and wind speed analysis",
      "Roof system failure investigation and uplift mechanics",
      "Hail damage identification and documentation",
      "Wind-driven rain intrusion analysis",
      "Building envelope breach forensics",
      "Post-storm structural integrity evaluation",
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDndLEphQFjS10Y5M0AgzaDi4oBYeLjOWH9EN4rZLc8rZ8gkVuczB_SChrw1jXDj8WICEz2cdfhR0HIK6GeJ4f1cGTRRKF55541KMV-m2cSZWPlsC3VHqDueGUR3vNMKxAJK2fLoqYGmYHFOM5vfCkFTbG3y85rqp-TxYDrDmi8UyYTMZJLQkeJN3XpHLfVLULA3MTZV8-b8dJpwpdR3LurDV7Ju47B8LJlIJUFW7jCJsx1ecIjXJQNw17sAG-qspTo9uL4z0uEocq7",
  },
  "water-loss": {
    title: "Water Loss",
    icon: "opacity",
    tagline: "Precision Water Intrusion Investigation",
    description:
      "High-precision forensic investigation of water loss events. Our experts utilize advanced moisture detection technology and plumbing system analysis to identify exact sources of water intrusion, leaks, and flood damage.",
    features: [
      "Plumbing system failure analysis",
      "Roof leak source identification",
      "Foundation water intrusion investigation",
      "HVAC condensation and drainage issues",
      "Moisture mapping and thermal imaging",
      "Mold causation determination",
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQSOk4WRhDd7Zhd8F3A8pAvZ0MkQAdUKAKSWWLVMvGNzQeATWn5eYirG3gbCtlJVuJ2pKNhszteSVPVJKpjtr7Qzf1glcoK_iNkikcA1oCD-d-av83HtKa_0LtOJ_G3X7thbvUWxPoTDv-S4ZfznWUinajr758Gq6yMouK0PyR_Dxy-sTgK5qj3WTyijEpofGcy22kd5SD1IlFOzWNOoS_1HO9Q_wYcDj2z5xXqp6Gdggi9Nfo3NHeu36862sE2qApObCse-hiIowJ",
  },
  structural: {
    title: "Structural Engineering",
    icon: "architecture",
    tagline: "Comprehensive Structural Failure Analysis",
    description:
      "Expert structural forensic engineering services for complex building failures. Our licensed structural engineers investigate foundation issues, collapse events, and load-bearing system failures with meticulous attention to detail.",
    features: [
      "Foundation settlement and differential movement",
      "Structural collapse investigation",
      "Load-bearing member failure analysis",
      "Concrete and masonry defect evaluation",
      "Seismic damage assessment",
      "Construction defect investigation",
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfyGfjCtL1uPhfEdnQGLJrJatZtnYibFKEUwrb2N5-hH9jl7nN7RygnqvIOENRMYawBre8sC4WcC5uzkhfZ0UoyJWaQ1_y6Pvx33e3k6QQDHUgjaSbhvP0JRAvA1XAc79JjW2jGliAlIg0Iav-BAEeC_ylWlwpLH24GogAHOlwfda7iykexjQ4K32GATRiekob-3BHR5z8vfhbo0QII3Ke7EXENp47Q-qYnL-ptAtqVr3EU1UNbseQhRmPa_abAWa7vCZHISwTDhUl",
  },
  fortified: {
    title: "Fortified Certification",
    icon: "shield",
    tagline: "Advanced Building Resilience Assessment",
    description:
      "FORTIFIED certification and resilience evaluation services. We assess structures against severe weather standards and provide recommendations for enhanced protection and insurance premium reductions.",
    features: [
      "FORTIFIED Home™ designation evaluation",
      "Hurricane resistance upgrades assessment",
      "Roof system reinforcement analysis",
      "Impact-resistant building envelope review",
      "Insurance premium reduction consulting",
      "Resilience certification documentation",
    ],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  },
  "chimney-collapse": {
    title: "Chimney Collapse",
    icon: "report_problem",
    tagline: "Masonry Failure Investigation",
    description:
      "Specialized investigation of chimney failures and masonry structural issues. Our experts analyze brick, stone, and concrete masonry systems to determine causes of collapse, cracking, and deterioration.",
    features: [
      "Masonry structural failure analysis",
      "Chimney collapse causation determination",
      "Mortar joint deterioration evaluation",
      "Foundation and footing assessment",
      "Lightning strike damage investigation",
      "Seismic and wind damage evaluation",
    ],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  },
  "large-loss": {
    title: "Large Loss",
    icon: "domain_disabled",
    tagline: "Catastrophic Property Damage Forensics",
    description:
      "Comprehensive forensic engineering for large-loss and catastrophic damage events. Our team coordinates multi-discipline investigations for complex commercial and industrial property losses.",
    features: [
      "Multi-structure damage assessment",
      "Commercial property loss evaluation",
      "Industrial facility failure investigation",
      "Business interruption causation analysis",
      "Coordinated multi-discipline teams",
      "Expert witness and litigation support",
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkf418FwUNopsb3yD0_D0zU-metnvMbn0Gbsl7Kg1BJ3TZmyCRjSsLIz5H6piWOGrypB1KrOm2CSpYe86c4GwQ0Z3BfMaevZwuSgHv8PzRquqWCUIVVJqpTXvTWbQj_VHSCtc1F4CYzOL5T4RTkYHwqu5vW88RDzLsuKFJaIKaqDNYYd3tKgQ1la7SdnbNwBuSswxW7k5GI8s3p38uMWazjEHwdkaaqUkR-y-58OTUti41CviApw-4kLYCKeSszzja5tGH3EA83V2G",
  },
  "component-failure": {
    title: "Component Failure",
    icon: "construction",
    tagline: "Building Component Defect Analysis",
    description:
      "Detailed forensic evaluation of building component failures and material defects. We investigate product failures, installation errors, and material performance issues across all building systems.",
    features: [
      "Building material defect analysis",
      "Component manufacturing defect investigation",
      "Installation error identification",
      "Material performance failure evaluation",
      "Product liability support",
      "Warranty claim investigation",
    ],
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
  },
  "hvac-electrical": {
    title: "HVAC & Electrical",
    icon: "electrical_services",
    tagline: "Mechanical & Electrical Systems Forensics",
    description:
      "Technical forensic analysis of HVAC and electrical system failures. Our engineers investigate equipment malfunctions, electrical fires, and mechanical system failures with precision diagnostics.",
    features: [
      "HVAC system failure analysis",
      "Electrical fire origin and cause determination",
      "Equipment malfunction investigation",
      "Control system failure evaluation",
      "Energy efficiency assessment",
      "Code compliance verification",
    ],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
  },
};

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) {
    return {
      title: "Service Not Found | Trinity Engineering",
    };
  }
  return {
    title: `${service.title} | Trinity Engineering`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            alt={service.title}
            className="w-full h-full object-cover grayscale brightness-50 contrast-125"
            src={service.image}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.5)]">
                <span className="material-symbols-outlined text-background-dark text-3xl font-bold">
                  {service.icon}
                </span>
              </div>
              <span className="inline-block py-2 px-4 bg-primary/10 text-primary border border-primary/30 rounded font-bold text-xs uppercase tracking-[0.3em]">
                Forensic Service
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              {service.title}
            </h1>
            <p className="text-2xl text-primary font-bold mb-8 tracking-tight">
              {service.tagline}
            </p>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                className="bg-primary hover:bg-primary-dark text-background-dark px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(0,242,255,0.4)] text-center"
                href="#request"
              >
                Request Investigation
              </a>
              <a
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-lg font-bold text-lg transition-all text-center"
                href="#contact"
              >
                Contact Specialist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-32 bg-section-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-6">
              Our Capabilities
            </h2>
            <h3 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-8">
              Comprehensive {service.title} Investigation Services
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our team of licensed forensic engineers employs cutting-edge technology
              and proven methodologies to deliver accurate, defensible findings for
              your most complex cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-all hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {feature}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Professional forensic analysis with detailed documentation and
                      expert reporting.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-6">
              Investigation Process
            </h2>
            <h3 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              Our Forensic Methodology
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Initial Assessment",
                description: "Rapid response site inspection and preliminary evaluation",
              },
              {
                step: "02",
                title: "Evidence Collection",
                description: "Comprehensive documentation with advanced diagnostics",
              },
              {
                step: "03",
                title: "Forensic Analysis",
                description: "Expert evaluation using engineering principles",
              },
              {
                step: "04",
                title: "Expert Reporting",
                description: "Detailed findings with litigation-ready documentation",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-black text-primary/20 mb-6">
                  {item.step}
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-primary/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-section-dark" id="contact">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-[3rem] border border-primary/20 p-1 md:p-2 bg-gradient-to-br from-primary/20 to-transparent">
            <div className="bg-section-dark rounded-[2.8rem] px-8 py-20 md:px-20 text-center">
              <span className="material-symbols-outlined text-6xl text-primary mb-8 inline-block neon-icon">
                {service.icon}
              </span>
              <h2 className="text-5xl font-extrabold mb-8 text-white tracking-tight">
                Ready to Begin Your Investigation?
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto mb-12">
                Contact our {service.title.toLowerCase()} specialists for a rapid-response
                consultation. Available 24/7 for emergency investigations.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  className="bg-primary hover:bg-primary-dark text-background-dark px-12 py-6 rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(0,242,255,0.4)]"
                  href="#request"
                >
                  Submit Request
                </a>
                <a
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-12 py-6 rounded-2xl font-bold text-lg transition-all"
                  href="tel:+1-800-TRINITY"
                >
                  Call: 1-800-TRINITY
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
