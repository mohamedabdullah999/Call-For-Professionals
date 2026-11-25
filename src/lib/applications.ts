import { z } from 'zod';

/**
 * "Apply to speak" validation, shared by the form (client) and the API route (server).
 * Error messages are codes; the UI maps them to localised copy.
 */
export const LIMITS = {
  fullName: { min: 2, max: 120 },
  jobTitle: { min: 2, max: 160 },
  expertise: { min: 2, max: 160 },
  company: { min: 2, max: 160 },
  linkedinUrl: { min: 1, max: 300 },
  bio: { min: 50, max: 1500 },
} as const;

export type FieldName = keyof typeof LIMITS;

const ERROR_CODES = ['required', 'tooShort', 'tooLong', 'linkedin'] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

const text = ({ min, max }: { min: number; max: number }) =>
  z
    .string({ error: 'required' })
    .trim()
    .min(1, { error: 'required' })
    .min(min, { error: 'tooShort' })
    .max(max, { error: 'tooLong' });

/** True for an http(s) link to a page on linkedin.com (any subdomain, e.g. www. or sa.). */
export function isLinkedInUrl(value: string): boolean {
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return false;
  }
  const host = u.hostname.toLowerCase();
  return (
    (u.protocol === 'https:' || u.protocol === 'http:') &&
    (host === 'linkedin.com' || host.endsWith('.linkedin.com')) &&
    !u.username &&
    !u.password &&
    u.pathname.length > 1
  );
}

/** People often paste "linkedin.com/in/name" without the scheme; accept it and add https://. */
const linkedinUrl = z
  .string({ error: 'required' })
  .trim()
  .min(1, { error: 'required' })
  .max(LIMITS.linkedinUrl.max, { error: 'tooLong' })
  .transform((v) => (/^[a-z][a-z\d+.-]*:/i.test(v) ? v : `https://${v}`))
  .refine(isLinkedInUrl, { error: 'linkedin' });

export const speakerApplicationSchema = z.object({
  locale: z.enum(['en', 'ar']),
  fullName: text(LIMITS.fullName),
  jobTitle: text(LIMITS.jobTitle),
  expertise: text(LIMITS.expertise),
  company: text(LIMITS.company),
  linkedinUrl,
  bio: text(LIMITS.bio),
  // Honeypot: real people never fill this hidden field
  company_url: z.string().max(500).optional(),
});

export type SpeakerApplicationInput = z.input<typeof speakerApplicationSchema>;
export type SpeakerApplication = z.output<typeof speakerApplicationSchema>;

/** Flattens zod issues to { fieldName: ErrorCode }, keeping the first issue per field. */
export function toFieldErrors(error: z.ZodError): Record<string, ErrorCode> {
  const out: Record<string, ErrorCode> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (out[key]) continue;
    const code = issue.message as ErrorCode;
    out[key] = (ERROR_CODES as readonly string[]).includes(code) ? code : 'required';
  }
  return out;
}
