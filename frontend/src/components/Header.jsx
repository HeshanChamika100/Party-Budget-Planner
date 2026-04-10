import React from 'react';

function Header({ darkMode, toggleDarkMode, isMobileMenuOpen, setIsMobileMenuOpen, hasUnsavedChanges }) {
  return (
    <div className={`relative mb-6 sm:mb-8 ${
      hasUnsavedChanges ? 'mt-24 sm:mt-20' : 'mt-6 sm:mt-8'
    }`}>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`mobile-menu-container absolute right-1 top-2 z-20 block rounded-2xl p-2.5 shadow-lg transition-all duration-200 hover:-translate-y-0.5 sm:hidden ${
          darkMode 
            ? 'border-white/10 bg-slate-950/85 text-white backdrop-blur-md hover:bg-slate-900' 
            : 'border-white/80 bg-white/85 text-slate-800 backdrop-blur-md hover:bg-white'
        }`}
        title="Menu"
      >
        <span className="text-lg leading-none">
          {isMobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`mobile-menu-container fixed right-0 top-0 z-50 h-screen w-80 transform shadow-2xl transition-all duration-300 ease-in-out animate-slide-in-right sm:hidden ${
          darkMode 
            ? 'bg-slate-950/95 backdrop-blur-xl' 
            : 'bg-white/95 backdrop-blur-xl'
        }`}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className={`p-6 border-b ${
              darkMode ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-display text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Menu
                </h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-full p-2 transition-all duration-200 ${
                    darkMode 
                      ? 'text-slate-400 hover:bg-white/5 hover:text-white' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>

            {/* Menu Content */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center space-x-3 rounded-2xl p-4 text-left transition-all duration-200 ${
                    darkMode 
                      ? 'bg-amber-300 text-slate-950 hover:bg-amber-200' 
                      : 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">
                    {darkMode ? '☀️' : '🌙'}
                  </span>
                  <span className="font-medium">
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </span>
                </button>
              </div>
            </div>

            {/* Menu Footer */}
            <div className={`p-6 border-t ${
              darkMode ? 'border-white/10' : 'border-slate-200'
            }`}>
              <p className={`text-center text-sm ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Party Budget Planner
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`mx-auto flex max-w-5xl flex-row items-start gap-3 rounded-[1.75rem] border px-4 pb-4 pt-2 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.55)] sm:flex-row sm:items-center sm:gap-6 sm:rounded-none sm:border-0 sm:px-0 sm:pb-0 sm:pt-6 sm:shadow-none ${
        darkMode
          ? 'border-white/10 bg-slate-950/75'
          : 'border-white/75 bg-white/72'
      }`}>
        <div className="relative shrink-0">
          <div className={`relative flex h-[4.2rem] w-[4.2rem] items-center justify-center rounded-[1.3rem] shadow-[0_18px_45px_-20px_rgba(15,23,42,0.65)] sm:h-20 sm:w-20 sm:rounded-[1.5rem] ${
            darkMode
              ? 'bg-gradient-to-br from-fuchsia-500 via-violet-500 to-amber-300'
              : 'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-amber-300'
          }`}>
            <div className="absolute inset-1.5 rounded-[1.05rem] bg-white/72 backdrop-blur-sm" />
            <span className="relative text-[1.55rem] sm:text-3xl">🎉</span>
          </div>
          <span className="absolute -right-2 top-2 h-3 w-3 rounded-full bg-amber-300/90 shadow-sm" />
          <span className="absolute -bottom-1 left-3 h-2.5 w-2.5 rounded-full bg-rose-300/80 shadow-sm" />
        </div>

        <div className="min-w-0 flex-1 space-y-2 pt-0.5 sm:w-auto sm:flex-none sm:space-y-3 sm:pt-0">
          <div className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.28em] ${
            darkMode
              ? 'border-white/10 bg-white/5 text-slate-300'
              : 'border-white/70 bg-white/70 text-slate-600'
          }`}>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Party planning workspace
          </div>
          <div>
            <h1 className={`font-display text-[1.9rem] font-extrabold tracking-tight leading-[1.03] sm:text-5xl ${
              darkMode ? 'text-white' : 'text-slate-950'
            }`}>
              Party Budget Planner
            </h1>
            <p className={`mt-2 max-w-[31ch] text-[0.92rem] leading-relaxed sm:mt-3 sm:max-w-2xl sm:text-base ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Split costs, track people, and keep the output polished enough to share without explaining the math twice.
            </p>
          </div>
        </div>

        <div className="ml-auto hidden sm:block">
          <button
            onClick={toggleDarkMode}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
              darkMode
                ? 'bg-amber-300 text-slate-950 hover:bg-amber-200'
                : 'bg-slate-950 text-amber-300 hover:bg-slate-800'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
