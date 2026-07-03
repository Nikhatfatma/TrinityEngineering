import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClaimsHero from "@/components/claims/ClaimsHero";
import ClaimsSteepHighSection from "@/components/claims/ClaimsSteepHighSection";
import ClaimsDateOfLossSection from "@/components/claims/ClaimsDateOfLossSection";
import ClaimsStructuralSection from "@/components/claims/ClaimsStructuralSection";
import ClaimsRepairabilitySection from "@/components/claims/ClaimsRepairabilitySection";
import ClaimsCtaSection from "@/components/claims/ClaimsCtaSection";

export default function ClaimsPage() {
  return (
    <main className="min-h-screen w-full min-w-0 max-lg:overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <ClaimsHero />
      <ClaimsSteepHighSection />
      <ClaimsDateOfLossSection />
      <ClaimsStructuralSection />
      <ClaimsRepairabilitySection />
      <ClaimsCtaSection />
      <Footer />
    </main>
  );
}
