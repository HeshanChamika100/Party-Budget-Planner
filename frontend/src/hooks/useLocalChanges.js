import { useState, useEffect } from 'react';

/**
 * Custom hook to manage local state with unsaved changes tracking
 */
export function useLocalChanges(items, people, {
  addItem,
  updateItem,
  removeItem,
  addPerson,
  updatePerson,
  removePerson
}) {
  const [localItems, setLocalItems] = useState([]);
  const [localPeople, setLocalPeople] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync items from Sanity to local state when loaded
  useEffect(() => {
    if (items.length > 0 && localItems.length === 0) {
      setLocalItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Sync people from Sanity to local state when loaded
  useEffect(() => {
    if (people.length > 0 && localPeople.length === 0) {
      setLocalPeople(people);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people]);

  // Item handlers
  const handleChange = (index, field, value) => {
    const newItems = [...localItems];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "name" ? value : (field === "isAlcoholic" ? value : Number(value))
    };
    setLocalItems(newItems);
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
    setLocalItems([...localItems, newItem]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveItem = (index) => {
    const newItems = localItems.filter((_, i) => i !== index);
    setLocalItems(newItems);
    setHasUnsavedChanges(true);
  };

  // People handlers
  const handlePersonChange = (index, field, value) => {
    const newPeople = [...localPeople];
    newPeople[index] = {
      ...newPeople[index],
      [field]: value
    };
    setLocalPeople(newPeople);
    setHasUnsavedChanges(true);
  };

  const handleAddPerson = () => {
    const newPerson = { 
      name: "", 
      isAlcoholic: false,
      _isNew: true
    };
    setLocalPeople([...localPeople, newPerson]);
    setHasUnsavedChanges(true);
  };

  const handleRemovePerson = (index) => {
    const newPeople = localPeople.filter((_, i) => i !== index);
    setLocalPeople(newPeople);
    setHasUnsavedChanges(true);
  };

  // Save all changes to backend
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Save items
      for (let i = 0; i < localItems.length; i++) {
        const item = localItems[i];
        if (item._isNew) {
          const { _isNew, ...itemData } = item;
          await addItem(itemData);
        } else if (item._id) {
          await updateItem(i, "name", item.name);
          await updateItem(i, "unitPrice", item.unitPrice);
          await updateItem(i, "quantity", item.quantity);
          await updateItem(i, "isAlcoholic", item.isAlcoholic);
        }
      }

      // Handle deleted items
      for (const item of items) {
        const exists = localItems.find(li => li._id === item._id);
        if (!exists && item._id) {
          const index = items.findIndex(i => i._id === item._id);
          await removeItem(index);
        }
      }

      // Save people
      for (let i = 0; i < localPeople.length; i++) {
        const person = localPeople[i];
        if (person._isNew) {
          const { _isNew, ...personData } = person;
          await addPerson(personData);
        } else if (person._id) {
          await updatePerson(i, "name", person.name);
          await updatePerson(i, "isAlcoholic", person.isAlcoholic);
        }
      }

      // Handle deleted people
      for (const person of people) {
        const exists = localPeople.find(lp => lp._id === person._id);
        if (!exists && person._id) {
          const index = people.findIndex(p => p._id === person._id);
          await removePerson(index);
        }
      }

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
