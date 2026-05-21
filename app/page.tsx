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
    <main className="min-h-screen w-full min-w-0 max-lg:overflow-x-clip [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <Hero />
      <InsuranceInspections />
      <StatsSection />
      <WeatherScrutiny />
      <FortifiedSection />
      <AdjusterTraining />
      <RepairabilitySection />
      <BioSection />
      <LeadingIndustry />
      <CredentialsSection />
      <Footer />
    </main>
  );
}
