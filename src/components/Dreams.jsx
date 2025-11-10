import React, { useEffect, useState } from 'react'
import { Sparkles, Plus } from 'lucide-react'

const api = (path) => `${import.meta.env.VITE_BACKEND_URL || ''}${path}`

export default function Dreams(){
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)

  const load = async () => {
    const res = await fetch(api('/dreams'))
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
    let image = null
    if(file) image = await toBase64(file)
    await fetch(api('/dreams'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, description, image, achieved:false }) })
    setTitle(''); setDescription(''); setFile(null)
    load()
  }

  return (
    <div className="text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-yellow-300" />
        <div className="text-xl font-semibold">Dreams comes true</div>
      </div>

      <div className="flex gap-2 mb-3 items-center">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul impian" className="bg-white/10 rounded px-2 py-1"/>
        <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Deskripsi singkat" className="bg-white/10 rounded px-2 py-1 flex-1"/>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} className="text-indigo-200"/>
        <button onClick={add} className="px-3 py-1 rounded bg-indigo-600/70 hover:bg-indigo-600 flex items-center gap-1"><Plus size={16}/> Tambah</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it)=> (
          <div key={it.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            {it.image && <img src={it.image} alt={it.title} className="w-full h-36 object-cover"/>}
            <div className="p-3">
              <div className="font-semibold text-lg flex items-center gap-2">
                <span>{it.title}</span>
                {it.achieved && <span className="text-emerald-300 text-xs">tercapai</span>}
              </div>
              <div className="text-indigo-200/90 text-sm">{it.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
