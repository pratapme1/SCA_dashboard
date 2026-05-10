import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Icon } from './icons';
import { dataSources, categories, risks, supplierDirectory } from './data';
import {
  SevPill, StatusDot, Confidence, ActionPill, StatusPill,
  Card, GlobalMetricsSummary, Tabs, EmptyState, SupplierSearch, AIAnalyzeButton,
  SourceHealthPill, ChainViz, Toast
} from './components';
import { ChatAssistant } from './chat';

// ---------- Constants ----------
const ANALYST_NAME = 'V. Pratap Kumar';

// ---------- Top bar ----------
function TopBar({ risks }) {
  return (
    <header className="h-[52px] px-4 flex items-center justify-between border-b border-gray-800 bg-[#0f172a] shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">shield</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">SCA Risk Intelligence</h1>
            <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase">Supply Chain Assurance · Dell Technologies</span>
          </div>
        </div>
        
        {/* Director Readout Banner */}
        <div className="director-banner px-3 py-1 ml-2 rounded-r flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
          <span className="material-symbols-outlined text-primary text-base">campaign</span>
          <p className="text-[11px] font-medium text-gray-100">
            <span className="text-primary font-bold">Director Readout:</span> 2 critical suppliers threaten <span className="text-primary">$240M</span>. Recommended action: escalate Foxconn today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 pr-4 border-r border-gray-800">
          <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Source Health</span>
          <div className="flex gap-1">
            <SourceHealthPill label="ERP" status="green" title="ERP Systems: Synced" />
            <SourceHealthPill label="TPR" status="green" title="Risk Tools: Synced" />
            <SourceHealthPill label="DDL" status="amber" title="DDL Feeds: Delayed" />
            <SourceHealthPill label="DOC" status="green" title="PDF Reports: Synced" />
            <SourceHealthPill label="REV" status="red" title="Revenue: Failed" />
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-700 rounded text-[9px] text-gray-300 hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-[12px]">account_circle</span>
          <span className="font-semibold uppercase tracking-wider">Executive View</span>
        </button>
      </div>
    </header>
  );
}

// ---------- Risk Queue ----------
function RiskQueue({ riskRows, selectedId, onSelect, supplierFilter, setSupplierFilter, onAIAnalyze, aiLoading }) {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    let out = riskRows.filter((r) => !r.dismissed);
    if (supplierFilter.length) out = out.filter((r) => supplierFilter.includes(r.supplier));
    if (filter === 'Critical') out = out.filter((r) => r.severity === 'Critical');
    return out;
  }, [riskRows, supplierFilter, filter]);

  return (
    <Card 
      eyebrow="AI-Scored Risk Queue" 
      title="Critical Exposure List"
      action={
        <div className="flex gap-2">
          <SupplierSearch directory={supplierDirectory} value={supplierFilter} onChange={setSupplierFilter} />
          <AIAnalyzeButton targets={supplierFilter} onAnalyze={onAIAnalyze} loading={aiLoading} />
        </div>
      }
      className="h-full"
    >
      <div className="scroll-container flex-grow">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0f172a] border-b border-gray-800 z-10">
            <tr className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">
              <th className="px-3 py-2">Supplier & Product Focus</th>
              <th className="px-3 py-2">Risk Category</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Confidence</th>
              <th className="px-3 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.map((r) => {
              const isActive = selectedId === r.id;
              const cat = categories[r.category];
              return (
                <tr 
                  key={r.id} 
                  onClick={() => onSelect(r.id)}
                  className={`cursor-pointer transition-all duration-200 hover:bg-gray-800/30 ${isActive ? 'selected-row' : ''}`}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded border border-gray-700 flex items-center justify-center bg-gray-800 text-white font-bold text-[9px]">
                        {r.supplier.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white leading-none">{r.supplier}</span>
                          <span className="px-1 py-[1px] rounded bg-gray-800 border border-gray-700 text-[8px] text-gray-400 leading-none">{r.country}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-0.5 block truncate max-w-[180px]">
                          {r.products.join(', ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1 text-gray-300">
                      <span className="material-symbols-outlined text-sm" style={{ color: cat.tint.replace('text-', '') }}>
                        {cat.icon === 'Globe' ? 'public' : cat.icon === 'Package' ? 'factory' : cat.icon === 'Shield' ? 'security' : cat.icon === 'DollarSign' ? 'payments' : 'info'}
                      </span>
                      <span className="text-[11px]">{cat.label}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <SevPill level={r.severity} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Confidence value={r.confidence} />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <ActionPill action={r.action} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState title="No risks match filters" body="Adjust your search or category filters to see active supply chain risks." />
        )}
      </div>
      <div className="p-2 bg-[#0f172a] border-t border-gray-800 flex justify-between items-center text-[8px] text-gray-500 font-bold tracking-widest shrink-0">
        <span>{filtered.length} OF {riskRows.length} RISKS FILTERED</span>
        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[9px]">update</span> LAST UPDATED 4 MIN AGO</span>
      </div>
    </Card>
  );
}

