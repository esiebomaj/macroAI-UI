/**
 * Build daily macro series for the History chart: rolling past 7 calendar days
 * ending today (today + previous 6 days). Missing days yield zeros.
 */

/** @param {Date} d */
export function dateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Strip time; compare/slice by calendar day only */
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/**
 * Inclusive range of calendar days from start through end (both at local midnight).
 * @param {Date} start
 * @param {Date} end
 * @returns {Date[]}
 */
export function eachDayInRange(start, end) {
  const out = []
  const cur = startOfDay(start)
  const last = startOfDay(end)
  while (cur <= last) {
    out.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

function tickLabel(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
}

/**
 * @param {Record<string, { cal?: number, pro?: number, carb?: number, fat?: number }>} history
 * @returns {{ dateKey: string, label: string, cal: number, pro: number, carb: number, fat: number }[]}
 */
export function buildMacroChartSeries(history) {
  const today = startOfDay(new Date())
  const rangeEnd = today
  const rangeStart = new Date(today)
  rangeStart.setDate(rangeStart.getDate() - 6)

  const days = eachDayInRange(rangeStart, rangeEnd)

  return days.map((d) => {
    const key = dateKey(d)
    const row = history[key]
    return {
      dateKey: key,
      label: tickLabel(d),
      cal: row ? Number(row.cal) || 0 : 0,
      pro: row ? Number(row.pro) || 0 : 0,
      carb: row ? Number(row.carb) || 0 : 0,
      fat: row ? Number(row.fat) || 0 : 0,
    }
  })
}
