import { useState, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import MacroCalculatorModal from './MacroCalculatorModal'

export default function GoalsTab({ goals, saveGoals, calculateMacros }) {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ cal: '', pro: '', carb: '', fat: '', weight: '', goal_weight: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)

  useEffect(() => {
    setForm({
      cal: goals.cal, pro: goals.pro, carb: goals.carb, fat: goals.fat,
      weight: goals.weight || '', goal_weight: goals.goal_weight || '',
    })
  }, [goals])

  async function handleSave() {
    setSaving(true)
    // Preserve any stored profile fields so a manual edit doesn't wipe them.
    await saveGoals({
      cal: +form.cal, pro: +form.pro, carb: +form.carb, fat: +form.fat,
      weight: +form.weight || null, goal_weight: +form.goal_weight || null,
      age: goals.age ?? null, height_cm: goals.height_cm ?? null,
      sex: goals.sex ?? null, activity_level: goals.activity_level ?? null,
      target_date: goals.target_date ?? null,
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }
  const fieldLabel = { fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }
  const card = { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 16px', marginBottom: '1rem' }

  const diff = form.weight && form.goal_weight ? (parseFloat(form.weight) - parseFloat(form.goal_weight)).toFixed(1) : null

  const lastCalcLabel = goals.target_date && goals.age
    ? `Last updated on ${goals.target_date}`
    : 'Set your body profile and let us do the math'

  return (
    <div>
      {/* Standout calculator trigger */}
      <button
        onClick={() => setCalcOpen(true)}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'linear-gradient(180deg, #1c2210 0%, #171a12 100%)',
          border: '1px solid #8aaa3a', borderRadius: 10, padding: '14px 16px',
          marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#c8f066' }}>✦ Help me calculate my targets</div>
          <div style={{ fontSize: 11, color: '#8a9a6a', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lastCalcLabel}</div>
        </div>
        <span style={{ fontSize: 18, color: '#c8f066', flexShrink: 0 }}>→</span>
      </button>

      <div style={card}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: 12 }}>Daily targets</div>
        <div style={grid2}>
          <div><div style={fieldLabel}>Calories (kcal)</div><input type="number" value={form.cal} onChange={e => setForm(p=>({...p,cal:e.target.value}))} /></div>
          <div><div style={fieldLabel}>Protein (g)</div><input type="number" value={form.pro} onChange={e => setForm(p=>({...p,pro:e.target.value}))} /></div>
          <div><div style={fieldLabel}>Carbs (g)</div><input type="number" value={form.carb} onChange={e => setForm(p=>({...p,carb:e.target.value}))} /></div>
          <div><div style={fieldLabel}>Fat (g)</div><input type="number" value={form.fat} onChange={e => setForm(p=>({...p,fat:e.target.value}))} /></div>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: 12 }}>Personal info</div>
          <div style={grid2}>
            <div><div style={fieldLabel}>Current weight (kg)</div><input type="number" value={form.weight} onChange={e => setForm(p=>({...p,weight:e.target.value}))} /></div>
            <div><div style={fieldLabel}>Goal weight (kg)</div><input type="number" value={form.goal_weight} onChange={e => setForm(p=>({...p,goal_weight:e.target.value}))} /></div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ width:'100%', padding:10, background:'#c8f066', color:'#0e0e0e', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', marginTop:10, fontFamily:'DM Sans, sans-serif', opacity:saving?0.6:1 }}>
          {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save goals'}
        </button>
      </div>

      {/* Summary */}
      <div style={card}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: 12 }}>Current goals</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4,1fr)', gap: 8, marginBottom: diff ? 12 : 0 }}>
          {[
            { label: 'Calories', val: goals.cal, sub: 'kcal/day' },
            { label: 'Protein', val: goals.pro+'g', sub: 'per day' },
            { label: 'Carbs', val: goals.carb+'g', sub: 'per day' },
            { label: 'Fat', val: goals.fat+'g', sub: 'per day' },
          ].map(m => (
            <div key={m.label} style={{ background: '#1f1f1f', borderRadius: 8, padding: '10px' }}>
              <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 500 }}>{m.val}</div>
              <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
        {diff && (
          <div style={{ fontSize: 13, color: '#666', paddingTop: 12, borderTop: '1px solid #2a2a2a' }}>
            Target: lose <span style={{ color: '#c8f066', fontFamily: 'DM Mono, monospace' }}>{diff}kg</span>
            {' '}· Current: <span style={{ fontFamily: 'DM Mono, monospace' }}>{form.weight}kg</span>
            {' '}→ Goal: <span style={{ fontFamily: 'DM Mono, monospace' }}>{form.goal_weight}kg</span>
          </div>
        )}
      </div>

      {calcOpen && (
        <MacroCalculatorModal
          goals={goals}
          calculateMacros={calculateMacros}
          saveGoals={saveGoals}
          onClose={() => setCalcOpen(false)}
        />
      )}
    </div>
  )
}
