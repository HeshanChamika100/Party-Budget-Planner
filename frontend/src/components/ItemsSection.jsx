import React, { useState } from 'react';

function ItemsSection({
  localItems,
  handleChange,
  handleRemoveItem,
  handleAddItem,
  handleReorderItems,
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

    handleReorderItems(draggedIndex, targetIndex);
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
          1
        </span>
        <div>
          <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Step 1
          </p>
          <h2 className={`font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Party Items
          </h2>
        </div>
      </div>

      {/* Mobile Cards - Show on small screens */}
      <div className="block md:hidden space-y-4">
        {localItems.map((item, index) => (
          <ItemCardMobile
            key={index}
            item={item}
            index={index}
            displayNumber={index + 1}
            handleChange={handleChange}
            handleRemoveItem={handleRemoveItem}
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
      <ItemsTable
        localItems={localItems}
        handleChange={handleChange}
        handleRemoveItem={handleRemoveItem}
        darkMode={darkMode}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        draggedIndex={draggedIndex}
        dragOverIndex={dragOverIndex}
      />

      <button
        onClick={handleAddItem}
        className="mt-4 sm:mt-6 flex w-full items-center justify-center space-x-2 rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 sm:mx-auto sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
      >
        <span>➕</span>
        <span>Add New Item</span>
      </button>
    </div>
  );
}

// Mobile Card Component
function ItemCardMobile({
  item,
  index,
  displayNumber,
  handleChange,
  handleRemoveItem,
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
    } ${isDragTarget ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent' : ''}`}
      onDragOver={(event) => onDragOver(index, event)}
      onDrop={() => onDrop(index)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-semibold flex items-center ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          <span className="text-xl mr-2">🛍️</span>
          Item #{displayNumber}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            draggable
            onDragStart={(event) => onDragStart(index, event)}
            onDragEnd={onDragEnd}
            className="rounded-full bg-slate-900 p-2 text-white shadow-lg shadow-slate-950/20 transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:bg-slate-800"
            title="Drag to reorder"
            aria-label={`Drag item ${displayNumber} to reorder`}
          >
            ⋮⋮
          </button>
          <button
            onClick={() => handleRemoveItem(index)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600"
            title="Remove item"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Item Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            className={`w-full rounded-xl border-2 p-3 font-medium transition-all duration-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 ${
              darkMode 
                ? 'border-white/10 bg-white/5 text-white placeholder-slate-400' 
                : 'border-slate-200 bg-white text-slate-800 placeholder-slate-500'
            }`}
            placeholder="Enter item name..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>💰 Unit Price</label>
            <input
              type="number"
              value={item.unitPrice}
              onChange={(e) => handleChange(index, "unitPrice", e.target.value)}
              className={`w-full rounded-xl border-2 p-3 text-center font-medium transition-all duration-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 ${
                darkMode 
                  ? 'border-white/10 bg-white/5 text-white placeholder-slate-400' 
                  : 'border-slate-200 bg-white text-slate-800 placeholder-slate-500'
              }`}
              placeholder="0"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>📦 Quantity</label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
              className={`w-full rounded-xl border-2 p-3 text-center font-medium transition-all duration-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 ${
                darkMode 
                  ? 'border-white/10 bg-white/5 text-white placeholder-slate-400' 
                  : 'border-slate-200 bg-white text-slate-800 placeholder-slate-500'
              }`}
              min="1"
            />
          </div>
        </div>
        
        {/* Alcoholic Toggle */}
        <div className={`rounded-xl border p-3 ${darkMode ? 'border-fuchsia-400/10 bg-fuchsia-500/10' : 'border-fuchsia-100 bg-fuchsia-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium flex items-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              🍺 Alcoholic Item?
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={item.isAlcoholic}
                onChange={(e) => handleChange(index, "isAlcoholic", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 peer after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-fuchsia-600 rtl:peer-checked:after:-translate-x-full peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {item.isAlcoholic && (
            <p className={`text-xs mt-1 ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'}`}>
              This cost will be shared only among drinkers
            </p>
          )}
        </div>
        
        <div className={`rounded-xl border p-3 ${darkMode ? 'border-emerald-400/10 bg-emerald-500/10' : 'border-emerald-100 bg-emerald-50'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>🧮 Total:</span>
            <span className="text-lg font-bold text-emerald-600">
              Rs.{(item.unitPrice * item.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Table Component
function ItemsTable({
  localItems,
  handleChange,
  handleRemoveItem,
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
            <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">🛍️ Item</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">💰 Unit Price</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">📦 Quantity</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">🍺 Alcoholic</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">🧮 Total</th>
            <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">⚡ Action</th>
          </tr>
        </thead>
        <tbody className={`transition-all duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          {localItems.map((item, index) => {
            return (
            <tr
              key={index}
              className={`border-b transition-colors duration-200 ${
              darkMode 
                ? `border-gray-600 hover:bg-gray-600 ${item.isAlcoholic ? 'bg-gray-600/50' : ''}` 
                : `border-gray-100 hover:bg-gray-50 ${item.isAlcoholic ? 'bg-purple-50/30' : ''}`
              } ${dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
              onDragOver={(event) => onDragOver(index, event)}
              onDrop={() => onDrop(index)}
            >
              <td className="p-3 lg:p-4 text-center">
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => onDragStart(index, event)}
                  onDragEnd={onDragEnd}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                  aria-label={`Drag item ${index + 1} to reorder`}
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
                  value={item.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className={`w-full p-2 lg:p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-medium text-sm lg:text-base ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                  placeholder="Enter item name..."
                />
              </td>
              <td className="p-3 lg:p-4">
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleChange(index, "unitPrice", e.target.value)}
                  className={`w-full p-2 lg:p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium text-sm lg:text-base ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                  placeholder="0"
                />
              </td>
              <td className="p-3 lg:p-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, "quantity", e.target.value)}
                  className={`w-full p-2 lg:p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium text-sm lg:text-base ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                  min="1"
                />
              </td>
              <td className="p-3 lg:p-4 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isAlcoholic}
                    onChange={(e) => handleChange(index, "isAlcoholic", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </td>
              <td className="p-3 lg:p-4 text-center">
                <span className={`inline-flex items-center px-2 lg:px-4 py-1 lg:py-2 rounded-full font-bold text-sm lg:text-lg ${
                  item.isAlcoholic 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  Rs.{(item.unitPrice * item.quantity).toLocaleString()}
                </span>
              </td>
              <td className="p-3 lg:p-4 text-center">
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600 lg:h-11 lg:w-11"
                  title="Remove item"
                >
                  <TrashIcon className="h-5 w-5 lg:h-[1.15rem] lg:w-[1.15rem]" />
                </button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TrashIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export default ItemsSection;
