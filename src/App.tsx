import { useState, useCallback } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useI18n } from '@/hooks/useI18n';
import PageLoader from '@/components/PageLoader';
import Navigation from '@/sections/Navigation';
import HeroSection from '@/sections/HeroSection';
import ServicesSection from '@/sections/ServicesSection';
import ProjectsSection from '@/sections/ProjectsSection';
import AboutContactSection from '@/sections/AboutContactSection';
import Footer from '@/sections/Footer';

export default function App() {
  const [ready, setReady] = useState(false);
  useLenis();
  useI18n(); // Initialize i18n

  const handleLoaderComplete = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <>
      <PageLoader onComplete={handleLoaderComplete} />
      <Navigation />
      <main>
        <HeroSection ready={ready} />
        <ServicesSection />
        <ProjectsSection />
        <AboutContactSection />
      </main>
      <Footer />
    </>
  );
}
