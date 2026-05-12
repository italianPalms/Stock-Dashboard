import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Position } from '../types'

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#a855f7',
]

interface Props {
  positions: Position[]
  totalValue: number
  isDark?: boolean
}

export default function AllocationChart({ positions, totalValue, isDark }: Props) {
  if (positions.length === 0) return null

  const data = positions.map((pos, i) => ({
    name: pos.ticker,
    value: pos.shares * pos.currentPrice,
    pct: totalValue > 0 ? ((pos.shares * pos.currentPrice) / totalValue) * 100 : 0,
    fill: COLORS[i % COLORS.length],
  }))

  const tooltipStyle = isDark
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }
    : { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#111827' }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name, entry) => {
            const v = value as number
            const pct = (entry.payload as { pct: number }).pct
            return [
              `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pct.toFixed(1)}%)`,
              name,
            ]
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
