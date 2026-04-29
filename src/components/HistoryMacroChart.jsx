import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buildMacroChartSeries } from '../lib/historyChartData'
import { useIsMobile } from '../hooks/useIsMobile'

const ACCENT = '#c8f066'

const METRICS = [
  { id: 'cal', label: 'Calories', shortLabel: 'Cal', unit: 'kcal', color: ACCENT },
  { id: 'pro', label: 'Protein', shortLabel: 'Protein', unit: 'g', color: '#7eb8da' },
  { id: 'carb', label: 'Carbs', shortLabel: 'Carbs', unit: 'g', color: '#e8a838' },
  { id: 'fat', label: 'Fat', shortLabel: 'Fat', unit: 'g', color: '#c792ea' },
]

function metricConfig(id) {
  return METRICS.find((m) => m.id === id) || METRICS[0]
}

function ChartTooltip({ active, payload, metricId }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  const m = metricConfig(metricId)
  const raw = row[m.id]
  const value = Number(raw) || 0
  const display =
    m.id === 'cal'
      ? `${Math.round(value)} kcal`
      : `${Math.round(value)} g`

  return (
    <div
      style={{
        background: '#121212',
        border: '1px solid #2a2a2a',
        borderRadius: 8,
        padding: '10px 12px',
        fontSize: 11,
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ fontFamily: 'DM Mono, monospace', color: '#888', marginBottom: 8, fontSize: 10 }}>
        {row.dateKey}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#aaa' }}>{m.label}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', color: m.color }}>{display}</span>
      </div>
    </div>
  )
}

export default function HistoryMacroChart({ history }) {
  const isMobile = useIsMobile()
  const [metricId, setMetricId] = useState('cal')

  const data = useMemo(() => buildMacroChartSeries(history || {}), [history])
  const m = metricConfig(metricId)

  const chartHeight = isMobile ? 200 : 240

  const yTickFormatter = (v) => {
    if (m.id === 'cal' && v >= 1000) return `${Math.round(v / 1000)}k`
    return String(Math.round(v))
  }

  return (
    <div
      style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
        borderRadius: 8,
        marginBottom: 12,
        padding: '12px 12px 8px',
        overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 10, fontWeight: 500 }}>
        Past 7 days
      </div>

      <div
        role="tablist"
        aria-label="Metric to plot"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 12,
        }}
      >
        {METRICS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={metricId === opt.id}
            onClick={() => setMetricId(opt.id)}
            style={{
              padding: isMobile ? '10px 12px' : '8px 14px',
              fontSize: isMobile ? 12 : 11,
              cursor: 'pointer',
              border: 'none',
              borderRadius: 6,
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.03em',
              fontWeight: metricId === opt.id ? 500 : 400,
              color: metricId === opt.id ? '#fff' : '#888',
              background: metricId === opt.id ? '#252525' : 'transparent',
              boxShadow: metricId === opt.id ? `inset 0 0 0 1px ${opt.color}` : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {opt.shortLabel}
          </button>
        ))}
      </div>

      <div
        style={{ width: '100%', height: chartHeight }}
        aria-label={`Past 7 days of ${m.label.toLowerCase()} in ${m.unit}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: isMobile ? 8 : 16, left: isMobile ? -8 : 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#888', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#333' }}
              minTickGap={isMobile ? 28 : 18}
              interval={0}
            />
            <YAxis
              tick={{ fill: '#888', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#333' }}
              width={isMobile ? 40 : 48}
              tickFormatter={yTickFormatter}
              // label={{
              //   value: m.unit,
              //   angle: -90,
              //   position: 'insideLeft',
              //   fill: '#666',
              //   fontSize: 10,
              //   dx: isMobile ? 4 : 0,
              // }}
            />
            <Tooltip content={<ChartTooltip metricId={metricId} />} cursor={{ stroke: '#444', strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey={m.id}
              name={m.label}
              stroke={m.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
