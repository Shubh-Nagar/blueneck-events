import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { careers, contact } from '../../data/site';
import { ease } from '../../lib/motion';
import { ErrorText, Field, inputCls, Label, Select } from '../contact/ContactForm';

type Status =
  { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; via: 'endpoint' | 'email' } | { kind: 'error'; message: string };

const EXPERIENCE = ['Student or fresher', 'Under 2 years', '2 to 5 years', '5 to 10 years', 'More than 10 years'];

/**
 * Job application form. Delivery mirrors the enquiry form:
 * - VITE_FORM_ENDPOINT set → POST JSON there, tagged `form: "careers"`.
 * - Otherwise → open the visitor's email app addressed to careers.email (or contact.email).
 * CVs travel as a link (Drive, Dropbox, LinkedIn) so both routes work without uploads.
 */
export default function ApplicationForm({
  team,
  role,
  onTeamChange,
  onRoleChange,
}: {
  team: string;
  role: string;
  onTeamChange: (v: string) => void;
  onRoleChange: (v: string) => void;
}) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inbox = careers.email || contact.email;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = 'Enter your name.';
    if (!data.email?.trim()) errs.email = 'Enter an email so we can reply.';
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = 'Check the email address.';
    if (!data.team) errs.team = 'Choose the team you would like to join.';
    if (data.cv && !/^https?:\/\/\S+\.\S+/.test(data.cv)) errs.cv = 'Paste a full link, starting with https://';
    if (!data.message?.trim()) errs.message = 'Tell us a little about yourself.';
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    if (endpoint) {
      setStatus({ kind: 'sending' });
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ form: 'careers', ...data }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus({ kind: 'sent', via: 'endpoint' });
        form.reset();
        onRoleChange('');
        onTeamChange('');
      } catch {
        setStatus({ kind: 'error', message: 'The application did not go through. Check your connection and send it again.' });
      }
      return;
    }

    if (inbox) {
      const lines: [string, string | undefined][] = [
        ['Name', data.name],
        ['Email', data.email],
        ['Phone', data.phone],
        ['City', data.city],
        ['Team', data.team],
        ['Role', data.role],
        ['Experience', data.experience],
        ['CV / portfolio', data.cv],
      ];
      const body = [...lines.filter(([, v]) => v?.trim()).map(([k, v]) => `${k}: ${v}`), '', data.message].join('\n');
      const subject = `Application: ${data.role?.trim() || data.team} — ${data.name}`;
      window.location.href = `mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: 'sent', via: 'email' });
      return;
    }

    setStatus({
      kind: 'error',
      message: 'This form is not connected yet. Add careers.email in src/data/site.ts or set VITE_FORM_ENDPOINT.',
    });
  }

  if (status.kind === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
        className="py-6 text-center"
      >
        <img src="/brand/blueneck-mark.png" alt="" className="mx-auto h-16 w-16" />
        <h3 className="mt-8 font-display text-h3 text-ink">
          {status.via === 'endpoint' ? 'Application sent' : 'Your email is ready to send'}
        </h3>
        <p className="mx-auto mt-4 max-w-prose text-body text-ink/65">
          {status.via === 'endpoint'
            ? 'Thank you. We read every application and will reach out if there is a fit.'
            : 'Your email app has opened with your details filled in. Press send there, and attach your CV if you like.'}
        </p>
        <button onClick={() => setStatus({ kind: 'idle' })} className="link-draw mt-8 text-body-sm font-semibold text-navy">
          Send another application
        </button>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      <Field label="Your name" name="name" error={errors.name} autoComplete="name" />
      <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />
      <Field label="City" name="city" placeholder="e.g. Indore" autoComplete="address-level2" optional />

      <Select label="Team" name="team" value={team} onChange={(e) => onTeamChange(e.target.value)} error={errors.team}>
        <option value="">Choose one</option>
        {careers.teams.map((t) => (
          <option key={t.name}>{t.name}</option>
        ))}
        <option>Internship</option>
        <option>Not sure yet</option>
      </Select>
      <Select label="Experience in events" name="experience" defaultValue="">
        <option value="">Choose a range</option>
        {EXPERIENCE.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </Select>

      <Field
        label="Role"
        name="role"
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
        placeholder="e.g. Event manager"
        optional
      />
      <Field
        label="Link to CV or portfolio"
        name="cv"
        type="url"
        inputMode="url"
        placeholder="Drive, Dropbox, LinkedIn…"
        error={errors.cv}
        optional
      />

      <div className="sm:col-span-2">
        <Label htmlFor="message">About you</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-err' : undefined}
          placeholder="The events you have worked on, what you did on them, and what you would like to do next."
          className={inputCls(!!errors.message) + ' resize-y'}
        />
        <ErrorText id="message-err" text={errors.message} />
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2">
        <AnimatePresence>
          {status.kind === 'error' && (
            <motion.p
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md text-body-sm text-[#B42318]"
            >
              {status.message}
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="submit"
          disabled={status.kind === 'sending'}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-ink px-8 py-4 text-body-sm font-bold tracking-wide text-white transition-colors duration-500 disabled:opacity-60"
        >
          <span
            aria-hidden
            className="absolute inset-0 translate-y-full bg-navy transition-transform duration-500 ease-stage group-hover:translate-y-0"
          />
          <span className="relative">{status.kind === 'sending' ? 'Sending application' : 'Send application'}</span>
          <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
