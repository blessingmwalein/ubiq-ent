import { ContentCategories } from "@/components/home/content-categories";
import { CTASection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/features-section";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { HeroSection } from "@/components/home/hero-section";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-background">
      <Header />
      <HeroSection />
      <ContentCategories />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
