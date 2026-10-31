import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../components/ui/Page';
import PageHero from '../components/ui/PageHero';
import Heading from '../components/ui/Heading';
import ApplicationForm from '../components/careers/ApplicationForm';
import { careers, scale, services, type Opening } from '../data/site';
import { cases } from '../data/work';
import { ease } from '../lib/motion';

/** Reasons to join, each anchored in something the company has actually done. */
const WHY = [
  {
    figure: `${services.length}`,
    title: 'Kinds of stage',
    body: 'Government ceremonies on Monday, a celebrity concert by the weekend. Few teams see this many formats this early in a career.',
  },
  {
    figure: scale[2].figure,
    title: 'In forty days',
    body: 'Pan India, not just Indore. Projects move through cities on tight calendars, and the crew travels with them.',
  },
  {
    figure: '~60 yrs',
    title: 'Of experience to learn from',
    body: 'Three directors with close to sixty years in events between them, working on the floor alongside the team.',
  },
  {
    figure: scale[0].figure,
    title: 'Guests at a single show',
    body: 'Real scale, real responsibility. You will own a part of something thousands of people walk through.',
  },
];

const STEPS = [
  { title: 'Apply', body: 'Send the form below with a link to your CV or portfolio. Two lines about your best event beat a long cover letter.' },
  { title: 'Conversation', body: 'A call with the team lead to talk through your work, what you enjoyed and what you would like to do next.' },
  { title: 'Meet the team', body: 'A visit to the studio, or a short practical brief, so you can see how we work and we can see how you think.' },
  { title: 'Welcome on board', body: 'An offer, an induction, and usually a live event within your first few weeks.' },
];

export default function Careers() {
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');

  const applyFor = (t: string, r = '') => {
    setTeam(t);
    setRole(r);
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Page title="Careers">
      <PageHero
        lead="Build the stage"
        accent="with us"
        after={
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.8, ease } }}
          >
            <a
              href="#apply"
              className="inline-flex h-12 items-center rounded-full bg-navy px-7 text-body-sm font-bold tracking-wide text-white shadow-md transition-colors duration-300 hover:bg-cobalt"
            >
              Apply now
            </a>
            <a
              href="#teams"
              className="inline-flex h-12 items-center rounded-full bg-white px-7 text-body-sm font-bold tracking-wide text-navy ring-1 ring-inset ring-navy/20 transition-colors duration-300 hover:bg-ice/50"
            >
              See the teams
            </a>
          </motion.div>
        }
      >
        Planners, designers, producers and crew who like a deadline, a crowd and a plan that holds. Based in Indore, working
        across India.
      </PageHero>

      <PhotoReel />
      <Why />
      <Teams onApply={(t) => applyFor(t)} />
      <Openings onApply={(o) => applyFor(o.team, o.title)} />
      <Process />

      <section id="apply" className="scroll-mt-24 bg-gradient-to-b from-white to-[#F5F9FD] py-24 sm:py-32" aria-labelledby="apply-title">
        <div className="shell grid items-start gap-16 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-5">
            <Heading id="apply-title" align="left" size="md" lead="Your turn" accent="on stage">
              Tell us who you are and the team you would like to join. No opening that fits? Apply anyway; we keep every
              application on file for the next season.
            </Heading>
            <ul className="mt-10 space-y-4 text-body-sm text-ink/70">
              {[
                'A link to your CV or portfolio is enough; no uploads needed.',
                'Freshers and students are welcome; choose Internship as the team.',
                'Freelance and per-event crew can apply the same way.',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="tile mt-2 h-2 w-2 shrink-0 bg-cobalt" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            className="relative rounded-[2rem] bg-white p-6 shadow-[0_40px_90px_-40px_rgba(8,22,41,0.45)] ring-1 ring-ink/5 sm:p-10 lg:col-span-7"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease }}
          >
            <span aria-hidden className="tile absolute -right-3 -top-3 h-8 w-8 bg-gradient-to-br from-sky to-navy" />
            <ApplicationForm team={team} role={role} onTeamChange={setTeam} onRoleChange={setRole} />
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

