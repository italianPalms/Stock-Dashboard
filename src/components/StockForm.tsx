import { useState, useEffect } from 'react'
import type { Position } from '../types'

interface Props {
  initial?: Position
  onSave: (data: Omit<Position, 'id'>) => void
  onCancel: () => void
}

const empty = {
  ticker: '',
  name: '',
  shares: '',
  avgCost: '',
  currentPrice: '',
}

export default function StockForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState(
    initial
      ? {
          ticker: initial.ticker,
          name: initial.name,
          shares: String(initial.shares),
          avgCost: String(initial.avgCost),
          currentPrice: String(initial.currentPrice),
        }
      : empty
  )

  useEffect(() => {
    if (initial) {
      setForm({
        ticker: initial.ticker,
        name: initial.name,
        shares: String(initial.shares),
        avgCost: String(initial.avgCost),
        currentPrice: String(initial.currentPrice),
      })
    }
  }, [initial])

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    onSave({
      ticker: form.ticker.toUpperCase().trim(),
      name: form.name.trim(),
      shares: parseFloat(form.shares),
      avgCost: parseFloat(form.avgCost),
      currentPrice: parseFloat(form.currentPrice),
    })
  }

  function field(
    label: string,
    key: keyof typeof form,
    type = 'text',
    placeholder = ''
  ) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        <input
          type={type}
          required
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' ? 'any' : undefined}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field('Ticker', 'ticker', 'text', 'AAPL')}
        {field('Company name', 'name', 'text', 'Apple Inc.')}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {field('Shares', 'shares', 'number', '10')}
        {field('Avg. cost ($)', 'avgCost', 'number', '150.00')}
        {field('Current price ($)', 'currentPrice', 'number', '175.00')}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          {initial ? 'Save changes' : 'Add position'}
        </button>
      </div>
    </form>
  )
}
