# Market Analysis

## Competitors

### 1. ServiceNow
*   **URL**: servicenow.com
*   **Pricing**: Enterprise contract. Negotated. High ($100+ user/month).
*   **Key Features**: CMDB, ITIL workflow engine, enterprise service desk, deep change management.
*   **Weaknesses**: Slow deployment, complex configuration, outdated UI, high cost.

### 2. Jira Service Management (JSM)
*   **URL**: atlassian.com/software/jira/service-management
*   **Pricing**: Tiered. Free up to 3 agents. Standard $22/agent/month. Premium $49/agent/month. Enterprise custom.
*   **Key Features**: Jira ticket link, asset management, incident queues, basic post-mortems.
*   **Weaknesses**: Complex workflow editor, slow page loads, requires heavy Jira ecosystem lock-in.

### 3. PagerDuty
*   **URL**: pagerduty.com
*   **Pricing**: Free tier. Professional $21/user/month. Business $41/user/month. Enterprise custom.
*   **Key Features**: On-call scheduling, alert routing, incident response orchestration, Jeli integration.
*   **Weaknesses**: Expensive per seat, complex alert rules configuration, post-incident analysis requires separate add-ons.

### 4. Rootly
*   **URL**: rootly.com
*   **Pricing**: Custom enterprise. Startup tier available on request.
*   **Key Features**: Slack-first incident management, automated timelines, post-mortem generation, metrics.
*   **Weaknesses**: Heavy reliance on Slack/Teams API, high cost for small teams, limited offline/web-only workflows.

### 5. FireHydrant
*   **URL**: firehydrant.com
*   **Pricing**: Free tier (limited). Paid tiers start at $20/user/month. Enterprise custom.
*   **Key Features**: Runbook automation, incident command UI, retrospective builder, tool integrations.
*   **Weaknesses**: Setup complexity, UI cluttered during active incidents, high learning curve.

### 6. Blameless
*   **URL**: blameless.com
*   **Pricing**: Custom enterprise.
*   **Key Features**: Incident response, retrospective templates, reliability insights (SLOs), action items.
*   **Weaknesses**: Opaque pricing, lacks native monitoring, dashboard customization limited.

### 7. Jeli (by PagerDuty)
*   **URL**: jeli.io
*   **Pricing**: Bundled with PagerDuty Enterprise or sold separately.
*   **Key Features**: Deep post-incident analysis, narrative builder, team coordination analysis.
*   **Weaknesses**: Expensive, overkill for simple incidents, requires high SRE maturity.

### 8. BigPanda
*   **URL**: bigpanda.io
*   **Pricing**: Custom enterprise. Event-volume based.
*   **Key Features**: AI-driven alert correlation, root cause analysis assistance, noise reduction.
*   **Weaknesses**: High cost, complex integration step, enterprise-only sales model.

### 9. Freshservice
*   **URL**: freshworks.com/freshservice
*   **Pricing**: Starter $19/agent/month. Growth $49/agent/month. Pro $95/agent/month. Enterprise $119/agent/month.
*   **Key Features**: ITIL-aligned problem management, asset management, service catalog.
*   **Weaknesses**: Weak post-incident analysis tool, generic workflows, limited developer-focused features.

### 10. Sentry
*   **URL**: sentry.io
*   **Pricing**: Developer free. Team $26/month. Business $80/month. Enterprise custom.
*   **Key Features**: Error tracking, stack traces, release monitoring, root cause code line identification.
*   **Weaknesses**: Limited to application code errors, lacks process-level problem management or ITIL workflows.

### 11. Honeycomb
*   **URL**: honeycomb.io
*   **Pricing**: Free tier (20GB). Pro $150/month. Enterprise custom.
*   **Key Features**: High-cardinality observability, query builder, BubbleUp for anomaly detection.
*   **Weaknesses**: Steep learning curve, requires code instrumentation, no native incident coordination features.

### 12. Opsgenie (Atlassian)
*   **URL**: atlassian.com/software/opsgenie
*   **Pricing**: Free tier (5 users). Essentials $9/user/month. Enterprise $29/user/month.
*   **Key Features**: Alerting, on-call schedules, incident routing.
*   **Weaknesses**: Slow feature development since Atlassian acquisition, overlaps with JSM.

