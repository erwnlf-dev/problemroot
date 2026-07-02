PRD ready.

### 1. Product Overview
ProblemRoot track incidents, isolate root causes, assign action items. For engineering teams. Differentiator: fast timeline construction and action tracking without Slack lock-in.

### 2. Core Functional Requirements
- Track incidents through lifecycle: Investigating -> Identified -> Mitigated -> Resolved.
- Create and link Action Items to specific incidents with owners and due dates.
- Filter incidents by severity (P1-P4), status, and affected service.
- Build incident timeline by adding chronological event logs.
- Calculate real-time MTTR (Mean Time to Resolution) and incident distribution on dashboard.
- Export incident data and configuration as JSON; import to restore or migrate.

### 3. Data Model & Persistence
Persistence: `localStorage` with JSON serialization.
Keys: `app_incidents`, `app_action_items`, `app_settings`.

```typescript
export type Severity = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'Investigating' | 'Identified' | 'Mitigated' | 'Resolved';
export type ActionStatus = 'Todo' | 'InProgress' | 'Done';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: Severity;
  service: string;
  rootCause: string;
  detectedAt: number; // Unix timestamp
  resolvedAt: number | null; // Unix timestamp
  createdAt: number;
  updatedAt: number;
}

export interface ActionItem {
  id: string;
  incidentId: string;
  title: string;
  owner: string;
  status: ActionStatus;
  dueDate: number;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineEvent {
  id: string;
  incidentId: string;
  timestamp: number;
  description: string;
  type: 'system' | 'user' | 'note';
}

export interface AppSettings {
  userName: string;
  userEmail: string;
  emailNotifications: boolean;
  slackWebhooks: boolean;
}
```

### 4. Pages, Routes & FUNCTIONALITY

- **Landing page (`/`)**: Decide/Learn surface. Hero section, 6 key features (Timeline builder, Action item tracking, MTTR analytics, Service categorization, JSON import/export, local-first speed), 3 pricing tiers (Hobby $0, Team $29/mo, Enterprise $99/mo), 6 FAQs, CTA buttons, footer. No dynamic app state.
- **Dashboard (`/dashboard`)**: Monitor surface. Displays total incidents, active incidents, MTTR (average hours to resolve), and action item completion rate. Includes SVG bar chart of incident counts by severity and interactive recent activity feed.
- **Incident List (`/dashboard/incidents`)**: Operate surface. Table of all incidents. Search by title/service, filter by status/severity. Create new incident via modal. Bulk delete selected incidents.
- **Incident Detail (`/dashboard/incidents/[id]`)**: Operate/Diagnose surface. View/edit incident fields. Update status with validation (cannot set to Resolved without root cause filled). Add/edit timeline events. Add/toggle action items.
- **Settings (`/dashboard/settings`)**: Configure surface. Profile form (name, email) with validation. Notification toggles. Export button (triggers JSON download of all localStorage data). Import button (uploads JSON, parses, updates state). Reset button (clears localStorage, seeds default data).

### 5. Component Specification per Page
- **Landing**: `Hero`, `FeaturesGrid`, `PricingCards`, `FAQAccordion`, `CTASection`, `Footer`.
- **Dashboard**: `Sidebar` (navigation), `StatCards` (MTTR, open incidents, action item ratio), `SeverityChart` (SVG chart), `ActivityFeed` (last 5 state changes).
- **Incident List**: `Sidebar`, `FilterBar` (search input, status/severity dropdowns), `IncidentTable` (rows with edit/delete buttons, checkboxes), `CreateIncidentModal` (form with validation).
- **Incident Detail**: `Sidebar`, `IncidentForm` (inline edit inputs), `TimelineWidget` (chronological list + add event form), `ActionItemsList` (checklist + add item form).
- **Settings**: `Sidebar`, `ProfileForm` (inputs + save state), `ToggleOptions` (switches for notifications), `DataActions` (Import/Export/Reset buttons).

### 6. User Flows
1. **Create Incident**: User clicks "New Incident" -> fills title, severity, service -> clicks save -> validation checks fields -> saves to localStorage -> list updates -> success toast displays.
2. **Resolve Incident**: User opens incident details -> attempts to change status to "Resolved" -> system prompts for root cause -> user fills root cause -> status updates -> resolvedAt timestamp set -> dashboard MTTR updates.
3. **Data Migration**: User goes to settings -> clicks "Export" -> downloads `problemroot_backup.json` -> goes to new browser -> clicks "Import" -> uploads file -> data merges -> page refreshes with loaded data.

### 7. Mock Data (seed on first load)
Seed checked on first load when `app_incidents` key not present in `localStorage`.
- 8 Incidents (3 Resolved, 2 Mitigated, 2 Identified, 1 Investigating; varied severities P1-P4).
- 10 Timeline Events spread across incidents.
- 6 Action Items (3 Done, 2 InProgress, 1 Todo).

### 8. File Manifest
```json
[
  {"path": "src/app/layout.tsx", "purpose": "Root layout: Inter font, dark theme, metadata, StoreProvider wrapper", "dependencies": []},
  {"path": "src/app/globals.css", "purpose": "Tailwind directives + custom theme styles", "dependencies": []},
  {"path": "src/app/page.tsx", "purpose": "Landing page: Marketing copy, features, pricing, FAQ, CTA links", "dependencies": []},
  {"path": "src/app/dashboard/layout.tsx", "purpose": "Dashboard layout: Sidebar navigation, top header, content container", "dependencies": []},
  {"path": "src/app/dashboard/page.tsx", "purpose": "Dashboard main page: computed metrics, SVG charts, recent activity feed", "dependencies": []},
  {"path": "src/app/dashboard/incidents/page.tsx", "purpose": "Incident CRUD: list view, search, filter, creation modal, bulk actions", "dependencies": []},
  {"path": "src/app/dashboard/incidents/[id]/page.tsx", "purpose": "Incident details: edit form, timeline event manager, action items checklist", "dependencies": []},
  {"path": "src/app/dashboard/settings/page.tsx", "purpose": "Settings: configuration options, JSON import/export, database reset", "dependencies": []},
  {"path": "src/lib/store.tsx", "purpose": "React Context: global state, localStorage sync, CRUD reducers, notifications provider", "dependencies": []},
  {"path": "src/lib/types.ts", "purpose": "TypeScript type declarations for entities, state, and actions", "dependencies": []},
  {"path": "src/lib/utils.ts", "purpose": "Helper functions: date formatters, ID generator, JSON export/import handlers", "dependencies": []}
]
```

---
skipped: Slack API integration, add when users request automated channel creation.
skipped: Multi-tenant auth, add when team collaboration features required.