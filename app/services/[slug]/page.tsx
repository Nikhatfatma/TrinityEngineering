import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceAssignmentForm from "@/components/ServiceAssignmentForm";

interface ServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
  heroImage: string;
  stats: {
    cases: string;
    responseTime: string;
    successRate: string;
    coverage: string;
  };
  capabilities: {
    icon: string;
    title: string;
    description: string;
  }[];
  perils: string[];
  process: {
    step: number;
    title: string;
    description: string;
    icon: string;
  }[];
  reportTypes: {
    title: string;
    description: string;
    deliveryTime: string;
  }[];
}

const servicesData: { [key: string]: ServiceDetail } = {
  "structural": {
    slug: "structural",
    title: "Structural Analysis",
    tagline: "Foundation settlement, framing failures, and load-bearing capacity investigations",
    description: "Comprehensive forensic structural engineering investigations delivered by licensed PE engineers with decades of experience in analyzing foundation failures, framing defects, and building envelope issues.",
    longDescription: "Trinity Engineering's structural analysis services provide in-depth forensic investigations into foundation settlement, framing failures, load-bearing capacity issues, and building envelope defects. Our licensed Professional Engineers utilize advanced diagnostic equipment, engineering principles, and forensic methodologies to determine the root cause of structural failures. We deliver clear, defensible reports suitable for insurance claims, litigation, and remediation planning.",
    icon: "architecture",
    heroImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80",
    stats: {
      cases: "2,500+",
      responseTime: "48 Hours",
      successRate: "99%",
      coverage: "Nationwide",
    },
    capabilities: [
      {
        icon: "foundation",
        title: "Foundation Settlement Analysis",
        description: "Comprehensive investigation of differential settlement, expansive soils, consolidation, and structural impact assessment.",
      },
      {
        icon: "construction",
        title: "Framing & Truss Failures",
        description: "Forensic analysis of roof truss failures, wall framing defects, and structural member inadequacies.",
      },
      {
        icon: "compress",
        title: "Load-Bearing Evaluation",
        description: "Engineering analysis of structural capacity, overload conditions, and design deficiencies.",
      },
      {
        icon: "home_repair_service",
        title: "Building Envelope",
        description: "Investigation of water intrusion, thermal performance, and exterior envelope failures.",
      },
      {
        icon: "crisis_alert",
        title: "Collapse Investigation",
        description: "Emergency response and forensic analysis for partial or complete structural collapses.",
      },
      {
        icon: "ruler",
        title: "Code Compliance Review",
        description: "Assessment of structures against applicable building codes and engineering standards.",
      },
    ],
    perils: [
      "Foundation Settlement",
      "Differential Movement",
      "Expansive Soils",
      "Consolidation",
      "Framing Defects",
      "Truss Failures",
      "Overloading",
      "Design Deficiencies",
      "Construction Defects",
      "Material Degradation",
      "Seismic Damage",
      "Building Collapse",
    ],
    process: [
      {
        step: 1,
        title: "Site Investigation",
        description: "Detailed on-site inspection with comprehensive documentation, measurements, and photographic evidence.",
        icon: "travel_explore",
      },
      {
        step: 2,
        title: "Forensic Analysis",
        description: "Engineering calculations, load analysis, and forensic evaluation to determine root cause.",
        icon: "calculate",
      },
      {
        step: 3,
        title: "Testing & Diagnostics",
        description: "Non-destructive testing, material sampling, and laboratory analysis when required.",
        icon: "science",
      },
      {
        step: 4,
        title: "Expert Reporting",
        description: "Delivery of comprehensive, defensible engineering reports with findings and recommendations.",
        icon: "description",
      },
    ],
    reportTypes: [
      {
        title: "Standard Report",
        description: "Comprehensive forensic engineering report with site observations, analysis, and conclusions.",
        deliveryTime: "5-7 Business Days",
      },
      {
        title: "Expedited Report",
        description: "Fast-tracked investigation and reporting for time-sensitive claims and litigation.",
        deliveryTime: "48-72 Hours",
      },
      {
        title: "Expert Witness Package",
        description: "Detailed report with supporting calculations, exhibits, and expert testimony preparation.",
        deliveryTime: "Custom Timeline",
      },
    ],
  },
  "storm-damage": {
    slug: "storm-damage",
    title: "Storm Damage Assessment",
    tagline: "Hurricane, wind, hail, and severe weather damage forensic investigations",
    description: "Expert evaluation of weather-related structural damage with rapid deployment capabilities nationwide. Our PE engineers provide precise, defensible storm damage assessments for insurance and legal claims.",
    longDescription: "Trinity Engineering's storm damage assessment services deliver rapid, comprehensive forensic investigations of hurricane, wind, hail, and severe weather impacts on residential and commercial properties. Our licensed engineers utilize meteorological data, engineering principles, and advanced diagnostic tools to accurately determine causation, extent, and timeline of weather-related damage.",
    icon: "cyclone",
    heroImage: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1600&q=80",
    stats: {
      cases: "5,000+",
      responseTime: "24 Hours",
      successRate: "98%",
      coverage: "All 50 States",
    },
    capabilities: [
      {
        icon: "wind_power",
        title: "Wind Damage Analysis",
        description: "Forensic evaluation of structural damage caused by high winds, including roof, siding, and framing failures.",
      },
      {
        icon: "thunderstorm",
        title: "Hail Impact Assessment",
        description: "Detailed inspection and documentation of hail damage to roofing, siding, and exterior building components.",
      },
      {
        icon: "cyclone",
        title: "Hurricane Investigation",
        description: "Comprehensive analysis of hurricane damage with correlation to meteorological data and wind speeds.",
      },
      {
        icon: "flood",
        title: "Storm Water Intrusion",
        description: "Investigation of water intrusion pathways and damage resulting from severe weather events.",
      },
      {
        icon: "bolt",
        title: "Lightning Strike Analysis",
        description: "Forensic evaluation of direct and indirect lightning damage to structures and systems.",
      },
      {
        icon: "public",
        title: "CAT Response Team",
        description: "Rapid deployment catastrophe response for large-scale weather events and disasters.",
      },
    ],
    perils: [
      "Hurricane Damage",
      "High Wind",
      "Hail Impact",
      "Tornado",
      "Derecho",
      "Storm Surge",
      "Wind-Driven Rain",
      "Roof Blow-Off",
      "Siding Failure",
      "Window Breakage",
      "Tree Impact",
      "Flying Debris",
    ],
    process: [
      {
        step: 1,
        title: "Rapid Deployment",
        description: "24-hour response time with immediate deployment of qualified PE engineer to the site.",
        icon: "rocket_launch",
      },
      {
        step: 2,
        title: "Weather Data Correlation",
        description: "Analysis of meteorological data to determine wind speeds, hail size, and storm timing.",
        icon: "cloud",
      },
      {
        step: 3,
        title: "Damage Documentation",
        description: "Comprehensive photo documentation, drone surveys, and detailed damage mapping.",
        icon: "photo_camera",
      },
      {
        step: 4,
        title: "Causation Report",
        description: "Delivery of defensible engineering report with clear causation determination and repair recommendations.",
        icon: "task_alt",
      },
    ],
    reportTypes: [
      {
        title: "Emergency Report",
        description: "Rapid preliminary assessment for immediate claim decisions and emergency repairs.",
        deliveryTime: "24-48 Hours",
      },
      {
        title: "Comprehensive Storm Report",
        description: "Detailed forensic analysis with weather data correlation, damage extent, and repair scope.",
        deliveryTime: "5-7 Business Days",
      },
      {
        title: "CAT Event Report",
        description: "Large-scale catastrophe reporting for multiple properties and complex weather events.",
        deliveryTime: "Custom Timeline",
      },
    ],
  },
  "water-loss": {
    slug: "water-loss",
    title: "Water Loss Investigation",
    tagline: "Precision source identification for complex plumbing and intrusion failures",
    description: "Advanced forensic investigation to pinpoint the exact origin and cause of water damage. Our engineers utilize thermal imaging, moisture mapping, and non-destructive testing to identify hidden water sources.",
    longDescription: "Trinity Engineering's water loss investigations combine forensic engineering expertise with advanced diagnostic technology to accurately identify the source, cause, and extent of water damage. Our PE engineers specialize in complex cases involving hidden plumbing leaks, building envelope failures, and intrusion source determination for residential and commercial properties.",
    icon: "opacity",
    heroImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80",
    stats: {
      cases: "3,800+",
      responseTime: "36 Hours",
      successRate: "96%",
      coverage: "Nationwide",
    },
    capabilities: [
      {
        icon: "plumbing",
        title: "Plumbing System Analysis",
        description: "Forensic investigation of pipe failures, water heater malfunctions, and fixture leaks.",
      },
      {
        icon: "roofing",
        title: "Roof & Envelope Failure",
        description: "Identification of water intrusion through roofing, walls, windows, and foundation.",
      },
      {
        icon: "thermostat",
        title: "Thermal Imaging",
        description: "Advanced infrared thermography to detect hidden moisture and water migration patterns.",
      },
      {
        icon: "water_drop",
        title: "Moisture Mapping",
        description: "Comprehensive moisture detection and mapping to determine extent of water damage.",
      },
      {
        icon: "search",
        title: "Non-Destructive Testing",
        description: "Utilization of borescopes, moisture meters, and acoustic testing to locate hidden sources.",
      },
      {
        icon: "science",
        title: "Material Analysis",
        description: "Assessment of water damage impact on building materials and structural components.",
      },
    ],
    perils: [
      "Pipe Bursts",
      "Plumbing Leaks",
      "Water Heater Failure",
      "Roof Leaks",
      "Window Intrusion",
      "Foundation Seepage",
      "Sub-Slab Leaks",
      "Condensation",
      "Ice Dam",
      "Appliance Leaks",
      "Fixture Failures",
      "Building Envelope",
    ],
    process: [
      {
        step: 1,
        title: "Initial Assessment",
        description: "Comprehensive site inspection to document water damage and identify potential source areas.",
        icon: "visibility",
      },
      {
        step: 2,
        title: "Diagnostic Testing",
        description: "Deployment of thermal cameras, moisture meters, and non-destructive testing equipment.",
        icon: "biotech",
      },
      {
        step: 3,
        title: "Source Identification",
        description: "Forensic analysis to pinpoint the exact origin and cause of water intrusion.",
        icon: "pin_drop",
      },
      {
        step: 4,
        title: "Expert Report Delivery",
        description: "Comprehensive report with source determination, extent of damage, and repair recommendations.",
        icon: "fact_check",
      },
    ],
    reportTypes: [
      {
        title: "Source Identification Report",
        description: "Focused investigation to determine the exact source and cause of water intrusion.",
        deliveryTime: "3-5 Business Days",
      },
      {
        title: "Comprehensive Water Loss Report",
        description: "Detailed forensic analysis including source, timeline, extent, and material impact assessment.",
        deliveryTime: "5-7 Business Days",
      },
      {
        title: "Litigation Support Package",
        description: "In-depth investigation with detailed exhibits, testing data, and expert witness preparation.",
        deliveryTime: "Custom Timeline",
      },
    ],
  },
  "fortified": {
    slug: "fortified",
    title: "FORTIFIED Roof Certification",
    tagline: "Official FORTIFIED evaluations for superior weather resilience",
    description: "Certified FORTIFIED Home™ inspections and evaluations by designated FORTIFIED evaluators. Ensure your property meets the highest standards for wind and hail resistance.",
    longDescription: "Trinity Engineering provides official FORTIFIED Home™ certification services through our team of designated FORTIFIED evaluators. We conduct comprehensive inspections during construction and post-construction to verify compliance with FORTIFIED standards, helping property owners achieve enhanced resilience against hurricanes, high winds, and hail while potentially reducing insurance premiums.",
    icon: "roofing",
    heroImage: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=1600&q=80",
    stats: {
      cases: "1,200+",
      responseTime: "72 Hours",
      successRate: "100%",
      coverage: "All Coastal States",
    },
    capabilities: [
      {
        icon: "shield",
        title: "FORTIFIED Roof™",
        description: "Official certification for roof system that meets FORTIFIED standards for wind uplift resistance.",
      },
      {
        icon: "home",
        title: "FORTIFIED Home™",
        description: "Comprehensive whole-house FORTIFIED certification including roof, walls, and building envelope.",
      },
      {
        icon: "verified",
        title: "New Construction Review",
        description: "Multi-stage inspections during construction to ensure FORTIFIED compliance at each critical phase.",
      },
      {
        icon: "assignment_turned_in",
        title: "Existing Home Evaluation",
        description: "Assessment of existing properties for FORTIFIED designation or retrofit recommendations.",
      },
      {
        icon: "wind_power",
        title: "Wind Uplift Testing",
        description: "Engineering analysis and testing to verify roof system resistance to high wind forces.",
      },
      {
        icon: "savings",
        title: "Insurance Premium Reduction",
        description: "Documentation to support insurance premium discounts for FORTIFIED certified properties.",
      },
    ],
    perils: [
      "Hurricane Force Winds",
      "High Wind Events",
      "Hail Impact",
      "Wind-Driven Rain",
      "Roof Uplift",
      "Soffit Damage",
      "Fascia Failure",
      "Gable End Collapse",
      "Water Intrusion",
      "Debris Impact",
    ],
    process: [
      {
        step: 1,
        title: "Pre-Construction Consultation",
        description: "Review of architectural plans and roofing specifications for FORTIFIED compliance.",
        icon: "design_services",
      },
      {
        step: 2,
        title: "Mid-Roof Inspection",
        description: "Critical on-site inspection during roof deck installation to verify sealed deck requirement.",
        icon: "engineering",
      },
      {
        step: 3,
        title: "Final Inspection",
        description: "Comprehensive inspection of completed roof system including all FORTIFIED requirements.",
        icon: "task",
      },
      {
        step: 4,
        title: "Official Certification",
        description: "Submission to IBHS and issuance of official FORTIFIED designation certificate.",
        icon: "workspace_premium",
      },
    ],
    reportTypes: [
      {
        title: "FORTIFIED Roof™ Certification",
        description: "Official designation for roof system meeting FORTIFIED Roof standards.",
        deliveryTime: "10-14 Business Days",
      },
      {
        title: "FORTIFIED Home™ Certification",
        description: "Comprehensive whole-house FORTIFIED designation with sealed deck, ring-shank nails, and more.",
        deliveryTime: "14-21 Business Days",
      },
      {
        title: "Retrofit Evaluation",
        description: "Assessment of existing home with recommendations for achieving FORTIFIED designation.",
        deliveryTime: "5-7 Business Days",
      },
    ],
  },
  "large-loss": {
    slug: "large-loss",
    title: "Large Loss Assessment",
    tagline: "Complex multi-discipline investigations for catastrophic property failures",
    description: "Specialized forensic engineering for high-value commercial, industrial, and multi-family property losses. Our large loss team provides rapid deployment and coordinated multi-discipline investigations.",
    longDescription: "Trinity Engineering's Large Loss division specializes in complex, high-value property damage investigations requiring multi-discipline expertise. Our team coordinates structural, mechanical, electrical, and fire investigation engineers to provide comprehensive forensic analysis for commercial properties, industrial facilities, and catastrophic events.",
    icon: "warning",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80",
    stats: {
      cases: "850+",
      responseTime: "96 Hours",
      successRate: "97%",
      coverage: "International",
    },
    capabilities: [
      {
        icon: "factory",
        title: "Industrial Facilities",
        description: "Forensic investigation of manufacturing plants, warehouses, and distribution centers.",
      },
      {
        icon: "business",
        title: "Commercial Properties",
        description: "Multi-story office buildings, retail centers, and mixed-use development investigations.",
      },
      {
        icon: "apartment",
        title: "Multi-Family Housing",
        description: "Comprehensive analysis of apartment complexes, condominiums, and assisted living facilities.",
      },
      {
        icon: "groups",
        title: "Multi-Discipline Team",
        description: "Coordinated response from structural, mechanical, electrical, and fire investigation experts.",
      },
      {
        icon: "emergency",
        title: "CAT Response",
        description: "Rapid deployment catastrophe response team for major weather events and disasters.",
      },
      {
        icon: "gavel",
        title: "Litigation Support",
        description: "Comprehensive expert witness services for high-stakes commercial litigation.",
      },
    ],
    perils: [
      "Structural Collapse",
      "Fire & Explosion",
      "Catastrophic Weather",
      "Flooding",
      "System Failures",
      "Construction Defects",
      "Earthquake",
      "Industrial Accidents",
      "Equipment Failure",
      "Business Interruption",
    ],
    process: [
      {
        step: 1,
        title: "Emergency Response",
        description: "Immediate deployment of large loss team with site security and evidence preservation.",
        icon: "emergency_home",
      },
      {
        step: 2,
        title: "Coordinated Investigation",
        description: "Multi-discipline forensic analysis with structural, mechanical, electrical, and fire experts.",
        icon: "group_work",
      },
      {
        step: 3,
        title: "Advanced Documentation",
        description: "Drone surveys, laser scanning, thermal imaging, and comprehensive photographic documentation.",
        icon: "photo_library",
      },
      {
        step: 4,
        title: "Integrated Reporting",
        description: "Unified comprehensive report addressing all aspects of the large loss event.",
        icon: "summarize",
      },
    ],
    reportTypes: [
      {
        title: "Preliminary Assessment",
        description: "Rapid initial evaluation for claim reserving and emergency response decisions.",
        deliveryTime: "48-72 Hours",
      },
      {
        title: "Comprehensive Large Loss Report",
        description: "Multi-discipline forensic investigation with detailed analysis and exhibits.",
        deliveryTime: "14-21 Business Days",
      },
      {
        title: "Expert Witness Package",
        description: "Litigation-ready reporting with expert testimony preparation and supporting documentation.",
        deliveryTime: "Custom Timeline",
      },
    ],
  },
};

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-background-dark">
        <img
          src={service.heroImage}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/95 via-background-dark/80 to-background-dark/60"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-2xl mb-6 border-2 border-primary/30">
            <span className="material-symbols-outlined text-primary text-4xl">
              {service.icon}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {service.tagline}
          </p>
          <a
            href="#submit-assignment"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <span className="material-icons text-2xl">send</span>
            Submit an Assignment
          </a>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-section-dark border-b border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-accent mb-2">
                {service.stats.cases}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Cases Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-accent mb-2">
                {service.stats.responseTime}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-accent mb-2">
                {service.stats.successRate}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-accent mb-2">
                {service.stats.coverage}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Coverage Area
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-gray-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Overview
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {service.longDescription}
              </p>
              <a
                href="#submit-assignment"
                className="inline-flex items-center gap-2 text-primary dark:text-accent hover:text-primary-dark dark:hover:text-accent-light font-semibold transition-colors"
              >
                Request This Service
                <span className="material-icons text-lg">arrow_forward</span>
              </a>
            </div>
            <div className="bg-white dark:bg-section-dark rounded-2xl shadow-lg dark:shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Report Types Available
              </h3>
              <div className="space-y-6">
                {service.reportTypes.map((report, index) => (
                  <div key={index} className="border-l-4 border-primary dark:border-accent pl-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-primary dark:text-accent font-semibold">
                      <span className="material-icons text-sm">schedule</span>
                      {report.deliveryTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-white dark:bg-section-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Services & Solutions
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive capabilities delivered by licensed Professional Engineers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-background-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-primary/10 dark:bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                    {capability.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {capability.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perils Assessed Section */}
      <section className="py-20 bg-gray-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Perils Assessed
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our forensic engineers investigate a comprehensive range of failure mechanisms and causes
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {service.perils.map((peril, index) => (
              <div
                key={index}
                className="bg-white dark:bg-section-dark rounded-lg p-4 border border-gray-200 dark:border-gray-800 text-center hover:border-primary dark:hover:border-accent transition-all hover:shadow-md"
              >
                <span className="material-symbols-outlined text-primary dark:text-accent text-2xl mb-2 block">
                  verified
                </span>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                  {peril}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investigation Process Section */}
      <section className="py-20 bg-white dark:bg-section-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Investigation Process
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A systematic approach to forensic engineering excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.process.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 dark:bg-accent/10 rounded-full mb-6 relative">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                    {step.icon}
                  </span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary dark:bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
                {index < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent dark:from-accent/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Assignment Form Section */}
      <section id="submit-assignment" className="py-20 bg-gray-50 dark:bg-background-dark">
        <ServiceAssignmentForm serviceType={service.title} />
      </section>

      <Footer />
    </>
  );
}

// Generate static params for all services
export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}
