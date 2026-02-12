"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: "phone",
      title: "Phone",
      primary: "(855) 929-5888",
      secondary: "24/7 Emergency Line",
      action: "tel:+18559295888",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "email",
      title: "Email",
      primary: "claims@trinitypllc.com",
      secondary: "General Inquiries",
      action: "mailto:claims@trinitypllc.com",
      color: "from-green-500 to-green-600",
    },
    {
      icon: "shield",
      title: "FORTIFIED",
      primary: "fortified@trinitypllc.com",
      secondary: "Certification Inquiries",
      action: "mailto:fortified@trinitypllc.com",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const offices = [
    {
      city: "Headquarters",
      address: "123 Engineering Drive",
      location: "Suite 400, Your City, ST 12345",
      phone: "(855) 929-5888",
      hours: "Mon-Fri: 8AM-6PM",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-dark to-navy dark:from-background-dark dark:via-section-dark dark:to-background-dark">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/20">
            <span className="material-symbols-outlined text-white text-base">contact_support</span>
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Get In Touch
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Available 24/7 for emergency investigations. Reach out to discuss your forensic engineering needs.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                className="group bg-white dark:bg-section-dark rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-2xl text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-white text-4xl">
                    {method.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{method.title}</h3>
                <p className="text-lg font-bold text-primary dark:text-accent mb-1">{method.primary}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{method.secondary}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      <Footer />
    </div>
  );
}
