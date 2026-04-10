import React, { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SaveBanner from "./components/SaveBanner";
import ItemsSection from "./components/ItemsSection";
import PeopleSection from "./components/PeopleSection";
import BudgetSummary from "./components/BudgetSummary";
import { usePartyData, LoadingSpinner, ErrorMessage } from './hooks/useFirebaseData.jsx';
import { useLocalChanges } from './hooks/useLocalChanges';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const {
    items,
    people,
    parties,
    selectedPartyId,
    loading,
    error,
    savePartyData,
    selectParty,
    createParty,
    renameParty,
    deleteParty,
    refresh,
  } = usePartyData();

  const {
    localItems,
    localPeople,
    hasUnsavedChanges,
    isSaving,
    handleChange,
    handleAddItem,
    handleRemoveItem,
    handleReorderItems,
    handlePersonChange,
    handleAddPerson,
    handleRemovePerson,
    handleReorderPeople,
    handleSaveChanges,
    handleDiscardChanges,
  } = useLocalChanges(items, people, {
    savePartyData,
  });

  // UI state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [createPartyPrompt, setCreatePartyPrompt] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const selectedParty = parties.find((party) => party._id === selectedPartyId) ?? null;
  const selectedPartyName = selectedParty?.name ?? 'My Party';
  const shellClass = darkMode
    ? 'bg-[#040816] text-slate-100'
    : 'bg-[#f7f2ec] text-slate-900';

  // Budget calculations (using local state)
  const totalPeople = localPeople.length;
  const alcoholicPeople = localPeople.filter(person => person.isAlcoholic).length;
  const nonAlcoholicPeople = localPeople.filter(person => !person.isAlcoholic).length;
  
  const totalAlcoholicCost = localItems
    .filter(item => item.isAlcoholic)
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    
  const totalNonAlcoholicCost = localItems
    .filter(item => !item.isAlcoholic)
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    
  const totalCost = totalAlcoholicCost + totalNonAlcoholicCost;
  
  const nonAlcoholicCostPerPerson = totalPeople > 0 ? (totalNonAlcoholicCost / totalPeople) : 0;
  const alcoholicCostPerPerson = totalPeople > 0 && alcoholicPeople > 0 
    ? (totalNonAlcoholicCost / totalPeople) + (totalAlcoholicCost / alcoholicPeople)
    : nonAlcoholicCostPerPerson;

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const promptCreateParty = (defaultName) => {
    return new Promise((resolve) => {
      setCreatePartyPrompt({ defaultName, resolve });
    });
  };

  const closeCreatePartyPrompt = (result) => {
    if (!createPartyPrompt) {
      return;
    }

    createPartyPrompt.resolve(result);
    setCreatePartyPrompt(null);
  };

  const confirmDeleteParty = (partyName) => {
    return new Promise((resolve) => {
      setDeleteConfirmation({ partyName, resolve });
    });
  };

  const closeDeleteConfirmation = (result) => {
    if (!deleteConfirmation) {
      return;
    }

    deleteConfirmation.resolve(result);
    setDeleteConfirmation(null);
  };

  const handleSelectParty = async (nextPartyId) => {
    if (!nextPartyId || nextPartyId === selectedPartyId) {
      return;
    }

    if (hasUnsavedChanges) {
      const shouldContinue = confirm(
        'You have unsaved changes. Switch parties and discard unsaved edits?'
      );

      if (!shouldContinue) {
        return;
      }
    }

    await selectParty(nextPartyId);
  };

  const handleCreateParty = async () => {
    const defaultName = `Party ${parties.length + 1}`;
    const nextPartyName = await promptCreateParty(defaultName);

    if (!nextPartyName) {
      return;
    }

    if (hasUnsavedChanges) {
      const shouldContinue = confirm(
        'You have unsaved changes. Create and switch to a new party and discard current edits?'
      );

      if (!shouldContinue) {
        return;
      }
    }

    await createParty(nextPartyName);
  };

  const handleRenameParty = async () => {
    if (!selectedPartyId) {
      return;
    }

    const nextName = prompt('Rename party:', selectedPartyName);
    const normalizedName = nextName?.trim();

    if (!normalizedName || normalizedName === selectedPartyName) {
      return;
    }

    try {
      await renameParty(selectedPartyId, normalizedName);
      toast.success('Party renamed successfully.');
    } catch (renameError) {
      console.error('Failed to rename party:', renameError);
      toast.error('Failed to rename party. Please try again.');
    }
  };

  const handleDeleteParty = async () => {
    if (!selectedPartyId) {
      return;
    }

    const shouldDelete = await confirmDeleteParty(selectedPartyName);

    if (!shouldDelete) {
      return;
    }

    if (hasUnsavedChanges) {
      const shouldDiscard = confirm(
        'You also have unsaved changes in this party. Continue and lose those edits?'
      );

      if (!shouldDiscard) {
        return;
      }
    }

    try {
      await deleteParty(selectedPartyId);
      toast.success('Party deleted. Switched to another available party.');
    } catch (deleteError) {
      console.error('Failed to delete party:', deleteError);
      toast.error('Failed to delete party. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner darkMode={darkMode} />;
  }

  if (error) {
    return (
      <div className={`relative min-h-screen overflow-hidden transition-all duration-300 ${shellClass}`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl ${darkMode ? 'bg-fuchsia-500/15' : 'bg-rose-300/35'}`} />
          <div className={`absolute right-[-6rem] top-40 h-96 w-96 rounded-full blur-3xl ${darkMode ? 'bg-cyan-500/10' : 'bg-amber-300/25'}`} />
        </div>
        <div className="relative mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <ErrorMessage 
            error={error} 
            onRetry={refresh}
            darkMode={darkMode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-hidden transition-all duration-300 ${shellClass}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-32 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full blur-3xl ${darkMode ? 'bg-fuchsia-500/12' : 'bg-rose-300/35'}`} />
        <div className={`absolute right-[-7rem] top-44 h-[28rem] w-[28rem] rounded-full blur-3xl ${darkMode ? 'bg-cyan-500/10' : 'bg-amber-300/20'}`} />
        <div className={`absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl ${darkMode ? 'bg-violet-500/10' : 'bg-orange-200/25'}`} />
      </div>

      {createPartyPrompt && (
        <CreatePartyModal
          defaultName={createPartyPrompt.defaultName}
          darkMode={darkMode}
          onCancel={() => closeCreatePartyPrompt(null)}
          onCreate={(value) => closeCreatePartyPrompt(value)}
        />
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div
            className={`w-[min(92vw,28rem)] rounded-3xl border p-4 shadow-2xl backdrop-blur-xl ${
              darkMode
                ? 'border-white/10 bg-slate-950/95 text-slate-100'
                : 'border-slate-200 bg-white/95 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
                darkMode ? 'bg-rose-500/10 text-rose-300' : 'bg-rose-50 text-rose-600'
              }`}>
                🗑️
              </div>

              <div className="min-w-0 flex-1">
                <p className={`font-display text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  Delete this party?
                </p>
                <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="font-semibold">{deleteConfirmation.partyName}</span> and all of its items and people will be removed permanently.
                </p>

                {hasUnsavedChanges && (
                  <p className={`mt-2 rounded-2xl border px-3 py-2 text-xs leading-relaxed ${
                    darkMode
                      ? 'border-amber-400/20 bg-amber-400/10 text-amber-200'
                      : 'border-amber-200 bg-amber-50 text-amber-800'
                  }`}>
                    You also have unsaved changes in this party. Deleting it will discard those edits.
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => closeDeleteConfirmation(false)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                      darkMode
                        ? 'bg-white/5 text-slate-100 hover:bg-white/10'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => closeDeleteConfirmation(true)}
                    className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600"
                  >
                    Delete party
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        {/* Unsaved Changes Banner */}
        <SaveBanner
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={handleSaveChanges}
          onDiscard={handleDiscardChanges}
          darkMode={darkMode}
        />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              borderRadius: '18px',
              fontSize: '14px',
              padding: '14px 16px',
              boxShadow: '0 18px 50px -24px rgba(15, 23, 42, 0.55)',
              border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(226,232,240,0.8)',
              background: darkMode ? 'rgba(2, 6, 23, 0.95)' : 'rgba(255, 255, 255, 0.96)',
              color: darkMode ? '#f8fafc' : '#0f172a',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        
        {/* Header with Logo and Dark Mode Toggle */}
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <div className={`mb-4 sm:mb-6 rounded-3xl border backdrop-blur-xl shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] ${
          darkMode
            ? 'border-white/10 bg-slate-950/78 text-slate-100'
            : 'border-white/70 bg-white/75 text-slate-900'
        }`}>
          <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
            <div className="space-y-1">
              <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Active Party
              </p>
              <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{selectedPartyName}</p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 md:flex md:w-auto md:flex-nowrap md:items-center">
              <select
                value={selectedPartyId ?? ''}
                onChange={(event) => handleSelectParty(event.target.value)}
                className={`col-span-2 min-w-0 rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm outline-none md:min-w-[240px] ${
                  darkMode
                    ? 'border-white/10 bg-slate-900/70 text-slate-100'
                    : 'border-slate-200 bg-white/90 text-slate-800'
                }`}
              >
                {parties.map((party) => (
                  <option key={party._id} value={party._id}>
                    {party.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCreateParty}
                className="col-span-2 h-11 whitespace-nowrap rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-800 md:col-span-1"
              >
                + New Party
              </button>

              <button
                onClick={handleRenameParty}
                disabled={!selectedPartyId}
                className="h-11 whitespace-nowrap rounded-2xl bg-amber-500 px-4 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Rename
              </button>

              <button
                onClick={handleDeleteParty}
                disabled={!selectedPartyId}
                className="h-11 whitespace-nowrap rounded-2xl bg-rose-500 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className={`rounded-[2rem] border p-4 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.6)] backdrop-blur-xl sm:p-6 lg:p-8 transition-all duration-300 ${
          darkMode 
            ? 'border-white/10 bg-slate-950/82 text-slate-100' 
            : 'border-white/70 bg-[#fffaf4]/88 text-slate-900'
        }`}>
          {/* Items Section */}
          <ItemsSection
            localItems={localItems}
            handleChange={handleChange}
            handleRemoveItem={handleRemoveItem}
            handleAddItem={handleAddItem}
            handleReorderItems={handleReorderItems}
            darkMode={darkMode}
          />

          {/* People Section */}
          <PeopleSection
            localPeople={localPeople}
            handlePersonChange={handlePersonChange}
            handleRemovePerson={handleRemovePerson}
            handleAddPerson={handleAddPerson}
            handleReorderPeople={handleReorderPeople}
            darkMode={darkMode}
          />

          {/* Budget Summary */}
          <BudgetSummary
            localItems={localItems}
            localPeople={localPeople}
            partyName={selectedPartyName}
            totalPeople={totalPeople}
            alcoholicPeople={alcoholicPeople}
            nonAlcoholicPeople={nonAlcoholicPeople}
            totalCost={totalCost}
            totalAlcoholicCost={totalAlcoholicCost}
            totalNonAlcoholicCost={totalNonAlcoholicCost}
            alcoholicCostPerPerson={alcoholicCostPerPerson}
            nonAlcoholicCostPerPerson={nonAlcoholicCostPerPerson}
            darkMode={darkMode}
          />
        </div>

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;

function CreatePartyModal({ defaultName, darkMode, onCancel, onCreate }) {
  const [partyName, setPartyName] = useState(defaultName);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const normalizedName = partyName.trim();
  const canCreate = normalizedName.length > 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        className={`w-[min(92vw,30rem)] rounded-[2rem] border p-5 shadow-2xl ${
          darkMode
            ? 'border-white/10 bg-slate-950/95 text-slate-100'
            : 'border-slate-200 bg-white/95 text-slate-900'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
            darkMode ? 'bg-fuchsia-500/10 text-fuchsia-300' : 'bg-fuchsia-50 text-fuchsia-600'
          }`}>
            ✨
          </div>

          <div className="min-w-0 flex-1">
            <p className={`font-display text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              Create a new party
            </p>
            <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Give this party a name before you start adding items and people.
            </p>

            <label className="mt-4 block">
              <span className={`mb-2 block text-xs font-semibold uppercase tracking-[0.24em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Party name
              </span>
              <input
                ref={inputRef}
                type="text"
                value={partyName}
                onChange={(event) => setPartyName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && canCreate) {
                    event.preventDefault();
                    onCreate(normalizedName);
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    onCancel();
                  }
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all duration-200 focus:-translate-y-0.5 focus:ring-4 ${
                  darkMode
                    ? 'border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-fuchsia-400 focus:ring-fuchsia-400/20'
                    : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-fuchsia-400 focus:ring-fuchsia-200'
                }`}
                placeholder="Enter party name"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={onCancel}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  darkMode
                    ? 'bg-white/5 text-slate-100 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => canCreate && onCreate(normalizedName)}
                disabled={!canCreate}
                className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create party
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
