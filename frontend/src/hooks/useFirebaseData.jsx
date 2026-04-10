import { useCallback, useEffect, useState } from 'react';
import {
  createParty,
  deleteParty,
  ensurePartyStore,
  initializeFirebaseAnalytics,
  listParties,
  loadPartyDataById,
  renameParty,
  savePartyData,
} from '../lib/firebase';

const toUserFriendlyMessage = (error, fallbackMessage) => {
  if (error?.code === 'permission-denied') {
    return 'Firestore denied access. Deploy your Firestore rules (see firestore.rules) or relax rules in Firebase Console.';
  }

  return fallbackMessage;
};

export const usePartyData = () => {
  const [items, setItems] = useState([]);
  const [people, setPeople] = useState([]);
  const [parties, setParties] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (preferredPartyId = null) => {
    setLoading(true);

    try {
      await initializeFirebaseAnalytics();

      const availableParties = await ensurePartyStore();
      setParties(availableParties);

      const fallbackPartyId = availableParties[0]?._id ?? null;
      const resolvedPartyId =
        preferredPartyId && availableParties.some((party) => party._id === preferredPartyId)
          ? preferredPartyId
          : selectedPartyId && availableParties.some((party) => party._id === selectedPartyId)
            ? selectedPartyId
            : fallbackPartyId;

      setSelectedPartyId(resolvedPartyId);

      if (!resolvedPartyId) {
        setItems([]);
        setPeople([]);
        setError(null);
        return;
      }

      const data = await loadPartyDataById(resolvedPartyId);

      setItems(data.items);
      setPeople(data.people);
      setError(null);
    } catch (loadError) {
      console.error('Error loading Firebase data:', loadError);
      setError(toUserFriendlyMessage(loadError, 'Failed to load party data'));
    } finally {
      setLoading(false);
    }
  }, [selectedPartyId]);

  const refresh = useCallback(async () => {
    await loadData(selectedPartyId);
  }, [loadData, selectedPartyId]);

  const selectParty = useCallback(async (partyId) => {
    await loadData(partyId);
  }, [loadData]);

  const createNewParty = useCallback(async (partyName) => {
    const createdParty = await createParty(partyName);
    await loadData(createdParty._id);
    return createdParty;
  }, [loadData]);

  const renameExistingParty = useCallback(async (partyId, partyName) => {
    const renamedParty = await renameParty(partyId, partyName);
    const availableParties = await listParties();
    setParties(availableParties);
    setError(null);
    return renamedParty;
  }, []);

  const deleteExistingParty = useCallback(async (partyId) => {
    setLoading(true);

    try {
      const remainingParties = await deleteParty(partyId);
      const nextPartyId = remainingParties[0]?._id ?? null;

      setParties(remainingParties);
      setSelectedPartyId(nextPartyId);

      if (nextPartyId) {
        const nextPartyData = await loadPartyDataById(nextPartyId);
        setItems(nextPartyData.items);
        setPeople(nextPartyData.people);
      } else {
        setItems([]);
        setPeople([]);
      }

      setError(null);
      return remainingParties;
    } catch (deleteError) {
      console.error('Error deleting party:', deleteError);
      setError(toUserFriendlyMessage(deleteError, 'Failed to delete party'));
      throw deleteError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveData = useCallback(async (nextItems, nextPeople, partyId = selectedPartyId) => {
    try {
      if (!partyId) {
        throw new Error('Please select a party before saving.');
      }

      const savedState = await savePartyData(partyId, nextItems, nextPeople);
      setItems(savedState.items);
      setPeople(savedState.people);
      const availableParties = await listParties();
      setParties(availableParties);
      setError(null);
      return savedState;
    } catch (saveError) {
      console.error('Error saving Firebase data:', saveError);
      setError(toUserFriendlyMessage(saveError, 'Failed to save party data'));
      throw saveError;
    }
  }, [selectedPartyId]);

  return {
    items,
    people,
    parties,
    selectedPartyId,
    loading,
    error,
    savePartyData: saveData,
    selectParty,
    createParty: createNewParty,
    renameParty: renameExistingParty,
    deleteParty: deleteExistingParty,
    refresh,
  };
};

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
