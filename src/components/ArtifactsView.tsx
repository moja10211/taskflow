import React, { useState } from 'react';
import { 
  Mail, 
  BarChart3, 
  Kanban, 
  FileText, 
  Globe, 
  Copy, 
  Check, 
  Send, 
  Download,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import type { AgentArtifacts } from '../types.ts';
import { DataVisualizer } from './DataVisualizer.tsx';
import { KanbanBoard } from './KanbanBoard.tsx';

interface ArtifactsViewProps {
  artifacts: AgentArtifacts;
  isApprovalPending?: boolean;
}

export const ArtifactsView: React.FC<ArtifactsViewProps> = ({
  artifacts,
  isApprovalPending,
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'data' | 'kanban' | 'research' | 'report'>(() => {
    if (artifacts.email) return 'email';
    if (artifacts.dataAnalysis) return 'data';
    if (artifacts.kanban) return 'kanban';
    return 'report';
  });

  const [copied, setCopied] = useState(false);
  const [emailDispatched, setEmailDispatched] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] overflow-hidden select-text">
      {/* Top Tab Bar */}
      <div className="p-3 border-b border-slate-800/80 bg-[#0d1220] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          {artifacts.email && (
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'email'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Draft</span>
            </button>
          )}

          {artifacts.dataAnalysis && (
            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'data'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Data Analysis & Trends</span>
            </button>
          )}

          {artifacts.kanban && (
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'kanban'
                  ? 'bg-slate-800 text-purple-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Tasks ({artifacts.kanban.tasks.length})</span>
            </button>
          )}

          {artifacts.webResearch && (
            <button
              onClick={() => setActiveTab('research')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'research'
                  ? 'bg-slate-800 text-blue-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Intelligence</span>
            </button>
          )}

          {artifacts.summaryReport && (
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'report'
                  ? 'bg-slate-800 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Memo</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'email' && artifacts.email && (
            <button
              onClick={() => copyToClipboard(artifacts.email!.body)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Email'}</span>
            </button>
          )}

          {activeTab === 'report' && artifacts.summaryReport && (
            <button
              onClick={() => downloadText('mojaflow-executive-summary.md', artifacts.summaryReport!)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Memo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Tab: Email Draft View */}
        {activeTab === 'email' && artifacts.email && (
          <div className="max-w-3xl mx-auto space-y-4">
            {isApprovalPending && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/50 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Draft created. Awaiting Human-in-the-Loop approval before dispatch.</span>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-[#0f1422] shadow-xl overflow-hidden">
              {/* Email Envelope Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/70 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 w-16">To:</span>
                    <span className="text-cyan-300 font-semibold">{artifacts.email.recipient}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {artifacts.email.urgency.replace('_', ' ')}
                  </span>
                </div>

                {artifacts.email.cc && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 w-16">Cc:</span>
                    <span className="text-slate-400">{artifacts.email.cc}</span>
                  </div>
                )}

                <div className="flex items-start gap-2 pt-1 border-t border-slate-800/80 font-sans">
                  <span className="text-slate-500 font-mono text-xs w-16 shrink-0 mt-0.5">Subject:</span>
                  <span className="text-slate-100 font-semibold text-sm">
                    {artifacts.email.subject}
                  </span>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {artifacts.email.body}
              </div>

              {/* Email Footer Bar */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
                <span>Generated at {artifacts.email.generatedAt} by MojaFlow Action Dispatcher</span>

                {emailDispatched ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                    <Check className="w-4 h-4" />
                    <span>Dispatched to SMTP Relay</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setEmailDispatched(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simulate SMTP Send</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Data Analysis View */}
        {activeTab === 'data' && artifacts.dataAnalysis && (
          <div className="max-w-4xl mx-auto">
            <DataVisualizer data={artifacts.dataAnalysis} />
          </div>
        )}

        {/* Tab: Kanban Tasks View */}
        {activeTab === 'kanban' && artifacts.kanban && (
          <div className="max-w-5xl mx-auto">
            <KanbanBoard kanban={artifacts.kanban} />
          </div>
        )}

        {/* Tab: Web Intelligence View */}
        {activeTab === 'research' && artifacts.webResearch && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-cyan-300 uppercase font-mono tracking-wider block">
                Research Synthesis Summary
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {artifacts.webResearch.synthesis}
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase font-mono block">
                Corroborated Sources ({artifacts.webResearch.findings.length})
              </span>

              {artifacts.webResearch.findings.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-800 bg-[#0f1422] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                      {Math.round(item.confidenceScore * 100)}% match
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.snippet}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate">{item.sourceUrl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Executive Memo Report */}
        {activeTab === 'report' && artifacts.summaryReport && (
          <div className="max-w-3xl mx-auto">
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0f1422] space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Autonomous Executive Resolution Report
                  </h3>
                  <span className="text-xs text-slate-400">
                    Compiled via multi-tool agentic ReAct cycle
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FINAL ANSWER
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap space-y-2">
                {artifacts.summaryReport}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
