/**
 * Shape of all page copy. Every fact in en.ts / ar.ts must come from the official
 * agent kit (EXPERTS-LIVE-SAUDI.md, BRAND.md). Anything not confirmed is listed in
 * docs/OPEN-ITEMS.md and marked with a `// TBC:` comment where it is used.
 */
export type Locale = 'en' | 'ar';

export interface Track {
  name: string;
  topics: string;
}

export interface Item {
  title: string;
  text: string;
}

export interface Speaker {
  name: string;
  role: string;
}

export interface Tier {
  name: string;
  price: string;
  note?: string;
}

export interface FieldCopy {
  label: string;
  hint?: string;
  placeholder?: string;
}

export interface Content {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  meta: { title: string; description: string; ogLocale: string };
  a11y: {
    skip: string;
    menuOpen: string;
    menuClose: string;
    primaryNav: string;
    switchLanguage: string;
    opensNewTab: string;
    pnuLogo: string;
    elksaLogo: string;
    homeLink: string;
  };
  nav: { label: string; href: string }[];
  langSwitch: { label: string; href: string; lang: Locale };
  /** Label of every CTA on the page; all of them link to the form (#apply) */
  ctaApply: string;
  hero: {
    kicker: string;
    titleLines: [string, string];
    lead: string;
    tagline: string;
    dateLabel: string;
    date: string;
    days: string;
    venueLabel: string;
    venue: string;
  };
  countdown: {
    live: string;
    over: string;
    /** {n} is replaced with the number of days. Arabic uses all four forms. */
    daysToGo: { one: string; two?: string; few?: string; many: string };
  };
  facts: { value: string; label: string }[];
  apply: {
    label: string;
    heading: string;
    intro: string;
    stepsHeading: string;
    steps: string[];
  };
  form: {
    heading: string;
    intro: string;
    fields: {
      fullName: FieldCopy;
      jobTitle: FieldCopy;
      expertise: FieldCopy;
      company: FieldCopy;
      linkedinUrl: FieldCopy;
      bio: FieldCopy;
    };
    counter: {
      /** {n} is the number of characters still needed to reach the minimum */
      belowMin: string;
      /** {n} is the current length, {max} the limit */
      count: string;
    };
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
    privacyNote: string;
    errors: {
      required: string;
      /** {min} is replaced with the minimum length */
      tooShort: string;
      /** {max} is replaced with the character limit */
      tooLong: string;
      linkedin: string;
      summary: string;
      network: string;
      rateLimited: string;
      server: string;
    };
  };
  superNourah: {
    time: string;
    when: string;
    heading: string;
    body: string;
  };
  programme: {
    heading: string;
    intro: string;
    tracks: Track[];
  };
  speakers: {
    heading: string;
    intro: string;
    hostLabel: string;
    mcLabel: string;
    mc: string;
    list: Speaker[];
    all: string;
  };
  partners: {
    heading: string;
    /** Logos and their order live in src/lib/organisers.ts */
    groupTitle: string;
  };
  partnerCta: {
    heading: string;
    body: string;
  };
  footer: {
    line: string;
    contact: string;
    website: string;
    registration: string;
    rights: string;
  };
  mobileBar: { text: string };
  notFound: { heading: string; body: string; back: string };
}
