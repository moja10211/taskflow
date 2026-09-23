import React from 'react';
import { ShieldCheck, Plus, Activity } from 'lucide-react';
import type { TaskStatus } from '../types.ts';
import { MojaFlowLogo } from './MojaFlowLogo.tsx';

interface HeaderProps {
  currentStatus: TaskStatus;
  activeToolsCount: number;
  totalToolsCount: number;
  onNewTask: () => void;
  taskTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentStatus,
  activeToolsCount,
  totalToolsCount,
  onNewTask,
  taskTitle,
}) => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#0d121f] px-5 flex items-center justify-between z-20 shrink-0">
      {/* Zone 1: Brand mark */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <MojaFlowLogo className="w-8 h-8" />
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              MojaFlow AI
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800 text-xs text-slate-400">
          <span className="text-slate-500">Workspace</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium truncate max-w-[220px]">
            {taskTitle || 'Autonomous ReAct Session'}
          </span>
        </div>
      </div>

      {/* Zone 2: Engine status indicator */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
          <span className={`w-2 h-2 rounded-full ${
            currentStatus === 'running' 
              ? 'bg-cyan-400 animate-pulse' 
              : currentStatus === 'waiting_approval'
              ? 'bg-amber-400 animate-ping'
              : currentStatus === 'completed'
              ? 'bg-emerald-400'
              : 'bg-slate-500'
          }`} />
          <span className="uppercase text-[11px] font-semibold text-slate-300">
            {currentStatus === 'idle' && 'Engine Idle'}
            {currentStatus === 'planning' && 'Planning DAG'}
            {currentStatus === 'running' && 'ReAct Loop Active'}
            {currentStatus === 'waiting_approval' && 'Safety Gate Hold'}
            {currentStatus === 'completed' && 'Cycle Complete'}
            {currentStatus === 'rejected' && 'Action Aborted'}
            {currentStatus === 'failed' && 'Error Stalled'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safety Gate: Enforced</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tools: {activeToolsCount}/{totalToolsCount}</span>
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewTask}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>

        {/* User profile avatar fallback (Section 3.E Zero-Broken-Image Policy) */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600/80 flex items-center justify-center text-xs font-bold text-slate-200">
            MG
          </div>
          <span className="hidden sm:inline text-xs font-medium text-slate-300">
            Lead Ops
          </span>
        </div>
      </div>
    </header>
  );
};
