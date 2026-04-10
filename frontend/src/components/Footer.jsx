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
    <footer className="mt-6 pb-2 sm:mt-10">
      <div className={`grid items-start gap-3 lg:auto-rows-fr lg:grid-cols-[1.35fr_1fr] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className={`flex h-full flex-col rounded-[1.75rem] border p-4 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-5 ${
          darkMode ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/70'
        }`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Planning note
            </p>
            <div className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] ${
              darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              {currentTime.toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3 py-1">
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
              darkMode ? 'bg-cyan-400/10 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
            }`}>
              💡
            </div>
            <div className="min-w-0">
              <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Tip of the moment
              </p>
              <p className={`mt-1.5 max-w-xl text-sm leading-relaxed sm:text-base ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {partyTips[currentTip]}
              </p>
            </div>
          </div>

          <div className="mt-2 flex gap-2">
            {partyTips.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentTip
                    ? (darkMode ? 'w-8 bg-cyan-300' : 'w-8 bg-cyan-600')
                    : (darkMode ? 'w-3 bg-white/15' : 'w-3 bg-slate-300')
                }`}
              />
            ))}
          </div>
        </div>

        <div className={`h-full rounded-[1.75rem] border p-4 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-5 ${
          darkMode ? 'border-white/10 bg-slate-950/65' : 'border-white/70 bg-white/70'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Built by
              </p>
              <p className={`mt-1.5 font-display text-[1.9rem] font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                Heshan Chamika
              </p>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Full stack developer
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className={`group relative flex h-10 w-10 items-center justify-center rounded-2xl border text-base transition-all duration-200 hover:-translate-y-0.5 ${
                    darkMode
                      ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  title={link.label}
                >
                  <span>{link.icon}</span>
                  <span className={`pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100 ${
                    darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-900 text-white'
                  }`}>
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className={`mt-4 grid grid-cols-2 gap-2.5 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
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

      <div className={`mt-3 text-center text-xs uppercase tracking-[0.24em] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
        Party Budget Planner · {new Date().getFullYear()}
      </div>
    </footer>
  )
}

export default Footer