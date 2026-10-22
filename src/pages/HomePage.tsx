import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import DestinationsSection from '../components/home/DestinationsSection'
import InteractiveMapPreviewSection from '../components/home/InteractiveMapPreviewSection'
import ExampleDiscoverySection from '../components/home/ExampleDiscoverySection'
import BenefitsSection from '../components/home/BenefitsSection'
import CTASection from '../components/home/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DestinationsSection />
        <InteractiveMapPreviewSection />
        <ExampleDiscoverySection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
