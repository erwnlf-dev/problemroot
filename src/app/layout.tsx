// FILE: src/app/layout.tsx
'use client';
import { Inter } from 'next/font/google';
import { StoreProvider } from './store';
import Script from 'next/script';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProblemRoot - Fast Incident Tracking',
  description: 'Track incidents, isolate root causes, assign action items. Engineering teams made easy.',
  openGraph: {
    title: 'ProblemRoot',
    description: 'Track incidents, isolate root causes, assign action items. Engineering teams made easy.',
    url: 'https://problemroot.com',
    siteName: 'ProblemRoot',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ProblemRoot',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Track incidents, isolate root causes, assign action items. Engineering teams made easy.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} bg-page text-text min-h-screen`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-page text-text">
        <StoreProvider>
          {children}
        </StoreProvider>
        <Script src="/changelog.json" strategy="lazyOnload" />
        <Script src="/cookie-consent.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
