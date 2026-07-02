import React from 'react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 hidden md:block">
      <div className="font-bold text-lg text-primary mb-6">ProblemRoot</div>
      <nav className="space-y-2">
        <Link href="/dashboard" className="block p-2 hover:bg-zinc-900 rounded">Overview</Link>
        <Link href="/dashboard/incidents" className="block p-2 hover:bg-zinc-900 rounded">Incidents</Link>
        <Link href="/dashboard/settings" className="block p-2 hover:bg-zinc-900 rounded">Settings</Link>
      </nav>
    </aside>
  );
}

export function Header({ ...props }: any) {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 px-6 flex items-center justify-between">
      <div className="font-semibold text-zinc-200">Incident Commander Dashboard</div>
      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">Sign Out</Link>
    </header>
  );
}

export function HelpWidget() {
  return (
    <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-sm mt-auto">
      <div className="font-semibold mb-1 text-zinc-200">Need Help?</div>
      <p className="text-zinc-400">Read the Runbook or contact support.</p>
    </div>
  );
}
