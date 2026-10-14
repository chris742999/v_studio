import Navbar from "../components/Navbar/Navbar";
import AnimatedBackground from "../components/Background/AnimatedBackground";

import ContactHero from "../components/Contact/ContactHero";
import ContactForm from "../components/Contact/ContactForm";
import ContactMap from "../components/Contact/ContactMap";
import ContactCTA from "../components/Contact/ContactCTA";

export default function Contact() {
  return (
    <div className="relative min-h-screen bg-[#050816] text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <ContactHero />

      {/* Contact Form */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
  <div className="flex justify-center">
    <div className="w-full max-w-3xl">
      <ContactForm />
    </div>
  </div>
</section>

      {/* Google Map */}
      <section className="relative z-10 px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <ContactMap />
        </div>
      </section>

      {/* Call to Action */}
      <ContactCTA />
    </div>
  );
}