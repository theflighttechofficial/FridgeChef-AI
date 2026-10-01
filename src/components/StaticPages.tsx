import React, { useState } from 'react';
import { SiteLayout } from './SiteLayout';
import { CONTACT_ADDRESS, CONTACT_EMAIL } from '../config/site';
import { track } from '../utils/analytics';

const inputBase =
  'w-full bg-[#141816] border rounded-[3px] px-3.5 py-3 text-[15px] text-[#F5F1E8] placeholder:text-[#6F6A60] outline-none focus:border-[#F5F1E8]/50';

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const validate = (name: string, email: string, message: string): FieldErrors => {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = 'Please enter your name.';
  if (!email.trim()) errors.email = 'Please enter your email so we can reply.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.email = 'That email address does not look right.';
  if (message.trim().length < 10) errors.message = 'Please write at least 10 characters.';
  else if (message.length > 4000) errors.message = 'Please keep it under 4,000 characters.';
  return errors;
};

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot, real visitors never see it
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(name, email, message);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (res.status === 429) throw new Error('Too many messages from this connection. Please try again in a few minutes.');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.fields) setErrors(data.fields);
        throw new Error(data?.error || 'Your message could not be sent. Please try again.');
      }
      track('contact_submitted');
      window.location.hash = '#/thanks';
    } catch (err: any) {
      setFormError(err?.message || 'Your message could not be sent. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const fieldError = (key: keyof FieldErrors) =>
    errors[key] ? (
      <p id={`contact-${key}-error`} className="mt-1.5 text-sm text-[#FF8A73]">
        {errors[key]}
      </p>
    ) : null;

  return (
    <SiteLayout title="Contact" description="Send the FridgeChef team a question, bug report or idea.">
      <h1 className="font-serif text-4xl sm:text-5xl">Contact</h1>
      <p className="mt-4 text-[15px] leading-7 text-[#B9B4A8] max-w-xl">
        Found a bug, have an idea, or want your data deleted? Write to us here and we will reply by email.
      </p>

      {(CONTACT_EMAIL || CONTACT_ADDRESS) && (
        <dl className="mt-8 grid sm:grid-cols-2 gap-6 text-[15px]">
          {CONTACT_EMAIL && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8F8A80]">Email</dt>
              <dd className="mt-1">
                <a className="underline underline-offset-4 hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
          )}
          {CONTACT_ADDRESS && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8F8A80]">Address</dt>
              <dd className="mt-1 whitespace-pre-line text-[#D9D4C8]">{CONTACT_ADDRESS}</dd>
            </div>
          )}
        </dl>
      )}

      <form onSubmit={submit} noValidate className="mt-10 space-y-5 max-w-xl border-t border-[#F5F1E8]/10 pt-10">
        {formError && (
          <div role="alert" className="px-4 py-3 rounded-[3px] border border-[#FF5A3C]/50 bg-[#FF5A3C]/10 text-sm text-[#FFD2C8]">
            {formError}
          </div>
        )}

        <div>
          <label htmlFor="contact-name" className="block text-sm mb-1.5">Name</label>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={`${inputBase} ${errors.name ? 'border-[#FF5A3C]' : 'border-[#F5F1E8]/15'}`}
          />
          {fieldError('name')}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm mb-1.5">Email</label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`${inputBase} ${errors.email ? 'border-[#FF5A3C]' : 'border-[#F5F1E8]/15'}`}
          />
          {fieldError('email')}
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm mb-1.5">Message</label>
          <textarea
            id="contact-message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`${inputBase} resize-y ${errors.message ? 'border-[#FF5A3C]' : 'border-[#F5F1E8]/15'}`}
          />
          {fieldError('message')}
        </div>

        <div aria-hidden className="hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="px-6 py-3.5 rounded-[3px] bg-[#FF5A3C] text-[#1A0A05] font-semibold hover:bg-[#ff7357] disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Send message'}
        </button>
        <p className="text-xs text-[#8F8A80]">
          We store your message to reply to it. See the <a href="#/privacy" className="underline underline-offset-4">privacy policy</a>.
        </p>
      </form>
    </SiteLayout>
  );
};

export const ThanksPage: React.FC = () => (
  <SiteLayout title="Message sent" description="Thanks for getting in touch with FridgeChef.">
    <p className="font-serif text-[#FF5A3C] text-lg">Message sent</p>
    <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Thanks, we have your message.</h1>
    <p className="mt-5 text-[15px] leading-7 text-[#B9B4A8] max-w-xl">
      We read every message and usually reply within a few working days. Keep an eye on your inbox, including the spam
      folder.
    </p>
    <div className="mt-10 flex flex-wrap gap-4">
      <a href="#/" className="px-6 py-3.5 rounded-[3px] bg-[#FF5A3C] text-[#1A0A05] font-semibold hover:bg-[#ff7357]">
        Back to the app
      </a>
      <a href="#/contact" className="px-6 py-3.5 rounded-[3px] border border-[#F5F1E8]/20 hover:border-[#F5F1E8]/50">
        Send another message
      </a>
    </div>
  </SiteLayout>
);

export const NotFoundPage: React.FC = () => (
  <SiteLayout title="Page not found" description="This page does not exist on FridgeChef.">
    <p className="font-serif text-[#FF5A3C] text-lg tabular-nums">404</p>
    <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Nothing in this part of the fridge.</h1>
    <p className="mt-5 text-[15px] leading-7 text-[#B9B4A8] max-w-xl">
      The page you asked for does not exist or has moved. Check the address, or head back to the app.
    </p>
    <div className="mt-10 flex flex-wrap gap-4">
      <a href="/" className="px-6 py-3.5 rounded-[3px] bg-[#FF5A3C] text-[#1A0A05] font-semibold hover:bg-[#ff7357]">
        Go to FridgeChef
      </a>
      <a href="#/contact" className="px-6 py-3.5 rounded-[3px] border border-[#F5F1E8]/20 hover:border-[#F5F1E8]/50">
        Report a broken link
      </a>
    </div>
  </SiteLayout>
);
