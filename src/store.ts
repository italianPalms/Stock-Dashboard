import { useState, useEffect } from 'react'
import type { Position } from './types'

const STORAGE_KEY = 'portfolio_positions'

function load(): Position[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(positions: Position[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
}

export function usePortfolio() {
  const [positions, setPositions] = useState<Position[]>(load)

  useEffect(() => {
    save(positions)
  }, [positions])

  function addPosition(pos: Omit<Position, 'id'>) {
    setPositions(prev => [...prev, { ...pos, id: crypto.randomUUID() }])
  }

  function updatePosition(id: string, updates: Omit<Position, 'id'>) {
    setPositions(prev =>
      prev.map(p => (p.id === id ? { ...updates, id } : p))
    )
  }

  function removePosition(id: string) {
    setPositions(prev => prev.filter(p => p.id !== id))
  }

  const totalValue = positions.reduce(
    (sum, p) => sum + p.shares * p.currentPrice,
    0
  )

  return { positions, totalValue, addPosition, updatePosition, removePosition }
}
