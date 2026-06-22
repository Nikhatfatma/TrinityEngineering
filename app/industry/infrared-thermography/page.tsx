import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InfraredHero from "@/components/industry/infrared/InfraredHero";
import InfraredToolsSection from "@/components/industry/infrared/InfraredToolsSection";
import InfraredMeasuringSection from "@/components/industry/infrared/InfraredMeasuringSection";
import InfraredConfirmationSection from "@/components/industry/infrared/InfraredConfirmationSection";
import InfraredLeverageSection from "@/components/industry/infrared/InfraredLeverageSection";
import InfraredQualitySection from "@/components/industry/infrared/InfraredQualitySection";
import InfraredCtaSection from "@/components/industry/infrared/InfraredCtaSection";

export const metadata: Metadata = {
  title: "Infrared Thermography | Trinity Engineering",
  description:
    "Advanced infrared thermography for forensic field inspections — hidden moisture, thermal anomalies, and defensible documentation from Trinity Engineering.",
};

export default function InfraredThermographyPage() {
  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <InfraredHero />
      <InfraredToolsSection />
      <InfraredMeasuringSection />
      <InfraredConfirmationSection />
      <InfraredLeverageSection />
      <InfraredQualitySection />
      <InfraredCtaSection />
      <Footer />
    </main>
  );
}
