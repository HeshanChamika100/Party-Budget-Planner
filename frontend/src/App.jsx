import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SaveBanner from "./components/SaveBanner";
import ItemsSection from "./components/ItemsSection";
import PeopleSection from "./components/PeopleSection";
import BudgetSummary from "./components/BudgetSummary";
import { usePartyData, LoadingSpinner, ErrorMessage } from './hooks/useFirebaseData.jsx';
import { useLocalChanges } from './hooks/useLocalChanges';

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
      alert('✅ Party renamed successfully!');
    } catch (renameError) {
      console.error('Failed to rename party:', renameError);
      alert('❌ Failed to rename party. Please try again.');
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
      alert('🗑️ Party deleted. Switched to another available party.');
    } catch (deleteError) {
      console.error('Failed to delete party:', deleteError);
      alert('❌ Failed to delete party. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner darkMode={darkMode} />;
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-all duration-300 p-2 sm:p-4 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
      }`}>
        <div className="max-w-6xl mx-auto pt-20">
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
    <div className={`min-h-screen transition-all duration-300 p-2 sm:p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Unsaved Changes Banner */}
        <SaveBanner
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={handleSaveChanges}
          onDiscard={handleDiscardChanges}
          darkMode={darkMode}
        />
        
        {/* Header with Logo and Dark Mode Toggle */}
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <div className={`mb-4 sm:mb-6 p-4 rounded-2xl backdrop-blur-sm border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between ${
          darkMode
            ? 'bg-gray-800/95 border-gray-600/20 text-white'
            : 'bg-white/95 border-white/20 text-gray-800'
        }`}>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Active Party
            </p>
            <p className="font-bold text-lg">{selectedPartyName}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
            <select
              value={selectedPartyId ?? ''}
              onChange={(event) => handleSelectParty(event.target.value)}
              className={`px-4 py-2 rounded-xl border-2 min-w-[220px] ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-800'
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
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
            >
              + New Party
            </button>

            <button
              onClick={handleRenameParty}
              disabled={!selectedPartyId}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Rename
            </button>

            <button
              onClick={handleDeleteParty}
              disabled={!selectedPartyId}
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Main Container */}
        <div className={`backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/95 border border-gray-600/20 text-white' 
            : 'bg-white/95 border border-white/20 text-gray-800'
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
