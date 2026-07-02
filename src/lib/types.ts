// FILE: src/lib/types.ts
'use client';

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
  detectedAt: number;
  resolvedAt: number | null;
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
