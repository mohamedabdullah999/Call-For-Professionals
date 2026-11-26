import type { Content } from './types';

const en: Content = {
  locale: 'en',
  dir: 'ltr',
  meta: {
    title: 'Call For Professional Speakers | Experts Live Saudi 2026, 29–30 Nov, Riyadh',
    description:
      'Call For Professional Speakers: apply to speak at Experts Live Saudi 2026, 29–30 November at PNU Conference & Convention Center, Riyadh. Share your expertise and the conference topics you can speak about.',
    ogLocale: 'en_US',
  },
  a11y: {
    skip: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    primaryNav: 'Main',
    switchLanguage: 'Read this page in Arabic',
    opensNewTab: '(opens in a new tab)',
    pnuLogo: 'Princess Nourah bint Abdulrahman University',
    elksaLogo: 'Experts Live Saudi',
    homeLink: 'Experts Live Saudi, back to top',
  },
  nav: [
    { label: 'Apply to speak', href: '#apply' },
    { label: 'Programme', href: '#programme' },
    { label: 'Partners', href: '#partners' },
  ],
  // Plain <a>: the components add the base path
  langSwitch: { label: 'العربية', href: '/ar', lang: 'ar' },
  ctaApply: 'Apply to speak',
  hero: {
    kicker: 'Experts Live Saudi 2026',
    titleLines: ['Call For', 'Professional Speakers'],
    lead: 'Experts Live Saudi 2026 is looking for speakers. Share your expertise with 1,000+ attendees in Riyadh.',
    tagline: 'Learn. Share. Lead.',
    dateLabel: 'When',
    date: '29–30 November 2026',
    days: 'Sunday and Monday',
    venueLabel: 'Where',
    venue: 'PNU Conference & Convention Center, Riyadh',
  },
  countdown: {
    live: 'Happening now',
    over: 'Thank you for joining us',
    daysToGo: { one: 'Starts tomorrow', many: '{n} days to go' },
  },
  facts: [
    { value: '1,000+', label: 'attendees' },
    { value: '500+', label: 'C-level and digital economy leaders' },
    { value: '55+', label: 'speakers' },
    { value: '16', label: 'countries represented by speakers' },
    { value: '6', label: 'tracks' },
    { value: '8', label: 'hands-on lab rooms' },
  ],
  apply: {
    label: 'Call For Professional Speakers',
    heading: 'Apply to speak at Experts Live Saudi 2026',
    intro:
      'Tell us who you are, what you specialise in and which of the conference topics you can speak about. The six tracks are listed further down the page.',
    stepsHeading: 'How it works',
    // TBC: selection process and reply timing not confirmed by the organiser
    steps: [
      'Send your application with the form.',
      'The organising team reviews it.',
      'We contact you with the next steps.',
    ],
  },
  form: {
    heading: 'Apply to speak',
    intro: 'All fields are required.',
    fields: {
      fullName: { label: 'Speaker name' },
      jobTitle: { label: 'Job title' },
      expertise: { label: 'Area of expertise' },
      company: { label: 'Current company' },
      linkedinUrl: {
        label: 'LinkedIn profile',
        placeholder: 'https://www.linkedin.com/in/your-name',
        hint: 'The link to your public LinkedIn profile.',
      },
      bio: {
        label: 'Short bio & topics of interest',
        hint: 'A short bio and the conference topics you’re interested in speaking about, 50 to 1,500 characters.',
      },
    },
    counter: {
      belowMin: '{n} more to reach the minimum',
      count: '{n} / {max} characters',
    },
    submit: 'Send application',
    sending: 'Sending…',
    successTitle: 'Application received',
    successBody: 'Thank you. We’ve saved your application and the organising team will review it.',
    sendAnother: 'Send another',
    // TBC: link to a privacy policy once one exists
    privacyNote: 'We use these details only to review your application to speak and to contact you about it.',
    errors: {
      required: 'Fill in this field.',
      tooShort: 'Use at least {min} characters.',
      tooLong: 'Keep this under {max} characters.',
      linkedin: 'Enter a link to your LinkedIn profile, like https://www.linkedin.com/in/your-name',
      summary: 'Some fields need your attention.',
      network: 'Couldn’t send. Check your connection and try again.',
      rateLimited: 'Too many attempts from this connection. Wait a minute, then try again.',
      server: 'Couldn’t save your details. Try again, or email hany@expertslive.sa.',
    },
  },
  programme: {
    heading: 'Six tracks on the digital economy',
    intro:
      'Opening keynotes and panels on the main stage, then six parallel tracks and eight hands-on workshop rooms at Level 300–400.',
    tracks: [
      { name: 'Artificial Intelligence', topics: 'Generative AI, AI agents, AI adoption' },
      { name: 'Cloud & Hyperscale', topics: 'Cloud architecture, multi-cloud, migration' },
      { name: 'Governance & Security', topics: 'Governance, cybersecurity, identity, compliance' },
      { name: 'Data & IoT', topics: 'Data platforms, IoT and smart devices, analytics' },
      { name: 'Automation', topics: 'Automation, digital experience, digital economy' },
      { name: 'Endpoint & Device Management', topics: 'Modern workplace, endpoint security' },
    ],
  },
  speakers: {
    heading: '55+ speakers from 16 countries',
    intro: 'Saudi leaders, global experts and Microsoft MVPs. A selection:',
    hostLabel: 'Host',
    mcLabel: 'MC for both days',
    mc: 'Dr. Atheer Almutairi',
    list: [
      { name: 'Prof. Hanan Aljuaid', role: 'Director, AI for Healthcare Research Chair, PNU' },
      { name: 'Dr Manal Alassaf', role: 'SVP Marketplace, HUMAIN' },
      { name: 'Dr Mona Al-Muheid', role: 'VP Data & AI Models, Healthcare, HUMAIN' },
      { name: 'Zainab Alamin', role: 'VP National Digital Transformation, Microsoft' },
      { name: 'Prof. Sara Alotaibi', role: 'Senior Advisor, RDIA' },
      { name: 'Dr. Fatimah Alakeel', role: 'Cybersecurity & AI Executive' },
      { name: 'Dr. Abdullah Altaf', role: 'Cloud Architect R&D, SDAIA' },
      { name: 'Dr Mohammed Dighriri', role: 'NCEC' },
      { name: 'Ahmed Gamal', role: 'VAST Data' },
      { name: 'Leon Gordon', role: 'Onyx Data' },
      { name: 'Hazem Ali', role: 'Skytells' },
      { name: 'Majd Aldeen Masriah', role: 'Geidea' },
      { name: 'Mohamed Mortadha Manai', role: 'Netflix' },
    ],
    all: 'See all speakers',
  },
  partners: {
    heading: 'Organised with',
    groupTitle: 'Organised by',
  },
  footer: {
    line: 'Experts Live Saudi · PNU, Riyadh · 29–30 Nov 2026 · Presented by ZAT.VC & Cloud Mechanics · In partnership with Microsoft, MCIT, PNU & AI Chair',
    contact: 'Talk to us',
    website: 'Main website',
    registration: 'Registration',
    rights: '© 2026 Experts Live Saudi',
  },
  mobileBar: { text: '29–30 Nov, Riyadh' },
  notFound: {
    heading: 'This page doesn’t exist',
    body: 'The link may be old or mistyped.',
    back: 'Go to the Experts Live Saudi page',
  },
};

export default en;
