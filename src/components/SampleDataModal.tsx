import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  FileCode, 
  Check, 
  Table, 
  Database,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_DATASETS, SampleFile } from '../data/sampleDatasets.ts';
import type { AttachedFile } from '../types.ts';

interface SampleDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (file: AttachedFile) => void;
}

export const SampleDataModal: React.FC<SampleDataModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!isOpen) return null;

  const currentFile = SAMPLE_DATASETS[selectedIdx];

  const handleAttach = () => {
    onSelectSample({
      name: currentFile.name,
      size: currentFile.size,
      type: currentFile.type,
      rawContent: currentFile.content,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#0d1220] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Inspect Built-in Production Datasets
              </h3>
              <p className="text-xs text-slate-400">
                Choose a verified dataset to test autonomous file parsing, anomaly detection & dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* File selector column */}
          <div className="p-3 space-y-2 bg-slate-950/40 overflow-y-auto">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-2 px-1">
              Select Dataset
            </span>
            {SAMPLE_DATASETS.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedIdx === idx
                    ? 'bg-slate-800 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold ${selectedIdx === idx ? 'text-white' : 'text-slate-300'}`}>
                    {file.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-cyan-400">
                    {file.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {file.description}
                </p>
                <span className="text-[10px] font-mono text-slate-500 block mt-2">
                  Size: {file.size}
                </span>
              </button>
            ))}
          </div>

          {/* File raw preview column */}
          <div className="md:col-span-2 p-4 flex flex-col overflow-hidden bg-[#090d16]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                <Table className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentFile.name}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {currentFile.type === 'csv' ? 'CSV Delimited Records' : 'JSON Object Hierarchy'}
              </span>
            </div>

            <div className="flex-1 overflow-auto rounded-lg border border-slate-800/90 bg-slate-950 p-3 font-mono text-xs text-slate-300">
              <pre className="whitespace-pre overflow-x-auto leading-relaxed text-[11px]">
                {currentFile.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Ready to attach to active agent prompt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAttach}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-950"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Attach {currentFile.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
