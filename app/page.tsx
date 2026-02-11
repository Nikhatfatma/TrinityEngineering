import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TechnicalJournal from "@/components/TechnicalJournal";
import Careers from "@/components/Careers";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <TechnicalJournal />
      <Careers />
      <ContactForm />
      <Footer />
    </>
  );
}
