/**
 * In-app careers tab — commented out while navbar links to the external portal.
 * Restore the block below and remove the redirect when ready to use again.
 */
/*
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareersHero from "@/components/careers/CareersHero";
import CareersIntroSection from "@/components/careers/CareersIntroSection";
import CareersAchievementsSection from "@/components/careers/CareersAchievementsSection";
import CareersBrandSection from "@/components/careers/CareersBrandSection";
import CareersGridSection from "@/components/careers/CareersGridSection";

export default function CareersPage() {
  return (
    <main className="min-h-screen w-full min-w-0 max-lg:overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <CareersHero />
      <CareersIntroSection />
      <CareersAchievementsSection />
      <CareersBrandSection />
      <CareersGridSection />
      <Footer />
    </main>
  );
}
*/

import { redirect } from "next/navigation";

const CAREERS_EXTERNAL_URL = "https://careers.trinitypllc.com/jobs/Careers";

export default function CareersPage() {
  redirect(CAREERS_EXTERNAL_URL);
}
