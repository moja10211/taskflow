import React, { useState, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  FileSpreadsheet, 
  X, 
  Sparkles, 
  Loader2, 
  CornerDownLeft,
  Database
} from 'lucide-react';
import type { AttachedFile } from '../types.ts';
import { SAMPLE_DATASETS } from '../data/sampleDatasets.ts';

interface CommandInputProps {
  onRunTask: (prompt: string, attachedFile?: AttachedFile) => void;
  isRunning: boolean;
  onOpenSampleModal: () => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  onRunTask,
  isRunning,
  onOpenSampleModal,
}) => {
  const [prompt, setPrompt] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | undefined>(() => {
    // Default to sample sales csv so the user can test the exact prompt instantly!
    const sample = SAMPLE_DATASETS[0];
    return {
      name: sample.name,
      size: sample.size,
      type: sample.type,
      rawContent: sample.content,
      parsedSummary: {
        rowCount: 10,
        columns: ['Date', 'Region', 'Product', 'Units_Sold', 'Revenue', 'Target', 'Customer_Rating', 'Notes'],
        sampleRows: [],
      }
    };
  });

  const [isRecording, setIsRecording] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    {
      title: "Sales CSV & Email Draft",
      prompt: "Analyze last week's sales CSV, summarize negative trends, and prepare an email draft for executive leadership.",
      file: SAMPLE_DATASETS[0],
    },
    {
      title: "Incident Logs & Postmortem",
      prompt: "Inspect server incident logs, isolate bottleneck services, and draft emergency dispatch action items.",
      file: SAMPLE_DATASETS[1],
    },
    {
      title: "Customer NPS & Kanban Board",
      prompt: "Analyze customer feedback survey, pinpoint churn risks, and export remediation tasks to a Kanban board.",
      file: SAMPLE_DATASETS[2],
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();
      let type: AttachedFile['type'] = 'other';
      if (extension === 'csv') type = 'csv';
      else if (extension === 'json') type = 'json';
      else if (extension === 'txt') type = 'txt';

      setAttachedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type,
        rawContent: content,
      });
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const toggleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    // Check for webkitSpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };
        recognition.onerror = () => {
          setIsRecording(false);
        };
        recognition.onend = () => {
          setIsRecording(false);
        };
        recognition.start();
        return;
      } catch (e) {
        console.warn('Speech recognition start failed, using simulation mode', e);
      }
    }

    // Audio recording simulation mode
    setIsRecording(true);
    let interval: any;
    let ticks = 0;
    const demoVoiceText = "Analyze last week's sales CSV, summarize negative trends, and prepare an email draft";

    interval = setInterval(() => {
      ticks++;
      setVoiceVolume(Math.random() * 80 + 20);
      if (ticks >= 12) {
        clearInterval(interval);
        setIsRecording(false);
        setVoiceVolume(0);
        setPrompt(demoVoiceText);
      }
    }, 150);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    onRunTask(prompt, attachedFile);
  };

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setPrompt(preset.prompt);
    setAttachedFile({
      name: preset.file.name,
      size: preset.file.size,
      type: preset.file.type,
      rawContent: preset.file.content,
    });
  };

  return (
    <div className="p-4 border-b border-slate-800/80 bg-[#0d121f]">
      {/* Preset recommendations */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Workflow Presets</span>
          </div>
          <button
            onClick={onOpenSampleModal}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <Database className="w-3 h-3" />
            <span>Switch Sample Dataset</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              disabled={isRunning}
              className="text-left py-1.5 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              <span className="font-medium text-slate-200">{preset.title}</span>
              <span className="text-[11px] text-slate-500 block truncate max-w-[260px]">
                {preset.file.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Attached file chip if present */}
      {attachedFile && (
        <div className="mb-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs">
          <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium text-slate-200">{attachedFile.name}</span>
          <span className="text-slate-500 font-mono text-[11px]">({attachedFile.size})</span>
          <button
            onClick={() => setAttachedFile(undefined)}
            disabled={isRunning}
            className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-0.5 rounded hover:bg-slate-800"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Command Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="rounded-xl border border-slate-800 bg-[#090d16] focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all shadow-inner">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Instruct the autonomous agent (e.g., 'Analyze last week's sales CSV, summarize negative trends, and prepare an email draft')..."
            rows={3}
            disabled={isRunning}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
          />

          {/* Voice recording waveform pulse banner if active */}
          {isRecording && (
            <div className="mx-3 mb-2 px-3 py-1.5 rounded-md bg-rose-950/40 border border-rose-800/60 flex items-center justify-between text-xs text-rose-300 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Listening for autonomous command...</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6].map((bar) => (
                  <span
                    key={bar}
                    className="w-1 bg-rose-400 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(4, Math.random() * 16 + 4)}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/80 bg-slate-950/40 rounded-b-xl">
            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors"
                title="Attach CSV, JSON, or TXT"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Attach Data</span>
              </button>

              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  isRecording 
                    ? 'text-rose-400 bg-rose-950/40 border border-rose-800' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
                title={isRecording ? 'Stop Voice Input' : 'Dictate with Voice'}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isRecording ? 'Listening' : 'Voice Input'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-[11px] text-slate-500 font-mono">
                Press Enter to run
              </span>
              <button
                type="submit"
                disabled={!prompt.trim() || isRunning}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-md ${
                  !prompt.trim() || isRunning
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 active:scale-95 shadow-cyan-900/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing ReAct Loop...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Agent</span>
                    <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
