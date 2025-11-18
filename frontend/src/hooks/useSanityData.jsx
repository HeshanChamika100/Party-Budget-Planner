import React, { useState, useEffect } from 'react';
import {
  fetchPartyItems,
  fetchPartyPeople,
  createPartyItem,
  createPartyPerson,
  updatePartyItem,
  updatePartyPerson,
  deletePartyItem,
  deletePartyPerson,
} from '../lib/sanityClient';

/**
 * Custom hook for managing party items with Sanity backend
 */
export const usePartyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load items from Sanity
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchPartyItems();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error('Error loading items:', err);
        setError('Failed to load party items');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Add a new item
  const addItem = async (itemData = { name: "", unitPrice: 0, quantity: 1, isAlcoholic: false }) => {
    try {
      const newItem = await createPartyItem(itemData);
      setItems([...items, newItem]);
      return newItem;
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item');
      throw err;
    }
  };

  // Update an item
  const updateItem = async (index, field, value) => {
    try {
      const item = items[index];
      const updates = { [field]: field === "name" ? value : Number(value) };
      
      const updatedItem = await updatePartyItem(item._id, updates);
      
      const newItems = [...items];
      newItems[index] = updatedItem;
      setItems(newItems);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
      throw err;
    }
  };

  // Remove an item
  const removeItem = async (index) => {
    try {
      const item = items[index];
      await deletePartyItem(item._id);
      
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    setItems,
  };
};

/**
 * Custom hook for managing party people with Sanity backend
 */
export const usePartyPeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load people from Sanity
  useEffect(() => {
    const loadPeople = async () => {
      try {
        setLoading(true);
        const data = await fetchPartyPeople();
        setPeople(data);
        setError(null);
      } catch (err) {
        console.error('Error loading people:', err);
        setError('Failed to load party people');
      } finally {
        setLoading(false);
      }
    };

    loadPeople();
  }, []);

  // Add a new person
  const addPerson = async (personData = { name: "", isAlcoholic: false }) => {
    try {
      const newPerson = await createPartyPerson(personData);
      setPeople([...people, newPerson]);
      return newPerson;
    } catch (err) {
      console.error('Error adding person:', err);
      setError('Failed to add person');
      throw err;
    }
  };

  // Update a person
  const updatePerson = async (index, field, value) => {
    try {
      const person = people[index];
      const updates = { [field]: value };
      
      const updatedPerson = await updatePartyPerson(person._id, updates);
      
      const newPeople = [...people];
      newPeople[index] = updatedPerson;
      setPeople(newPeople);
    } catch (err) {
      console.error('Error updating person:', err);
      setError('Failed to update person');
      throw err;
    }
  };

  // Remove a person
  const removePerson = async (index) => {
    try {
      const person = people[index];
      await deletePartyPerson(person._id);
      
      const newPeople = people.filter((_, i) => i !== index);
      setPeople(newPeople);
    } catch (err) {
      console.error('Error removing person:', err);
      setError('Failed to remove person');
      throw err;
    }
  };

  return {
    people,
    loading,
    error,
    addPerson,
    updatePerson,
    removePerson,
    setPeople,
  };
};

/**
 * Loading component
 */
export const LoadingSpinner = ({ darkMode = false }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <div className={`animate-spin rounded-full h-16 w-16 border-b-4 mx-auto ${
        darkMode ? 'border-purple-400' : 'border-purple-600'
      }`}></div>
      <p className={`text-lg font-semibold ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Loading party data...
      </p>
    </div>
  </div>
);

/**
 * Error component
 */
export const ErrorMessage = ({ error, onRetry, darkMode = false }) => (
  <div className={`p-6 rounded-2xl border-2 mx-auto max-w-md ${
    darkMode 
      ? 'bg-red-900/20 border-red-400/30 text-red-400' 
      : 'bg-red-50 border-red-200 text-red-600'
  }`}>
    <div className="flex items-center space-x-3 mb-3">
      <span className="text-2xl">⚠️</span>
      <h3 className="text-lg font-bold">Error Loading Data</h3>
    </div>
    <p className="mb-4">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Try Again
      </button>
    )}
  </div>
);
