import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SwiHero from "@/components/swi/SwiHero";
import SwiProblemSection from "@/components/swi/SwiProblemSection";
import SwiSolutionSection from "@/components/swi/SwiSolutionSection";
import SwiMethodologySection from "@/components/swi/SwiMethodologySection";
import SwiStatsSection from "@/components/swi/SwiStatsSection";
import SwiSourcesSection from "@/components/swi/SwiSourcesSection";
import SwiCtaSection from "@/components/swi/SwiCtaSection";

export default function SwiPage() {
  return (
    <main className="min-h-screen w-full min-w-0 max-lg:overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <SwiHero />
      <SwiProblemSection />
      <SwiSolutionSection />
      <SwiMethodologySection />
      <SwiStatsSection />
      <SwiSourcesSection />
      <SwiCtaSection />
      <Footer />
    </main>
  );
}
