import { useState, type FormEvent, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { contact, services } from '../../data/site';
import { ease } from '../../lib/motion';

type Status =
  { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; via: 'endpoint' | 'email' } | { kind: 'error'; message: string };

const GUESTS = ['Under 100', '100 to 500', '500 to 2,000', '2,000 to 10,000', 'More than 10,000'];

/**
 * Enquiry form.
 * - If VITE_FORM_ENDPOINT is set, posts JSON there (Formspree, Getform, your API).
 * - Otherwise, if an email is set in src/data/site.ts, opens the visitor's email
 *   app with the enquiry filled in.
 */
export default function ContactForm({ initialType = '' }: { initialType?: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = 'Enter your name.';
    if (!data.email?.trim() && !data.phone?.trim()) errs.email = 'Enter an email or a phone number so we can reply.';
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errs.email = 'Check the email address.';
    if (!data.message?.trim()) errs.message = 'Tell us a little about the event.';
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
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus({ kind: 'sent', via: 'endpoint' });
        form.reset();
      } catch {
        setStatus({ kind: 'error', message: 'The enquiry did not go through. Check your connection and send it again.' });
      }
      return;
    }

    if (contact.email) {
      const lines: [string, string | undefined][] = [
        ['Name', data.name],
        ['Organisation', data.company],
        ['Email', data.email],
        ['Phone', data.phone],
        ['Type of event', data.type],
        ['Date', data.date],
        ['City', data.city],
        ['Guests', data.guests],
      ];
      const body = [...lines.filter(([, v]) => v?.trim()).map(([k, v]) => `${k}: ${v}`), '', data.message].join('\n');
      const subject = `Event enquiry from ${data.name}${data.type ? ` — ${data.type}` : ''}`;
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: 'sent', via: 'email' });
      return;
    }

    setStatus({
      kind: 'error',
      message: 'This form is not connected yet. Add an email in src/data/site.ts or set VITE_FORM_ENDPOINT.',
    });
  }

  if (status.kind === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
        className="text-center"
      >
        <img src="/brand/blueneck-mark.png" alt="" className="mx-auto h-16 w-16" />
        <h2 className="mt-8 font-display text-h3 text-ink">
          {status.via === 'endpoint' ? 'Enquiry sent' : 'Your email is ready to send'}
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-body text-ink/65">
          {status.via === 'endpoint'
            ? 'Thank you. We have your details and will be in touch soon.'
            : 'Your email app has opened with the details filled in. Press send there and we will be in touch soon.'}
        </p>
        <button onClick={() => setStatus({ kind: 'idle' })} className="link-draw mt-8 text-body-sm font-semibold text-navy">
          Write another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      <Field label="Your name" name="name" error={errors.name} autoComplete="name" required />
      <Field label="Organisation" name="company" autoComplete="organization" optional />
      <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />

      <Select label="Type of event" name="type" defaultValue={services.find((s) => s.slug === initialType)?.name ?? ''}>
        <option value="">Choose one</option>
        {services.map((s) => (
          <option key={s.slug}>{s.name}</option>
        ))}
        <option>Something else</option>
      </Select>
      <Select label="Expected guests" name="guests" defaultValue="">
        <option value="">Choose a range</option>
        {GUESTS.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </Select>
      <Field label="Date or month" name="date" placeholder="e.g. February 2027" optional />
      <Field label="City" name="city" placeholder="e.g. Indore" optional />

      <div className="sm:col-span-2">
        <Label htmlFor="message">About the event</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-err' : undefined}
          placeholder="The occasion, who it is for, and anything you already know about venue or format."
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
          <span className="relative">{status.kind === 'sending' ? 'Sending enquiry' : 'Send enquiry'}</span>
          <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}

export const inputCls = (err: boolean) =>
  `mt-2 block w-full rounded-xl border-0 bg-[#F3F6FA] px-4 py-3.5 text-body-sm text-ink placeholder:text-ink/35 ring-1 ring-inset transition-[box-shadow,background-color] focus:bg-white focus:outline-none focus:ring-2 ${
    err ? 'ring-[#B42318]' : 'ring-transparent focus:ring-cobalt'
  }`;

export function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-[0.8rem] font-semibold text-ink/75">
      {children}
      {optional && <span className="font-normal text-ink/40"> (optional)</span>}
    </label>
  );
}

export function ErrorText({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="mt-2 text-[0.8rem] text-[#B42318]">
      {text}
    </p>
  ) : null;
}

export function Field({
  label,
  name,
  error,
  optional,
  ...rest
}: { label: string; name: string; error?: string; optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={name} optional={optional}>
        {label}
      </Label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        className={inputCls(!!error)}
        {...rest}
      />
      <ErrorText id={`${name}-err`} text={error} />
    </div>
  );
}

export function Select({
  label,
  name,
  children,
  error,
  ...rest
}: {
  label: string;
  name: string;
  children: ReactNode;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        className={inputCls(!!error) + ' cursor-pointer'}
        {...rest}
      >
        {children}
      </select>
      <ErrorText id={`${name}-err`} text={error} />
    </div>
  );
}
