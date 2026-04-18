import { useEffect } from 'react'

export default function HistoryTab({ history, goals, fetchHistory }) {
  useEffect(() => { fetchHistory() }, [fetchHistory])

  const keys = Object.keys(history).sort().reverse()

  if (!keys.length) return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666', fontSize: 13 }}>No history yet. Start logging food today!</div>
  )

  return (
    <div>
      {keys.map(k => {
        const d = history[k]
        const pct = Math.round(d.cal / goals.cal * 100)
        const bc = pct > 105
          ? { bg: 'rgba(255,95,95,0.15)', color: '#ff5f5f' }
          : pct >= 85
          ? { bg: 'rgba(200,240,102,0.15)', color: '#c8f066' }
          : { bg: '#1f1f1f', color: '#666' }

        return (
          <div key={k} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#666' }}>{k}</div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'DM Mono, monospace', background: bc.bg, color: bc.color }}>{pct}%</span>
            </div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>
              {Math.round(d.cal)} kcal · P:{Math.round(d.pro)}g · C:{Math.round(d.carb)}g · F:{Math.round(d.fat)}g
            </div>
            <div style={{ background: '#2a2a2a', borderRadius: 2, height: 3 }}>
              <div style={{ height: 3, borderRadius: 2, width: Math.min(pct,100)+'%', background: pct > 105 ? '#ff5f5f' : '#c8f066' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
