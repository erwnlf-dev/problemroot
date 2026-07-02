# ProblemRoot

Incident tracking and root cause analysis for engineering teams, without the Slack lock-in.

![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- Track incidents through lifecycle (Investigating → Resolved)
- Create and link Action Items with owners and due dates
- Filter by severity (P1–P4), status, and service
- Build incident timeline with chronological event logs
- Real-time MTTR and incident distribution dashboard
- JSON export/import for backup and migration
- Client-side storage with `localStorage`
- Zero backend dependencies

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Hosting**: Cloudflare Pages

## Getting Started

```bash
git clone https://github.com/your-org/problemroot.git
cd problemroot
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── incidents/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── store.tsx
│   ├── types.ts
│   └── utils.ts
└── public/
```

## License

MIT