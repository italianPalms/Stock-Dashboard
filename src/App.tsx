import { useState, useEffect } from 'react'
import { usePortfolio } from './store'
import type { Position } from './types'
import StockForm from './components/StockForm'
import PortfolioTable from './components/PortfolioTable'
import AllocationChart from './components/AllocationChart'

type ModalState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; position: Position }

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      {sub && <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export default function App() {
  const { positions, totalValue, addPosition, updatePosition, removePosition } =
    usePortfolio()
  const [modal, setModal] = useState<ModalState>({ type: 'closed' })
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const totalCost = positions.reduce((s, p) => s + p.shares * p.avgCost, 0)
  const totalGain = totalValue - totalCost
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
  const isPositive = totalGain >= 0

  function handleSave(data: Omit<Position, 'id'>) {
    if (modal.type === 'add') addPosition(data)
    else if (modal.type === 'edit') updatePosition(modal.position.id, data)
    setModal({ type: 'closed' })
  }

  function handleRemove(id: string) {
    if (confirm('Remove this position?')) removePosition(id)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 shadow-sm shrink-0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Portfolio</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Track your stock positions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(d => !d)}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setModal({ type: 'add' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Add position
            </button>
          </div>
        </div>

        {/* Summary cards + allocation chart side by side */}
        {positions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 content-start">
              <SummaryCard label="Total value" value={`$${fmt(totalValue)}`} />
              <SummaryCard label="Cost basis" value={`$${fmt(totalCost)}`} />
              <SummaryCard
                label="Total gain / loss"
                value={`${isPositive ? '+' : '-'}$${fmt(Math.abs(totalGain))}`}
              />
              <SummaryCard
                label="Return"
                value={`${isPositive ? '+' : ''}${totalGainPct.toFixed(2)}%`}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Allocation</h2>
              <AllocationChart positions={positions} totalValue={totalValue} isDark={dark} />
            </div>
          </div>
        )}

        {/* Full-width positions table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-5">Positions</h2>
          <PortfolioTable
            positions={positions}
            totalValue={totalValue}
            onEdit={pos => setModal({ type: 'edit', position: pos })}
            onRemove={handleRemove}
          />
        </div>
      </div>

      {/* Add / Edit modal */}
      {modal.type !== 'closed' && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setModal({ type: 'closed' }) }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5">
              {modal.type === 'add' ? 'Add position' : `Edit ${modal.position.ticker}`}
            </h2>
            <StockForm
              initial={modal.type === 'edit' ? modal.position : undefined}
              onSave={handleSave}
              onCancel={() => setModal({ type: 'closed' })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