### 13. Datadog (Incident Management)
*   **URL**: datadoghq.com
*   **Pricing**: $20/user/month (Incident Management add-on).
*   **Key Features**: Direct link to metrics/logs, timeline generation, post-mortem generation.
*   **Weaknesses**: Requires Datadog agent/ecosystem, expensive data ingestion costs.

### 14. Dynatrace
*   **URL**: dynatrace.com
*   **Pricing**: Pay-as-you-go or commit. High cost.
*   **Key Features**: Davis AI root-cause analysis, automatic topology mapping, full-stack monitoring.
*   **Weaknesses**: Enterprise-only sales, complex configuration, heavy agent footprint.

### 15. Splunk Incident Advisor
*   **URL**: splunk.com
*   **Pricing**: Data-volume based. Enterprise cost.
*   **Key Features**: Log correlation, search-based incident analysis, dashboards.
*   **Weaknesses**: High storage cost, complex query language (SPL), slow UI.

---

## Underserved Niches / Feature Gaps
1.  **Low-Overhead RCA for SMBs**: Existing RCA tools (Jeli, Blameless) require dedicated SRE teams. SMBs need one-click timelines without complex setup.
2.  **No-Code Incident Timeline Scrapers**: Pulling data from Slack, Teams, Jira, and logs into a single timeline without writing API integrations.
3.  **ISO 22301 / ITIL-Compliant Export**: Auto-generating formal compliance documents for audits from raw incident logs.

---

## Market Size Estimate
*   **TAM (Total Addressable Market)**: $15B+ (Global ITSM and Incident Management market).
*   **SAM (Serviceable Addressable Market)**: $2.5B (Cloud incident response and post-mortem tools).
*   **SOM (Serviceable Obtainable Market)**: $50M (Targeting SMB to Mid-Market engineering teams seeking low-overhead RCA tools).

---

# Competitive Feature Matrix

