// FILE: src/app/dashboard/incidents/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useStore } from '@/lib/store';
import type { Incident, ActionItem, TimelineEvent, IncidentStatus, Severity, ActionStatus } from '@/lib/types';
import {
  ArrowLeft, Save, Plus, Trash2, CheckCircle2, Circle, Clock,
  AlertTriangle, ChevronDown, Edit2, X, User, Calendar
} from 'lucide-react';

const SEVERITY_COLORS: Record<Severity, string> = {
  P1: 'bg-[#ef4444]/20 text-[#ef4444]',
  P2: 'bg-[#f59e0b]/20 text-[#f59e0b]',
  P3: 'bg-[#3b82f6]/20 text-[#3b82f6]',
  P4: 'bg-[#10b981]/20 text-[#10b981]',
};

const STATUS_COLORS: Record<IncidentStatus, string> = {
  Investigating: 'bg-[#ef4444]/20 text-[#ef4444]',
  Identified: 'bg-[#f59e0b]/20 text-[#f59e0b]',
  Mitigated: 'bg-[#3b82f6]/20 text-[#3b82f6]',
  Resolved: 'bg-[#10b981]/20 text-[#10b981]',
};

const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  Todo: 'bg-[#8a8f98]/20 text-[#8a8f98]',
  InProgress: 'bg-[#3b82f6]/20 text-[#3b82f6]',
  Done: 'bg-[#10b981]/20 text-[#10b981]',
};

function formatTs(ts: number) {
  return new Date(ts).toLocaleString();
}

