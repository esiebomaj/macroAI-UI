import { useState, useMemo } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary — little/no exercise' },
  { value: 'light', label: 'Light — 1-3 days/week' },
  { value: 'moderate', label: 'Moderate — 3-5 days/week' },
  { value: 'active', label: 'Active — 6-7 days/week' },
  { value: 'very_active', label: 'Very active — hard daily training' },
]

const METRIC_INFO = {
  bmr: {
    title: 'Basal Metabolic Rate',
    body: 'Calories your body burns at rest each day, just to stay alive.',
  },
  tdee: {
    title: 'Total Daily Energy Expenditure',
    body: 'Calories you need to maintain your current weight — BMR plus your activity.',
  },
  deficit: {
    title: 'Daily deficit',
    body: 'Calorie deficit needed each day to achieve your target weight.',
  },
  surplus: {
    title: 'Daily surplus',
    body: 'Calories eaten above your TDEE to gain weight by the target date.',
  },
}

// Small round "i" button + expandable explanation for the BMR / TDEE / deficit metrics.
function MetricChips({ result, openInfo, setOpenInfo }) {
  const deltaKey = result.daily_delta > 0 ? 'deficit' : result.daily_delta < 0 ? 'surplus' : null
  const deltaText = result.daily_delta > 0
    ? `\u2212${result.daily_delta} deficit`
    : result.daily_delta < 0
      ? `+${Math.abs(result.daily_delta)} surplus`
      : 'maintenance'

  const chips = [
    { key: 'bmr', label: 'BMR', value: result.bmr },
    { key: 'tdee', label: 'TDEE', value: result.tdee },
    ...(deltaKey ? [{ key: deltaKey, label: deltaText, value: null }] : []),
  ]

  const infoBtn = (active) => ({
    width: 15, height: 15, borderRadius: '50%', flexShrink: 0,
    border: `1px solid ${active ? '#c8f066' : '#555'}`,
    background: active ? '#c8f066' : 'transparent',
    color: active ? '#0e0e0e' : '#888',
    fontSize: 9, fontWeight: 700, fontStyle: 'italic', lineHeight: 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontFamily: 'Georgia, serif', padding: 0,
  })
  const chip = {
    position: 'relative',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 6,
    padding: '5px 8px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa',
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
      {chips.map(c => (
        <span key={c.key} style={chip}>
          {c.value != null ? <><span style={{ color: '#888' }}>{c.label}</span> <span style={{ color: '#e8e8e8' }}>{c.value}</span></> : <span style={{ color: '#e8e8e8' }}>{c.label}</span>}
          <button
            type="button"
            aria-label={`What is ${METRIC_INFO[c.key].title}?`}
            onClick={(e) => { e.stopPropagation(); setOpenInfo(openInfo === c.key ? null : c.key) }}
            style={infoBtn(openInfo === c.key)}
          >
            i
          </button>
          {openInfo === c.key && (
            <div
              role="tooltip"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, zIndex: 10,
                width: 220, maxWidth: '78vw', textAlign: 'left',
                padding: '9px 11px', background: '#0f0f0f',
                border: '1px solid #3a3a3a', borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                fontFamily: 'DM Sans, sans-serif', whiteSpace: 'normal',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#c8f066', marginBottom: 3 }}>{METRIC_INFO[c.key].title}</div>
              <div style={{ fontSize: 11, color: '#bbb', lineHeight: 1.45 }}>{METRIC_INFO[c.key].body}</div>
              {/* arrow */}
              <span style={{ position: 'absolute', top: '100%', left: 14, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #3a3a3a' }} />
              <span style={{ position: 'absolute', top: 'calc(100% - 1px)', left: 14, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #0f0f0f' }} />
            </div>
          )}
        </span>
      ))}
    </div>
  )
}

// Rough client-side pace estimate for the live hint (backend is source of truth on Calculate).
function estimatePace({ weight, goal_weight, target_date }) {
  const w = parseFloat(weight)
  const gw = parseFloat(goal_weight)
  if (!w || !gw || !target_date) return null
  const days = Math.round((new Date(target_date) - new Date()) / 86400000)
  if (days <= 0) return { invalid: true }
  const kg = w - gw
  const kgPerWeek = kg / (days / 7)
  const pct = Math.abs(kgPerWeek) / w * 100
  let status = 'ok'
  if (pct > 1.5) status = 'danger'
  else if (pct > 1.0) status = 'warn'
  return {
    kgPerWeek,
    kgTotal: kg,
    direction: kg > 0 ? 'lose' : kg < 0 ? 'gain' : 'maintain',
    status,
  }
}

export default function MacroCalculatorModal({ goals, onClose, calculateMacros, saveGoals }) {
  const isMobile = useIsMobile()

  const [profile, setProfile] = useState({
    weight: goals.weight || '',
    goal_weight: goals.goal_weight || '',
    target_date: goals.target_date || '',
    age: goals.age || '',
    height_cm: goals.height_cm || '',
    sex: goals.sex || 'male',
    activity_level: goals.activity_level || 'moderate',
  })
  const [result, setResult] = useState(null)      // MacroCalcResponse
  const [targets, setTargets] = useState(null)     // editable { cal, pro, carb, fat }
  const [calculating, setCalculating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [openInfo, setOpenInfo] = useState(null)  // which metric explanation is expanded

  // Changing any profile input invalidates the previously computed targets,
  // so we clear the result and revert the footer back to "Calculate".
  const set = (k, v) => {
    setProfile(p => ({ ...p, [k]: v }))
    setResult(null)
    setTargets(null)
    setError(null)
    setOpenInfo(null)
  }

  const pace = useMemo(() => estimatePace(profile), [profile])

  const canCalculate =
    profile.weight && profile.goal_weight && profile.target_date &&
    profile.age && profile.height_cm && profile.sex && profile.activity_level

  async function handleCalculate() {
    setError(null)
    setCalculating(true)
    try {
      const res = await calculateMacros({
        weight: +profile.weight,
        goal_weight: +profile.goal_weight,
        target_date: profile.target_date,
        activity_level: profile.activity_level,
        age: +profile.age,
        height_cm: +profile.height_cm,
        sex: profile.sex,
      })
      setResult(res)
      setTargets({ cal: res.cal, pro: res.pro, carb: res.carb, fat: res.fat })
    } catch (e) {
      console.error('calculate failed', e)
      setError('Could not calculate. Check your inputs and try again.')
    } finally {
      setCalculating(false)
    }
  }

  async function handleSave() {
    if (!targets) return
    setSaving(true)
    try {
      await saveGoals({
        cal: +targets.cal, pro: +targets.pro, carb: +targets.carb, fat: +targets.fat,
        weight: +profile.weight || null,
        goal_weight: +profile.goal_weight || null,
        age: +profile.age || null,
        height_cm: +profile.height_cm || null,
        sex: profile.sex || null,
        activity_level: profile.activity_level || null,
        target_date: profile.target_date || null,
      })
      onClose()
    } catch (e) {
      console.error('save failed', e)
      setError('Could not save your goals. Please try again.')
      setSaving(false)
    }
  }

  // --- styles (match the app: #161616 cards, #2a2a2a borders, lime #c8f066) ---
  const overlay = {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: isMobile ? 'stretch' : 'center',
    justifyContent: 'center',
    padding: isMobile ? 0 : 16,
  }
  const panel = {
    background: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: isMobile ? 0 : 14,
    width: isMobile ? '100%' : 460,
    maxWidth: '100%',
    maxHeight: isMobile ? '100dvh' : '90vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
  }
  const header = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 18px', borderBottom: '1px solid #2a2a2a', flexShrink: 0,
  }
  const body = { padding: '16px 18px', overflowY: 'auto', flex: 1, minHeight: 0 }
  const footer = {
    padding: '14px 18px', borderTop: '1px solid #2a2a2a', flexShrink: 0,
    display: 'flex', gap: 8,
    paddingBottom: isMobile ? 'calc(14px + env(safe-area-inset-bottom))' : 14,
  }
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }
  const fieldLabel = { fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }
  const sectionLabel = { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: 12 }
  const closeBtn = { background: 'none', border: '1px solid #2a2a2a', borderRadius: 5, padding: '4px 10px', fontSize: 11, cursor: 'pointer', color: '#666', fontFamily: 'DM Sans, sans-serif' }
  const primaryBtn = (disabled) => ({ flex: 1, padding: 11, background: '#c8f066', color: '#0e0e0e', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: disabled ? 0.6 : 1 })
  const secondaryBtn = { flex: 1, padding: 11, background: 'none', color: '#c8f066', border: '1px solid #8aaa3a', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }

  const paceColor = pace?.invalid || pace?.status === 'danger' ? '#ff5f5f'
    : pace?.status === 'warn' ? '#e0b341' : '#c8f066'

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={e => { e.stopPropagation(); if (openInfo) setOpenInfo(null) }}>
        <div style={header}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Calculate my targets</div>
          <button onClick={onClose} style={closeBtn}>close</button>
        </div>

        <div style={body}>
          {/* Profile */}
          <div style={sectionLabel}>Your profile</div>
          <div style={grid2}>
            <div><div style={fieldLabel}>Age</div><input type="number" value={profile.age} onChange={e => set('age', e.target.value)} /></div>
            <div>
              <div style={fieldLabel}>Sex</div>
              <select value={profile.sex} onChange={e => set('sex', e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div><div style={fieldLabel}>Height (cm)</div><input type="number" value={profile.height_cm} onChange={e => set('height_cm', e.target.value)} /></div>
            <div>
              <div style={fieldLabel}>Activity</div>
              <select value={profile.activity_level} onChange={e => set('activity_level', e.target.value)}>
                {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Goal */}
          <div style={{ ...sectionLabel, marginTop: 18 }}>Your goal</div>
          <div style={grid2}>
            <div><div style={fieldLabel}>Current weight (kg)</div><input type="number" value={profile.weight} onChange={e => set('weight', e.target.value)} /></div>
            <div><div style={fieldLabel}>Target weight (kg)</div><input type="number" value={profile.goal_weight} onChange={e => set('goal_weight', e.target.value)} /></div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={fieldLabel}>Target date</div>
            <input type="date" value={profile.target_date} onChange={e => set('target_date', e.target.value)} />
          </div>

          {/* Live pace hint */}
          {pace && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#1f1f1f', borderRadius: 8, border: `1px solid ${paceColor}33`, fontSize: 12 }}>
              {pace.invalid ? (
                <span style={{ color: paceColor }}>⚠ Target date must be in the future.</span>
              ) : pace.direction === 'maintain' ? (
                <span style={{ color: '#888' }}>Current and target weight are the same — maintenance.</span>
              ) : (
                <span style={{ color: '#aaa' }}>
                  <span style={{ color: paceColor, fontFamily: 'DM Mono, monospace' }}>≈ {Math.abs(pace.kgPerWeek).toFixed(2)} kg/week</span>
                  {' · '}{pace.direction} <span style={{ fontFamily: 'DM Mono, monospace' }}>{Math.abs(pace.kgTotal).toFixed(1)} kg</span>
                  {pace.status === 'ok' && <span style={{ color: paceColor }}> · realistic ✓</span>}
                  {pace.status === 'warn' && <span style={{ color: paceColor }}> · aggressive</span>}
                  {pace.status === 'danger' && <span style={{ color: paceColor }}> · too aggressive ⚠</span>}
                </span>
              )}
            </div>
          )}

          {/* Result */}
          {result && targets && (
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #2a2a2a' }}>
              <div style={sectionLabel}>Daily targets</div>
              <MetricChips result={result} openInfo={openInfo} setOpenInfo={setOpenInfo} />
              {result.warning && (
                <div style={{ fontSize: 12, color: '#e0b341', marginBottom: 12, lineHeight: 1.4 }}>⚠ {result.warning}</div>
              )}
              <div style={grid2}>
                <div><div style={fieldLabel}>Calories (kcal)</div><input type="number" value={targets.cal} onChange={e => setTargets(t => ({ ...t, cal: e.target.value }))} /></div>
                <div><div style={fieldLabel}>Protein (g)</div><input type="number" value={targets.pro} onChange={e => setTargets(t => ({ ...t, pro: e.target.value }))} /></div>
                <div><div style={fieldLabel}>Carbs (g)</div><input type="number" value={targets.carb} onChange={e => setTargets(t => ({ ...t, carb: e.target.value }))} /></div>
                <div><div style={fieldLabel}>Fat (g)</div><input type="number" value={targets.fat} onChange={e => setTargets(t => ({ ...t, fat: e.target.value }))} /></div>
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>You can fine-tune these before saving.</div>
            </div>
          )}

          {error && <div style={{ fontSize: 12, color: '#ff5f5f', marginTop: 12 }}>{error}</div>}
        </div>

        <div style={footer}>
          {!result ? (
            <button onClick={handleCalculate} disabled={!canCalculate || calculating} style={primaryBtn(!canCalculate || calculating)}>
              {calculating ? 'Calculating...' : 'Calculate my targets'}
            </button>
          ) : (
            <>
              <button onClick={handleCalculate} disabled={calculating} style={secondaryBtn}>
                {calculating ? '...' : 'Recalculate'}
              </button>
              <button onClick={handleSave} disabled={saving} style={primaryBtn(saving)}>
                {saving ? 'Saving...' : 'Save goals'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
