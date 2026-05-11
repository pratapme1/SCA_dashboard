import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from './icons';

// ---------- Severity pill ----------
export function SevPill({ level, size = 'sm' }) {
  const map = { Critical: 'sev-crit', High: 'sev-high', Medium: 'sev-med', Low: 'sev-low' };
  const dot = { Critical: 'bg-red-500 glow-red', High: 'bg-yellow-500', Medium: 'bg-blue-500', Low: 'bg-green-500' }[level];
  const cls = map[level] || 'sev-med';
  const padding = 'px-1.5 py-[1px]';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold text-[8px] uppercase tracking-wider ${cls} ${padding}`}>
      <span className={`w-1 h-1 rounded-full ${dot}`}></span>
      {level}
    </span>
  );
}

// ---------- Status dot ----------
export function StatusDot({ status }) {
  const color = { green: 'bg-green-500', amber: 'bg-yellow-500', red: 'bg-red-500' }[status] || 'bg-green-500';
  return <div className={`source-dot ${color}`}></div>;
}

// ---------- Confidence bar ----------
export function Confidence({ value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-primary leading-none">{value}%</span>
      <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

// ---------- Action pill ----------
export function ActionPill({ action }) {
  const map = {
    Escalate:    { cls: 'bg-red-500/20 text-white', label: 'ACTION REQ' },
    Investigate: { cls: 'bg-blue-900/30 text-blue-400', label: 'IN REVIEW' },
    Monitor:     { cls: 'bg-gray-800 text-gray-400', label: 'MONITORING' },
    Dismiss:     { cls: 'bg-gray-900 text-gray-500', label: 'DISMISSED' },
  };
  const m = map[action] || map.Monitor;
  return (
    <span className={`text-[8px] font-bold ${m.cls} px-1 py-[1px] rounded tracking-widest uppercase`}>
      {m.label}
    </span>
  );
}

// ---------- Status pill (queue status) ----------
export function StatusPill({ status }) {
  const map = {
    'New':       'bg-gray-800 text-gray-300 border-gray-700',
    'In Review': 'bg-blue-900/20 text-blue-400 border-blue-800/30',
    'Escalated': 'bg-red-900/20 text-red-400 border-red-800/30',
    'Resolved':  'bg-green-900/20 text-green-400 border-green-800/30',
    'Open': 'bg-gray-800 text-gray-300 border-gray-700',
    'Investigating': 'bg-blue-900/20 text-blue-400 border-blue-800/30',
    'Awaiting Supplier': 'bg-yellow-900/20 text-yellow-500 border-yellow-800/30',
    'Blocked': 'bg-red-900/20 text-red-400 border-red-800/30',
    'Dismissed': 'bg-gray-900 text-gray-600 border-gray-800',
    'Awaiting response': 'bg-red-900/20 text-red-400 border-red-800/30',
    'Monitoring': 'bg-blue-900/20 text-blue-400 border-blue-800/30',
  };
  return <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${map[status] || map.New}`}>{status}</span>;
}

