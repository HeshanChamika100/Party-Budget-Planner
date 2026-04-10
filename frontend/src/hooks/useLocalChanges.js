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

  // Sync remote items into local state when loaded.
  useEffect(() => {
    if (items.length > 0 && localItems.length === 0) {
      setLocalItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Sync remote people into local state when loaded.
  useEffect(() => {
    if (people.length > 0 && localPeople.length === 0) {
      setLocalPeople(people);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people]);

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
    handlePersonChange,
    handleAddPerson,
    handleRemovePerson,
    handleSaveChanges,
    handleDiscardChanges,
  };
}
