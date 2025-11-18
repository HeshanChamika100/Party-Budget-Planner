import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SaveBanner from "./components/SaveBanner";
import ItemsSection from "./components/ItemsSection";
import PeopleSection from "./components/PeopleSection";
import BudgetSummary from "./components/BudgetSummary";
import { usePartyItems, usePartyPeople, LoadingSpinner, ErrorMessage } from './hooks/useSanityData.jsx';
import { useLocalChanges } from './hooks/useLocalChanges';

function App() {
  // Use Sanity hooks for data management
  const { 
    items, 
    loading: itemsLoading, 
    error: itemsError, 
    addItem, 
    updateItem: updateItemHook, 
    removeItem 
  } = usePartyItems();

  const { 
    people, 
    loading: peopleLoading, 
    error: peopleError, 
    addPerson, 
    updatePerson: updatePersonHook, 
    removePerson 
  } = usePartyPeople();
  
  // Use local changes hook for managing unsaved changes
  const {
    localItems,
    localPeople,
    hasUnsavedChanges,
    isSaving,
    handleChange,
    handleAddItem,
    handleRemoveItem,
    handlePersonChange,
    handleAddPerson,
    handleRemovePerson,
    handleSaveChanges,
    handleDiscardChanges,
  } = useLocalChanges(items, people, {
    addItem,
    updateItem: updateItemHook,
    removeItem,
    addPerson,
    updatePerson: updatePersonHook,
    removePerson,
  });

  // UI state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Loading state
  if (itemsLoading || peopleLoading) {
    return <LoadingSpinner darkMode={darkMode} />;
  }

  // Error state
  if (itemsError || peopleError) {
    return (
      <div className={`min-h-screen transition-all duration-300 p-2 sm:p-4 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
      }`}>
        <div className="max-w-6xl mx-auto pt-20">
          <ErrorMessage 
            error={itemsError || peopleError} 
            onRetry={() => window.location.reload()}
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
            darkMode={darkMode}
          />

          {/* People Section */}
          <PeopleSection
            localPeople={localPeople}
            handlePersonChange={handlePersonChange}
            handleRemovePerson={handleRemovePerson}
            handleAddPerson={handleAddPerson}
            darkMode={darkMode}
          />

          {/* Budget Summary */}
          <BudgetSummary
            localItems={localItems}
            localPeople={localPeople}
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
