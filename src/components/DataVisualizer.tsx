import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Table, 
  BarChart, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { DataAnalysisArtifact } from '../types.ts';

interface DataVisualizerProps {
  data: DataAnalysisArtifact;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'table' | 'anomalies'>('chart');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const maxValue = Math.max(...data.chartData.map(d => Math.max(d.value, d.target || 0)), 100000);

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {data.metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-sm"
          >
            <span className="text-[11px] text-slate-400 font-medium block mb-1 truncate">
              {metric.label}
            </span>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg font-bold text-white font-mono tabular-nums tracking-tight">
                {metric.value}
              </span>
              {metric.trend && (
                <span className={`inline-flex items-center text-xs font-mono font-semibold ${
                  metric.trend === 'up' 
                    ? 'text-emerald-400' 
                    : metric.trend === 'down' 
                    ? 'text-rose-400' 
                    : 'text-slate-400'
                }`}>
                  {metric.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                </span>
              )}
            </div>
            {metric.change && (
              <span className={`text-[11px] font-mono mt-0.5 block truncate ${
                metric.flag === 'critical' 
                  ? 'text-rose-400 font-semibold' 
                  : metric.flag === 'warning' 
                  ? 'text-amber-400 font-medium' 
                  : 'text-slate-500'
              }`}>
                {metric.change}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between p-1 bg-slate-900 rounded-lg border border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'chart'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart className="w-3.5 h-3.5" />
            <span>Regional Target Variance Chart</span>
          </button>
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'anomalies'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Anomaly Clusters ({data.anomalies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'table'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Raw Records Grid</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 pr-2">
          Dataset: {data.datasetName}
        </span>
      </div>

      {/* Tab 1: Chart View */}
      {activeTab === 'chart' && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-200 block">
                Realized Revenue vs Period Quota by Region
              </span>
              <span className="text-[11px] text-slate-400">
                Visualizing underperforming cohorts identified by the agent
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500" />
                <span>Actual Revenue</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-slate-700 border border-slate-600" />
                <span>Target Quota</span>
              </span>
            </div>
          </div>

          {/* SVG/CSS Chart Bar Graph */}
          <div className="space-y-3 pt-2">
            {data.chartData.map((item, idx) => {
              const actualWidth = Math.min(100, Math.round((item.value / maxValue) * 100));
              const targetWidth = item.target ? Math.min(100, Math.round((item.target / maxValue) * 100)) : 0;
              const delta = item.target ? Math.round(((item.value - item.target) / item.target) * 100) : 0;
              const isShortfall = delta < 0;

              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-medium text-slate-300 group-hover:text-cyan-300 transition-colors">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold tabular-nums">
                        ${item.value.toLocaleString()}
                      </span>
                      {item.target && (
                        <span className={`text-[11px] font-bold ${isShortfall ? 'text-rose-400' : 'text-emerald-400'}`}>
                          ({delta > 0 ? `+${delta}%` : `${delta}%`})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual Bar Track */}
                  <div className="relative h-6 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 p-0.5 flex flex-col justify-center">
                    {/* Target outline marker */}
                    {targetWidth > 0 && (
                      <div
                        className="absolute top-0 bottom-0 border-r-2 border-dashed border-amber-400/70 z-10"
                        style={{ left: `${targetWidth}%` }}
                        title={`Target Quota: $${item.target?.toLocaleString()}`}
                      />
                    )}
                    {/* Actual Bar Fill */}
                    <div
                      className={`h-full rounded transition-all duration-500 flex items-center px-2 text-[10px] font-mono font-semibold text-slate-950 ${
                        isShortfall && Math.abs(delta) >= 20
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-sm shadow-rose-950'
                          : 'bg-gradient-to-r from-cyan-500 to-teal-400'
                      }`}
                      style={{ width: `${Math.max(6, actualWidth)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Insights Bullet List */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <span className="text-xs font-semibold text-cyan-300 block uppercase font-mono tracking-wider">
              Autonomous Synthesis & Insights
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {data.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">›</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Anomalies List */}
      {activeTab === 'anomalies' && (
        <div className="space-y-2">
          {data.anomalies.map((anom, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                anom.severity === 'critical'
                  ? 'bg-rose-950/20 border-rose-800/60'
                  : 'bg-amber-950/20 border-amber-800/60'
              }`}
            >
              <div className="mt-0.5">
                {anom.severity === 'critical' ? (
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-200">
                    {anom.item}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                    anom.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {anom.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {anom.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Table Records */}
      {activeTab === 'table' && data.tableData && (
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider sticky top-0">
                <tr>
                  {data.tableData.columns.map((col, idx) => (
                    <th key={idx} className="px-3.5 py-2.5 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.tableData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-900/50 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3.5 py-2 font-mono tabular-nums text-slate-300">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
