import React from 'react';

function SaveBanner({ hasUnsavedChanges, isSaving, onSave, onDiscard, darkMode }) {
  if (!hasUnsavedChanges) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 shadow-lg border-b-4 animate-slide-down ${
      darkMode 
        ? 'bg-yellow-900/95 border-yellow-500 backdrop-blur-sm' 
        : 'bg-yellow-50/95 border-yellow-400 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className={`font-bold text-base ${
              darkMode ? 'text-yellow-200' : 'text-yellow-800'
            }`}>
              You have unsaved changes
            </p>
            <p className={`text-sm ${
              darkMode ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              Don't forget to save your changes.
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            🚫 Discard
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 hover:scale-105'
            } text-white shadow-lg`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveBanner;
