// FILE: src/app/dashboard/incidents/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Incident, Severity, IncidentStatus } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';
import {
  Plus, Search, Trash2, X, ChevronDown, AlertCircle,
  CheckCircle2, Clock, Zap, Filter
} from 'lucide-react';

const SEVERITIES: Severity[] = ['P1', 'P2', 'P3', 'P4'];
const STATUSES: IncidentStatus[] = ['Investigating', 'Identified', 'Mitigated', 'Resolved'];

const SEV_COLORS: Record<Severity, string> = {
  P1: 'bg-[#ef4444]/10 text-[#ef4444]',
  P2: 'bg-[#f59e0b]/10 text-[#f59e0b]',
  P3: 'bg-[#3b82f6]/10 text-[#3b82f6]',
  P4: 'bg-[#10b981]/10 text-[#10b981]',
};

const STATUS_COLORS: Record<IncidentStatus, string> = {
  Investigating: 'bg-[#ef4444]/10 text-[#ef4444]',
  Identified: 'bg-[#f59e0b]/10 text-[#f59e0b]',
  Mitigated: 'bg-[#3b82f6]/10 text-[#3b82f6]',
  Resolved: 'bg-[#10b981]/10 text-[#10b981]',
};

const STATUS_ICONS: Record<IncidentStatus, React.ReactNode> = {
  Investigating: <AlertCircle size={12} />,
  Identified: <Zap size={12} />,
  Mitigated: <Clock size={12} />,
  Resolved: <CheckCircle2 size={12} />,
};

interface FormData {
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  service: string;
  rootCause: string;
  detectedAt: string;
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  severity: 'P3',
  status: 'Investigating',
  service: '',
  rootCause: '',
  detectedAt: new Date().toISOString().slice(0, 16),
};

function validate(form: FormData): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = 'Required';
  if (form.title.trim().length > 200) errs.title = 'Max 200 chars';
  if (!form.service.trim()) errs.service = 'Required';
  if (!form.detectedAt) errs.detectedAt = 'Required';
  if (form.status === 'Resolved' && !form.rootCause.trim())
    errs.rootCause = 'Root cause required before resolving';
  return errs;
}

