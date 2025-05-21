import ContactSection from "@/components/sections/contact-section";
import HeroSection from "@/components/sections/hero-section";
import TestimonialSection from "@/components/sections/testimonial-card";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TestimonialSection />
      <ContactSection />
    </div>
  );
}
