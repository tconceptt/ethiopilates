import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import StudioVideo from "@/components/StudioVideo";
import Services from "@/components/Services";
import Amenities from "@/components/Amenities";
import Schedule from "@/components/Schedule";
import Pricing from "@/components/Pricing";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <StudioVideo />
      <Services />
      <Amenities />
      <Schedule />
      <Pricing />
      <CtaBand />
      <Footer />
    </main>
  );
}
