import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DroneHero from "@/components/industry/drone/DroneHero";
import DroneProblemSection from "@/components/industry/drone/DroneProblemSection";
import DroneTechnologySection from "@/components/industry/drone/DroneTechnologySection";
import DroneQualitySection from "@/components/industry/drone/DroneQualitySection";
import DroneApproachSection from "@/components/industry/drone/DroneApproachSection";
import DroneCtaSection from "@/components/industry/drone/DroneCtaSection";

export const metadata: Metadata = {
  title: "Drone Technology | Trinity Engineering",
  description:
    "FAA Part 107 certified UAS inspections — leveraging drone technology for more thorough forensic field evaluations at Trinity Engineering.",
};

export default function DroneTechnologyPage() {
  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <DroneHero />
      <DroneProblemSection />
      <DroneTechnologySection />
      <DroneQualitySection />
      <DroneApproachSection />
      <DroneCtaSection />
      <Footer />
    </main>
  );
}
