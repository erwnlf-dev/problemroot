// FILE: src/app/dashboard/layout.tsx
'use client';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar, Header, HelpWidget } from '@/components';
import { useStore } from '@/lib/store';
import { AppSettings } from '@/lib/types';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const { state, dispatch } = useStore();

  useEffect(() => {
    const storedSettings = localStorage.getItem('app_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      setSettings({
        userName: '',
        userEmail: '',
        emailNotifications: false,
        slackWebhooks: false,
      });
    }
  }, []);

  useEffect(() => {
    if (settings) {
      localStorage.setItem('app_settings', JSON.stringify(settings));
    }
  }, [settings]);

  return (
    <div className={`min-h-screen ${inter.className} bg-page text-text`}>
      <Sidebar />
      <div className="ml-60">
        <Header settings={settings} setSettings={setSettings} />
        <main className="p-6">
          {children}
        </main>
        <HelpWidget />
      </div>
    </div>
  );
}
