import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageLoader from './PageLoader';
import Assistant from '../assistant/Assistant';

/** Site chrome. Resets scroll on navigation (keeps hash links working). */
export default function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded bg-paper px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <PageLoader />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Assistant />
    </>
  );
}
