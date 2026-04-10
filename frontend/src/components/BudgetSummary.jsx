import React from 'react';
import PDFGenerator from './PDFGenerator';

function BudgetSummary({
  localItems,
  localPeople,
  partyName,
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
    <div className={`rounded-[1.75rem] border p-4 transition-all duration-300 sm:p-6 lg:p-8 ${
      darkMode 
        ? 'border-emerald-400/15 bg-gradient-to-br from-emerald-950/30 via-slate-950/50 to-cyan-950/30' 
        : 'border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50'
    }`}>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/20">
            3
          </span>
          <div>
            <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Step 3
            </p>
            <h2 className={`font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Budget Summary
            </h2>
          </div>
        </div>
        <p className={`max-w-2xl text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          A compact view of the total spend, drinker split, and the number of people in the room.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
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
        partyName={partyName}
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
    purple: darkMode ? 'text-fuchsia-300' : 'text-fuchsia-700',
    green: darkMode ? 'text-emerald-300' : 'text-emerald-700',
    blue: darkMode ? 'text-sky-300' : 'text-sky-700',
  };

  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-[0_16px_60px_-40px_rgba(15,23,42,0.5)] transition-all duration-300 sm:p-6 ${
      darkMode 
        ? 'border-white/10 bg-white/5' 
        : 'border-white/70 bg-white/85'
    }`}>
      <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-start sm:gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl lg:text-3xl">{icon}</span>
          <span className={`text-sm font-semibold sm:text-base lg:text-lg ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>{label}</span>
        </div>
        <div className="text-right sm:text-left">
          <p className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
          {subValue && (
            <p className={`text-xs sm:text-sm mt-1 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
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
