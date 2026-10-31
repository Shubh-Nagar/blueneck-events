import Page from '../components/ui/Page';
import PageHero from '../components/ui/PageHero';
import { ButtonLink } from '../components/ui/Button';

export default function NotFound() {
  return (
    <Page title="Page not found">
      <PageHero
        lead="This page isn’t"
        accent="on the programme."
        after={
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/work">See our work</ButtonLink>
            <ButtonLink to="/" variant="ghost">
              Go to the home page
            </ButtonLink>
          </div>
        }
      >
        The link may be old or mistyped. Our work and contact details are a click away.
      </PageHero>
      <div className="h-[20vh] bg-white" />
    </Page>
  );
}
