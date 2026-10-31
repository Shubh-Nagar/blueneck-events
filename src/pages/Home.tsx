import Page from '../components/ui/Page';
import Hero from '../components/home/Hero';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Journey from '../components/home/Journey';
import Clients from '../components/home/Clients';
import Voices from '../components/home/Voices';
import Expertise from '../components/home/Expertise';
import Culture from '../components/home/Culture';
import ContactCta from '../components/home/ContactCta';

export default function Home() {
  return (
    <Page title="Home">
      <Hero />
      <FeaturedProjects />
      <Journey />
      <Clients />
      <Expertise />
      <Voices />
      <Culture />
      <ContactCta />
    </Page>
  );
}
