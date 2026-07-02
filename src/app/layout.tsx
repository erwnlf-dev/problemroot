import { Inter } from 'next/font/google';
import { StoreProvider } from './providers';
import { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProblemRoot - Fast Incident Tracking',
  description: 'Track incidents, isolate root causes, assign action items. Engineering teams made easy.',
  openGraph: {
    title: 'ProblemRoot',
    description: 'Track incidents, isolate root causes, assign action items.',
    url: 'https://problemroot.pages.dev',
    siteName: 'ProblemRoot',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} bg-page text-text min-h-screen`}>
      <body className="bg-page text-text">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
