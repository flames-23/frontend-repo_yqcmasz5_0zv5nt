import React from 'react'

const Star = ({ style }) => (
  <span
    className="absolute rounded-full bg-white/70"
    style={{ width: 2, height: 2, ...style }}
  />
)

export default function GalaxyBackground({ children }) {
  // Generate small twinkling dots
  const stars = Array.from({ length: 120 }, (_, i) => (
    <Star key={i} style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.8 + 0.2,
      boxShadow: '0 0 6px rgba(255,255,255,0.6)'
    }} />
  ))

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 opacity-40" style={{
        background: 'radial-gradient(600px 300px at 20% 10%, rgba(99,102,241,0.25), transparent 60%),\nradial-gradient(400px 260px at 80% 20%, rgba(236,72,153,0.25), transparent 60%),\nradial-gradient(500px 260px at 60% 80%, rgba(59,130,246,0.25), transparent 60%)'
      }} />
      <div className="absolute inset-0">
        {stars}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
