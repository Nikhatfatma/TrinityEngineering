import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InsuranceInspections from "@/components/home/InsuranceInspections";
import StatsSection from "@/components/home/StatsSection";
import WeatherScrutiny from "@/components/home/WeatherScrutiny";
import FortifiedSection from "@/components/home/FortifiedSection";
import AdjusterTraining from "@/components/home/AdjusterTraining";
import RepairabilitySection from "@/components/home/RepairabilitySection";
import BioSection from "@/components/home/BioSection";
import LeadingIndustry from "@/components/home/LeadingIndustry";
import CredentialsSection from "@/components/home/CredentialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-clip max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <Hero />
      <div className="max-w-[1440px] mx-auto">
        <InsuranceInspections />
        <StatsSection />
        <WeatherScrutiny />
        <FortifiedSection />
        <AdjusterTraining />
        <RepairabilitySection />
        <BioSection />
        <LeadingIndustry />
        <CredentialsSection />
      </div>
      <Footer />
    </main>
  );
}
