import React, { useState } from 'react';
import { 
  Brain, 
  Play, 
  Eye, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Wrench, 
  Copy, 
  Check, 
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';
import type { AgentStep, PlanSubTask } from '../types.ts';

interface ExecutionTimelineProps {
  plan: PlanSubTask[];
  steps: AgentStep[];
  isRunning: boolean;
  currentStepIndex: number;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({
  plan,
  steps,
  isRunning,
  currentStepIndex,
}) => {
  const [expandedStepIds, setExpandedStepIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    setExpandedStepIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyStepContent = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getPhaseBadge = (phase: AgentStep['phase']) => {
    switch (phase) {
      case 'thought':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-950/60 text-purple-300 border border-purple-800/60">
            <Brain className="w-3 h-3 text-purple-400" />
            <span>THOUGHT</span>
          </span>
        );
      case 'action':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
            <Play className="w-3 h-3 text-cyan-400" />
            <span>ACTION</span>
          </span>
        );
      case 'observation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>OBSERVATION</span>
          </span>
        );
      case 'approval':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>SAFETY GATE</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300">
            <Terminal className="w-3 h-3" />
            <span>FINAL</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] overflow-hidden select-text">
      {/* Visual Subtask Plan Bar */}
      {plan.length > 0 && (
        <div className="p-3 border-b border-slate-800/80 bg-[#0d1322]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Decomposed Agent Plan ({plan.length} Steps)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {steps.length} ReAct Trace Events
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {plan.map((item, idx) => {
              const isCompleted = steps.some(s => s.tool === item.toolTarget && s.phase === 'observation');
              const isActive = !isCompleted && isRunning && steps.some(s => s.tool === item.toolTarget);

              return (
                <div
                  key={item.id || `plan-${idx}`}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-800/50'
                      : isActive
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-sm shadow-cyan-950'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-slate-400 font-semibold">
                      0{idx + 1}. {item.toolTarget.replace('_', ' ').toUpperCase()}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-200 block truncate">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Vertical ReAct Timeline Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
        {steps.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
            <Brain className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400">Autonomous ReAct Timeline</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Input a task or attach a dataset to visualize real-time Plan → Thought → Action → Observation iterations.
            </p>
          </div>
        ) : (
          <div className="relative border-l border-slate-800 ml-3 pl-5 space-y-4">
            {steps.map((step, idx) => {
              const isExpanded = expandedStepIds[step.id] ?? (step.phase === 'action' || step.isApprovalRequired);

              return (
                <div key={step.id || `step-${idx}`} className="relative group">
                  {/* Timeline bullet node */}
                  <div className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    step.phase === 'thought'
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : step.phase === 'action'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : step.phase === 'observation'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-amber-950 border-amber-500 text-amber-300'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </div>

                  {/* Step Card Container */}
                  <div className={`rounded-xl border transition-all ${
                    step.isApprovalRequired
                      ? 'bg-amber-950/15 border-amber-600/70 shadow-lg shadow-amber-950/20'
                      : 'bg-[#0f1422] border-slate-800/90 hover:border-slate-700'
                  }`}>
                    {/* Header */}
                    <div 
                      onClick={() => toggleStep(step.id)}
                      className="p-3 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {getPhaseBadge(step.phase)}
                        <h4 className="text-xs font-semibold text-slate-200">
                          {step.title}
                        </h4>
                        {step.tool && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
                            <Wrench className="w-3 h-3" />
                            {step.tool}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                        {step.durationMs && (
                          <span className="font-mono tabular-nums text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {step.durationMs}ms
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyStepContent(step.id, step.content);
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                          title="Copy step content"
                        >
                          {copiedId === step.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="px-3 pb-3">
                      <p className={`text-xs leading-relaxed ${
                        step.phase === 'thought' 
                          ? 'text-purple-200/90 italic' 
                          : step.phase === 'observation'
                          ? 'text-emerald-200/90'
                          : 'text-slate-300'
                      }`}>
                        {step.content}
                      </p>

                      {/* Expandable tool arguments / output */}
                      {isExpanded && (step.toolInput || step.toolOutput) && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/80">
                          {step.toolInput && (
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase tracking-wider">
                                Tool Invocation Parameters (Payload)
                              </span>
                              <pre className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-tight">
                                {JSON.stringify(step.toolInput, null, 2)}
                              </pre>
                            </div>
                          )}

                          {step.toolOutput && (
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase tracking-wider">
                                Observation Output (Resolved by Tool)
                              </span>
                              <pre className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-tight">
                                {typeof step.toolOutput === 'string'
                                  ? step.toolOutput
                                  : JSON.stringify(step.toolOutput, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isRunning && (
              <div className="flex items-center gap-2 pl-2 text-xs font-mono text-cyan-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>ReAct reasoning engine executing next iteration...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
