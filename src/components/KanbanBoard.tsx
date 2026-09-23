import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Tag, 
  ArrowRight, 
  Plus, 
  MoveRight,
  Kanban
} from 'lucide-react';
import type { KanbanArtifact, KanbanTaskItem } from '../types.ts';

interface KanbanBoardProps {
  kanban: KanbanArtifact;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ kanban }) => {
  const [tasks, setTasks] = useState<KanbanTaskItem[]>(kanban.tasks);

  const columns: { id: KanbanTaskItem['status']; title: string; countColor: string }[] = [
    { id: 'todo', title: 'To Do / Backlog', countColor: 'text-slate-400' },
    { id: 'in_progress', title: 'In Progress', countColor: 'text-cyan-400' },
    { id: 'review', title: 'In Review', countColor: 'text-amber-400' },
    { id: 'done', title: 'Completed', countColor: 'text-emerald-400' },
  ];

  const moveTask = (taskId: string, direction: 'next' | 'prev') => {
    const order: KanbanTaskItem['status'][] = ['todo', 'in_progress', 'review', 'done'];
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const currentIdx = order.indexOf(t.status);
      const nextIdx = direction === 'next' 
        ? Math.min(order.length - 1, currentIdx + 1)
        : Math.max(0, currentIdx - 1);
      return { ...t, status: order[nextIdx] };
    }));
  };

  const getPriorityBadge = (priority: KanbanTaskItem['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">URGENT</span>;
      case 'high':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">MEDIUM</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800">LOW</span>;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Kanban className="w-4 h-4 text-cyan-400" />
            <span>{kanban.boardTitle}</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Exported by Action Dispatcher Tool on {kanban.exportedAt}
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {tasks.length} Action Items
        </span>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 flex flex-col min-h-[320px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-200">
                  {col.title}
                </span>
                <span className={`px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 font-mono text-[11px] font-bold ${col.countColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-[11px] text-slate-600 border border-dashed border-slate-800/60 rounded-lg">
                    No tasks in this lane
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border border-slate-800 bg-[#0e1320] hover:border-slate-700 transition-all shadow-sm space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-semibold text-slate-200 leading-snug">
                          {task.title}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getPriorityBadge(task.priority)}
                          <span className="text-slate-400 font-mono">
                            {task.tag}
                          </span>
                        </div>
                      </div>

                      {task.assignee && (
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 truncate max-w-[140px]">
                            <User className="w-3 h-3 text-slate-500" />
                            <span>{task.assignee}</span>
                          </span>

                          {/* Quick advance button */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => moveTask(task.id, 'prev')}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                title="Move back"
                              >
                                ←
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => moveTask(task.id, 'next')}
                                className="p-1 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300"
                                title="Advance lane"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
