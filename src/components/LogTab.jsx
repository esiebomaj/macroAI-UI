import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const S = {
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 16px', marginBottom: '1rem' },
  metric: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 10px' },
  label: { fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 },
  val: { fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 500 },
  sub: { fontSize: 10, color: '#666', marginTop: 3, fontFamily: 'DM Mono, monospace' },
  barTrack: { background: '#2a2a2a', borderRadius: 2, height: 4 },
  mealHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#161616', border: '1px solid #2a2a2a', borderRadius: '8px 8px 0 0', borderBottom: 'none', gap: 8 },
  foodItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#161616', border: '1px solid #2a2a2a', borderTop: 'none', gap: 10 },
}

export default function LogTab({ goals, todayLog, library, addLogEntry, removeLogEntry }) {
  const isMobile = useIsMobile()
  const metricGrid = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: 8,
    marginBottom: '1rem',
  }
  const [meal, setMeal] = useState('Lunch')
  const [selectedFood, setSelectedFood] = useState('')
  const [qty, setQty] = useState(1)
  const [fields, setFields] = useState({ cal: '', pro: '', carb: '', fat: '', name: '' })
  const [adding, setAdding] = useState(false)

  const tot = todayLog.reduce((a, e) => ({
    cal: a.cal + e.cal, pro: a.pro + e.pro, carb: a.carb + e.carb, fat: a.fat + e.fat
  }), { cal: 0, pro: 0, carb: 0, fat: 0 })

  const pct = Math.min(Math.round(tot.cal / goals.cal * 100), 100)
  const over = tot.cal > goals.cal
  const left = goals.cal - Math.round(tot.cal)

  function pickFood(i) {
    setSelectedFood(i)
    if (i === '') return
    const f = library[i]
    setFields({ cal: f.cal, pro: f.pro, carb: f.carb, fat: f.fat, name: '' })
    setQty(1)
  }

  async function handleAdd() {
    const q = parseFloat(qty) || 1
    const cal = parseFloat(fields.cal) || 0
    const pro = parseFloat(fields.pro) || 0
    const carb = parseFloat(fields.carb) || 0
    const fat = parseFloat(fields.fat) || 0
    if (!cal && !pro && !carb && !fat) return
    const name = fields.name || (selectedFood !== '' ? library[selectedFood].name : 'Custom food')
    setAdding(true)
    await addLogEntry({ name, meal, cal: Math.round(cal*q), pro: Math.round(pro*q*10)/10, carb: Math.round(carb*q*10)/10, fat: Math.round(fat*q*10)/10, qty: q })
    setAdding(false)
    setFields({ cal: '', pro: '', carb: '', fat: '', name: '' })
    setQty(1); setSelectedFood('')
  }

  const meals = ['Breakfast','Lunch','Dinner','Snack']

  return (
    <div>
      {/* Metrics */}
      <div style={metricGrid}>
        {[
          { label: 'Calories', val: Math.round(tot.cal), sub: `/ ${goals.cal}`, over: over },
          { label: 'Protein', val: Math.round(tot.pro)+'g', sub: `/ ${goals.pro}g`, over: tot.pro > goals.pro },
          { label: 'Carbs', val: Math.round(tot.carb)+'g', sub: `/ ${goals.carb}g` },
          { label: 'Fat', val: Math.round(tot.fat)+'g', sub: `/ ${goals.fat}g` },
        ].map(m => (
          <div key={m.label} style={S.metric}>
            <div style={S.label}>{m.label}</div>
            <div style={{ ...S.val, color: m.over ? '#ff5f5f' : 'white' }}>{m.val}</div>
            <div style={S.sub}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ ...S.card, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 8 }}>
          <span>Daily calories</span>
          <span style={{ fontFamily: 'DM Mono, monospace' }}>
            {Math.round(tot.cal)} / {goals.cal} {over ? `(${Math.abs(left)} over)` : 'kcal'}
          </span>
        </div>
        <div style={S.barTrack}>
          <div style={{ height: 4, borderRadius: 2, width: pct+'%', background: over ? '#ff5f5f' : '#c8f066', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Add food */}
      <div style={S.card}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: 10 }}>Add food</div>
        <select value={meal} onChange={e => setMeal(e.target.value)} style={{ marginBottom: 8 }}>
          {meals.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={selectedFood} onChange={e => pickFood(e.target.value)} style={{ marginBottom: 8 }}>
          <option value="">-- pick from library --</option>
          {library.map((f, i) => <option key={f.id} value={i}>{f.name} ({f.unit})</option>)}
        </select>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input type="number" placeholder="Qty" min="1" value={qty} onChange={e => setQty(e.target.value)} />
          <input type="number" placeholder="kcal" value={fields.cal} onChange={e => setFields(p => ({...p, cal:e.target.value}))} />
          <input type="number" placeholder="Protein g" value={fields.pro} onChange={e => setFields(p => ({...p, pro:e.target.value}))} />
          <input type="number" placeholder="Carbs g" value={fields.carb} onChange={e => setFields(p => ({...p, carb:e.target.value}))} />
          <input type="number" placeholder="Fat g" value={fields.fat} onChange={e => setFields(p => ({...p, fat:e.target.value}))} />
          <input type="text" placeholder="Food name" value={fields.name} onChange={e => setFields(p => ({...p, name:e.target.value}))} />
        </div>
        <button onClick={handleAdd} disabled={adding} style={{ width: '100%', padding: 10, background: '#c8f066', color: '#0e0e0e', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: adding ? 'not-allowed' : 'pointer', marginTop: 8, opacity: adding ? 0.6 : 1, fontFamily: 'DM Sans, sans-serif' }}>
          {adding ? 'Adding...' : 'Add to log'}
        </button>
      </div>

      {/* Log entries */}
      {meals.map(m => {
        const entries = todayLog.filter(e => e.meal === m)
        if (!entries.length) return null
        const mTot = entries.reduce((a,e) => ({cal:a.cal+e.cal, pro:a.pro+e.pro}), {cal:0,pro:0})
        return (
          <div key={m} style={{ marginBottom: '1rem' }}>
            <div style={S.mealHeader}>
              <span style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666' }}>{m}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#c8f066' }}>{Math.round(mTot.cal)} kcal · {Math.round(mTot.pro)}g P</span>
            </div>
            {entries.map((e, i) => (
              <div key={e.id} style={{ ...S.foodItem, borderRadius: i === entries.length-1 ? '0 0 8px 8px' : 0 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, overflowWrap: 'anywhere' }}>{e.qty > 1 ? `${e.qty}× ` : ''}{e.name}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2, fontFamily: 'DM Mono, monospace' }}>P:{e.pro}g C:{e.carb}g F:{e.fat}g</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{Math.round(e.cal)}</span>
                  <button onClick={() => removeLogEntry(e.id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '4px 6px' }} onMouseOver={e => e.target.style.color='#ff5f5f'} onMouseOut={e => e.target.style.color='#666'}>×</button>
                </div>
              </div>
            ))}
          </div>
        )
      })}

      {!todayLog.length && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666', fontSize: 13 }}>
          Nothing logged yet today.<br />Add food above or ask the AI assistant.
        </div>
      )}
    </div>
  )
}
