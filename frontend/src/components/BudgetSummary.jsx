import React from 'react';
import PDFGenerator from './PDFGenerator';

function BudgetSummary({
  localItems,
  localPeople,
  totalPeople,
  alcoholicPeople,
  nonAlcoholicPeople,
  totalCost,
  totalAlcoholicCost,
  totalNonAlcoholicCost,
  alcoholicCostPerPerson,
  nonAlcoholicCostPerPerson,
  darkMode
}) {
  return (
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
        <SummaryCard
          icon="💰"
          label="Total Cost"
          value={`Rs.${totalCost.toLocaleString()}`}
          darkMode={darkMode}
          color="purple"
        />
        
        <SummaryCard
          icon="🍺"
          label="Alcoholic Cost"
          value={`Rs.${totalAlcoholicCost.toLocaleString()}`}
          subValue={alcoholicPeople > 0 ? `Per person: Rs.${alcoholicCostPerPerson.toLocaleString()}` : null}
          darkMode={darkMode}
          color="purple"
        />
        
        <SummaryCard
          icon="🥤"
          label="Non-Alcoholic Cost"
          value={`Rs.${totalNonAlcoholicCost.toLocaleString()}`}
          subValue={nonAlcoholicPeople > 0 ? `Per person: Rs.${nonAlcoholicCostPerPerson.toLocaleString()}` : null}
          darkMode={darkMode}
          color="green"
        />
        
        <SummaryCard
          icon="👥"
          label="Total People"
          value={totalPeople.toLocaleString()}
          darkMode={darkMode}
          color="blue"
        />
      </div>

      {/* PDF Generation Component */}
      <PDFGenerator 
        items={localItems}
        people={localPeople}
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
  );
}

// Summary Card Component
function SummaryCard({ icon, label, value, subValue, darkMode, color }) {
  const colorClasses = {
    purple: darkMode ? 'text-purple-400' : 'text-purple-600',
    green: darkMode ? 'text-green-400' : 'text-green-600',
    blue: darkMode ? 'text-blue-400' : 'text-blue-600',
  };

  return (
    <div className={`p-3 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-start justify-between sm:flex-col sm:items-center sm:space-y-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-xl sm:text-2xl lg:text-3xl">{icon}</span>
          <span className={`text-sm sm:text-base lg:text-lg font-semibold ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{label}</span>
        </div>
        <div className="text-right sm:text-center">
          <p className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
          {subValue && (
            <p className={`text-xs sm:text-sm mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetSummary;
