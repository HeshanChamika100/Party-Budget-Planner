import { useCallback, useEffect, useState } from 'react';
import { initializeFirebaseAnalytics, loadPartyData, savePartyData, seedPartyData } from '../lib/firebase';

const toUserFriendlyMessage = (error, fallbackMessage) => {
  if (error?.code === 'permission-denied') {
    return 'Firestore denied access. Deploy your Firestore rules (see firestore.rules) or relax rules in Firebase Console.';
  }

  return fallbackMessage;
};

export const usePartyData = () => {
  const [items, setItems] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      await initializeFirebaseAnalytics();
      let data = await loadPartyData();

      if (data.items.length === 0 && data.people.length === 0) {
        data = await seedPartyData();
      }

      setItems(data.items);
      setPeople(data.people);
      setError(null);
    } catch (loadError) {
      console.error('Error loading Firebase data:', loadError);
      setError(toUserFriendlyMessage(loadError, 'Failed to load party data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveData = useCallback(async (nextItems, nextPeople) => {
    try {
      const savedState = await savePartyData(nextItems, nextPeople);
      setItems(savedState.items);
      setPeople(savedState.people);
      setError(null);
      return savedState;
    } catch (saveError) {
      console.error('Error saving Firebase data:', saveError);
      setError(toUserFriendlyMessage(saveError, 'Failed to save party data'));
      throw saveError;
    }
  }, []);

  return {
    items,
    people,
    loading,
    error,
    savePartyData: saveData,
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
