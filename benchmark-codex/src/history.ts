export const HISTORY_STORAGE_KEY = 'calculator-history'

export type HistoryItem = {
  id: string
  expression: string
  result: string
  createdAt: string
}

const isHistoryItem = (value: unknown): value is HistoryItem => {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string'
    && typeof item.expression === 'string'
    && typeof item.result === 'string'
    && typeof item.createdAt === 'string'
    && !Number.isNaN(Date.parse(item.createdAt))
}

export function loadHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isHistoryItem) : []
  } catch {
    return []
  }
}

export function saveHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  } catch {
    // The calculator remains usable when storage is unavailable or full.
  }
}

export function createHistoryItem(expression: string, result: string): HistoryItem {
  const createdAt = new Date().toISOString()
  return {
    id: `${createdAt}-${Math.random().toString(36).slice(2)}`,
    expression,
    result,
    createdAt,
  }
}

export function formatHistoryDate(createdAt: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}
