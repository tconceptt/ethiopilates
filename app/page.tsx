import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import StudioVideo from "@/components/StudioVideo";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StudioVideo />
      <About />
      <Services />
      <Pricing />
      <Footer />
    </main>
  );
}