import React, { useState, useEffect } from 'react'

const Footer = ({ darkMode = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [partyEmojis] = useState(['🎉', '🎊', '🎈', '🎂', '🥳', '🎁', '🎭', '🎪', '🎨', '🎵', '💃', '🕺'])
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const emojiTimer = setInterval(() => {
      setCurrentEmojiIndex((prev) => (prev + 1) % partyEmojis.length)
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(emojiTimer)
    }
  }, [partyEmojis.length])

  const socialLinks = [
    { icon: '💼', label: 'LinkedIn', url: '#' },
    { icon: '🐙', label: 'GitHub', url: 'https://github.com/HeshanChamika100/' },
    { icon: '📧', label: 'Email', url: 'mailto:heshanchamika100@gmail.com' },
    { icon: '📞', label: 'Whatsapp', url: 'https://wa.me/94723141125' }
  ]

  const partyTips = [
    "💡 Pro tip: Always add 10% extra to your budget for unexpected expenses!",
    "🎯 Remember: The best parties are about the people, not the price!",
    "📝 Keep track of dietary restrictions when planning your menu!",
    "🎪 Don't forget to plan some fun activities and games!",
    "🎵 Great music can make any party unforgettable!"
  ]

  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % partyTips.length)
    }, 5000)

    return () => clearInterval(tipTimer)
  }, [partyTips.length])

  return (
    <footer className="mt-8 sm:mt-12">
      {/* Animated Divider */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="mx-4 text-2xl animate-bounce">
          {partyEmojis[currentEmojiIndex]}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Party Tips Section */}
      <div className={`backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 border transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-600/30' 
          : 'bg-white/10 border-white/20'
      }`}>
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center justify-center">
            <span className="mr-2 text-2xl animate-pulse">💡</span>
            Party Planning Tips
          </h3>
          <div className="relative h-12 sm:h-16 flex items-center justify-center">
            <p 
              key={currentTip}
              className="text-white/90 text-sm sm:text-base font-medium px-4 animate-slideIn text-center leading-relaxed"
            >
              {partyTips[currentTip]}
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          {/* Left Section - Branding */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center md:justify-start">
              <span className="mr-2 text-2xl animate-sparkle">🎉</span>
              Party Planner
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Making your celebrations memorable, one budget at a time!
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-white/70">
              <span className="text-sm">Built with</span>
              <span className="text-red-400 animate-pulse">❤️</span>
              <span className="text-sm">& lots of</span>
              <span className="text-yellow-400 animate-bounce">☕</span>
            </div>
          </div>

          {/* Center Section - Developer Info */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 shadow-lg">
                <span className="text-2xl font-bold text-white">H</span>
              </div>
              <h4 className="text-lg font-bold text-white">Developed by Heshan</h4>
              <p className="text-white/70 text-sm">Full Stack Developer</p>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="group relative"
                  title={link.label}
                >
                  <div className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-12">
                    <span className="text-lg">{link.icon}</span>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {link.label}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Section - Stats & Time */}
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-bold text-white mb-3">✨ Live Stats</h4>
              <div className="space-y-2">
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-xs text-white/70">Current Time</p>
                  <p className="text-sm font-mono text-white">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-xs text-white/70">Today's Date</p>
                  <p className="text-sm font-mono text-white">
                    {currentTime.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <span>©</span>
              <span>{new Date().getFullYear()}</span>
              <span>Party Budget Planner</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">All rights reserved</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <button className="text-white/70 hover:text-white transition-colors duration-200 flex items-center space-x-1">
                <span>🌟</span>
                <span>Rate this app</span>
              </button>
              <button className="text-white/70 hover:text-white transition-colors duration-200 flex items-center space-x-1">
                <span>💬</span>
                <span>Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Celebration Message */}
      <div className="text-center mt-6 px-4">
        <p className="text-white/90 text-base sm:text-lg font-medium animate-pulse">
          🎊 Happy Planning! Make your party memorable! 🎊
        </p>
        <div className="mt-3 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i}
              className="text-yellow-400 animate-bounce text-sm"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer