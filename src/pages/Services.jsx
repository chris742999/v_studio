import Navbar from "../components/Navbar/Navbar";
import ServicesHero from "../sections/services/ServicesHero";
import ServicesGrid from "../sections/services/ServicesGrid";
import WhyChooseUs from "../sections/services/WhyChooseUs";
import ProcessSection from "../sections/services/ProcessSection";
import FeaturedProjects from "../sections/services/FeaturedProjects";
import TestimonialsSection from "../sections/services/TestimonialsSection";
import AnimatedBackground from "../components/Background/AnimatedBackground";


export default function Services() {
  return (
    <main className="min-h-screen bg-[#030712] text-white overflow-hidden">
        <AnimatedBackground />
      <Navbar />
      <ServicesHero />
      <ServicesGrid />
      <WhyChooseUs />
      <ProcessSection />
        <FeaturedProjects />
        <TestimonialsSection />
    </main>
    
  );
}