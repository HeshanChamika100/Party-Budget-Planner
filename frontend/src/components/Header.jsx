import React from 'react';

function Header({ darkMode, toggleDarkMode, isMobileMenuOpen, setIsMobileMenuOpen, hasUnsavedChanges }) {
  return (
    <div className={`text-center mb-6 sm:mb-10 relative ${
      hasUnsavedChanges ? 'mt-24 sm:mt-20' : ''
    }`}>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`mobile-menu-container absolute -top-10 right-2 p-2 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 block sm:hidden z-10 ${
          darkMode 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        title="Menu"
      >
        <span className="text-lg">
          {isMobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Desktop Dark Mode Toggle - Only visible on desktop */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-0 right-0 p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 hidden sm:block z-10 ${
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`mobile-menu-container fixed top-0 right-0 w-80 h-screen z-50 shadow-2xl sm:hidden transform transition-all duration-300 ease-in-out animate-slide-in-right ${
          darkMode 
            ? 'bg-gray-900/95 backdrop-blur-sm' 
            : 'bg-white/95 backdrop-blur-sm'
        }`}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className={`p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Menu
                </h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
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
                  className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
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
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <p className={`text-sm text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Party Budget Planner
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 mt-12 sm:mt-0 px-4 sm:px-0 space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Custom Logo */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="relative">
                <span className="text-3xl sm:text-4xl lg:text-5xl animate-bounce">🎉</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          {/* Logo sparkles */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute -bottom-1 -right-3 w-3 h-3 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1 -right-4 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-80"></div>
        </div>
        
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl animate-pulse text-center sm:text-left">
          Party Budget Planner
        </h1>
      </div>
      <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium drop-shadow-lg px-4">
        Plan your perfect party within budget!
      </p>
    </div>
  );
}

export default Header;
