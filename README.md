# Blueneck Events — website

Multi-page marketing site for **Blueneck Events Pvt. Ltd.** (Corporate | Weddings | Activations).
Built with React 19, TypeScript, Vite 6, Tailwind CSS 3, Framer Motion 12 and React Router 7.

All copy, the 29 case studies, director bios, client logos and photographs come from the
Blueneck corporate profile PDF. The brand palette is sampled from the logo artwork.

## Run it

Requires Node.js 18.18+ (20 or 22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serves the production build
```

## Before going live

These were not in the company profile, so they are left empty and hidden in the UI:

| What | Where |
| --- | --- |
| Office address, email, phone, WhatsApp, Instagram, LinkedIn | `src/data/site.ts` → `contact` |
| Client testimonials (the home page shows labelled "case notes" until you add some) | `src/data/site.ts` → `testimonials` |
| Contact form delivery | set `VITE_FORM_ENDPOINT` (see `.env.example`), or set `contact.email` to use a mailto fallback |
| Names for two client emblems without a legible name (`client-18.png`, `client-39.png`) | `src/data/images.generated.json` → `_clients` |

Also check the few details inferred from photos rather than stated in the text (years and
cities on some case studies, e.g. Pravasi Bharatiya Divas 2023, USICON 2023) in `src/data/work.ts`.

## Pages

| Route | Content |
| --- | --- |
| `/` | Hero (tile-burst of event photos), who we are, scale figures, services list with cursor preview, selected work, client wall, case notes / testimonials, call to action |
| `/about` | Company story, studio image, what we do, the three directors |
| `/expertise` | Nine service lines, each with linked productions |
| `/work` | Filterable masonry of all 29 productions (`/work?type=sports` etc. is shareable) |
| `/work/:slug` | Case study: cover, facts, story, scope, gallery with lightbox, next/related |
| `/contact` | Enquiry form with validation, contact details, map |

## Structure

```
public/
  brand/            logo mark, light + dark wordmarks, full logo (OG image)
  images/work/      <case-slug>/1.webp (cover) … n.webp — extracted from the PDF
  images/team/      director cut-outs
  images/clients/   client logos (transparent PNG)
  images/studio/    office reception render
  _redirects, .htaccess   SPA fallbacks for Netlify and Apache/Hostinger
src/
  data/             site.ts (company, contact, services, directors, clients)
                    work.ts (case studies + categories)
                    images.generated.json (image sizes + placeholder tones)
  components/
    layout/         Header (with mobile menu), Footer, Layout
    home/           Hero, TileBurst, Intro, ExpertiseList, FeaturedWork, ClientWall, Voices, ContactCta
    work/           WorkCard, Lightbox
    contact/        ContactForm
    ui/             Button, Img (lazy + tone placeholder), Logo, Page, PageHero, SectionHead
  pages/            Home, About, Expertise, Work, CaseStudy, Contact, NotFound
  lib/motion.ts     shared easing and reveal variants
```

### Adding a production

1. Put photos in `public/images/work/<slug>/1.webp`, `2.webp`, … (1 is the cover; ~1400px wide WebP).
2. Add an entry for `<slug>` to `src/data/images.generated.json` with each image's `src`, `w`, `h` and a dark `tone` colour.
3. Add the case to the `data` array in `src/data/work.ts`. Set `featured: true` to show it on the home page (the first six are used).

## Design notes

- **Palette** (from the logo): navy `#254C82`, cobalt `#537DBE`, sky `#75A6D8`, mist `#89BBE5`, ice `#BBD9F2`, on a deepened navy base `#081629`. Defined in `tailwind.config.js`.
- **Type**: Bodoni Moda (display; echoes the high-contrast logo lettering) + Hanken Grotesk (text), self-hosted via Fontsource.
- **Signature**: the logo's rounded-diamond sunburst, rebuilt in the hero with a ring of real event photos; hovering a tile names the event. The diamond tile recurs as list bullets and backdrops.
- **Motion**: one load sequence per page (headline lines rise, burst tiles fly out from the BN disc); everything else responds to the visitor (hover, filter, open). `prefers-reduced-motion` is respected.
- **Performance**: routes are code-split, images are lazy-loaded WebP with intrinsic sizes and colour placeholders, framer-motion and React are in separate long-cache chunks.

## Deploy

- **Vercel**: import the repo; `vercel.json` handles SPA routing.
- **Netlify**: build `npm run build`, publish `dist`; `public/_redirects` handles routing.
- **Hostinger / Apache**: upload the contents of `dist/` to `public_html`; `public/.htaccess` (copied into `dist`) handles routing and caching.
