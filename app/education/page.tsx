import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EducationHero from "@/components/education/EducationHero";
import EducationCoursesSection from "@/components/education/EducationCoursesSection";
import EducationQuoteSection from "@/components/education/EducationQuoteSection";

export const metadata = {
  title: "Education & Training | Trinity Engineering",
  description: "Sign up for one of our advanced training classes on a forensic engineering topic that suits the needs of you and your team! Join us in-person or via online webinar.",
};

export default function EducationPage() {
  return (
    <main className="min-h-screen w-full min-w-0 max-lg:overflow-x-clip bg-white [&_section]:scroll-mt-14 max-lg:[&_section]:scroll-mt-14">
      <Navbar />
      <EducationHero />
      <EducationCoursesSection />
      <EducationQuoteSection />
      <Footer />
    </main>
  );
}
