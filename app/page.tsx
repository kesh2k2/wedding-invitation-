import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Couple from "@/components/Couple";
import OurStory from "@/components/OurStory";
import Countdown from "@/components/Countdown";
import WeddingDetails from "@/components/WeddingDetails";
import Invitation from "@/components/Invitation";
import Footer from "@/components/Footer";
import WeddingProvider from "@/components/WeddingProvider";

export default function Home() {
  return (
    <WeddingProvider>
      <main id="home" className="min-h-screen bg-[#FAF9F6]">
        <Navbar />
        <Hero />
        <Couple />
        <OurStory />
        <Countdown />
        <WeddingDetails />
        <Invitation />
        <Footer />

      </main>
    </WeddingProvider>
  );
}