// ---------- Decision Brief ----------
function DecisionBrief({ risk, onClose, onEscalate, onAssign, onMonitor, onDismiss }) {
  const [activeTab, setActiveTab] = useState('impact');

  if (!risk) return (
    <Card isExecutive={false} className="h-full flex items-center justify-center text-center p-8">
      <div className="max-w-xs">
        <span className="material-symbols-outlined text-4xl text-gray-700 mb-4">analytics</span>
        <h3 className="text-white font-bold mb-2">Select a Risk to Analyze</h3>
        <p className="text-gray-500 text-xs leading-relaxed">Select a supplier from the queue to view blast radius, upstream vulnerabilities, and recommended actions.</p>
      </div>
    </Card>
  );

  const cat = categories[risk.category];
  const tabs = [
    { id: 'impact', label: 'Impact' },
    { id: 'supply-chain', label: 'Supply Chain' },
    { id: 'audit', label: 'Audit & Action' },
  ];

  return (
    <div className="flex flex-col h-full gap-3 animate-in fade-in duration-300">
      <Card isExecutive={true} className="flex-grow flex flex-col shadow-2xl border-primary/20">
        {/* Detail Header */}
        <div className="p-3 bg-gradient-to-br from-[#1e293b] to-[#111827] border-b border-gray-800 shrink-0">
          <div className="flex justify-between items-start mb-1.5">
            <span className="text-[8px] text-primary uppercase tracking-[0.2em] font-bold">Risk Assessment · {risk.id.toUpperCase()}</span>
            <span className="px-1.5 py-0.5 bg-red-900/30 border border-red-800/50 text-red-400 text-[8px] font-bold rounded-full">{risk.severity.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gray-900 border border-gray-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-gray-400 font-light">domain</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight leading-none">{risk.supplier}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-gray-400">{cat.label} Event · {risk.country}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[8px] text-primary uppercase tracking-widest font-bold mb-0.5">AI Confidence</div>
              <div className="text-lg font-bold text-white glow-gold leading-none">{risk.confidence}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        <div className="p-3 scroll-container flex-grow">
          {activeTab === 'impact' && (
            <div className="flex flex-col gap-3 slide-in">
              <div className="grid grid-cols-2 gap-2">
                <div className="nested-card p-2.5 rounded-lg border-l-4 border-l-yellow-500">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <span className="material-symbols-outlined text-[10px]">payments</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest">Revenue Exposure</span>
                  </div>
                  <div className="text-xl font-bold text-white tracking-tighter leading-none mb-0.5">{risk.revenueExposure}</div>
                  <span className="text-[9px] text-gray-400 leading-tight">Quarterly impact at risk</span>
                </div>
                <div className="nested-card p-2.5 rounded-lg border-l-4 border-l-red-500">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <span className="material-symbols-outlined text-[10px]">timer</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest">Days to Impact</span>
                  </div>
                  <div className="text-xl font-bold text-red-400 tracking-tighter leading-none mb-0.5">{risk.daysToImpact || '—'}</div>
                  <span className="text-[9px] text-gray-400 leading-tight">Inventory burn threshold</span>
                </div>
              </div>
              <div className="nested-card p-2.5 rounded-lg border border-gray-800">
                <h4 className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">AI Intelligence Summary</h4>
                <p className="text-[11px] text-gray-200 leading-snug italic">
                  "{risk.summary}"
                </p>
                <div className="mt-2 pt-2 border-t border-gray-800">
                  <span className="text-[8px] text-gray-500 font-bold uppercase block mb-0.5">Critical Products Affected</span>
                  <p className="text-[10px] text-white leading-tight">{risk.products.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'supply-chain' && (
            <div className="flex flex-col gap-3 slide-in">
              <div className="nested-card p-2.5 rounded-lg border border-gray-800">
                <h4 className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">account_tree</span> Upstream Vulnerability Map
                </h4>
                <ChainViz chain={risk.chain} />
                <div className="pt-2 border-t border-gray-800">
                  <span className="text-[8px] text-red-400 font-bold uppercase block mb-0.5">Alternative Sourcing Strategy</span>
                  <p className="text-[10px] text-red-300 font-bold leading-tight">
                    {risk.altSupplier ? `${risk.altSupplier.name.toUpperCase()} (${risk.altSupplier.leadDays}D LEAD)` : 'SINGLE SOURCE DETECTED - NO IMMEDIATE FAILOVER'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="flex flex-col gap-3 slide-in">
              <div className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-800">
                <h4 className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Governance & Audit Trail</h4>
                <div className="space-y-1.5">
                  {risk.audit.map((a, i) => (
                    <div key={i} className="flex gap-2 text-[9px] leading-tight">
                      <span className="text-gray-500 w-16 shrink-0 font-mono uppercase">{a.t.split('·')[0]}</span>
                      <span className="text-gray-300">
                        <span className={`${a.kind === 'ai' ? 'text-primary' : a.kind === 'system' ? 'text-gray-400' : 'text-blue-400'} font-bold`}>{a.who}</span> — {a.act}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => onAssign(risk)} className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-[9px] font-bold rounded border border-gray-700 flex items-center justify-center gap-1 uppercase tracking-wider transition-colors">
                  <span className="material-symbols-outlined text-[12px]">person_add</span> Assign Analyst
                </button>
                <button onClick={() => onMonitor(risk)} className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-[9px] font-bold rounded border border-gray-700 flex items-center justify-center gap-1 uppercase tracking-wider transition-colors">
                  <span className="material-symbols-outlined text-[12px]">visibility</span> Monitor Closely
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Footer */}
        <div className="p-3 bg-[#0f172a] border-t border-gray-800 shrink-0">
          <button 
            onClick={() => onEscalate(risk)}
            className="w-full py-1.5 bg-primary hover:bg-yellow-500 text-on-primary text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[12px]">warning</span>
            Escalate to Regional VP
          </button>
        </div>
      </Card>
    </div>
  );
}

// ---------- Main App Component ----------
export default function App() {
  const [selectedId, setSelectedId] = useState('r-001');
  const [supplierFilter, setSupplierFilter] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Derived data
  const critCount = risks.filter(r => r.severity === 'Critical').length;
  const highCount = risks.filter(r => r.severity === 'High').length;
  const selectedRisk = useMemo(() => risks.find(r => r.id === selectedId), [selectedId]);

  const handleAIAnalyze = () => {
    if (!supplierFilter.length) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setToast({
        title: "Intelligence Refresh Complete",
        body: `Re-scored ${supplierFilter.length} suppliers against latest DDL and ERP feeds.`,
        meta: "May 10 · 11:42 · 9 sources synced"
      });
    }, 1500);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="flex flex-col h-screen bg-[#0b1120] text-gray-100 overflow-hidden">
      <TopBar risks={risks} />
      
      {/* Metrics Summary Row */}
      <GlobalMetricsSummary 
        totalSuppliers="1,247" 
        activeRisks={risks.length} 
        critCount={critCount} 
        highCount={highCount} 
        efficiency="4.2" 
      />

      {/* Main Dashboard Grid */}
      <main className="flex-grow flex gap-3 p-3 overflow-hidden">
        {/* Master: Risk Queue (55%) */}
        <div className="w-[55%] h-full">
          <RiskQueue 
            riskRows={risks} 
            selectedId={selectedId} 
            onSelect={setSelectedId} 
            supplierFilter={supplierFilter} 
            setSupplierFilter={setSupplierFilter}
            onAIAnalyze={handleAIAnalyze}
            aiLoading={aiLoading}
          />
        </div>

        {/* Detail: Blast Radius & Action (45%) */}
        <div className="w-[45%] h-full">
          <DecisionBrief 
            risk={selectedRisk}
            onEscalate={(r) => setToast({ title: `Escalated ${r.supplier}`, body: "Regional VP has been notified via Slack + Email.", meta: "Audit trail updated" })}
            onAssign={(r) => setToast({ title: `Assigned ${r.supplier}`, body: "Ops team assigned to triage capacity gap.", meta: "Ticket #SCA-992 created" })}
            onMonitor={(r) => setToast({ title: `Monitoring ${r.supplier}`, body: "Added to high-priority watch list.", meta: "Weekly refresh active" })}
          />
        </div>
      </main>

      {/* Status Footer */}
      <footer className="h-7 bg-[#0b1120] border-t border-gray-800 flex items-center justify-between px-4 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[7px] text-gray-500 tracking-widest uppercase">Proprietary Director View · Dell SCA Team Discovery 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[7px] text-gray-400 uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span> SYSTEM NOMINAL · V0.4.0-DIR
          </span>
        </div>
      </footer>

      <Toast toast={toast} />
      <ChatAssistant />
    </div>
  );
}
