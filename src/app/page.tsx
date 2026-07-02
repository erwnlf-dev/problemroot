// FILE: src/app/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Zap, ListChecks, BarChart2, Tag, Download, Database,
  CheckCircle, ChevronDown, ChevronUp, ArrowRight, Shield,
  Clock, Users, Star
} from 'lucide-react';

const FEATURES = [
  { icon: Clock, title: 'Timeline Builder', desc: 'Construct incident timelines in seconds. Chronological event logs with type tagging.' },
  { icon: ListChecks, title: 'Action Item Tracking', desc: 'Link action items to incidents. Assign owners, set due dates, track to Done.' },
  { icon: BarChart2, title: 'MTTR Analytics', desc: 'Real-time mean time to resolution. Severity distribution charts. No setup.' },
  { icon: Tag, title: 'Service Categorization', desc: 'Filter by service, severity P1–P4, and status. Find what matters fast.' },
  { icon: Download, title: 'JSON Import/Export', desc: 'Full data portability. Export everything, import to restore or migrate.' },
  { icon: Database, title: 'Local-First Speed', desc: 'Zero latency. Data lives in your browser. No backend, no cold starts.' },
];

const PRICING = [
  {
    name: 'Hobby',
    price: '$0',
    period: 'forever',
    desc: 'For solo engineers and side projects.',
    features: ['1 user', 'Up to 100 incidents', 'Basic timeline builder', 'JSON export', 'Community support'],
    cta: 'Start Free',
    href: '/dashboard',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/mo',
    desc: 'For engineering teams that ship fast.',
    features: ['Up to 5 users', 'Unlimited incidents', 'All features', 'Action item tracking', 'Email support', 'MTTR analytics'],
    cta: 'Start Trial',
    href: '/dashboard',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/mo',
    desc: 'For orgs that need control and compliance.',
    features: ['Unlimited users', 'Custom configuration', 'SSO / SAML', 'API access', 'Priority support', 'SLA guarantee'],
    cta: 'Contact Sales',
    href: '/dashboard',
    highlight: false,
  },
];

const FAQS = [
  { q: 'Where is my data stored?', a: 'Entirely in your browser via localStorage. Nothing leaves your machine. No accounts, no servers.' },
  { q: 'Can I migrate data between browsers?', a: 'Yes. Export as JSON from Settings, import on any browser. Full fidelity.' },
  { q: 'What is MTTR and how is it calculated?', a: 'Mean Time to Resolution: average hours between detectedAt and resolvedAt across all resolved incidents.' },
  { q: 'Can I use this without Slack?', a: 'That is the point. ProblemRoot is Slack-free by design. No integrations required.' },
  { q: 'What severities are supported?', a: 'P1 through P4. Filter, chart, and track by severity across all views.' },
  { q: 'Is there a mobile app?', a: 'Not yet. The web app is responsive. Native apps are on the roadmap for Enterprise.' },
];

const TESTIMONIALS = [
  { name: 'Alex R.', role: 'SRE Lead, Fintech', text: 'Cut our post-incident review time by 40%. Timeline builder is the killer feature.' },
  { name: 'Priya M.', role: 'Engineering Manager', text: 'Finally a tool that does not require a Slack bot or a 3-hour onboarding call.' },
  { name: 'Dan K.', role: 'Staff Engineer', text: 'MTTR dashboard alone is worth it. Exported 6 months of data in one click.' },
];

