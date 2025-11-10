import React, { useEffect, useState } from 'react'
import { ImagePlus } from 'lucide-react'

const api = (path) => `${import.meta.env.VITE_BACKEND_URL || ''}${path}`

export default function Photos(){
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [file, setFile] = useState(null)

  const load = async () => {
    const res = await fetch(api('/photos'))
    const data = await res.json()
    setItems(data)
  }
  useEffect(()=>{ load() },[])

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const add = async () => {
    if(!file) return
    const src = await toBase64(file)
    await fetch(api('/photos'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, src, date }) })
    setTitle(''); setDate(''); setFile(null)
    load()
  }

  return (
    <div className="text-white">
      <div className="flex gap-2 mb-3 items-center">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul" className="bg-white/10 rounded px-2 py-1"/>
        <input value={date} onChange={e=>setDate(e.target.value)} placeholder="Tanggal (YYYY-MM-DD)" className="bg-white/10 rounded px-2 py-1"/>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} className="text-indigo-200"/>
        <button onClick={add} className="px-3 py-1 rounded bg-indigo-600/70 hover:bg-indigo-600 flex items-center gap-1"><ImagePlus size={16}/> Tambah</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it)=> (
          <div key={it.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <img src={it.src} alt={it.title} className="w-full h-32 object-cover"/>
            <div className="p-2 text-sm">
              <div className="font-semibold">{it.title}</div>
              <div className="text-indigo-300/80">{it.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
