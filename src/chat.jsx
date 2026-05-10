import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './icons';
import { risks, dataSources, supplierDirectory } from './data';

function buildSystemPrompt() {
  const summary = {
    suppliers_monitored: 1247,
    suppliers_in_directory_sample: supplierDirectory.length,
    active_risks: risks.length,
    by_severity: ['Critical','High','Medium','Low'].reduce((acc, s) => { acc[s] = risks.filter(r => r.severity===s).length; return acc; }, {}),
    sources: dataSources.map(s => ({ name: s.name, status: s.status, last: s.last, records: s.records })),
    risks: risks.map(r => ({
      id: r.id, supplier: r.supplier, country: r.country, category: r.category,
      severity: r.severity, source: r.source, confidence: r.confidence,
      recommended_action: r.action, status: r.status, detected: r.detected,
      summary: r.summary, products: r.products,
      alt_supplier: r.altSupplier ? `${r.altSupplier.name} (${r.altSupplier.leadDays}d)` : 'SINGLE SOURCE',
      revenue_exposure: r.revenueExposure, days_to_impact: r.daysToImpact,
      chain: r.chain, recommendation: r.recommendation,
    })),
  };

  return `You are the SCA Risk Intelligence assistant for Dell's Supply Chain Assurance team.
You help analysts get quick insights about supplier risk data shown in the dashboard, plus reasonable inference about adjacent supply-chain context.

Be concise (2–4 short paragraphs max), executive-tone, no fluff. Use bullet points sparingly when comparing items. Cite supplier names and numbers from the data.

If asked about something not in the data, say what you can infer and what would need to be sourced.

DASHBOARD DATA (JSON):
${JSON.stringify(summary)}`;
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask me anything about the suppliers, risks, or signals on this dashboard — or adjacent questions I can reason about.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const taRef = useRef(null);
  const hasModel = Boolean(window.claude && window.claude.complete);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (open && taRef.current) setTimeout(() => taRef.current && taRef.current.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy || !hasModel) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const reply = await window.claude.complete({
        messages: [
          { role: 'user', content: `${buildSystemPrompt()}\n\n---\nConversation so far:\n${next.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}\n\nReply as ASSISTANT only.` },
        ],
      });
      setMessages([...next, { role: 'assistant', content: (reply || '').trim() || 'No response.' }]);
    } catch (e) {
      setMessages([...next, { role: 'assistant', content: `Sorry — couldn't reach the model. (${String(e).slice(0,140)})` }]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const suggestions = [
    'Which suppliers should I escalate first today and why?',
    'Show single-source risks with <30 day buffer',
    'Compare Foxconn and Quanta exposure',
    'What does the geopolitical risk for Foxconn imply for PowerEdge revenue?',
  ];

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Ask the SCA assistant"
        className={`assistant-launcher inline-flex fixed bottom-20 right-6 z-40 items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-full bg-primary text-[#111827] font-bold text-[12px] shadow-lg shadow-primary/20 border border-primary/60 hover:scale-[1.02] active:scale-[0.99] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${open ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <Icon.Sparkles size={13} />
        <span>Ask Assistant</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Soft backdrop */}
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-auto"></div>

          <div className="absolute bottom-6 right-6 w-[420px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-xl bg-[#111827] border border-gray-800 shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08]">
              <div className="h-7 w-7 grid place-items-center rounded-md bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/30 text-gold">
                <Icon.Sparkles size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-white">SCA Assistant</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Grounded in current dashboard</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"><Icon.X size={14} /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto scroll-thin px-4 py-3 space-y-3">
              {!hasModel && (
                <div className="rounded-lg border border-high/30 bg-high/[0.06] px-3 py-2.5 text-[11.5px] text-zinc-200 leading-relaxed">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-200">
                    <Icon.AlertTriangle size={10} /> Assistant unavailable
                  </div>
                  This environment has not provided <span className="font-mono text-zinc-100">window.claude.complete</span>. You can review suggested prompts, but sending is disabled until the host API is available.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 h-6 w-6 rounded-md grid place-items-center text-[10px] font-mono ${
                    m.role === 'user'
                      ? 'bg-sky-400/15 text-sky-200 border border-sky-400/25'
                      : 'bg-gold/15 text-gold border border-gold/30'
                  }`}>{m.role === 'user' ? 'You' : 'AI'}</div>
                  <div className={`max-w-[88%] rounded-lg px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-sky-400/10 border border-sky-400/20 text-sky-50'
                      : 'bg-white/[0.03] border border-white/[0.06] text-zinc-100'
                  }`}>{m.content}</div>
                </div>
              ))}
              {busy && (
                <div className="flex gap-2">
                  <div className="shrink-0 h-6 w-6 rounded-md bg-gold/15 text-gold border border-gold/30 grid place-items-center text-[10px]">AI</div>
                  <div className="rounded-lg px-3 py-2 bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-[12px] inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: '120ms' }}></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: '240ms' }}></span>
                    <span className="ml-1.5 text-[11px] text-zinc-400">thinking…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion chips */}
            {messages.length <= 1 && !busy && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-[10.5px] px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] hover:border-white/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                  >{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-white/[0.06]">
              <div className="flex items-end gap-2 rounded-lg bg-white/[0.03] border border-white/[0.08] focus-within:border-gold/40 px-2.5 py-2">
                <textarea
                  ref={taRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  placeholder={hasModel ? 'Ask about a supplier, risk, or what-if…' : 'Assistant host API unavailable'}
                  className="flex-1 bg-transparent outline-none resize-none text-[12.5px] text-white placeholder:text-zinc-500 max-h-[120px]"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!input.trim() || busy || !hasModel}
                  className={`h-7 w-7 grid place-items-center rounded-md transition ${
                    !input.trim() || busy || !hasModel
                      ? 'bg-white/[0.04] text-zinc-500 cursor-not-allowed'
                      : 'bg-gold text-[#111827] hover:bg-gold-soft'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70`}
                  title="Send"
                ><Icon.ArrowRight size={13} /></button>
              </div>
              <div className="mt-1.5 px-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                {hasModel ? 'Enter to send · Shift+Enter for newline · grounded in dashboard data' : 'Host API unavailable · sending disabled'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