export default function IncidentsPage() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | ''>('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | ''>('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowDeleteConfirm(null);
        setShowBulkConfirm(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const incidents: Incident[] = state.incidents ?? [];

  const filtered = incidents.filter((inc) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      inc.title.toLowerCase().includes(q) ||
      inc.service.toLowerCase().includes(q);
    const matchStatus = !filterStatus || inc.status === filterStatus;
    const matchSev = !filterSeverity || inc.severity === filterSeverity;
    return matchSearch && matchStatus && matchSev;
  });

  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (inc: Incident) => {
    setEditId(inc.id);
    setForm({
      title: inc.title,
      description: inc.description,
      severity: inc.severity,
      status: inc.status,
      service: inc.service,
      rootCause: inc.rootCause,
      detectedAt: new Date(inc.detectedAt).toISOString().slice(0, 16),
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const now = Date.now();
    const detectedAt = new Date(form.detectedAt).getTime();

    if (editId) {
      const existing = incidents.find((i) => i.id === editId)!;
      const resolvedAt =
        form.status === 'Resolved' && existing.status !== 'Resolved'
          ? now
          : form.status !== 'Resolved'
          ? null
          : existing.resolvedAt;

      dispatch({
        type: 'UPDATE_INCIDENT',
        payload: {
          ...existing,
          ...form,
          detectedAt,
          resolvedAt,
          updatedAt: now,
        },
      });
      dispatch({ type: 'TOAST', payload: { message: 'Incident updated', kind: 'success' } });
    } else {
      const id = `inc_${now}_${Math.random().toString(36).slice(2, 7)}`;
      dispatch({
        type: 'ADD_INCIDENT',
        payload: {
          id,
          ...form,
          detectedAt,
          resolvedAt: null,
          createdAt: now,
          updatedAt: now,
        },
      });
      dispatch({ type: 'TOAST', payload: { message: 'Incident created', kind: 'success' } });
    }

    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_INCIDENT', payload: id });
    dispatch({ type: 'TOAST', payload: { message: 'Incident deleted', kind: 'success' } });
    setShowDeleteConfirm(null);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkDelete = () => {
    selected.forEach((id) => dispatch({ type: 'DELETE_INCIDENT', payload: id }));
    dispatch({ type: 'TOAST', payload: { message: `${selected.size} incidents deleted`, kind: 'success' } });
    setSelected(new Set());
    setShowBulkConfirm(false);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === sorted.length) setSelected(new Set());
    else setSelected(new Set(sorted.map((i) => i.id)));
  };

  const field = (key: keyof FormData, label: string, node: React.ReactNode) => (
    <div>
      <label className="mb-1 block text-xs text-[#8a8f98]">{label}</label>
      {node}
      {errors[key] && <p className="mt-1 text-xs text-[#ef4444]">{errors[key]}</p>}
    </div>
  );

  const inputCls = `w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#08090a] px-3 py-2 text-sm text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none`;
  const selectCls = `${inputCls} appearance-none`;

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Incidents</h1>
            <p className="text-sm text-[#8a8f98]">{incidents.length} total · {incidents.filter(i => i.status !== 'Resolved').length} active</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-[#5e6ad2] px-4 py-2 text-sm font-medium text-white hover:bg-[#828fff] transition-colors">
            <Plus size={16} />
            New Incident
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8f98]" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents… (⌘K)"
              className={`${inputCls} pl-9 pr-3`}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-[#f7f8f8]">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
              showFilters || filterStatus || filterSeverity
                ? 'border-[#5e6ad2] text-[#5e6ad2]'
                : 'border-[rgba(255,255,255,0.08)] text-[#d0d6e0]'
            }`}
          >
            <Filter size={14} />
            Filters
            {(filterStatus || filterSeverity) && (
              <span className="rounded-full bg-[#5e6ad2] px-1.5 py-0.5 text-xs text-white">
                {[filterStatus, filterSeverity].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Bulk delete */}
          {selected.size > 0 && (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="flex items-center gap-2 rounded-md bg-[#ef4444]/10 border border-[#ef4444]/30 px-3 py-2 text-sm text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors"
            >
              <Trash2 size={14} />
              Delete {selected.size}
            </button>
          )}

          <span className="ml-auto text-xs text-[#8a8f98]">{sorted.length} results</span>
        </div>

        {/* Filter row */}
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as IncidentStatus | '')}
                className={`${selectCls} pr-8 min-w-[140px]`}
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8a8f98]" />
            </div>
            <div className="relative">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as Severity | '')}
                className={`${selectCls} pr-8 min-w-[140px]`}
              >
                <option value="">All Severities</option>
                {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8a8f98]" />
            </div>
            {(filterStatus || filterSeverity) && (
              <button
                onClick={() => { setFilterStatus(''); setFilterSeverity(''); }}
                className="text-xs text-[#8a8f98] hover:text-[#f7f8f8] underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={sorted.length > 0 && selected.size === sorted.length}
                  onChange={toggleAll}
                  className="rounded border-[rgba(255,255,255,0.08)] bg-[#191a1b] accent-[#5e6ad2]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase text-[#8a8f98]">Incident</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-[#8a8f98]">Service</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-[#8a8f98]">Severity</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-[#8a8f98]">Status</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-[#8a8f98]">Detected</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-[#8a8f98]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-[#8a8f98]">
                  {search || filterStatus || filterSeverity
                    ? 'No incidents match filters'
                    : 'No incidents yet. Create your first one.'}
                </td>
              </tr>
            )}
            {sorted.map((inc) => (
              <tr
                key={inc.id}
                className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[#0f1011] transition-colors group"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(inc.id)}
                    onChange={() => toggleSelect(inc.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-[rgba(255,255,255,0.08)] bg-[#191a1b] accent-[#5e6ad2]"
                  />
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/dashboard/incidents/${inc.id}`}
                    className="block"
                  >
                    <p className="text-sm font-medium text-[#f7f8f8] hover:text-[#7170ff] transition-colors line-clamp-1">
                      {inc.title}
                    </p>
                    {inc.description && (
                      <p className="text-xs text-[#8a8f98] line-clamp-1 mt-0.5">{inc.description}</p>
                    )}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[#d0d6e0]">{inc.service}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${SEV_COLORS[inc.severity]}`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[inc.status]}`}>
                    {STATUS_ICONS[inc.status]}
                    {inc.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-[#8a8f98]">
                    {formatDistanceToNow(inc.detectedAt)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(inc)}
                      className="rounded px-2 py-1 text-xs text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#191a1b] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(inc.id)}
                      className="rounded px-2 py-1 text-xs text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div
            className="w-full max-w-lg rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editId ? 'Edit Incident' : 'New Incident'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#8a8f98] hover:text-[#f7f8f8]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {field('title', 'Title *', (
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief incident title"
                  className={inputCls}
                />
              ))}

              {field('description', 'Description', (
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What happened?"
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              ))}

              <div className="grid grid-cols-2 gap-4">
                {field('service', 'Service *', (
                  <input
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    placeholder="e.g. API Gateway"
                    className={inputCls}
                  />
                ))}

                {field('detectedAt', 'Detected At *', (
                  <input
                    type="datetime-local"
                    value={form.detectedAt}
                    onChange={(e) => setForm({ ...form, detectedAt: e.target.value })}
                    className={inputCls}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {field('severity', 'Severity', (
                  <div className="relative">
                    <select
                      value={form.severity}
                      onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}
                      className={`${selectCls} pr-8`}
                    >
                      {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8a8f98]" />
                  </div>
                ))}

                {field('status', 'Status', (
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as IncidentStatus })}
                      className={`${selectCls} pr-8`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8a8f98]" />
                  </div>
                ))}
              </div>

              {field('rootCause', 'Root Cause', (
                <textarea
                  value={form.rootCause}
                  onChange={(e) => setForm({ ...form, rootCause: e.target.value })}
                  placeholder={form.status === 'Resolved' ? 'Required for Resolved status' : 'Describe the root cause…'}
                  rows={2}
                  className={`${inputCls} resize-none ${form.status === 'Resolved' && !form.rootCause ? 'border-[#f59e0b]' : ''}`}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-md border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[#d0d6e0] hover:bg-[#0f1011] transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="rounded-md bg-[#5e6ad2] px-4 py-2 text-sm font-medium text-white hover:bg-[#828fff] transition-colors">
                {editId ? 'Save Changes' : 'Create Incident'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single delete confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-6 shadow-2xl">
            <h2 className="mb-2 text-base font-semibold">Delete Incident?</h2>
            <p className="mb-5 text-sm text-[#8a8f98]">
              This will permanently delete the incident and all associated data. Cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="rounded-md border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[#d0d6e0] hover:bg-[#0f1011] transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="rounded-md bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#ef4444]/80 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete confirm */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#191a1b] p-6 shadow-2xl">
            <h2 className="mb-2 text-base font-semibold">Delete {selected.size} Incidents?</h2>
            <p className="mb-5 text-sm text-[#8a8f98]">
              This will permanently delete {selected.size} incidents and all associated data. Cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowBulkConfirm(false)} className="rounded-md border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[#d0d6e0] hover:bg-[#0f1011] transition-colors">
                Cancel
              </button>
              <button onClick={handleBulkDelete} className="rounded-md bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#ef4444]/80 transition-colors">
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
