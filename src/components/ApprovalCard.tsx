import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Mail, 
  Send, 
  Edit3, 
  AlertTriangle, 
  Server, 
  Trash2,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ApprovalRequest } from '../types.ts';

interface ApprovalCardProps {
  request: ApprovalRequest;
  onApprove: (updatedPayload?: any) => void;
  onReject: (reason: string) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipient, setEditedRecipient] = useState(request.payload.recipient || '');
  const [editedSubject, setEditedSubject] = useState(request.payload.subject || '');
  const [editedBody, setEditedBody] = useState(request.payload.body || '');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = () => {
    if (isEditing) {
      onApprove({
        ...request.payload,
        recipient: editedRecipient,
        subject: editedSubject,
        body: editedBody,
      });
    } else {
      onApprove();
    }
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    onReject(rejectReason || 'User manually rejected safety step authorization.');
  };

  const getActionIcon = () => {
    switch (request.actionType) {
      case 'send_email':
        return <Mail className="w-5 h-5 text-amber-400" />;
      case 'delete_data':
        return <Trash2 className="w-5 h-5 text-rose-400" />;
      case 'api_dispatch':
        return <Server className="w-5 h-5 text-cyan-400" />;
      default:
        return <Send className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="m-4 rounded-xl border-2 border-amber-500/80 bg-[#121624] shadow-2xl shadow-amber-950/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Safety Gate Warning Header */}
      <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-slate-900 px-4 py-3 border-b border-amber-600/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 tracking-wide uppercase font-mono">
                Human-in-the-Loop Safety Gate Triggered
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                HOLDING
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              {request.title}
            </h3>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-amber-300/80">
          <Lock className="w-3.5 h-3.5" />
          <span>Execution Paused</span>
        </div>
      </div>

      {/* Card Content & Payload Review */}
      <div className="p-4 space-y-3.5">
        <p className="text-xs text-slate-300 leading-relaxed">
          {request.description}
        </p>

        {/* Action Type details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Action Type</span>
            <span className="font-mono text-slate-200 uppercase font-medium">{request.actionType.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Risk Level</span>
            <span className="font-mono text-amber-400 uppercase font-semibold">HIGH (External Dispatch)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Target System</span>
            <span className="font-mono text-cyan-300 truncate block">{request.target}</span>
          </div>
        </div>

        {/* Payload inspector / Editor */}
        <div className="rounded-lg border border-slate-800 bg-[#0a0d16] p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              {getActionIcon()}
              <span>Proposed Dispatch Payload Preview</span>
            </span>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Modify Parameters'}</span>
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Recipients (To / Cc):</label>
                <input
                  type="text"
                  value={editedRecipient}
                  onChange={(e) => setEditedRecipient(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Subject Line:</label>
                <input
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Email Body / Instructions:</label>
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {request.payload.recipient && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 font-mono text-[11px] w-16 shrink-0">To:</span>
                  <span className="font-mono text-cyan-300 font-medium">{editedRecipient || request.payload.recipient}</span>
                </div>
              )}

              {request.payload.subject && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 font-mono text-[11px] w-16 shrink-0">Subject:</span>
                  <span className="font-semibold text-slate-200">{editedSubject || request.payload.subject}</span>
                </div>
              )}

              {request.payload.body && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 font-mono text-[11px] block mb-1">Body Preview:</span>
                  <div className="max-h-48 overflow-y-auto p-2.5 rounded bg-slate-950/90 border border-slate-900 text-slate-300 text-xs whitespace-pre-wrap leading-relaxed">
                    {editedBody || request.payload.body}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reject reason input prompt if requested */}
        {showRejectInput && (
          <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/60 space-y-1.5 animate-in fade-in duration-150">
            <span className="text-xs font-semibold text-rose-300">
              Provide Rejection Reason to Agent:
            </span>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Hold dispatch until Q3 numbers are validated with CFO"
              className="w-full bg-slate-900 border border-rose-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
        )}

        {/* Decision CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Agent execution will not resume without user decision.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleReject}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/70 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>{showRejectInput ? 'Confirm Reject' : 'Reject Action'}</span>
            </button>

            <button
              onClick={handleApprove}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950 rounded-lg transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Continue Execution</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
