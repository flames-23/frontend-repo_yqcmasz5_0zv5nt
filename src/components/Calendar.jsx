import React, { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Bell, Plus, CheckCircle2, Image as ImageIcon, Calendar as CalendarIcon, Star } from 'lucide-react'

const api = (path) => `${import.meta.env.VITE_BACKEND_URL || ''}${path}`

function dayKey(date) {
  return date.toISOString().slice(0, 10)
}

export default function Calendar() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [notes, setNotes] = useState({})
  const [todos, setTodos] = useState({})

  const firstDay = useMemo(() => new Date(year, month, 1), [year, month])
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month])
  const startWeekday = firstDay.getDay() // 0 Sun - 6 Sat

  const fetchForMonth = async () => {
    const promises = []
    const days = []
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      const key = dayKey(date)
      days.push(key)
    }
    const queries = days.map(k => fetch(api(`/notes?date=${k}`)).then(r=>r.json()).then(arr=>[k, arr]))
    const tqueries = days.map(k => fetch(api(`/todos?date=${k}`)).then(r=>r.json()).then(arr=>[k, arr]))
    const [notePairs, todoPairs] = await Promise.all([
      Promise.all(queries),
      Promise.all(tqueries)
    ])
    const nObj = {}
    notePairs.forEach(([k, arr]) => nObj[k] = arr)
    const tObj = {}
    todoPairs.forEach(([k, arr]) => tObj[k] = arr)
    setNotes(nObj); setTodos(tObj)
  }

  useEffect(() => { fetchForMonth() }, [month, year])

  const addNote = async (dateStr, title, content) => {
    if (!title) return
    await fetch(api('/notes'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ date: dateStr, title, content }) })
    fetchForMonth()
  }
  const addTodo = async (dateStr, text) => {
    if (!text) return
    await fetch(api('/todos'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ date: dateStr, text, done:false }) })
    fetchForMonth()
  }

  const weeks = []
  let cur = 0 - startWeekday
  while (cur < daysInMonth) {
    const row = []
    for (let i = 0; i < 7; i++) {
      const dayNum = cur + 1
      if (dayNum > 0 && dayNum <= daysInMonth) {
        const d = new Date(year, month, dayNum)
        const key = dayKey(d)
        row.push({ dayNum, key, today: key === dayKey(now) })
      } else {
        row.push(null)
      }
      cur++
    }
    weeks.push(row)
  }

  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  const weekdays = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white" onClick={()=> setMonth(m=> m===0?11:(m-1)) || (m===0 && setYear(y=>y-1))}>
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="text-white text-2xl font-semibold tracking-wide flex items-center gap-2 justify-center"><CalendarIcon size={22}/>{months[month]} {year}</div>
          <div className="text-indigo-200 text-sm">Catatan tanggal dan daftar tugas harian</div>
        </div>
        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white" onClick={()=> setMonth(m=> m===11?0:(m+1)) || (m===11 && setYear(y=>y+1))}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-indigo-200 text-xs mb-2">
        {weekdays.map(w => <div key={w} className="text-center uppercase tracking-wider">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weeks.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((cell, j) => cell ? (
              <DayCell key={`${i}-${j}`} cell={cell} notes={notes[cell.key]||[]} todos={todos[cell.key]||[]} onAddNote={addNote} onAddTodo={addTodo} />
            ) : (
              <div key={`${i}-${j}`} className="h-28 rounded-xl border border-white/10 bg-white/5" />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function DayCell({ cell, notes, todos, onAddNote, onAddTodo }){
  const [noteText, setNoteText] = useState('')
  const [todoText, setTodoText] = useState('')

  return (
    <div className={`h-28 rounded-xl border relative overflow-hidden ${cell.today? 'border-pink-400/50 bg-pink-500/10':'border-white/10 bg-white/5'} backdrop-blur-sm p-2 text-white`}> 
      <div className="flex items-center justify-between">
        <div className={`text-sm font-semibold ${cell.today?'text-pink-200':'text-indigo-200'}`}>{cell.dayNum}</div>
        <div className="flex gap-1">
          <span className="text-[10px] text-indigo-300/80">{notes.length} catatan</span>
          <span className="text-[10px] text-indigo-300/80">{todos.length} tugas</span>
        </div>
      </div>

      <div className="mt-1 space-y-1 max-h-14 overflow-y-auto pr-1">
        {notes.map(n => (
          <div key={n.id} className="text-[10px] bg-indigo-600/30 rounded px-1 py-0.5 truncate">{n.title}</div>
        ))}
        {todos.map(t => (
          <div key={t.id} className="text-[10px] bg-sky-600/30 rounded px-1 py-0.5 truncate flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-300"/>
            <span className="truncate">{t.text}</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-2 bottom-2 flex gap-1">
        <input value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="+ catatan" className="w-1/2 bg-white/10 text-[10px] px-2 py-1 rounded outline-none placeholder:text-indigo-200/60" />
        <input value={todoText} onChange={e=>setTodoText(e.target.value)} placeholder="+ tugas" className="w-1/2 bg-white/10 text-[10px] px-2 py-1 rounded outline-none placeholder:text-indigo-200/60" />
        <button onClick={()=>{ onAddNote(cell.key, noteText); setNoteText('') }} className="px-2 rounded bg-indigo-500/40 hover:bg-indigo-500/60 text-white text-[10px]">Note</button>
        <button onClick={()=>{ onAddTodo(cell.key, todoText); setTodoText('') }} className="px-2 rounded bg-sky-500/40 hover:bg-sky-500/60 text-white text-[10px]">Todo</button>
      </div>
    </div>
  )
}
