import React, { useEffect, useState } from 'react'
import { Bell, Plus } from 'lucide-react'

const api = (path) => `${import.meta.env.VITE_BACKEND_URL || ''}${path}`

export default function Reminders(){
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [datetime, setDatetime] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await fetch(api('/reminders'))
    const data = await res.json()
    setItems(data)
  }
  useEffect(()=>{ load() },[])

  const add = async () => {
    if(!title || !datetime) return
    await fetch(api('/reminders'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, datetime_iso: datetime, message }) })
    setTitle(''); setDatetime(''); setMessage('')
    load()
  }

  return (
    <div className="text-white">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="text-pink-300"/>
        <div className="font-semibold">Pengingat</div>
      </div>
      <div className="flex gap-2 mb-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul" className="bg-white/10 rounded px-2 py-1"/>
        <input value={datetime} onChange={e=>setDatetime(e.target.value)} type="datetime-local" className="bg-white/10 rounded px-2 py-1"/>
        <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Pesan" className="bg-white/10 rounded px-2 py-1 flex-1"/>
        <button onClick={add} className="px-3 py-1 rounded bg-pink-600/70 hover:bg-pink-600 flex items-center gap-1"><Plus size={16}/> Tambah</button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {items.map(it => (
          <div key={it.id} className="bg-white/5 rounded p-2 border border-white/10 flex items-center gap-3">
            <div className="text-sm font-semibold">{it.title}</div>
            <div className="text-indigo-200/90 text-sm">{new Date(it.datetime_iso).toLocaleString()}</div>
            <div className="ml-auto text-indigo-300/90 text-sm">{it.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
