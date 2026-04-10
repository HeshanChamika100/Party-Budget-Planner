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
      <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 flex items-center ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg mr-3 sm:mr-4 shadow-lg">
          1
        </span>
        Party Items
      </h2>

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
        className="mt-4 sm:mt-6 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 sm:mx-auto"
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
    <div className={`border-2 rounded-2xl p-4 shadow-lg transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-gray-200'
    } ${isDragTarget ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent' : ''}`}
      onDragOver={(event) => onDragOver(index, event)}
      onDrop={() => onDrop(index)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-semibold flex items-center ${
          darkMode ? 'text-white' : 'text-gray-800'
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
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
            aria-label={`Drag item ${displayNumber} to reorder`}
          >
            ⋮⋮
          </button>
          <button
            onClick={() => handleRemoveItem(index)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200 shadow-lg"
            title="Remove item"
          >
            🗑️
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
            className={`w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-medium ${
              darkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
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
              className={`w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium ${
                darkMode 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
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
              className={`w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium ${
                darkMode 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
              }`}
              min="1"
            />
          </div>
        </div>
        
        {/* Alcoholic Toggle */}
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 flex items-center">
              🍺 Alcoholic Item?
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={item.isAlcoholic}
                onChange={(e) => handleChange(index, "isAlcoholic", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          {item.isAlcoholic && (
            <p className="text-xs text-purple-600 mt-1">
              This cost will be shared only among drinkers
            </p>
          )}
        </div>
        
        <div className="bg-green-50 p-3 rounded-xl border border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">🧮 Total:</span>
            <span className="text-lg font-bold text-green-600">
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
    <div className={`hidden md:block overflow-x-auto rounded-2xl shadow-lg border transition-all duration-300 ${
      darkMode ? 'border-gray-600' : 'border-gray-200'
    }`}>
      <table className="w-full">
        <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
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
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 lg:p-3 rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                  title="Remove item"
                >
                  🗑️
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

export default ItemsSection;
