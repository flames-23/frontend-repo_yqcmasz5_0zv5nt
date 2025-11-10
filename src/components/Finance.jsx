import React, { useEffect, useState, useMemo } from 'react'
import { ArrowDownCircle, ArrowUpCircle, Plus } from 'lucide-react'

const api = (path) => `${import.meta.env.VITE_BACKEND_URL || ''}${path}`

export default function Finance(){
  const [records, setRecords] = useState([])
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')

  const load = async () => {
    const res = await fetch(api('/finance'))
    const data = await res.json()
    setRecords(data)
  }

  useEffect(()=>{ load() },[])

  const add = async () => {
    if(!amount) return
    const today = new Date().toISOString().slice(0,10)
    await fetch(api('/finance'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ date: today, type, amount: parseFloat(amount), category, note }) })
    setAmount(''); setCategory(''); setNote('')
    load()
  }

  const totals = useMemo(()=>{
    let income = 0, expense = 0
    records.forEach(r=>{ if(r.type==='income') income += r.amount; else expense += r.amount })
    return { income, expense, balance: income - expense }
  },[records])

  return (
    <div className="text-white">
      <div className="flex items-center gap-3 mb-4">
        <ArrowUpCircle className="text-emerald-300"/> <span className="text-emerald-200">Pemasukan: {totals.income.toLocaleString()}</span>
        <ArrowDownCircle className="text-rose-300"/> <span className="text-rose-200">Pengeluaran: {totals.expense.toLocaleString()}</span>
        <span className="ml-auto px-3 py-1 rounded bg-white/10">Saldo: {totals.balance.toLocaleString()}</span>
      </div>
      <div className="flex gap-2 mb-3">
        <select value={type} onChange={e=>setType(e.target.value)} className="bg-white/10 rounded px-2 py-1">
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>
        <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="Jumlah" className="bg-white/10 rounded px-2 py-1"/>
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Kategori" className="bg-white/10 rounded px-2 py-1"/>
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Catatan" className="bg-white/10 rounded px-2 py-1 flex-1"/>
        <button onClick={add} className="px-3 py-1 rounded bg-indigo-600/70 hover:bg-indigo-600 flex items-center gap-1"><Plus size={16}/> Tambah</button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
        {records.map((r)=> (
          <div key={r.id} className="flex items-center gap-3 bg-white/5 rounded p-2">
            <span className={`px-2 py-0.5 rounded text-xs ${r.type==='income'?'bg-emerald-600/40':'bg-rose-600/40'}`}>{r.type}</span>
            <span className="font-semibold">{r.amount.toLocaleString()}</span>
            <span className="text-indigo-200/80">{r.category}</span>
            <span className="text-indigo-200/80">{r.date}</span>
            <span className="ml-auto text-indigo-300/80">{r.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
