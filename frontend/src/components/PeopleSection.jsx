import React, { useState } from 'react';

function PeopleSection({
  localPeople,
  handlePersonChange,
  handleRemovePerson,
  handleAddPerson,
  handleReorderPeople,
  darkMode,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const onDragStart = (index, event) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  };

  const onDragOver = (index, event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const onDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDragOverIndex(null);
      return;
    }

    handleReorderPeople(draggedIndex, targetIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="mb-6 sm:mb-10">
      <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-3 sm:gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/20 sm:h-10 sm:w-10">
          2
        </span>
        <div>
          <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Step 2
          </p>
          <h2 className={`font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Party People
          </h2>
        </div>
      </div>

      {/* Mobile Cards - Show on small screens */}
      <div className="block md:hidden space-y-4">
        {localPeople.map((person, index) => (
          <PersonCardMobile
            key={index}
            person={person}
            index={index}
            handlePersonChange={handlePersonChange}
            handleRemovePerson={handleRemovePerson}
            darkMode={darkMode}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            isDragTarget={dragOverIndex === index && draggedIndex !== index}
          />
        ))}
      </div>

      {/* Desktop Table - Show on medium screens and up */}
      <PeopleTable
        localPeople={localPeople}
        handlePersonChange={handlePersonChange}
        handleRemovePerson={handleRemovePerson}
        darkMode={darkMode}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        draggedIndex={draggedIndex}
        dragOverIndex={dragOverIndex}
      />

      <button
        onClick={handleAddPerson}
        className="mt-4 sm:mt-6 flex w-full items-center justify-center space-x-2 rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 sm:mx-auto sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
      >
        <span>👤</span>
        <span>Add New Person</span>
      </button>
    </div>
  );
}

// Mobile Card Component
function PersonCardMobile({
  person,
  index,
  handlePersonChange,
  handleRemovePerson,
  darkMode,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragTarget,
}) {
  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] transition-all duration-300 ${
      darkMode 
        ? 'border-white/10 bg-white/5' 
        : 'border-white/70 bg-white/85'
    } ${isDragTarget ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent' : ''}`}
      onDragOver={(event) => onDragOver(index, event)}
      onDrop={() => onDrop(index)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-semibold flex items-center ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          <span className="text-xl mr-2">👤</span>
          Person #{index + 1}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            draggable
            onDragStart={(event) => onDragStart(index, event)}
            onDragEnd={onDragEnd}
            className="rounded-full bg-slate-900 p-2 text-white shadow-lg shadow-slate-950/20 transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:bg-slate-800"
            title="Drag to reorder"
            aria-label={`Drag person ${index + 1} to reorder`}
          >
            ⋮⋮
          </button>
          <button
            onClick={() => handleRemovePerson(index)}
            className="rounded-full bg-rose-500 p-2 text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600"
            title="Remove person"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Person Name</label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => handlePersonChange(index, "name", e.target.value)}
            className={`w-full rounded-xl border-2 p-3 font-medium transition-all duration-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 ${
              darkMode 
                ? 'border-white/10 bg-white/5 text-white placeholder-slate-400' 
                : 'border-slate-200 bg-white text-slate-800 placeholder-slate-500'
            }`}
            placeholder="Enter person name..."
          />
        </div>
        
        {/* Alcoholic Toggle */}
        <div className={`rounded-xl border p-3 transition-all duration-300 ${
          person.isAlcoholic 
            ? (darkMode ? 'border-fuchsia-400/20 bg-fuchsia-500/10' : 'border-fuchsia-100 bg-fuchsia-50')
            : (darkMode ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-emerald-100 bg-emerald-50')
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium flex items-center ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {person.isAlcoholic ? '🍺' : '🥤'} {person.isAlcoholic ? 'Drinks Alcohol' : 'Non-Alcoholic'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={person.isAlcoholic}
                onChange={(e) => handlePersonChange(index, "isAlcoholic", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 peer after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-fuchsia-600 rtl:peer-checked:after:-translate-x-full peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {person.isAlcoholic && (
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'
            }`}>
              Will share alcoholic item costs
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Desktop Table Component
function PeopleTable({
  localPeople,
  handlePersonChange,
  handleRemovePerson,
  darkMode,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedIndex,
  dragOverIndex,
}) {
  return (
    <div className={`hidden md:block overflow-x-auto rounded-[1.5rem] border shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] transition-all duration-300 ${
      darkMode ? 'border-white/10' : 'border-white/70'
    }`}>
      <table className="w-full">
        <thead className="bg-gradient-to-r from-slate-950 via-slate-800 to-fuchsia-900 text-white">
          <tr>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">↕</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">#</th>
            <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">👤 Name</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">🍺 Alcoholic</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">⚡ Action</th>
          </tr>
        </thead>
        <tbody className={`transition-all duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          {localPeople.map((person, index) => (
            <tr
              key={index}
              className={`border-b transition-colors duration-200 ${
                darkMode 
                  ? `border-gray-600 hover:bg-gray-600 ${person.isAlcoholic ? 'bg-purple-900/20' : 'bg-green-900/20'}` 
                  : `border-gray-100 hover:bg-gray-50 ${person.isAlcoholic ? 'bg-purple-50/50' : 'bg-green-50/50'}`
              } ${dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-green-400 ring-inset' : ''}`}
              onDragOver={(event) => onDragOver(index, event)}
              onDrop={() => onDrop(index)}
            >
              <td className="p-3 lg:p-4 text-center">
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => onDragStart(index, event)}
                  onDragEnd={onDragEnd}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                  aria-label={`Drag person ${index + 1} to reorder`}
                >
                  ⋮⋮
                </button>
              </td>
              <td className="p-3 lg:p-4 text-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {index + 1}
                </span>
              </td>
              <td className="p-3 lg:p-4">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => handlePersonChange(index, "name", e.target.value)}
                  className={`w-full p-2 lg:p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-medium text-sm lg:text-base ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                  placeholder="Enter person name..."
                />
              </td>
              <td className="p-3 lg:p-4 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-lg">{person.isAlcoholic ? '🍺' : '🥤'}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={person.isAlcoholic}
                      onChange={(e) => handlePersonChange(index, "isAlcoholic", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </td>
              <td className="p-3 lg:p-4 text-center">
                <button
                  onClick={() => handleRemovePerson(index)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 lg:p-3 rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                  title="Remove person"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PeopleSection;