| Feature | ServiceNow | JSM | PagerDuty | Rootly | FireHydrant | Our Opportunity (ProblemRoot) | Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Slack/Teams Command Center** | No | Yes | Yes | Yes | Yes | Yes (Native chatops integration) | Table-stakes |
| **Automatic Timeline Builder** | No | No | Partial | Yes | Yes | Yes (Multi-source ingestion) | Table-stakes |
| **Post-Mortem Templates** | Yes | Yes | Yes | Yes | Yes | Yes (ISO 22301 compliance ready) | Table-stakes |
| **On-Call Scheduling** | No | Yes | Yes | No | No | No (Integrate, don't build) | Table-stakes |
| **Jira/Ticket Sync** | Yes | Yes | Yes | Yes | Yes | Yes (Bi-directional) | Table-stakes |
| **GenAI RCA Drafting** | No | No | No | Yes | Yes | Yes (Focus on system logs analysis) | Differentiator |
| **ISO 22301 Audit Export** | No | No | No | No | No | Yes (One-click audit PDF) | Differentiator |
| **CMDB Topology Mapping** | Yes | Yes | No | No | No | No (YAGNI for SMB) | Differentiator |
| **Action Item Tracking** | Yes | Yes | Yes | Yes | Yes | Yes (Syncs to Jira/GitHub Issues) | Table-stakes |
| **Chronological Log Merge** | No | No | No | No | No | Yes (Drop raw logs, auto-sort by TS) | Differentiator |
| **Error Budget Tracking** | No | No | No | No | No | Yes (Simple SLO dashboard) | Differentiator |
| **Runbook Automation** | No | No | Yes | Yes | Yes | No (Out of scope for MVP) | Table-stakes |
| **Multi-tenant RBAC** | Yes | Yes | Yes | Yes | Yes | Yes (Required for B2B) | Table-stakes |
| **SOC2 Compliance Ready** | Yes | Yes | Yes | Yes | Yes | Yes (Hosted on secure cloud) | Table-stakes |
| **Offline Incident Mode** | No | No | No | No | No | Yes (Local-first state sync) | Differentiator |

---

# User Persona Research

### 1. Incident Commander (Ian)
*   **Role**: Senior SRE
*   **Company Size**: 100-500 employees
*   **Pain Points**: Spend hours copy-pasting chat messages into post-mortems. Hard to track down who made what change.
*   **Current Tools**: Slack, Jira, PagerDuty, Google Docs.
*   **Switch Trigger**: Tool that auto-generates incident timelines and exports to Jira with one click.
*   **Price Sensitivity**: Low. Company pays. Budget up to $50/user/month.

### 2. VP Infrastructure (Victoria)
*   **Role**: VP / Director of Infrastructure
*   **Company Size**: 500-2000 employees
*   **Pain Points**: Lack of visibility into systemic root causes. Repeated incidents. Compliance audits (ISO 27001) are painful.
*   **Current Tools**: ServiceNow, Datadog.
*   **Switch Trigger**: Tool that shows recurring root causes and provides audit-ready reports.
*   **Price Sensitivity**: Medium. Needs clear ROI on MTTR reduction.

### 3. IT Helpdesk Manager (Harvey)
*   **Role**: IT Support Lead
*   **Company Size**: 50-200 employees
*   **Pain Points**: Too many alerts. No clear process for escalating from "ticket" to "major incident".
*   **Current Tools**: Freshservice, email, Teams.
*   **Switch Trigger**: Simple, low-cost incident workspace that doesn't require SRE training.
*   **Price Sensitivity**: High. Prefers flat-rate or low per-agent pricing.

### 4. CTO / Co-Founder (Chloe)
*   **Role**: CTO
*   **Company Size**: 10-50 employees (Scale-up)
*   **Pain Points**: Cannot afford PagerDuty Enterprise/Rootly prices but needs professional incident processes for enterprise sales deals.
*   **Current Tools**: Slack, GitHub Issues, Opsgenie.
*   **Switch Trigger**: Generous free tier or low starting tier with professional looking RCA exports.
*   **Price Sensitivity**: High. Bootstrapping/Early stage.

---

# Technical Landscape

## Common Tech Stacks
*   **Frontend**: React, Next.js, TailwindCSS.
*   **Backend**: Node.js (TypeScript), Go, or Python.
*   **Database**: PostgreSQL (relational data, timelines), Redis (caching, pub/sub for live updates).
*   **Deployment**: AWS (ECS/EKS), Vercel (frontend), Supabase (backend-as-a-service).

## Integration Points
*   **Chat**: Slack Webhooks & Block Kit API, Microsoft Teams Graph API.
*   **Ticketing**: Jira Cloud REST API, GitHub Issues API, GitLab Issues API.
*   **Monitoring**: Datadog Webhooks, Prometheus Alertmanager, Grafana.
*   **On-Call**: PagerDuty API, Opsgenie API.

## Data Import/Export
*   **Import**: CSV format from legacy ITSM, JSON dump from Jira, raw text/log upload.
*   **Export**: PDF (for audits), Markdown (for GitHub/GitLab), JSON (for raw data backup).

## Compliance Requirements
*   **SOC2 Type II**: Required for enterprise sales.
*   **GDPR**: Data residency controls (EU hosting option).
*   **HIPAA**: BAA agreements needed if system logs contain PII/PHI.

---

# Pricing Intelligence

*   **Competitor Pricing Models**:
    *   *Per-seat*: Standard in ITSM (JSM, Freshservice).
    *   *Per-incident/usage*: Rare, but appearing in modern tools.
    *   *Tiered*: Free -> Pro -> Enterprise.
*   **Price Ranges**:
    *   *Low*: $10-$20/user/month (JSM, Freshservice starter).
    *   *Medium*: $40-$80/user/month (PagerDuty, FireHydrant).
    *   *High*: $100+/user/month or custom contracts (ServiceNow, Rootly, Jeli).
*   **Free Tier Expectations**:
    *   Must allow 3-5 users.
    *   Must include basic incident logging and Slack integration.
    *   Limit history retention to 30 days.
*   **Enterprise Pricing Patterns**:
    *   Custom contracts with annual commitments.
    *   SSO/SAML, custom retention policies, and dedicated support as standard upsells.

---

# Feature Prioritization

| Feature | Description | Complexity | Impact | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Slack Integration** | Send alerts, create incident channels, log timeline events from Slack. | M | High | **MUST-HAVE** |
| **Timeline Builder** | Interactive web UI to construct chronological event logs. | S | High | **MUST-HAVE** |
| **Jira/GitHub Sync** | Export incidents and action items to developer ticketing tools. | M | High | **MUST-HAVE** |
| **RCA Template Builder** | Custom fields for root cause, prevention steps, and impact. | S | Med | **MUST-HAVE** |
| **PDF/Markdown Export** | Generate clean, audit-ready post-mortem documents. | S | High | **MUST-HAVE** |
| **GenAI RCA Draft** | Auto-summarize Slack history into a draft post-mortem. | M | High | **SHOULD-HAVE** |
| **Chronological Log Merge** | Upload raw server logs, auto-interleave with incident timeline. | S | Med | **SHOULD-HAVE** |
| **On-Call Rotation Engine** | Calendar, escalation policies, SMS/Phone alerts. | L | Low | **NICE-TO-HAVE** |
| **SSO / SAML** | Enterprise identity provider integration. | M | High | **SHOULD-HAVE** |
| **Analytics Dashboard** | MTTR, MTTA, incident frequency by service/team. | S | Med | **SHOULD-HAVE** |

---

# Go-to-Market Insights

## Discovery Channels
*   **Product Hunt / Hacker News**: Launch MVP targeting developers and SREs.
*   **GitHub Marketplace**: List integration to capture teams using GitHub Issues.
*   **Slack App Directory**: Essential for organic discovery.

## SEO / Content Angles
*   **Templates**: "Post-Mortem Template Markdown", "ISO 22301 Incident Report PDF".
*   **Comparisons**: "Rootly vs FireHydrant vs ProblemRoot", "ServiceNow alternatives for startups".
*   **Guides**: "How to conduct a blameless post-mortem".

## Partnerships
*   **Managed Service Providers (MSPs)**: Target small MSPs who need a white-labeled incident portal for clients.
*   **SaaS Co-Marketing**: Partner with monitoring tools (e.g., GlitchTip, Better Stack) that lack deep RCA features.

---

# Feasibility Score

| Dimension | Score (1-10) | Rationale |
| :--- | :--- | :--- |
| **Market Size** | 8 | Huge market, but dominated by giants. |
| **Competition Gap** | 7 | Clear gap for lightweight, compliance-focused RCA tools. |
| **Technical Feasibility** | 9 | Next.js + Supabase + Slack API covers 90% of requirements. No heavy infrastructure needed. |
| **Monetization Potential** | 8 | B2B SaaS buyers pay well to solve reliability/compliance headaches. |
| **SEO/Content Opportunity** | 7 | High search volume for templates; low difficulty for niche terms. |
| **Time to MVP** | 8 | Simple timeline tool and Slack bot can be built in 30 days. |
| **OVERALL** | **7.8 / 10** | **Weighted Average** |

### Recommendation: BUILD
High confidence. Focus strictly on the RCA and post-mortem workflow. Do not build monitoring or on-call scheduling (integrate with existing tools instead). Focus on ISO 22301 compliance-ready exports as the primary hook for mid-market customers.

---

# MVP Implementation Plan

```typescript
// ponytail: basic db schema for local-first sync. upgrade to postgres sync engine later.
interface Incident {
  id: string;
  title: string;
  severity: 'SEV1' | 'SEV2' | 'SEV3';
  status: 'INVESTIGATING' | 'IDENTIFIED' | 'MITIGATED' | 'RESOLVED';
  createdAt: string;
  timeline: TimelineEvent[];
  rca?: RootCauseAnalysis;
}

interface TimelineEvent {
  timestamp: string;
  source: 'slack' | 'manual' | 'system';
  message: string;
}

interface RootCauseAnalysis {
  summary: string;
  rootCause: string;
  preventionSteps: string[];
}
```
-> skipped: real-time collaboration engine, add when team size > 5 active users.