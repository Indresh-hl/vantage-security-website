import { AssessmentSection } from './components/AssessmentSection';
import { BriefingsSection } from './components/BriefingsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MetricsStatement } from './components/MetricsStatement';
import { Preloader } from './components/Preloader';
import { SectorsGrid } from './components/SectorsGrid';
import { ServicesRail } from './components/ServicesRail';
import { SmoothScroll } from './components/SmoothScroll';
import { StandardsShowcase } from './components/StandardsShowcase';
import { TacticalCursor } from './components/TacticalCursor';
import { Testimonials } from './components/Testimonials';

export default function App() {
  return (
    <div className="min-h-screen bg-[#06080C] text-white">
      <SmoothScroll />
      <TacticalCursor />
      <Preloader />
      <Header />
      <main id="main-content">
        {/* Pinned Hero -> Concave U-Shaped Charcoal-to-White Curve reveals About immediately at top */}
        <Hero />
        <MetricsStatement />
        {/* Sticky Horizontal Services Rail */}
        <ServicesRail />
        {/* Pinned Zooming SOC -> Concave U-Shaped Charcoal-to-White Curve reveals Testimonials immediately */}
        <StandardsShowcase />
        <Testimonials />
        <SectorsGrid />
        {/* Concave U-Shaped Charcoal Curves across Briefings, FAQ, and Site Assessment */}
        <BriefingsSection />
        <FaqSection />
        <AssessmentSection />
      </main>
      <Footer />
    </div>
  );
}
