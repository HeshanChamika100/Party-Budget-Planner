import React, { useState, useEffect } from "react";
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
    const partyName = prompt('Enter a name for the new party:', `Party ${parties.length + 1}`);
    const normalizedName = partyName?.trim();

    if (!normalizedName) {
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

    await createParty(normalizedName);
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

    const shouldDelete = confirm(
      `Delete "${selectedPartyName}"? This removes its budget items and people permanently.`
    );

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

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
              <select
                value={selectedPartyId ?? ''}
                onChange={(event) => handleSelectParty(event.target.value)}
                className={`min-w-[220px] rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm outline-none ${
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
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                + New Party
              </button>

              <button
                onClick={handleRenameParty}
                disabled={!selectedPartyId}
                className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Rename
              </button>

              <button
                onClick={handleDeleteParty}
                disabled={!selectedPartyId}
                className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
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
