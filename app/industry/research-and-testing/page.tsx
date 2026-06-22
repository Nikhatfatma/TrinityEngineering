import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchHero from "@/components/industry/research-and-testing/ResearchHero";
import Section1Research from "@/components/industry/research-and-testing/Section1Research";
import Section2Impact from "@/components/industry/research-and-testing/Section2Impact";
import Section3Desaturation from "@/components/industry/research-and-testing/Section3Desaturation";
import Section4Repairability from "@/components/industry/research-and-testing/Section4Repairability";
import Section5TrinityWay from "@/components/industry/research-and-testing/Section5TrinityWay";
import Section6Proven from "@/components/industry/research-and-testing/Section6Proven";

export const metadata: Metadata = {
  title: "Research and Controlled Testing | Trinity Engineering",
  description:
    "Empirical testing, controlled hail impact testing with the TIPC, shingle desaturation analysis, and standardized TRI repairability assessments at Trinity Engineering.",
};

export default function ResearchAndTestingPage() {
  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <ResearchHero />
      <Section1Research />
      <Section2Impact />
      <Section3Desaturation />
      <Section4Repairability />
      <Section5TrinityWay />
      <Section6Proven />
      <Footer />
    </main>
  );
}
