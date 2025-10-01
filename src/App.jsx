import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import PDFGenerator from './components/PDFGenerator';

function App() {
  const [items, setItems] = useState([
    { name: "Chicken", unitPrice: 1100, quantity: 10, isAlcoholic: false },
    { name: "Seasoning", unitPrice: 380, quantity: 3, isAlcoholic: false },
    { name: "Charcoal", unitPrice: 1000, quantity: 1, isAlcoholic: false },
    { name: "Beer", unitPrice: 3000, quantity: 1, isAlcoholic: true },
  ]);

  const [alcoholicPeople, setAlcoholicPeople] = useState(9);
  const [nonAlcoholicPeople, setNonAlcoholicPeople] = useState(4);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode was previously saved
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    if (field === "name") {
      newItems[index][field] = value;
    } else if (field === "isAlcoholic") {
      newItems[index][field] = value;
    } else {
      newItems[index][field] = Number(value);
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", unitPrice: 0, quantity: 1, isAlcoholic: false }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Advanced cost calculations
  const totalPeople = alcoholicPeople + nonAlcoholicPeople;
  
  const totalAlcoholicCost = items
    .filter(item => item.isAlcoholic)
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    
  const totalNonAlcoholicCost = items
    .filter(item => !item.isAlcoholic)
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    
  const totalCost = totalAlcoholicCost + totalNonAlcoholicCost;
  
  // Cost calculations per person type
  const nonAlcoholicCostPerPerson = totalPeople > 0 ? (totalNonAlcoholicCost / totalPeople) : 0;
  const alcoholicCostPerPerson = totalPeople > 0 && alcoholicPeople > 0 
    ? (totalNonAlcoholicCost / totalPeople) + (totalAlcoholicCost / alcoholicPeople)
    : nonAlcoholicCostPerPerson;

  // Dark mode functionality
  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 p-2 sm:p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10 relative">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`absolute top-0 right-0 p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 ${
              darkMode 
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="text-xl">
              {darkMode ? '☀️' : '🌙'}
            </span>
          </button>
          
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            {/* Custom Logo */}
            <div className="relative mr-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="relative">
                    <span className="text-2xl sm:text-3xl lg:text-4xl animate-bounce">🎉</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
              {/* Logo sparkles */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute -bottom-1 -right-3 w-3 h-3 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-1 -right-4 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-80"></div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl animate-pulse">
              Party Budget Planner
            </h1>
          </div>
          <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium drop-shadow-lg px-4">
            Plan your perfect party within budget!
          </p>
        </div>

        {/* Main Container */}
        <div className={`backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/95 border border-gray-600/20 text-white' 
            : 'bg-white/95 border border-white/20 text-gray-800'
        }`}>
          {/* Items Section */}
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
              {items.map((item, index) => (
                <div key={index} className={`border-2 rounded-2xl p-4 shadow-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-lg font-semibold flex items-center ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      <span className="text-xl mr-2">🛍️</span>
                      Item #{index + 1}
                    </h3>
                    <button
                      onClick={() => removeItem(index)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200 shadow-lg"
                      title="Remove item"
                    >
                      🗑️
                    </button>
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
              ))}
            </div>

            {/* Desktop Table - Show on medium screens and up */}
            <div className={`hidden md:block overflow-x-auto rounded-2xl shadow-lg border transition-all duration-300 ${
              darkMode ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
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
                  {items.map((item, index) => (
                    <tr key={index} className={`border-b transition-colors duration-200 ${
                      darkMode 
                        ? `border-gray-600 hover:bg-gray-600 ${item.isAlcoholic ? 'bg-gray-600/50' : ''}` 
                        : `border-gray-100 hover:bg-gray-50 ${item.isAlcoholic ? 'bg-purple-50/30' : ''}`
                    }`}>
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
                          onClick={() => removeItem(index)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 lg:p-3 rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addItem}
              className="mt-4 sm:mt-6 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 sm:mx-auto"
            >
              <span>➕</span>
              <span>Add New Item</span>
            </button>
          </div>

          {/* People Section */}
          <div className="mb-6 sm:mb-10">
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg mr-3 sm:mr-4 shadow-lg">
                2
              </span>
              Number of People
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/30' 
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
              }`}>
                <div className="flex flex-col items-center space-y-3">
                  <label className={`text-lg sm:text-xl font-semibold flex items-center space-x-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    <span>🍺</span>
                    <span>Alcoholic People:</span>
                  </label>
                  <input
                    type="number"
                    value={alcoholicPeople}
                    onChange={(e) => setAlcoholicPeople(Number(e.target.value))}
                    className={`w-32 sm:w-24 p-3 border-2 rounded-xl text-center text-xl font-bold focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-600 border-purple-400 text-white' 
                        : 'bg-white border-purple-300 text-gray-800'
                    }`}
                    min="0"
                  />
                </div>
              </div>
              <div className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-400/30' 
                  : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
              }`}>
                <div className="flex flex-col items-center space-y-3">
                  <label className={`text-lg sm:text-xl font-semibold flex items-center space-x-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    <span>🥤</span>
                    <span>Non-Alcoholic People:</span>
                  </label>
                  <input
                    type="number"
                    value={nonAlcoholicPeople}
                    onChange={(e) => setNonAlcoholicPeople(Number(e.target.value))}
                    className={`w-32 sm:w-24 p-3 border-2 rounded-xl text-center text-xl font-bold focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-600 border-green-400 text-white' 
                        : 'bg-white border-green-300 text-gray-800'
                    }`}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className={`p-4 sm:p-6 lg:p-8 rounded-2xl border transition-all duration-300 ${
            darkMode 
              ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-400/30' 
              : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg mr-3 sm:mr-4 shadow-lg">
                3
              </span>
              Budget Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className={`p-4 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl">💰</span>
                  <span className={`text-base sm:text-lg font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Total Cost</span>
                </div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                  Rs.{totalCost.toLocaleString()}
                </p>
              </div>
              <div className={`p-4 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl">🍺</span>
                  <span className={`text-base sm:text-lg font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Alcoholic Cost</span>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  Rs.{totalAlcoholicCost.toLocaleString()}
                </p>
                {alcoholicPeople > 0 && (
                  <p className={`text-xs sm:text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Per person: Rs.{alcoholicCostPerPerson.toLocaleString()}
                  </p>
                )}
              </div>
              <div className={`p-4 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl">🥤</span>
                  <span className={`text-base sm:text-lg font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Non-Alcoholic Cost</span>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  Rs.{totalNonAlcoholicCost.toLocaleString()}
                </p>
                {nonAlcoholicPeople > 0 && (
                  <p className={`text-xs sm:text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Per person: Rs.{nonAlcoholicCostPerPerson.toLocaleString()}
                  </p>
                )}
              </div>
              <div className={`p-4 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl">👥</span>
                  <span className={`text-base sm:text-lg font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Total People</span>
                </div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                  {totalPeople.toLocaleString()}
                </p>
              </div>
            </div>

            {/* PDF Generation Component */}
            <PDFGenerator 
              items={items}
              alcoholicPeople={alcoholicPeople}
              nonAlcoholicPeople={nonAlcoholicPeople}
              totalCost={totalCost}
              totalAlcoholicCost={totalAlcoholicCost}
              totalNonAlcoholicCost={totalNonAlcoholicCost}
              alcoholicCostPerPerson={alcoholicCostPerPerson}
              nonAlcoholicCostPerPerson={nonAlcoholicCostPerPerson}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;
