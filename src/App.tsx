import { useCallback, useEffect, useState } from 'react';
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

/** Project shown in the sheet according to the history entry, or null for the page itself. */
const projectInHistory = (state: unknown): number | null =>
  typeof (state as { project?: unknown } | null)?.project === 'number' ? (state as { project: number }).project : null;

export default function App() {
  const [openProject, setOpenProject] = useState<number | null>(null);

  // An open project sheet is a history entry of its own, so the browser's back button closes it
  useEffect(() => {
    // The page scrolls itself to sections; letting the browser restore positions would fight it
    history.scrollRestoration = 'manual';
    // After a reload with a sheet open the page starts closed, so its entry stands for the page again
    if (projectInHistory(history.state) !== null) history.replaceState(null, '');
    const onPop = (event: PopStateEvent) => setOpenProject(projectInHistory(event.state));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const showProject = useCallback((index: number) => {
    // Moving from one project to the next replaces the entry, so back always returns to the page
    if (projectInHistory(history.state) === null) history.pushState({ project: index }, '');
    else history.replaceState({ project: index }, '');
    setOpenProject(index);
  }, []);

  const closeProject = useCallback(() => {
    // Closed right away, so that a section can be measured just after (the contact link of the sheet)
    setOpenProject(null);
    if (projectInHistory(history.state) !== null) history.back();
  }, []);

  return (
    <>
      <SiteHeader />

      <main id="top">
        <HeroSection onOpen={showProject} />
        <WorkSection onOpen={showProject} />
        <VideoSection />
        <ServicesSection />
        <PhotoBand onOpen={showProject} />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>

      <SiteFooter />

      <ProjectModal index={openProject} onClose={closeProject} onNavigate={showProject} />
    </>
  );
}
