import React from 'react';

function SaveBanner({ hasUnsavedChanges, isSaving, onSave, onDiscard, darkMode }) {
  if (!hasUnsavedChanges) return null;

  return (
    <div className={`fixed left-1/2 top-4 z-50 w-[calc(100%-1rem)] max-w-6xl -translate-x-1/2 rounded-3xl border px-4 py-4 shadow-2xl backdrop-blur-xl animate-slide-down ${
      darkMode 
        ? 'border-amber-400/20 bg-slate-950/90' 
        : 'border-amber-200 bg-white/90'
    }`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${
            darkMode ? 'bg-amber-400/10 text-amber-300' : 'bg-amber-100 text-amber-700'
          }`}>
            •
          </div>
          <div>
            <p className={`font-display text-sm font-bold uppercase tracking-[0.22em] ${
              darkMode ? 'text-amber-200' : 'text-amber-700'
            }`}>
              Unsaved edits
            </p>
            <p className={`mt-1 text-sm ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Save now or discard the current working state before switching context.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              darkMode 
                ? 'bg-white/5 text-slate-100 hover:bg-white/10' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            } ${isSaving ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5'}`}
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isSaving 
                ? 'cursor-not-allowed bg-slate-400 text-white' 
                : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 hover:bg-emerald-600'
            }`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveBanner;
