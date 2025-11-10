import React from 'react'
import GalaxyBackground from './components/GalaxyBackground'
import Calendar from './components/Calendar'
import Finance from './components/Finance'
import Photos from './components/Photos'
import Dreams from './components/Dreams'
import Reminders from './components/Reminders'
import { Calendar as CalendarIcon, Wallet, Image as ImageIcon, CheckCircle2, Bell, Star } from 'lucide-react'

function Section({ title, icon, children }){
  const Icon = icon
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 text-white">
        <Icon className="text-indigo-300" />
        <div className="text-lg font-semibold">{title}</div>
      </div>
      {children}
    </div>
  )
}

export default function App(){
  return (
    <GalaxyBackground>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <header className="text-center text-white">
          <div className="text-3xl md:text-4xl font-bold tracking-tight">Galaxy Planner</div>
          <div className="text-indigo-200">Kalender, catatan, to-do, keuangan, foto, dan impian dalam satu tempat.</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Kalender & Harian" icon={CalendarIcon}>
              <Calendar />
            </Section>
            <Section title="Dreams comes true" icon={Star}>
              <Dreams />
            </Section>
          </div>
          <div className="space-y-6">
            <Section title="Pengingat" icon={Bell}>
              <Reminders />
            </Section>
            <Section title="Keuangan" icon={Wallet}>
              <Finance />
            </Section>
            <Section title="Galeri Foto" icon={ImageIcon}>
              <Photos />
            </Section>
          </div>
        </div>

        <footer className="text-center text-indigo-300 text-sm">Warna galaksi dengan bintang-bintang kecil agar tidak monoton ✨</footer>
      </div>
    </GalaxyBackground>
  )
}
