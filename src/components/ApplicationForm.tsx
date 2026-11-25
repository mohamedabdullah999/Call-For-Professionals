'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { Content } from '@/content/types';
import { LIMITS, speakerApplicationSchema, toFieldErrors, type ErrorCode, type FieldName } from '@/lib/applications';
import { Button } from './Button';
import styles from './ApplicationForm.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FormError = 'network' | 'rateLimited' | 'server' | 'summary';

/** Field order on screen; also the order used to focus the first invalid field. */
const FIELDS: FieldName[] = ['fullName', 'jobTitle', 'expertise', 'company', 'linkedinUrl', 'bio'];

/** "Apply to speak": the only form on the page. Validation is shared with POST /api/applications. */
export function ApplicationForm({ c }: { c: Pick<Content, 'locale' | 'form'> }) {
  const f = c.form;
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, ErrorCode>>({});
  const [formError, setFormError] = useState<FormError | null>(null);
  const [bioLength, setBioLength] = useState(0);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const fill = (template: string, values: Record<string, number>) =>
    template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ''));

  const message = (field: string, code: ErrorCode) => {
    const limits = LIMITS[field as FieldName];
    return fill(f.errors[code], { min: limits?.min ?? 0, max: limits?.max ?? 0 });
  };

  const focusFirstError = (fieldErrors: Record<string, ErrorCode>) => {
    const first = FIELDS.find((name) => fieldErrors[name]);
    const el = first ? formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`) : null;
    (el ?? summaryRef.current)?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    const data = new FormData(e.currentTarget);
    const value = (name: string) => String(data.get(name) ?? '');
    const payload = {
      locale: c.locale,
      fullName: value('fullName'),
      jobTitle: value('jobTitle'),
      expertise: value('expertise'),
      company: value('company'),
      linkedinUrl: value('linkedinUrl'),
      bio: value('bio'),
      company_url: value('company_url'),
    };

    const parsed = speakerApplicationSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setFormError('summary');
      setStatus('error');
      requestAnimationFrame(() => focusFirstError(fieldErrors));
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus('submitting');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus('success');
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { fields?: Record<string, ErrorCode> };
      if (res.status === 422 && body.fields) {
        setErrors(body.fields);
        setFormError('summary');
        requestAnimationFrame(() => focusFirstError(body.fields ?? {}));
      } else {
        setFormError(res.status === 429 ? 'rateLimited' : 'server');
        requestAnimationFrame(() => summaryRef.current?.focus());
      }
      setStatus('error');
    } catch {
      setFormError('network');
      setStatus('error');
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  const reset = () => {
    formRef.current?.reset();
    setStatus('idle');
    setErrors({});
    setFormError(null);
    setBioLength(0);
  };

  /* ---------- field helpers ---------- */
  const controlId = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-error`;
  const hintId = (name: string) => `${uid}-${name}-hint`;
  const describedBy = (name: string, hint?: boolean) =>
    [hint ? hintId(name) : null, errors[name] ? errId(name) : null].filter(Boolean).join(' ') || undefined;

  // Plain render helpers (not components) so inputs keep their values across re-renders.
  function field({ name, hint }: { name: FieldName; hint?: ReactNode }, control: ReactNode) {
    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={controlId(name)}>
          {f.fields[name].label}
        </label>
        {hint ? (
          <span id={hintId(name)} className={styles.hint}>
            {hint}
          </span>
        ) : null}
        {control}
        {errors[name] ? (
          <span id={errId(name)} className={styles.error}>
            {message(name, errors[name])}
          </span>
        ) : null}
      </div>
    );
  }

  const input = (name: FieldName, opts: { type?: string; ltr?: boolean; autoComplete?: string; hint?: boolean } = {}) => (
    <input
      id={controlId(name)}
      name={name}
      type={opts.type ?? 'text'}
      className={`${styles.control} ${opts.ltr ? styles.ltr : ''}`}
      placeholder={f.fields[name].placeholder}
      autoComplete={opts.autoComplete}
      maxLength={LIMITS[name].max}
      aria-required
      aria-invalid={errors[name] ? true : undefined}
      aria-describedby={describedBy(name, opts.hint)}
      dir={opts.ltr ? 'ltr' : undefined}
    />
  );

  const bioCount = bioLength < LIMITS.bio.min
    ? fill(f.counter.belowMin, { n: LIMITS.bio.min - bioLength })
    : fill(f.counter.count, { n: bioLength, max: LIMITS.bio.max });

  /* ---------- render ---------- */
  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>{f.heading}</h3>

      {status === 'success' ? (
        <div className={styles.success} role="status">
          <span className={styles.successMark} aria-hidden="true">
            ✓
          </span>
          <h4 ref={successRef} tabIndex={-1} className={styles.successTitle}>
            {f.successTitle}
          </h4>
          <p className={styles.successBody}>{f.successBody}</p>
          <Button type="button" variant="quiet" size="small" onClick={reset}>
            {f.sendAnother}
          </Button>
        </div>
      ) : (
        <>
          <p className={styles.intro}>{f.intro}</p>
          <form
            ref={formRef}
            className={styles.form}
            onSubmit={onSubmit}
            onInput={(e) => {
              const target = e.target as HTMLInputElement | HTMLTextAreaElement;
              if (target.name === 'bio') setBioLength(target.value.length);
              // Clear a field's error as soon as the person edits it
              if (errors[target.name]) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next[target.name];
                  return next;
                });
              }
            }}
            noValidate
          >
            {formError ? (
              <p ref={summaryRef} tabIndex={-1} className={styles.summary} role="alert">
                {f.errors[formError]}
              </p>
            ) : null}

            {field({ name: 'fullName' }, input('fullName', { autoComplete: 'name' }))}

            <div className={styles.row}>
              {field({ name: 'jobTitle' }, input('jobTitle', { autoComplete: 'organization-title' }))}
              {field({ name: 'expertise' }, input('expertise'))}
            </div>

            {field({ name: 'company' }, input('company', { autoComplete: 'organization' }))}

            {field(
              { name: 'linkedinUrl', hint: f.fields.linkedinUrl.hint },
              input('linkedinUrl', { type: 'url', ltr: true, autoComplete: 'url', hint: true }),
            )}

            {field(
              { name: 'bio', hint: f.fields.bio.hint },
              <>
                <textarea
                  id={controlId('bio')}
                  name="bio"
                  rows={7}
                  maxLength={LIMITS.bio.max}
                  className={styles.control}
                  aria-required
                  aria-invalid={errors.bio ? true : undefined}
                  aria-describedby={`${describedBy('bio', true)} ${uid}-bio-count`}
                />
                {/* Live counter. Part of the textarea's description (read on focus) rather than a live
                    region, so screen readers aren't interrupted on every keystroke. */}
                <span
                  id={`${uid}-bio-count`}
                  className={`${styles.counter} ${bioLength >= LIMITS.bio.min ? styles.counterOk : ''}`}
                >
                  {bioCount}
                </span>
              </>,
            )}

            {/* Honeypot for bots; hidden from people and assistive tech */}
            <div className={styles.honeypot} aria-hidden="true">
              <label>
                Company URL
                <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className={styles.footer}>
              <Button type="submit" block disabled={status === 'submitting'} aria-disabled={status === 'submitting'}>
                {status === 'submitting' ? f.sending : f.submit}
              </Button>
              <p className={styles.privacy}>{f.privacyNote}</p>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
