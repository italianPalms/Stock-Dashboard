import type { Position } from '../types'

interface Props {
  positions: Position[]
  totalValue: number
  onEdit: (position: Position) => void
  onRemove: (id: string) => void
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function fmtCurrency(n: number) {
  return '$' + fmt(n)
}

export default function PortfolioTable({ positions, totalValue, onEdit, onRemove }: Props) {
  if (positions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-lg">No positions yet.</p>
        <p className="text-sm mt-1">Click "Add position" to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 font-medium">
            <th className="pb-3 pr-4">Ticker</th>
            <th className="pb-3 pr-4">Company</th>
            <th className="pb-3 pr-4 text-right">Shares</th>
            <th className="pb-3 pr-4 text-right">Avg. cost</th>
            <th className="pb-3 pr-4 text-right">Current price</th>
            <th className="pb-3 pr-4 text-right">Market value</th>
            <th className="pb-3 pr-4 text-right">Gain / Loss</th>
            <th className="pb-3 text-right">Allocation</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {positions.map(pos => {
            const marketValue = pos.shares * pos.currentPrice
            const costBasis = pos.shares * pos.avgCost
            const gainLoss = marketValue - costBasis
            const gainLossPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0
            const allocation = totalValue > 0 ? (marketValue / totalValue) * 100 : 0
            const isPositive = gainLoss >= 0

            return (
              <tr key={pos.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-gray-100">{pos.ticker}</td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{pos.name}</td>
                <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">{fmt(pos.shares, 4).replace(/\.?0+$/, '')}</td>
                <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">{fmtCurrency(pos.avgCost)}</td>
                <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">{fmtCurrency(pos.currentPrice)}</td>
                <td className="py-3 pr-4 text-right font-medium text-gray-900 dark:text-gray-100">{fmtCurrency(marketValue)}</td>
                <td className={`py-3 pr-4 text-right font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {isPositive ? '+' : ''}{fmtCurrency(gainLoss)}
                  <span className="ml-1 text-xs opacity-75">
                    ({isPositive ? '+' : ''}{fmt(gainLossPct)}%)
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${allocation}%` }}
                      />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 w-12 text-right">{fmt(allocation)}%</span>
                  </div>
                </td>
                <td className="py-3 pl-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(pos)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onRemove(pos.id)}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-semibold text-gray-900 dark:text-gray-100">
            <td colSpan={5} className="pt-3 pr-4">Total</td>
            <td className="pt-3 pr-4 text-right">{fmtCurrency(totalValue)}</td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
