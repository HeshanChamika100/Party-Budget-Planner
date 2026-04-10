import React, { useState, useEffect } from 'react'

const Footer = ({ darkMode = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

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
    <footer className="mt-8 pb-4 sm:mt-12">
      <div className={`grid gap-4 lg:grid-cols-[1.4fr_1fr] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className={`rounded-[1.75rem] border p-5 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl ${
          darkMode ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/70'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Planning note
              </p>
              <p className={`mt-2 max-w-xl text-sm leading-relaxed sm:text-base ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {partyTips[currentTip]}
              </p>
            </div>
            <div className={`hidden rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] sm:block ${
              darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className={`rounded-[1.75rem] border p-5 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl ${
          darkMode ? 'border-white/10 bg-slate-950/65' : 'border-white/70 bg-white/70'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Built by
              </p>
              <p className={`mt-2 font-display text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                Heshan Chamika
              </p>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Full stack developer
              </p>
            </div>

            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition-all duration-200 hover:-translate-y-0.5 ${
                    darkMode
                      ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  title={link.label}
                >
                  <span>{link.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={`mt-5 grid grid-cols-2 gap-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <div className={`rounded-2xl border px-3 py-2 ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-400">Time</span>
              <span className="mt-1 block font-mono text-sm">{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className={`rounded-2xl border px-3 py-2 ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-400">Date</span>
              <span className="mt-1 block font-mono text-sm">{currentTime.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-4 text-center text-xs uppercase tracking-[0.24em] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
        Party Budget Planner · {new Date().getFullYear()}
      </div>
    </footer>
  )
}

export default Footer