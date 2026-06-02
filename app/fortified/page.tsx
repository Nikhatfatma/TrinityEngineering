import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FortifiedHero from "@/components/fortified/FortifiedHero";
import FortifiedSolutionsSection from "@/components/fortified/FortifiedSolutionsSection";
import FortifiedStraightforwardSection from "@/components/fortified/FortifiedStraightforwardSection";
import FortifiedStepsSection from "@/components/fortified/FortifiedStepsSection";
import FortifiedExperienceSection from "@/components/fortified/FortifiedExperienceSection";
import FortifiedCtaSection from "@/components/fortified/FortifiedCtaSection";

export default function FortifiedPage() {
  return (
    <main className="min-h-screen w-full min-w-0 max-lg:overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <FortifiedHero />
      <FortifiedSolutionsSection />
      <FortifiedStraightforwardSection />
      <FortifiedStepsSection />
      <FortifiedExperienceSection />
      <FortifiedCtaSection />
      <Footer />
    </main>
  );
}