/** A slow, endless strip of production covers: the places the work happens. */
function PhotoReel() {
  const reel = cases.slice(0, 12);
  return (
    <section aria-label="Productions by the team" className="overflow-hidden bg-white py-6">
      <div className="flex w-max animate-marquee-slow gap-4 motion-reduce:animate-none hover:[animation-play-state:paused]">
        {[...reel, ...reel].map((c, i) => (
          <Link
            key={`${c.slug}-${i}`}
            to={`/work/${c.slug}`}
            tabIndex={i >= reel.length ? -1 : undefined}
            aria-hidden={i >= reel.length || undefined}
            className="group relative block h-56 w-80 shrink-0 overflow-hidden rounded-[1.25rem] sm:h-64 sm:w-96"
            style={{ backgroundColor: c.images[0].tone }}
          >
            <img
              src={c.images[0].src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-stage group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <span className="absolute inset-x-5 bottom-4 font-display text-[1.05rem] italic leading-tight text-white">{c.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Why() {
  return (
    <section className="bg-white py-24 sm:py-32" aria-labelledby="why-title">
      <div className="shell">
        <Heading id="why-title" lead="Why work" accent="at Blueneck">
          A young company, incorporated in 2022, run by people who have been doing this for decades.
        </Heading>
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <motion.li
              key={w.title}
              className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-white to-ice/30 p-7 shadow-[0_25px_60px_-35px_rgba(37,76,130,0.55)] ring-1 ring-cobalt/15 transition-transform duration-500 ease-stage hover:-translate-y-1.5"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
            >
              <span
                aria-hidden
                className="tile absolute -right-8 -top-8 h-24 w-24 bg-ice/40 transition-transform duration-700 ease-stage group-hover:scale-125"
              />
              <p className="relative font-display text-[2.6rem] font-bold leading-none text-navy">{w.figure}</p>
              <p className="relative mt-3 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-cobalt">{w.title}</p>
              <p className="relative mt-5 text-body-sm leading-relaxed text-ink/70">{w.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The disciplines we hire for, as a numbered list; each row can jump to the form with its team chosen. */
function Teams({ onApply }: { onApply: (team: string) => void }) {
  return (
    <section id="teams" className="scroll-mt-24 bg-ink py-24 text-white sm:py-32" aria-labelledby="teams-title">
      <div className="shell">
        <Heading id="teams-title" tone="light" lead="The teams" accent="behind every show">
          Every production draws on all of them. Find the one that sounds like you.
        </Heading>
        <ol className="mx-auto mt-16 max-w-5xl border-t border-white/10">
          {careers.teams.map((t, i) => (
            <motion.li
              key={t.name}
              className="group grid items-center gap-4 border-b border-white/10 py-8 md:grid-cols-[4rem_1fr_auto] md:gap-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease, delay: i * 0.04 }}
            >
              <span className="font-display text-[1.1rem] text-sky/70">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-tight transition-colors duration-300 group-hover:text-ice">
                  {t.name}
                </h3>
                <p className="mt-2 max-w-2xl text-body-sm leading-relaxed text-white/60">{t.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => onApply(t.name)}
                className="inline-flex w-fit items-center gap-3 rounded-full px-5 py-2.5 text-body-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors duration-300 hover:bg-white hover:text-ink"
              >
                Apply
                <span aria-hidden>→</span>
                <span className="sr-only"> to {t.name}</span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Openings({ onApply }: { onApply: (o: Opening) => void }) {
  const list = careers.openings;
  return (
    <section className="bg-[#F7F9FC] py-24 sm:py-32" aria-labelledby="openings-title">
      <div className="shell">
        <Heading id="openings-title" lead="Open" accent="positions" />
        <div className="mx-auto mt-14 max-w-4xl">
          {list.length === 0 ? (
            <motion.div
              className="relative overflow-hidden rounded-[2rem] bg-white p-10 text-center shadow-[0_30px_70px_-40px_rgba(8,22,41,0.45)] ring-1 ring-ink/5 sm:p-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease }}
            >
              <span aria-hidden className="tile absolute -left-10 -top-10 h-32 w-32 bg-ice/40" />
              <p className="relative font-display text-h3 text-ink">No listed openings right now.</p>
              <p className="relative mx-auto mt-4 max-w-xl text-body text-ink/65">
                We hire through the season as new productions come in. Send an open application and we will reach out when
                something fits.
              </p>
              <a href="#apply" className="link-draw relative mt-8 inline-block text-body-sm font-semibold text-navy">
                Send an open application →
              </a>
            </motion.div>
          ) : (
            <ul className="space-y-4">
              {list.map((o, i) => (
                <motion.li
                  key={o.title}
                  className="flex flex-col gap-6 rounded-[1.5rem] bg-white p-7 shadow-[0_20px_50px_-35px_rgba(8,22,41,0.5)] ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_30px_70px_-35px_rgba(37,76,130,0.6)] sm:flex-row sm:items-center sm:justify-between"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease, delay: i * 0.06 }}
                >
                  <div>
                    <h3 className="font-display text-[1.6rem] leading-tight text-ink">{o.title}</h3>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] font-semibold uppercase tracking-[0.15em] text-cobalt">
                      <span>{o.team}</span>
                      <span>{o.location}</span>
                      <span>{o.type}</span>
                    </p>
                    <p className="mt-3 max-w-2xl text-body-sm text-ink/65">{o.summary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApply(o)}
                    className="inline-flex h-12 shrink-0 items-center self-start rounded-full bg-navy px-7 text-body-sm font-bold tracking-wide text-white transition-colors duration-300 hover:bg-cobalt sm:self-center"
                  >
                    Apply<span className="sr-only"> for {o.title}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="bg-white py-24 sm:py-32" aria-labelledby="process-title">
      <div className="shell">
        <Heading id="process-title" lead="How we" accent="hire" />
        <ol className="relative mx-auto mt-16 grid max-w-6xl gap-10 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden border-t-[1.5px] border-dashed border-cobalt/25 md:block"
          />
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease, delay: i * 0.12 }}
            >
              <span className="relative flex h-12 w-12 items-center justify-center">
                <span aria-hidden className="tile absolute inset-1 bg-navy" />
                <span className="relative font-display text-[1.1rem] font-bold text-white">{i + 1}</span>
              </span>
              <h3 className="mt-6 font-display text-[1.5rem] text-ink">{s.title}</h3>
              <p className="mt-3 text-body-sm leading-relaxed text-ink/65">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
