import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  BarChart2, 
  Globe, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Shield, 
  FileSpreadsheet,
  ChevronRight,
  History,
  Wrench,
  Info
} from 'lucide-react';
import type { TaskSession, ToolDefinition } from '../types.ts';

interface SidebarProps {
  sessions: TaskSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  tools: ToolDefinition[];
  onToggleTool: (toolId: ToolDefinition['id']) => void;
  onOpenSampleModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  tools,
  onToggleTool,
  onOpenSampleModal,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'tools'>('history');

  const uniqueSessions = useMemo(() => {
    const seen = new Set<string>();
    return sessions.filter((sess) => {
      if (!sess || !sess.id || seen.has(sess.id)) return false;
      seen.add(sess.id);
      return true;
    });
  }, [sessions]);

  const getToolIcon = (id: string) => {
    switch (id) {
      case 'file_reader':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'data_analyzer':
        return <BarChart2 className="w-4 h-4 text-cyan-400" />;
      case 'web_researcher':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'action_dispatcher':
        return <Send className="w-4 h-4 text-amber-400" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: TaskSession['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Success</span>
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Approval</span>
          </span>
        );
      case 'running':
      case 'planning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Active</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[11px] font-mono text-rose-400">
            Rejected
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-400">
            Idle
          </span>
        );
    }
  };

  return (
    <aside className="w-72 border-r border-slate-800/80 bg-[#0c101b] flex flex-col h-[calc(100vh-3.5rem)] shrink-0 select-none">
      {/* Tab Switcher */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="flex items-center p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Task History</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
              activeTab === 'tools'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Agent Tools</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTab === 'history' ? (
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Recent ReAct Sessions ({uniqueSessions.length})
              </span>
            </div>

            {uniqueSessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                No past tasks yet. Enter a prompt to begin an autonomous loop.
              </div>
            ) : (
              <div className="space-y-1.5">
                {uniqueSessions.map((sess) => {
                  const isSelected = sess.id === currentSessionId;
                  return (
                    <button
                      key={sess.id}
                      onClick={() => onSelectSession(sess.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-slate-800/80 border-slate-600 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className={`text-xs font-medium line-clamp-1 ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}>
                          {sess.title || sess.prompt}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="font-mono tabular-nums">{sess.createdAt}</span>
                        </div>
                        {getStatusBadge(sess.status)}
                      </div>

                      {sess.attachedFile && (
                        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-cyan-400/90 font-mono">
                          <FileSpreadsheet className="w-3 h-3" />
                          <span className="truncate max-w-[170px]">{sess.attachedFile.name}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="px-1">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Available Tools & Capabilities
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toggle tools enabled for the agent during reasoning.
              </p>
            </div>

            <div className="space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    tool.enabled
                      ? 'bg-slate-900/70 border-slate-800'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-slate-800/90 border border-slate-700/60">
                        {getToolIcon(tool.id)}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">
                          {tool.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    {/* Toggle switch */}
                    <button
                      onClick={() => onToggleTool(tool.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        tool.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={tool.enabled}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          tool.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                    {tool.requiresSafetyGate ? (
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        <Shield className="w-3 h-3" />
                        <span>Safety Gate Active</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Autonomous Execution</span>
                    )}
                    <span className="font-mono text-slate-400">
                      {tool.capabilities.length} capabilities
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer with Sample Datasets button & Safety Gate indicator */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
        <button
          onClick={onOpenSampleModal}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inspect Sample Datasets</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-[11px] text-slate-400 leading-snug">
            <span className="text-emerald-300 font-medium block">Human-in-the-Loop Safe</span>
            Destructive or external write actions will always trigger an interactive Approval Card.
          </div>
        </div>
      </div>
    </aside>
  );
};
