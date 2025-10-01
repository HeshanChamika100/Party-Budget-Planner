import React, { useState } from "react";
import Footer from "./components/Footer";

function App() {
  const [items, setItems] = useState([
    { name: "Chicken", unitPrice: 1100, quantity: 10 },
    { name: "Seasoning", unitPrice: 380, quantity: 3 },
    { name: "Charcoal", unitPrice: 1000, quantity: 1 },
    { name: "Beverages", unitPrice: 3000, quantity: 1 },
  ]);

  const [people, setPeople] = useState(13);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "name" ? value : Number(value);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", unitPrice: 0, quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const totalCost = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const perPerson = people > 0 ? (totalCost / people).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10">
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
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20">
          {/* Items Section */}
          <div className="mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8 flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg mr-3 sm:mr-4 shadow-lg">
                1
              </span>
              Party Items
            </h2>

            {/* Mobile Cards - Show on small screens */}
            <div className="block md:hidden space-y-4">
              {items.map((item, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
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
                      <label className="block text-sm font-medium text-gray-600 mb-2">Item Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-medium"
                        placeholder="Enter item name..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">💰 Unit Price</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleChange(index, "unitPrice", e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium"
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">📦 Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleChange(index, "quantity", e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium"
                          min="1"
                        />
                      </div>
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
            <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
                    <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">🛍️ Item</th>
                    <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">💰 Unit Price</th>
                    <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">📦 Quantity</th>
                    <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">🧮 Total</th>
                    <th className="p-3 lg:p-4 text-center font-semibold text-sm lg:text-base">⚡ Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="p-3 lg:p-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleChange(index, "name", e.target.value)}
                          className="w-full p-2 lg:p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-medium text-sm lg:text-base"
                          placeholder="Enter item name..."
                        />
                      </td>
                      <td className="p-3 lg:p-4">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleChange(index, "unitPrice", e.target.value)}
                          className="w-full p-2 lg:p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium text-sm lg:text-base"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-3 lg:p-4">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleChange(index, "quantity", e.target.value)}
                          className="w-full p-2 lg:p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-center font-medium text-sm lg:text-base"
                          min="1"
                        />
                      </td>
                      <td className="p-3 lg:p-4 text-center">
                        <span className="inline-flex items-center px-2 lg:px-4 py-1 lg:py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm lg:text-lg">
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg mr-3 sm:mr-4 shadow-lg">
                2
              </span>
              Number of People
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-2xl border border-purple-200">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label className="text-lg sm:text-xl font-semibold text-gray-700 flex items-center space-x-2">
                  <span>👥</span>
                  <span>People attending:</span>
                </label>
                <input
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="w-32 sm:w-24 p-3 border-2 border-purple-300 rounded-xl text-center text-xl font-bold focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 lg:p-8 rounded-2xl border border-green-200">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg mr-3 sm:mr-4 shadow-lg">
                3
              </span>
              Budget Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl">💰</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-600">Total Cost</span>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
                  Rs.{totalCost.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl">👤</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-600">Cost per Person</span>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                  Rs.{parseFloat(perPerson).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