function formatDate(ts: number) {
  return new Date(ts).toISOString().split('T')[0];
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function IncidentDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useStore();
  const id = searchParams.get('id') as string;

  const incident = state.incidents.find((i) => i.id === id) ?? null;
  const actionItems = state.actionItems.filter((a) => a.incidentId === id);
  const timelineEvents = state.timelineEvents
    .filter((e) => e.incidentId === id)
    .sort((a, b) => a.timestamp - b.timestamp);

  // Incident form state
  const [form, setForm] = useState<Partial<Incident>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Timeline form
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [tlForm, setTlForm] = useState({ description: '', type: 'note' as TimelineEvent['type'] });
  const [tlErrors, setTlErrors] = useState<Record<string, string>>({});
  const [editingTl, setEditingTl] = useState<TimelineEvent | null>(null);

  // Action item form
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionForm, setActionForm] = useState({ title: '', owner: '', dueDate: '', status: 'Todo' as ActionStatus });
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [editingAction, setEditingAction] = useState<ActionItem | null>(null);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingActionId, setDeletingActionId] = useState<string | null>(null);
  const [deletingTlId, setDeletingTlId] = useState<string | null>(null);

  useEffect(() => {
    if (incident) {
      setForm({
        title: incident.title,
        description: incident.description,
        status: incident.status,
        severity: incident.severity,
        service: incident.service,
        rootCause: incident.rootCause,
        detectedAt: incident.detectedAt,
        resolvedAt: incident.resolvedAt,
      });
    }
  }, [incident?.id]);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = 'Required';
    if (!form.service?.trim()) e.service = 'Required';
    if (!form.severity) e.severity = 'Required';
    if (!form.status) e.status = 'Required';
    if (form.status === 'Resolved' && !form.rootCause?.trim()) {
      e.rootCause = 'Root cause required before resolving';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSave = () => {
    if (!incident || !validate()) return;
    setSaving(true);
    const now = Date.now();
    const resolvedAt =
      form.status === 'Resolved' && !incident.resolvedAt
        ? now
        : form.status !== 'Resolved'
        ? null
        : incident.resolvedAt;

    dispatch({
      type: 'UPDATE_INCIDENT',
      payload: {
        ...incident,
        ...form,
        resolvedAt,
        updatedAt: now,
      } as Incident,
    });
    dispatch({ type: 'TOAST', payload: { message: 'Incident updated', kind: 'success' } });
    setSaving(false);
  };

  const handleDelete = () => {
    if (!incident) return;
    dispatch({ type: 'DELETE_INCIDENT', payload: incident.id });
    dispatch({ type: 'TOAST', payload: { message: 'Incident deleted', kind: 'success' } });
    router.push('/dashboard/incidents');
  };

  // Timeline
  const validateTl = () => {
    const e: Record<string, string> = {};
    if (!tlForm.description.trim()) e.description = 'Required';
    setTlErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddTimeline = () => {
    if (!validateTl()) return;
    const now = Date.now();
    if (editingTl) {
      dispatch({
        type: 'UPDATE_TIMELINE_EVENT',
        payload: { ...editingTl, description: tlForm.description, type: tlForm.type },
      });
      dispatch({ type: 'TOAST', payload: { message: 'Event updated', kind: 'success' } });
    } else {
      dispatch({
        type: 'ADD_TIMELINE_EVENT',
        payload: {
          id: genId(),
          incidentId: id,
          timestamp: now,
          description: tlForm.description,
          type: tlForm.type,
        },
      });
      dispatch({ type: 'TOAST', payload: { message: 'Event added', kind: 'success' } });
    }
    setTlForm({ description: '', type: 'note' });
    setEditingTl(null);
    setShowTimelineForm(false);
  };

  const handleEditTl = (ev: TimelineEvent) => {
    setEditingTl(ev);
    setTlForm({ description: ev.description, type: ev.type });
    setShowTimelineForm(true);
  };

  const handleDeleteTl = (tlId: string) => {
    dispatch({ type: 'DELETE_TIMELINE_EVENT', payload: tlId });
    dispatch({ type: 'TOAST', payload: { message: 'Event deleted', kind: 'success' } });
    setDeletingTlId(null);
  };

  // Action items
  const validateAction = () => {
    const e: Record<string, string> = {};
    if (!actionForm.title.trim()) e.title = 'Required';
    if (!actionForm.owner.trim()) e.owner = 'Required';
    if (!actionForm.dueDate) e.dueDate = 'Required';
    setActionErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddAction = () => {
    if (!validateAction()) return;
    const now = Date.now();
    if (editingAction) {
      dispatch({
        type: 'UPDATE_ACTION_ITEM',
        payload: {
          ...editingAction,
          title: actionForm.title,
          owner: actionForm.owner,
          status: actionForm.status,
          dueDate: new Date(actionForm.dueDate).getTime(),
          updatedAt: now,
        },
      });
      dispatch({ type: 'TOAST', payload: { message: 'Action item updated', kind: 'success' } });
    } else {
      dispatch({
        type: 'ADD_ACTION_ITEM',
        payload: {
          id: genId(),
          incidentId: id,
          title: actionForm.title,
          owner: actionForm.owner,
          status: actionForm.status,
          dueDate: new Date(actionForm.dueDate).getTime(),
          createdAt: now,
          updatedAt: now,
        },
      });
      dispatch({ type: 'TOAST', payload: { message: 'Action item added', kind: 'success' } });
    }
    setActionForm({ title: '', owner: '', dueDate: '', status: 'Todo' });
    setEditingAction(null);
    setShowActionForm(false);
  };

  const handleEditAction = (a: ActionItem) => {
    setEditingAction(a);
    setActionForm({
      title: a.title,
      owner: a.owner,
      dueDate: formatDate(a.dueDate),
      status: a.status,
    });
    setShowActionForm(true);
  };

  const handleDeleteAction = (aId: string) => {
    dispatch({ type: 'DELETE_ACTION_ITEM', payload: aId });
    dispatch({ type: 'TOAST', payload: { message: 'Action item deleted', kind: 'success' } });
    setDeletingActionId(null);
  };

  const toggleActionStatus = (a: ActionItem) => {
    const next: ActionStatus = a.status === 'Done' ? 'Todo' : a.status === 'Todo' ? 'InProgress' : 'Done';
    dispatch({
      type: 'UPDATE_ACTION_ITEM',
      payload: { ...a, status: next, updatedAt: Date.now() },
    });
  };

  if (!state.loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08090a]">
        <div className="text-[#8a8f98]">Loading…</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#08090a]">
        <AlertTriangle className="h-10 w-10 text-[#f59e0b]" />
        <p className="text-[#d0d6e0]">Incident not found.</p>
        <button
          onClick={() => router.push('/dashboard/incidents')}
          className="rounded-md bg-[#5e6ad2] px-4 py-2 text-sm font-medium text-white hover:bg-[#828fff]"
        >
          Back to incidents
        </button>
      </div>
    );
  }

  const mttr =
    incident.resolvedAt
      ? ((incident.resolvedAt - incident.detectedAt) / 3600000).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.05)] bg-[#0f1011] px-6 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/incidents')}
              className="flex items-center gap-1 text-sm text-[#8a8f98] hover:text-[#f7f8f8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Incidents
            </button>
            <span className="text-[#62666d]">/</span>
            <span className="text-sm text-[#d0d6e0] truncate max-w-xs">{incident.title}</span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold">{incident.title}</h1>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${SEVERITY_COLORS[incident.severity]}`}>
                {incident.severity}
              </span>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[incident.status]}`}>
                {incident.status}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {mttr && (
                <span className="flex items-center gap-1 text-xs text-[#8a8f98]">
                  <Clock className="h-3 w-3" />
                  MTTR {mttr}h
                </span>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-md border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[#ef4444] hover:bg-[#ef4444]/10"
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-md bg-[#5e6ad2] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#828fff] disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Incident form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core fields */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0f1011] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#f7f8f8]">Incident Details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[#8a8f98]">Title *</label>
                <input
                  className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                  value={form.title ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
                {errors.title && <p className="mt-1 text-xs text-[#ef4444]">{errors.title}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs text-[#8a8f98]">Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none resize-none"
                  value={form.description ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-[#8a8f98]">Severity *</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none pr-8"
                      value={form.severity ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Severity }))}
                    >
                      {(['P1', 'P2', 'P3', 'P4'] as Severity[]).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-[#8a8f98]" />
                  </div>
                  {errors.severity && <p className="mt-1 text-xs text-[#ef4444]">{errors.severity}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-[#8a8f98]">Status *</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none pr-8"
                      value={form.status ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as IncidentStatus }))}
                    >
                      {(['Investigating', 'Identified', 'Mitigated', 'Resolved'] as IncidentStatus[]).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-[#8a8f98]" />
                  </div>
                  {errors.status && <p className="mt-1 text-xs text-[#ef4444]">{errors.status}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-[#8a8f98]">Service *</label>
                <input
                  className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                  value={form.service ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                />
                {errors.service && <p className="mt-1 text-xs text-[#ef4444]">{errors.service}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs text-[#8a8f98]">
                  Root Cause {form.status === 'Resolved' && <span className="text-[#ef4444]">*</span>}
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none resize-none"
                  value={form.rootCause ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, rootCause: e.target.value }))}
                  placeholder={form.status === 'Resolved' ? 'Required for resolved incidents' : ''}
                />
                {errors.rootCause && <p className="mt-1 text-xs text-[#ef4444]">{errors.rootCause}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-[#8a8f98]">Detected At</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                    value={form.detectedAt ? new Date(form.detectedAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setForm((f) => ({ ...f, detectedAt: new Date(e.target.value).getTime() }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[#8a8f98]">Resolved At</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                    value={form.resolvedAt ? new Date(form.resolvedAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, resolvedAt: e.target.value ? new Date(e.target.value).getTime() : null }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0f1011] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f7f8f8]">Timeline</h2>
              <button
                onClick={() => {
                  setEditingTl(null);
                  setTlForm({ description: '', type: 'note' });
                  setTlErrors({});
                  setShowTimelineForm(true);
                }}
                className="flex items-center gap-1 rounded-md bg-[#5e6ad2] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#828fff]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Event
              </button>
            </div>

            {showTimelineForm && (
              <div className="mb-4 rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#d0d6e0]">
                    {editingTl ? 'Edit Event' : 'New Event'}
                  </span>
                  <button
                    onClick={() => { setShowTimelineForm(false); setEditingTl(null); }}
                    className="text-[#8a8f98] hover:text-[#f7f8f8]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-[#8a8f98]">Type</label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none rounded-md border border-[rgba(255,255,255,0.08)] bg-[#08090a] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none pr-8"
                        value={tlForm.type}
                        onChange={(e) => setTlForm((f) => ({ ...f, type: e.target.value as TimelineEvent['type'] }))}
                      >
                        <option value="note">Note</option>
                        <option value="user">User Action</option>
                        <option value="system">System</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-[#8a8f98]" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#8a8f98]">Description *</label>
                    <textarea
                      rows={2}
                      className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#08090a] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none resize-none"
                      value={tlForm.description}
                      onChange={(e) => setTlForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    {tlErrors.description && <p className="mt-1 text-xs text-[#ef4444]">{tlErrors.description}</p>}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setShowTimelineForm(false); setEditingTl(null); }}
                      className="rounded-md border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[#d0d6e0]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTimeline}
                      className="rounded-md bg-[#5e6ad2] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#828fff]"
                    >
                      {editingTl ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {timelineEvents.length === 0 ? (
              <p className="text-center text-sm text-[#62666d] py-6">No events yet. Add the first one.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[rgba(255,255,255,0.05)]" />
                <div className="space-y-4">
                  {timelineEvents.map((ev) => (
                    <div key={ev.id} className="relative flex gap-4 pl-6">
                      <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#5e6ad2] bg-[#08090a]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm text-[#d0d6e0]">{ev.description}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-[#62666d]">{formatTs(ev.timestamp)}</span>
                              <span className={`rounded px-1.5 py-0.5 text-xs ${
                                ev.type === 'system' ? 'bg-[#3b82f6]/20 text-[#3b82f6]' :
                                ev.type === 'user' ? 'bg-[#5e6ad2]/20 text-[#7170ff]' :
                                'bg-[#8a8f98]/20 text-[#8a8f98]'
                              }`}>
                                {ev.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEditTl(ev)}
                              className="rounded p-1 text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.05)]"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingTlId(ev.id)}
                              className="rounded p-1 text-[#8a8f98] hover:text-[#ef4444] hover:bg-[rgba(255,255,255,0.05)]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Meta + Action Items */}
        <div className="space-y-6">
          {/* Meta */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0f1011] p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#f7f8f8]">Info</h2>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#8a8f98]">ID</dt>
                <dd className="text-[#d0d6e0] font-mono truncate max-w-[120px]">{incident.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8a8f98]">Created</dt>
                <dd className="text-[#d0d6e0]">{formatTs(incident.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8a8f98]">Updated</dt>
                <dd className="text-[#d0d6e0]">{formatTs(incident.updatedAt)}</dd>
              </div>
              {mttr && (
                <div className="flex justify-between">
                  <dt className="text-[#8a8f98]">MTTR</dt>
                  <dd className="text-[#10b981] font-medium">{mttr}h</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[#8a8f98]">Actions</dt>
                <dd className="text-[#d0d6e0]">
                  {actionItems.filter((a) => a.status === 'Done').length}/{actionItems.length} done
                </dd>
              </div>
            </dl>
          </div>

          {/* Action Items */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0f1011] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f7f8f8]">Action Items</h2>
              <button
                onClick={() => {
                  setEditingAction(null);
                  setActionForm({ title: '', owner: '', dueDate: '', status: 'Todo' });
                  setActionErrors({});
                  setShowActionForm(true);
                }}
                className="flex items-center gap-1 rounded-md bg-[#5e6ad2] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#828fff]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            {showActionForm && (
              <div className="mb-4 rounded-md border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#d0d6e0]">
                    {editingAction ? 'Edit Action' : 'New Action'}
                  </span>
                  <button
                    onClick={() => { setShowActionForm(false); setEditingAction(null); }}
                    className="text-[#8a8f98] hover:text-[#f7f8f8]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <input
                      placeholder="Title *"
                      className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#08090a] px-3 py-1.5 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                      value={actionForm.title}
                      onChange={(e) => setActionForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    {actionErrors.title && <p className="mt-0.5 text-xs text-[#ef4444]">{actionErrors.title}</p>}
                  </div>
                  <div>
                    <input
                      placeholder="Owner *"
                      className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#08090a] px-3 py-1.5 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                      value={actionForm.owner}
                      onChange={(e) => setActionForm((f) => ({ ...f, owner: e.target.value }))}
                    />
                    {actionErrors.owner && <p className="mt-0.5 text-xs text-[#ef4444]">{actionErrors.owner}</p>}
                  </div>
                  <div>
                    <input
                      type="date"
                      className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#08090a] px-3 py-1.5 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
                      value={actionForm.dueDate}
                      onChange={(e) => setActionForm((f) => ({ ...f, dueDate: e.target.value }))}
                    />
                    {actionErrors.dueDate && <p className="mt-0.5 text-xs text-[#ef4444]">{actionErrors.dueDate}</p>}
                  </div>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-md border border-[rgba(255,255,255,0.08)] bg-[#08090a] px-3 py-1.5 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none pr-7"
                      value={actionForm.status}
                      onChange={(e) => setActionForm((f) => ({ ...f, status: e.target.value as ActionStatus }))}
                    >
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#8a8f98]" />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => { setShowActionForm(false); setEditingAction(null); }}
                      className="rounded-md border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-xs text-[#d0d6e0]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAction}
                      className="rounded-md bg-[#5e6ad2] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#828fff]"
                    >
                      {editingAction ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {actionItems.length === 0 ? (
              <p className="text-center text-xs text-[#62666d] py-4">No action items yet.</p>
            ) : (
              <div className="space-y-2">
                {actionItems.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-md border border-[rgba(255,255,255,0.05)] bg-[#191a1b] p-3"
                  >
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleActionStatus(a)}
                        className="mt-0.5 shrink-0 text-[#8a8f98] hover:text-[#10b981]"
                      >
                        {a.status === 'Done' ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${a.status === 'Done' ? 'line-through text-[#62666d]' : 'text-[#f7f8f8]'}`}>
                          {a.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-[#8a8f98]">
                            <User className="h-3 w-3" />
                            {a.owner}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#8a8f98]">
                            <Calendar className="h-3 w-3" />
                            {formatDate(a.dueDate)}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-xs ${ACTION_STATUS_COLORS[a.status]}`}>
                            {a.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditAction(a)}
                          className="rounded p-1 text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.05)]"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setDeletingActionId(a.id)}
                          className="rounded p-1 text-[#8a8f98] hover:text-[#ef4444] hover:bg-[rgba(255,255,255,0.05)]"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete incident confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-6">
            <h3 className="mb-2 text-base font-semibold text-[#f7f8f8]">Delete Incident?</h3>
            <p className="mb-5 text-sm text-[#8a8f98]">
              This will permanently delete &ldquo;{incident.title}&rdquo; and all associated timeline events and action items.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[#d0d6e0]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#ef4444]/80"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete action item confirm */}
      {deletingActionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-6">
            <h3 className="mb-2 text-base font-semibold text-[#f7f8f8]">Delete Action Item?</h3>
            <p className="mb-5 text-sm text-[#8a8f98]">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingActionId(null)}
                className="rounded-md border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[#d0d6e0]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAction(deletingActionId)}
                className="rounded-md bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#ef4444]/80"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete timeline event confirm */}
      {deletingTlId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-6">
            <h3 className="mb-2 text-base font-semibold text-[#f7f8f8]">Delete Timeline Event?</h3>
            <p className="mb-5 text-sm text-[#8a8f98]">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingTlId(null)}
                className="rounded-md border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[#d0d6e0]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTl(deletingTlId)}
                className="rounded-md bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#ef4444]/80"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IncidentDetailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading...</div>}>
      <IncidentDetailContent />
    </Suspense>
  );
}