const LANGS: Record<string, Record<string, string>> = {
  EN: {
    hero_title: 'Track incidents. Find root causes. Ship fixes.',
    hero_sub: 'ProblemRoot gives engineering teams a fast, local-first incident tracker with timeline construction and action item tracking — no Slack required.',
    cta_primary: 'Open Dashboard',
    cta_secondary: 'See Features',
    features_title: 'Everything you need. Nothing you do not.',
    pricing_title: 'Simple pricing.',
    faq_title: 'Frequently asked questions.',
    testimonials_title: 'Trusted by engineers.',
    email_placeholder: 'you@company.com',
    email_cta: 'Get Early Access',
    email_label: 'Join the waitlist. No spam.',
  },
  ID: {
    hero_title: 'Lacak insiden. Temukan akar masalah. Kirim perbaikan.',
    hero_sub: 'ProblemRoot memberi tim engineering pelacak insiden cepat dan lokal-first dengan pembuat timeline dan pelacakan action item — tanpa Slack.',
    cta_primary: 'Buka Dashboard',
    cta_secondary: 'Lihat Fitur',
    features_title: 'Semua yang dibutuhkan. Tidak lebih.',
    pricing_title: 'Harga sederhana.',
    faq_title: 'Pertanyaan yang sering diajukan.',
    testimonials_title: 'Dipercaya engineer.',
    email_placeholder: 'kamu@perusahaan.com',
    email_cta: 'Dapatkan Akses Awal',
    email_label: 'Daftar waitlist. Tanpa spam.',
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ProblemRoot',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Fast incident tracking, root cause isolation, and action item management for engineering teams.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [abVariant, setAbVariant] = useState<'A' | 'B'>('A');

  const t = LANGS[lang];

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent !== null) setCookieConsent(consent === 'true');

    const variant = localStorage.getItem('ab_hero') as 'A' | 'B' | null;
    if (variant) {
      setAbVariant(variant);
    } else {
      const v = Math.random() > 0.5 ? 'B' : 'A';
      localStorage.setItem('ab_hero', v);
      setAbVariant(v);
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) localStorage.setItem('referral', ref);
  }, []);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    const existing = JSON.parse(localStorage.getItem('waitlist') || '[]');
    if (!existing.includes(email)) {
      localStorage.setItem('waitlist', JSON.stringify([...existing, email]));
    }
    setEmailSaved(true);
    setEmail('');
  }

  function acceptCookies(val: boolean) {
    localStorage.setItem('cookie-consent', String(val));
    setCookieConsent(val);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]">
        {/* Nav */}
        <nav className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.05)] bg-[#08090a]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#5e6ad2]" />
              <span className="font-semibold tracking-tight">ProblemRoot</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
                className="rounded-md border border-[rgba(255,255,255,0.08)] px-3 py-1 text-xs text-[#8a8f98] hover:text-[#f7f8f8]"
              >
                {lang === 'EN' ? 'ID' : 'EN'}
              </button>
              <a href="#features" className="hidden text-sm text-[#8a8f98] hover:text-[#f7f8f8] sm:block">Features</a>
              <a href="#pricing" className="hidden text-sm text-[#8a8f98] hover:text-[#f7f8f8] sm:block">Pricing</a>
              <Link
                href="/dashboard"
                className="rounded-md bg-[#5e6ad2] px-4 py-2 text-sm font-medium text-white hover:bg-[#828fff]"
              >
                {t.cta_primary}
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          {/* mesh bg */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(94,106,210,0.15),transparent)]" />
          <div className="relative mx-auto max-w-3xl">
            {abVariant === 'B' && (
              <span className="mb-4 inline-block rounded-full border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.1)] px-3 py-1 text-xs text-[#7170ff]">
                Now in public beta
              </span>
            )}
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t.hero_title}
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-[#8a8f98]">
              {t.hero_sub}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-md bg-[#5e6ad2] px-6 py-3 text-sm font-medium text-white hover:bg-[#828fff]"
              >
                {t.cta_primary} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="rounded-md border border-[rgba(255,255,255,0.08)] px-6 py-3 text-sm text-[#d0d6e0] hover:border-[rgba(255,255,255,0.15)]"
              >
                {t.cta_secondary}
              </a>
            </div>
            <p className="mt-6 text-xs text-[#62666d]">No account required. Data stays in your browser.</p>
          </div>
        </section>

        {/* Social proof strip */}
        <section className="border-y border-[rgba(255,255,255,0.05)] bg-[#0f1011] px-6 py-6">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 text-sm text-[#62666d]">
            {['Incident tracking', 'Root cause analysis', 'MTTR dashboards', 'Action item ownership', 'Zero backend'].map(f => (
              <span key={f} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#10b981]" /> {f}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-3xl font-bold">{t.features_title}</h2>
            <p className="mb-16 text-center text-[#8a8f98]">Built for on-call engineers, not project managers.</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0f1011] p-5 transition hover:border-[rgba(255,255,255,0.1)]">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[rgba(94,106,210,0.12)]">
                    <Icon className="h-4 w-4 text-[#5e6ad2]" />
                  </div>
                  <h3 className="mb-1.5 font-semibold">{title}</h3>
                  <p className="text-sm text-[#8a8f98]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y border-[rgba(255,255,255,0.05)] bg-[#0f1011] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold">{t.testimonials_title}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {TESTIMONIALS.map(({ name, role, text }) => (
                <div key={name} className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#191a1b] p-5">
                  <div className="mb-3 flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />)}
                  </div>
                  <p className="mb-4 text-sm text-[#d0d6e0]">"{text}"</p>
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-[#62666d]">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-3xl font-bold">{t.pricing_title}</h2>
            <p className="mb-16 text-center text-[#8a8f98]">Start free. Upgrade when your team grows.</p>
            <div className="grid gap-6 sm:grid-cols-3">
              {PRICING.map(({ name, price, period, desc, features, cta, href, highlight }) => (
                <div
                  key={name}
                  className={`relative rounded-lg border p-6 ${
                    highlight
                      ? 'border-[#5e6ad2] bg-[rgba(94,106,210,0.06)]'
                      : 'border-[rgba(255,255,255,0.05)] bg-[#0f1011]'
                  }`}
                >
                  {highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5e6ad2] px-3 py-0.5 text-xs font-medium text-white">
                      Most Popular
                    </span>
                  )}
                  <p className="mb-1 font-semibold">{name}</p>
                  <div className="mb-2 flex items-end gap-1">
                    <span className="text-3xl font-bold">{price}</span>
                    <span className="mb-1 text-sm text-[#8a8f98]">{period}</span>
                  </div>
                  <p className="mb-6 text-sm text-[#8a8f98]">{desc}</p>
                  <ul className="mb-8 space-y-2">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#d0d6e0]">
                        <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-[#10b981]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    className={`block w-full rounded-md px-4 py-2 text-center text-sm font-medium ${
                      highlight
                        ? 'bg-[#5e6ad2] text-white hover:bg-[#828fff]'
                        : 'border border-[rgba(255,255,255,0.08)] text-[#d0d6e0] hover:border-[rgba(255,255,255,0.15)]'
                    }`}
                  >
                    {cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Email capture */}
        <section className="border-y border-[rgba(255,255,255,0.05)] bg-[#0f1011] px-6 py-20">
          <div className="mx-auto max-w-md text-center">
            <Zap className="mx-auto mb-4 h-8 w-8 text-[#5e6ad2]" />
            <h2 className="mb-2 text-2xl font-bold">Get early access</h2>
            <p className="mb-8 text-sm text-[#8a8f98]">{t.email_label}</p>
            {emailSaved ? (
              <p className="flex items-center justify-center gap-2 text-sm text-[#10b981]">
                <CheckCircle className="h-4 w-4" /> You are on the list.
              </p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.email_placeholder}
                  required
                  className="flex-1 rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md bg-[#5e6ad2] px-4 py-2 text-sm font-medium text-white hover:bg-[#828fff]"
                >
                  {t.email_cta}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-6 py-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-12 text-center text-3xl font-bold">{t.faq_title}</h2>
            <div className="space-y-2">
              {FAQS.map(({ q, a }, i) => (
                <div key={i} className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0f1011]">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
                  >
                    {q}
                    {openFaq === i
                      ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-[#8a8f98]" />
                      : <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#8a8f98]" />}
                  </button>
                  {openFaq === i && (
                    <p className="border-t border-[rgba(255,255,255,0.05)] px-5 py-4 text-sm text-[#8a8f98]">{a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-4 text-3xl font-bold">Ready to resolve faster?</h2>
            <p className="mb-8 text-[#8a8f98]">Open the dashboard. No signup. No credit card. Data stays yours.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-[#5e6ad2] px-8 py-3 text-sm font-medium text-white hover:bg-[#828fff]"
            >
              {t.cta_primary} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[rgba(255,255,255,0.05)] px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 grid gap-8 sm:grid-cols-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#5e6ad2]" />
                  <span className="font-semibold">ProblemRoot</span>
                </div>
                <p className="text-xs text-[#62666d]">Fast incident tracking for engineering teams.</p>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-[#8a8f98]">Product</p>
                <ul className="space-y-2 text-sm text-[#62666d]">
                  <li><a href="#features" className="hover:text-[#f7f8f8]">Features</a></li>
                  <li><a href="#pricing" className="hover:text-[#f7f8f8]">Pricing</a></li>
                  <li><Link href="/dashboard" className="hover:text-[#f7f8f8]">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-[#8a8f98]">Company</p>
                <ul className="space-y-2 text-sm text-[#62666d]">
                  <li><a href="#" className="hover:text-[#f7f8f8]">About</a></li>
                  <li><a href="#" className="hover:text-[#f7f8f8]">Blog</a></li>
                  <li><a href="#" className="hover:text-[#f7f8f8]">Changelog</a></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-[#8a8f98]">Legal</p>
                <ul className="space-y-2 text-sm text-[#62666d]">
                  <li><a href="#" className="hover:text-[#f7f8f8]">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-[#f7f8f8]">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-[#f7f8f8]">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.05)] pt-6 sm:flex-row">
              <p className="text-xs text-[#62666d]">© {new Date().getFullYear()} ProblemRoot. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Users className="h-3.5 w-3.5 text-[#62666d]" />
                <span className="text-xs text-[#62666d]">Local-first. No telemetry.</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Cookie consent */}
        {cookieConsent === null && (
          <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-4 shadow-xl">
            <p className="mb-3 text-sm text-[#d0d6e0]">
              We use localStorage to save your preferences. No tracking cookies.{' '}
              <a href="#" className="text-[#5e6ad2] underline">Privacy Policy</a>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => acceptCookies(true)}
                className="rounded-md bg-[#5e6ad2] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#828fff]"
              >
                Accept
              </button>
              <button
                onClick={() => acceptCookies(false)}
                className="rounded-md border border-[rgba(255,255,255,0.08)] px-4 py-1.5 text-xs text-[#d0d6e0]"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Help widget */}
        <details className="fixed bottom-4 right-4 z-40">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-[#5e6ad2] text-white shadow-lg hover:bg-[#828fff]">
            ?
          </summary>
          <div className="absolute bottom-12 right-0 w-64 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-4 shadow-xl">
            <p className="mb-2 text-sm font-semibold">Need help?</p>
            <ul className="space-y-1.5 text-xs text-[#8a8f98]">
              <li>• Dashboard shows MTTR and active incidents</li>
              <li>• Create incidents from the Incidents page</li>
              <li>• Export data from Settings</li>
              <li>• All data stored locally in your browser</li>
            </ul>
            <Link href="/dashboard" className="mt-3 block text-xs text-[#5e6ad2] hover:text-[#828fff]">
              Open Dashboard →
            </Link>
          </div>
        </details>
      </div>
    </>
  );
}
