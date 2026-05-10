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
export function ChainViz({ chain }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      {chain.map((c, i) => (
        <React.Fragment key={i}>
          <div className={`flex-1 bg-[#111827] border ${i === 0 ? 'border-red-900/50 shadow-[0_0_10px_rgba(248,113,113,0.1)]' : 'border-gray-800'} rounded p-1.5 text-center`}>
            <span className="text-[7px] text-gray-500 block leading-tight mb-0.5">{i === 0 ? 'T1 ASSEMBLY' : i === 1 ? 'T2 COMPONENT' : 'RAW MATERIAL'}</span>
            <span className="text-[10px] font-bold text-white leading-tight truncate block">{c}</span>
          </div>
          {i < chain.length - 1 && <span className="material-symbols-outlined text-gray-700 text-[10px]">arrow_forward</span>}
        </React.Fragment>
      ))}
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
