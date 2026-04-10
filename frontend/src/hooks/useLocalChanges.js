import { useState, useEffect } from 'react';

/**
 * Custom hook to manage local state with unsaved changes tracking.
 */
export function useLocalChanges(items, people, {
  savePartyData,
}) {
  const [localItems, setLocalItems] = useState([]);
  const [localPeople, setLocalPeople] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync selected party data into local editable state.
  useEffect(() => {
    setLocalItems(items);
    setLocalPeople(people);
    setHasUnsavedChanges(false);
  }, [items, people]);

  // Item handlers
  const handleChange = (index, field, value) => {
    setLocalItems((currentItems) => {
      const nextItems = [...currentItems];
      nextItems[index] = {
        ...nextItems[index],
        [field]: field === 'name' ? value : field === 'isAlcoholic' ? value : Number(value),
      };
      return nextItems;
    });
    setHasUnsavedChanges(true);
  };

  const handleAddItem = () => {
    const newItem = { 
      name: "", 
      unitPrice: 0, 
      quantity: 1, 
      isAlcoholic: false,
      _isNew: true
    };
    setLocalItems((currentItems) => [...currentItems, newItem]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveItem = (index) => {
    setLocalItems((currentItems) => currentItems.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleReorderItems = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) {
      return;
    }

    setLocalItems((currentItems) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= currentItems.length ||
        toIndex >= currentItems.length
      ) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      const [movedItem] = nextItems.splice(fromIndex, 1);
      nextItems.splice(toIndex, 0, movedItem);
      return nextItems;
    });

    setHasUnsavedChanges(true);
  };

  // People handlers
  const handlePersonChange = (index, field, value) => {
    setLocalPeople((currentPeople) => {
      const nextPeople = [...currentPeople];
      nextPeople[index] = {
        ...nextPeople[index],
        [field]: value,
      };
      return nextPeople;
    });
    setHasUnsavedChanges(true);
  };

  const handleAddPerson = () => {
    const newPerson = { 
      name: "", 
      isAlcoholic: false,
      _isNew: true
    };
    setLocalPeople((currentPeople) => [...currentPeople, newPerson]);
    setHasUnsavedChanges(true);
  };

  const handleRemovePerson = (index) => {
    setLocalPeople((currentPeople) => currentPeople.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleReorderPeople = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) {
      return;
    }

    setLocalPeople((currentPeople) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= currentPeople.length ||
        toIndex >= currentPeople.length
      ) {
        return currentPeople;
      }

      const nextPeople = [...currentPeople];
      const [movedPerson] = nextPeople.splice(fromIndex, 1);
      nextPeople.splice(toIndex, 0, movedPerson);
      return nextPeople;
    });

    setHasUnsavedChanges(true);
  };

  // Save all changes to Firebase.
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const savedState = await savePartyData(localItems, localPeople);
      setLocalItems(savedState.items);
      setLocalPeople(savedState.people);
      setHasUnsavedChanges(false);
      alert('✅ Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('❌ Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    if (confirm('Are you sure you want to discard all unsaved changes?')) {
      setLocalItems(items);
      setLocalPeople(people);
      setHasUnsavedChanges(false);
    }
  };

  return {
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
  };
}
