import React, { useState } from 'react';

interface DeleteAccountModalProps {
  onConfirmDelete: () => Promise<void>;
  onClose: () => void;
  triggerToast: (msg: string, type: 'success' | 'error') => void;
}

export function DeleteAccountModal({ onConfirmDelete, onClose, triggerToast }: DeleteAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmationText !== 'DELETE') {
      triggerToast("Please input 'DELETE' exactly to verify authorization.", 'error');
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirmDelete();
      triggerToast('Your EF26 Tactics profile has been completely erased.', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred during profile deletion.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navyBg/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-surface border border-danger/40 rounded-2xl p-6 relative overflow-hidden shadow-[0_8px_32px_rgba(239,68,68,0.15)]">
        {/* Top visual alert bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-danger"></div>

        {/* Header warnings */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-danger/10 p-2 rounded-xl text-danger">⚠️</span>
            <div>
              <h3 className="text-lg font-bold font-orbitron text-white tracking-wide uppercase">CRITICAL ACTION</h3>
              <p className="text-xs text-danger font-bold uppercase tracking-wider">Erasing tactics database</p>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pt-2">
            This action is permanent and completely irreversible. All of your saved custom formations, matches, statistics logs, and Pro status configurations will be wiped from our servers immediately.
          </p>
        </div>

        {/* Input verification */}
        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            To proceed, type “DELETE” in the field below
          </label>
          <input
            type="text"
            placeholder="DELETE"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full h-11 px-4 bg-surface2 border border-danger/30 focus:border-danger focus:ring-1 focus:ring-danger text-white rounded-xl text-sm placeholder-gray-500 font-bold transition-all outline-none uppercase"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-11 bg-surface2 hover:bg-gray-800 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl border border-border transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmationText !== 'DELETE'}
            className="h-11 bg-danger hover:bg-danger/90 disabled:bg-danger/40 disabled:text-gray-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:pointer-events-none cursor-pointer"
          >
            {isDeleting ? 'Erasing data...' : 'Permanently Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