// ---------- Card shell ----------
export function Card({ title, eyebrow, action, children, className = '', isExecutive = true }) {
  const cardCls = isExecutive ? 'executive-card' : 'nested-card';
  return (
    <section className={`${cardCls} rounded-lg flex flex-col min-h-0 overflow-hidden ${className}`}>
      {(title || eyebrow) && (
        <header className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#111827] shrink-0">
          <div>
            {eyebrow && <h2 className="text-[9px] text-primary uppercase tracking-widest font-bold mb-0.5">{eyebrow}</h2>}
            {title && <p className="text-sm font-semibold text-white">{title}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

// ---------- Global Metrics Summary ----------
export function GlobalMetricsSummary({ totalSuppliers, activeRisks, critCount, highCount, efficiency }) {
  return (
    <div className="h-[60px] bg-[#111827] border-b border-gray-800 flex items-center px-4 shrink-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Total Suppliers</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white leading-none">{totalSuppliers}</span>
              <span className="text-[9px] text-gray-500">monitored</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Active Risks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white leading-none">{activeRisks}</span>
              <div className="flex gap-1.5">
                <span className="text-[8px] font-bold text-red-400 bg-red-900/20 px-1 rounded">{critCount} CRIT</span>
                <span className="text-[8px] font-bold text-yellow-500 bg-yellow-900/20 px-1 rounded">{highCount} HIGH</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Analyst Efficiency</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-primary leading-none">{efficiency} hr</span>
              <span className="text-[9px] text-green-500 font-medium">+52% saved</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-gray-800"></div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-1">Risk Posture: <span className="text-white">MODERATE</span></span>
            <div className="flex gap-1">
              <div className="h-1 w-6 bg-primary rounded-full"></div>
              <div className="h-1 w-6 bg-primary rounded-full"></div>
              <div className="h-1 w-6 bg-primary rounded-full"></div>
              <div className="h-1 w-6 bg-gray-700 rounded-full"></div>
              <div className="h-1 w-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Tabs ----------
export function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex border-b border-gray-800 shrink-0 px-3 pt-1.5 bg-[#0f172a] ${className}`}>
      {tabs.map((t) => {
        const selected = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase border-b-2 transition-colors ${
              selected
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Empty state ----------
export function EmptyState({ icon = 'Search', title, body, actionLabel, onAction }) {
  const Ic = Icon[icon] || Icon.Search;
  return (
    <div className="h-full grid place-items-center px-6 py-8 text-center bg-[#0f172a]">
      <div className="max-w-[280px]">
        <div className="mx-auto h-10 w-10 rounded-lg bg-gray-900 border border-gray-800 text-gray-500 grid place-items-center">
          <Ic size={16} />
        </div>
        <div className="mt-3 text-sm font-bold text-white">{title}</div>
        <p className="mt-1.5 text-[11px] text-gray-400 leading-relaxed">{body}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-3 inline-flex items-center gap-1.5 rounded border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-[10px] font-bold text-primary hover:bg-primary/20"
          >
            <Icon.Refresh size={11} /> {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Source Health Pill ----------
export function SourceHealthPill({ label, status, title }) {
  const dotColor = { green: 'bg-green-500', amber: 'bg-yellow-500', red: 'bg-red-500' }[status] || 'bg-green-500';
  return (
    <div className="source-pill px-1.5 py-0.5 rounded flex items-center gap-1" title={title}>
      <div className={`source-dot ${dotColor}`}></div>
      <span className="text-[8px] text-gray-400 font-bold uppercase">{label}</span>
    </div>
  );
}

// ---------- Chain Visualizer ----------
const tierMeta = [
  { label: 'T1 ASSEMBLY',   color: 'border-red-500/40',   bg: 'bg-red-900/10', text: 'text-red-300',   dot: 'bg-red-400',  glow: 'shadow-[0_0_12px_rgba(248,113,113,0.15)]' },
  { label: 'T2 COMPONENT',  color: 'border-amber-500/30',  bg: 'bg-amber-900/10',text: 'text-amber-300', dot: 'bg-amber-400',glow: '' },
  { label: 'RAW MATERIAL',  color: 'border-sky-500/30',    bg: 'bg-sky-900/10',  text: 'text-sky-300',   dot: 'bg-sky-400',  glow: '' },
];

export function ChainViz({ chain }) {
  return (
    <div className="relative pl-6 py-0.5">
      {/* Vertical connecting line */}
      <div className="absolute left-[10px] top-3 bottom-3 w-px bg-gradient-to-b from-red-500/40 via-amber-500/30 to-sky-500/30"></div>

      {chain.map((c, i) => {
        const t = tierMeta[i] || tierMeta[tierMeta.length - 1];
        const isCritical = i === 0;

        return (
          <div key={i} className="relative pb-3 last:pb-0">
            {/* Timeline dot */}
            <div className={`absolute -left-5 top-1.5 w-2 h-2 rounded-full ${t.dot} ${isCritical ? 'animate-pulse' : ''} ring-2 ring-[#0f172a] z-10 ${isCritical ? 'shadow-[0_0_8px_rgba(248,113,113,0.5)]' : ''}`}></div>

            {/* Flow arrow between nodes */}
            {i < chain.length - 1 && (
              <div className="absolute -left-[18px] top-[16px] text-gray-600">
                <span className="material-symbols-outlined text-[10px]">arrow_downward</span>
              </div>
            )}

            {/* Node card */}
            <div className={`rounded-lg border ${t.color} ${t.bg} ${isCritical ? t.glow : ''} p-2 transition-all hover:brightness-110`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[7px] font-bold uppercase tracking-[0.15em] ${t.text}`}>{t.label}</span>
                {isCritical && <span className="text-[7px] font-bold text-red-400 uppercase tracking-wider bg-red-900/30 px-1 py-[1px] rounded">Critical Path</span>}
              </div>
              <div className="text-[11px] font-semibold text-white leading-tight">{c}</div>
              {i === 0 && (
                <div className="mt-1 flex items-center gap-1 text-[8px] text-gray-500">
                  <span className="material-symbols-outlined text-[9px]">inventory_2</span>
                  <span>Finished goods</span>
                </div>
              )}
              {i === chain.length - 1 && (
                <div className="mt-1 flex items-center gap-1 text-[8px] text-gray-500">
                  <span className="material-symbols-outlined text-[9px]">mining</span>
                  <span>Raw extraction</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Toast ----------
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-12 right-6 z-50 toast">
      <div className="rounded-lg executive-card border-primary/30 shadow-2xl px-4 py-3 max-w-[360px] bg-[#111827]">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 h-6 w-6 rounded bg-primary/10 text-primary grid place-items-center">
            <Icon.CheckCircle size={13} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white">{toast.title}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{toast.body}</div>
            <div className="text-[9px] font-mono text-gray-500 mt-1.5 uppercase tracking-widest">{toast.meta}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Modal ----------
export function Modal({ open, onClose, title, icon, children, actions, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-backdrop" onClick={onClose} />
      <div className={`relative bg-[#111827] border border-gray-800 rounded-xl shadow-2xl w-full ${widths[size]} modal-content`}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            {icon || <span className="material-symbols-outlined text-primary text-lg">info</span>}
            <h3 className="text-sm font-bold text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div className="p-5">{children}</div>
        {actions && (
          <div className="px-5 py-3.5 border-t border-gray-800 flex justify-end gap-2 bg-[#0f172a] rounded-b-xl">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Person Picker ----------
export function PersonPicker({ people, value, onChange, placeholder = 'Search people...', filterTeam }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = useMemo(() => {
    let pool = people;
    if (filterTeam) pool = pool.filter(p => p.team === filterTeam);
    if (value) pool = pool.filter(p => p.id !== value.id);
    const ql = q.trim().toLowerCase();
    if (ql) pool = pool.filter(p => p.name.toLowerCase().includes(ql) || p.role.toLowerCase().includes(ql) || p.team.toLowerCase().includes(ql));
    return pool.slice(0, 8);
  }, [q, value, people, filterTeam]);

  return (
    <div ref={ref} className="relative">
      {value ? (
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded p-1.5">
          <div className="w-5 h-5 rounded bg-primary/20 text-primary text-[8px] font-bold flex items-center justify-center">{value.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-white leading-tight">{value.name}</div>
            <div className="text-[8px] text-gray-500 leading-tight">{value.role}</div>
          </div>
          <button onClick={() => onChange(null)} className="text-gray-500 hover:text-white p-0.5">
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1.5 text-gray-500 text-[14px]">search</span>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded py-1 pl-7 pr-2 text-[11px] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary/50"
            placeholder={placeholder}
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
        </div>
      )}
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[60] bg-gray-900 border border-gray-700 rounded shadow-2xl overflow-hidden">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => { onChange(p); setQ(''); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-[11px] text-gray-300 hover:bg-gray-800 border-b border-gray-800 last:border-0 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded bg-gray-800 text-gray-400 text-[9px] font-bold flex items-center justify-center shrink-0">{p.avatar}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-white leading-tight">{p.name}</div>
                <div className="text-[8px] text-gray-500">{p.role} · {p.team}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Escalate Modal ----------
export function EscalateModal({ open, risk, people, onClose, onConfirm }) {
  const [assignee, setAssignee] = useState(null);
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('high');

  if (!risk) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Escalate Risk"
      icon={<span className="material-symbols-outlined text-red-400 text-lg">warning</span>}
      size="lg"
      actions={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-white border border-gray-700 rounded hover:bg-gray-800 uppercase tracking-wider transition-colors">Cancel</button>
          <button
            onClick={() => { if (assignee) onConfirm(risk, { assignee, reason, urgency }); onClose(); }}
            disabled={!assignee}
            className={`px-3 py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
              assignee ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            Confirm Escalation
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-white">{risk.supplier}</span>
            <span className="text-[8px] font-bold text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded-full">{risk.severity}</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-tight">{risk.category} &middot; {risk.revenueExposure} exposure &middot; {risk.daysToImpact ? `${risk.daysToImpact}d to impact` : 'No timeline'}</p>
        </div>

        <div>
          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Escalate To</label>
          <PersonPicker people={people} value={assignee} onChange={setAssignee} placeholder="Search by name, role, or team..." filterTeam="Leadership" />
        </div>

        <div>
          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Urgency</label>
          <div className="flex gap-2">
            {['high', 'medium', 'low'].map((u) => (
              <button key={u} onClick={() => setUrgency(u)} className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded border transition-colors ${
                urgency === u ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-300'
              }`}>
                {u === 'high' ? 'High' : u === 'medium' ? 'Medium' : 'Low'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-[11px] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary/50 resize-none"
            rows={2}
            placeholder="Brief escalation context..."
          />
        </div>
      </div>
    </Modal>
  );
}

// ---------- Assign Modal ----------
export function AssignModal({ open, risk, people, onClose, onConfirm }) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [assignee, setAssignee] = useState(null);
  const [notes, setNotes] = useState('');

  const teams = [...new Set(people.map(p => p.team))];

  if (!risk) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign to Analyst"
      icon={<span className="material-symbols-outlined text-sky-400 text-lg">person_add</span>}
      size="lg"
      actions={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-white border border-gray-700 rounded hover:bg-gray-800 uppercase tracking-wider transition-colors">Cancel</button>
          <button
            onClick={() => { if (assignee) onConfirm(risk, { assignee, team: selectedTeam, notes }); onClose(); }}
            disabled={!assignee}
            className={`px-3 py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
              assignee ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            Assign
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-800">
          <span className="text-[11px] font-bold text-white">{risk.supplier}</span>
          <p className="text-[9px] text-gray-400 mt-0.5">{risk.category} &middot; {risk.products.slice(0, 2).join(', ')}</p>
        </div>

        <div>
          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => { setSelectedTeam(e.target.value); setAssignee(null); }}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-[11px] text-gray-300 focus:outline-none focus:border-primary/50"
          >
            <option value="">All teams</option>
            {teams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Assign To</label>
          <PersonPicker people={people} value={assignee} onChange={setAssignee} placeholder="Search by name, role, or team..." filterTeam={selectedTeam || undefined} />
        </div>

        <div>
          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-[11px] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary/50 resize-none"
            rows={2}
            placeholder="Assignment context..."
          />
        </div>
      </div>
    </Modal>
  );
}

// ---------- Supplier Search ----------
export function SupplierSearch({ directory, value, onChange }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const matches = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return directory
      .filter(s => !value.includes(s.name))
      .filter(s => !ql || s.name.toLowerCase().includes(ql) || s.country.toLowerCase().includes(ql))
      .slice(0, 8);
  }, [q, value, directory]);

  const add = (name) => { onChange([...value, name]); setQ(''); };
  const remove = (name) => onChange(value.filter(v => v !== name));

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-2 top-1.5 text-gray-500 text-[14px]">search</span>
        <input 
          className="bg-gray-900 border border-gray-700 rounded py-1 pl-7 pr-2 text-[11px] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary/50 w-48" 
          placeholder="Search suppliers..." 
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[60] bg-gray-900 border border-gray-700 rounded shadow-2xl overflow-hidden">
          {matches.map(m => (
            <button key={m.name} onClick={() => add(m.name)} className="w-full text-left px-3 py-2 text-[11px] text-gray-300 hover:bg-gray-800 border-b border-gray-800 last:border-0 flex justify-between">
              <span>{m.name}</span>
              <span className="text-[9px] text-gray-500 uppercase">{m.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- AI Analyze Button ----------
export function AIAnalyzeButton({ targets, onAnalyze, loading }) {
  const disabled = targets.length === 0 || loading;
  return (
    <button
      type="button"
      onClick={onAnalyze}
      disabled={disabled}
      className={`px-3 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1.5 ${
        disabled
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
          : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
      }`}
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
      ) : (
        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
      )}
      <span>{loading ? 'ANALYZING...' : 'AI ANALYZE'}</span>
    </button>
  );
}
