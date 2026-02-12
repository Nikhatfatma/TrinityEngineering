import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import InteractiveMap from "@/components/InteractiveMap";
import HowItWorks from "@/components/HowItWorks";
import EducationHub from "@/components/EducationHub";
import TrustAuthority from "@/components/TrustAuthority";
import ContactForm from "@/components/ContactForm";
import Careers from "@/components/Careers";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <InteractiveMap />
      <Services />
      <HowItWorks />
      <EducationHub />
      <TrustAuthority />
      <ContactForm />
      <Careers />
      <Footer />
    </main>
  );
}
