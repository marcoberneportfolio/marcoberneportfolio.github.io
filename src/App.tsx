import { useCallback, useState } from 'react';
import AboutSection from '@/components/about-section';
import ContactSection from '@/components/contact-section';
import FaqSection from '@/components/faq-section';
import HeroSection from '@/components/hero-section';
import PhotoBand from '@/components/photo-band';
import ProjectModal from '@/components/project-modal';
import ServicesSection from '@/components/services-section';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import VideoSection from '@/components/video-section';
import WorkSection from '@/components/work-section';

export default function App() {
  const [openProject, setOpenProject] = useState<number | null>(null);
  const closeProject = useCallback(() => setOpenProject(null), []);

  return (
    <>
      <SiteHeader />

      <main id="top">
        <HeroSection onOpen={setOpenProject} />
        <WorkSection onOpen={setOpenProject} />
        <VideoSection />
        <ServicesSection />
        <PhotoBand onOpen={setOpenProject} />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>

      <SiteFooter />

      <ProjectModal index={openProject} onClose={closeProject} onNavigate={setOpenProject} />
    </>
  );
}
