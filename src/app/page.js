import { Nav } from '@/components/nav/nav';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { FreelanceSection } from '@/components/sections/freelance-section';
import { Hero } from '@/components/sections/hero';
import { OpenSourceSection } from '@/components/sections/open-source-section';
import { Projects } from '@/components/sections/projects';
import { Work } from '@/components/sections/work';

/**
 * Every section here is a teaser that links to its own page. Skills moved to
 * /about — the home page should never be the second copy of anything.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Projects />
        <FreelanceSection />
        <OpenSourceSection />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
