import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { getContent } from '@/content';
import { montserrat, plexArabic, reemKufi } from '@/lib/fonts';
import { LOCALES, SITE, absoluteUrl, isLocale, withBasePath } from '@/lib/site';
import '@/styles/globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: '#05071a',
  colorScheme: 'dark',
};

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = getContent(locale);
  return {
    // Trailing slash so relative URLs resolve inside the base path. Every URL below is absolute anyway.
    metadataBase: new URL(`${SITE.url}/`),
    title: c.meta.title,
    description: c.meta.description,
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: { en: absoluteUrl('/en'), ar: absoluteUrl('/ar'), 'x-default': absoluteUrl('/en') },
    },
    openGraph: {
      type: 'website',
      siteName: 'Experts Live Saudi',
      title: c.meta.title,
      description: c.meta.description,
      locale: c.meta.ogLocale,
      alternateLocale: locale === 'en' ? ['ar_SA'] : ['en_US'],
      url: absoluteUrl(`/${locale}`),
      images: [{ url: absoluteUrl('/og-call-for-professionals.png'), width: 1200, height: 630, alt: c.meta.title }],
    },
    twitter: { card: 'summary_large_image', title: c.meta.title, description: c.meta.description, images: [absoluteUrl('/og-call-for-professionals.png')] },
    icons: { icon: withBasePath('/favicon.png'), apple: withBasePath('/apple-touch-icon.png') },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = getContent(locale);

  return (
    <html
      lang={locale}
      dir={c.dir}
      className={`${montserrat.variable} ${plexArabic.variable} ${reemKufi.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          {c.a11y.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
