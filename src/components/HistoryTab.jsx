import { useEffect, useState } from 'react'
import HistoryMacroChart from './HistoryMacroChart'

const MEAL_ORDER = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

function formatDateLabel(key) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const isSame = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (isSame(date, today)) return 'Today'
  if (isSame(date, yesterday)) return 'Yesterday'
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function HistoryTab({ history, goals, fetchHistory }) {
  useEffect(() => { fetchHistory() }, [fetchHistory])
  const [expanded, setExpanded] = useState({})

  const keys = Object.keys(history).sort().reverse()

  if (!keys.length) return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666', fontSize: 13 }}>No history yet. Start logging food today!</div>
  )

  return (
    <div>
       <HistoryMacroChart history={history} />
      {keys.map(k => {
        const d = history[k]
        const pct = Math.round(d.cal / goals.cal * 100)
        const bc = pct > 105
          ? { bg: 'rgba(255,95,95,0.15)', color: '#ff5f5f' }
          : pct >= 85
          ? { bg: 'rgba(200,240,102,0.15)', color: '#c8f066' }
          : { bg: '#1f1f1f', color: '#666' }
        const isOpen = !!expanded[k]
        const entries = d.entries || []

        const grouped = MEAL_ORDER
          .map(m => ({ meal: m, items: entries.filter(e => e.meal === m) }))
          .filter(g => g.items.length)

        const ungrouped = entries.filter(e => !MEAL_ORDER.includes(e.meal))
        if (ungrouped.length) grouped.push({ meal: 'Other', items: ungrouped })

        return (
          <div key={k} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
            <button
              onClick={() => setExpanded(p => ({ ...p, [k]: !p[k] }))}
              disabled={!entries.length}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '12px 14px',
                textAlign: 'left',
                cursor: entries.length ? 'pointer' : 'default',
                color: 'inherit',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {entries.length > 0 && (
                    <span style={{
                      display: 'inline-block',
                      width: 10,
                      fontSize: 10,
                      color: '#666',
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                    }}>▶</span>
                  )}
                  <div>
                    <div style={{ fontSize: 13, color: '#eee' }}>{formatDateLabel(k)}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#666', marginTop: 2 }}>{k}{entries.length ? ` · ${entries.length} item${entries.length > 1 ? 's' : ''}` : ''}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'DM Mono, monospace', background: bc.bg, color: bc.color }}>{pct}%</span>
              </div>
              <div style={{ fontSize: 13, marginBottom: 8 }}>
                {Math.round(d.cal)} kcal · P:{Math.round(d.pro)}g · C:{Math.round(d.carb)}g · F:{Math.round(d.fat)}g
              </div>
              <div style={{ background: '#2a2a2a', borderRadius: 2, height: 3 }}>
                <div style={{ height: 3, borderRadius: 2, width: Math.min(pct,100)+'%', background: pct > 105 ? '#ff5f5f' : '#c8f066' }} />
              </div>
            </button>

            {isOpen && entries.length > 0 && (
              <div style={{ borderTop: '1px solid #2a2a2a', padding: '8px 14px 12px', background: '#121212' }}>
                {grouped.map(g => {
                  const mTot = g.items.reduce((a, e) => ({ cal: a.cal + e.cal, pro: a.pro + e.pro }), { cal: 0, pro: 0 })
                  return (
                    <div key={g.meal} style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', fontWeight: 500 }}>{g.meal}</span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#c8f066' }}>{Math.round(mTot.cal)} kcal · {Math.round(mTot.pro)}g P</span>
                      </div>
                      {g.items.map(e => (
                        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '1px solid #1f1f1f' }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 12, color: '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {e.qty > 1 ? `${e.qty}× ` : ''}{e.name}
                            </div>
                            <div style={{ fontSize: 10, color: '#666', marginTop: 2, fontFamily: 'DM Mono, monospace' }}>
                              P:{Math.round(e.pro)}g C:{Math.round(e.carb)}g F:{Math.round(e.fat)}g
                            </div>
                          </div>
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#eee', marginLeft: 10 }}>{Math.round(e.cal)}</span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
