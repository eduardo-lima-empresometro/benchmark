import { useCallback, useEffect, useReducer, useState } from 'react'
import { calculatorReducer, initialState, type CalculatorAction, type Operator } from './calculator'
import { createHistoryItem, formatHistoryDate, loadHistory, saveHistory, type HistoryItem } from './history'

type Key = {
  label: string
  ariaLabel?: string
  action: CalculatorAction
  variant?: 'utility' | 'operator' | 'equals'
  className?: string
}

const keys: Key[] = [
  { label: 'C', ariaLabel: 'Limpar', action: { type: 'clear' }, variant: 'utility' },
  { label: '±', ariaLabel: 'Inverter sinal', action: { type: 'toggle-sign' }, variant: 'utility' },
  { label: '%', ariaLabel: 'Porcentagem', action: { type: 'percent' }, variant: 'utility' },
  { label: '÷', ariaLabel: 'Dividir', action: { type: 'operator', operator: '/' }, variant: 'operator' },
  { label: '7', action: { type: 'digit', digit: '7' } },
  { label: '8', action: { type: 'digit', digit: '8' } },
  { label: '9', action: { type: 'digit', digit: '9' } },
  { label: '×', ariaLabel: 'Multiplicar', action: { type: 'operator', operator: '*' }, variant: 'operator' },
  { label: '4', action: { type: 'digit', digit: '4' } },
  { label: '5', action: { type: 'digit', digit: '5' } },
  { label: '6', action: { type: 'digit', digit: '6' } },
  { label: '−', ariaLabel: 'Subtrair', action: { type: 'operator', operator: '-' }, variant: 'operator' },
  { label: '1', action: { type: 'digit', digit: '1' } },
  { label: '2', action: { type: 'digit', digit: '2' } },
  { label: '3', action: { type: 'digit', digit: '3' } },
  { label: '+', ariaLabel: 'Somar', action: { type: 'operator', operator: '+' }, variant: 'operator' },
  { label: '0', action: { type: 'digit', digit: '0' }, className: 'key--zero' },
  { label: ',', ariaLabel: 'Separador decimal', action: { type: 'decimal' } },
  { label: '=', ariaLabel: 'Calcular resultado', action: { type: 'equals' }, variant: 'equals' },
]

function keyboardAction(key: string): CalculatorAction | null {
  if (/^[0-9]$/.test(key)) return { type: 'digit', digit: key }
  if (key === '.' || key === ',') return { type: 'decimal' }
  if (['+', '-', '*', '/'].includes(key)) return { type: 'operator', operator: key as Operator }
  if (key === 'Enter' || key === '=') return { type: 'equals' }
  if (key === 'Escape' || key.toLowerCase() === 'c') return { type: 'clear' }
  if (key === 'Backspace') return { type: 'backspace' }
  if (key === '%') return { type: 'percent' }
  return null
}

export default function App() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)

  useEffect(() => {
    saveHistory(history)
  }, [history])

  const handleAction = useCallback((action: CalculatorAction) => {
    if (action.type === 'equals') {
      const nextState = calculatorReducer(state, action)
      const calculationCompleted = nextState !== state && !nextState.error && nextState.expression.endsWith('=')
      if (calculationCompleted) {
        setHistory((current) => [
          createHistoryItem(nextState.expression, nextState.display),
          ...current,
        ])
      }
    }
    dispatch(action)
  }, [state])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = keyboardAction(event.key)
      if (!action) return
      event.preventDefault()
      handleAction(action)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleAction])

  const clearHistory = () => setHistory([])

  const reuseResult = (result: string) => {
    handleAction({ type: 'set-value', value: result })
  }

  return (
    <main className="page">
      <div className="workspace">
      <section className="calculator" aria-label="Calculadora">
        <header className="calculator__header">
          <span className="calculator__mark" aria-hidden="true">=</span>
          <h1>Calculadora</h1>
        </header>

        <div className="display" role="status" aria-live="polite" aria-atomic="true">
          <div className="display__expression" aria-label="Expressão">{state.expression || '\u00a0'}</div>
          <output className="display__value" aria-label={state.error ? 'Erro no cálculo' : 'Resultado'}>
            {state.display}
          </output>
        </div>

        <div className="keypad">
          {keys.map((key) => (
            <button
              key={`${key.label}-${key.ariaLabel ?? ''}`}
              type="button"
              className={['key', key.variant && `key--${key.variant}`, key.className].filter(Boolean).join(' ')}
              aria-label={key.ariaLabel ?? key.label}
              onClick={() => handleAction(key.action)}
            >
              {key.label}
            </button>
          ))}
        </div>
        <p className="keyboard-hint">Use também o teclado para calcular</p>
      </section>

      <aside className="history" aria-labelledby="history-title">
        <div className="history__header">
          <div>
            <span className="history__eyebrow">Memória</span>
            <h2 id="history-title">Histórico</h2>
          </div>
          <button
            type="button"
            className="history__clear"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            Limpar histórico
          </button>
        </div>

        {history.length === 0 ? (
          <p className="history__empty">Seus cálculos aparecerão aqui.</p>
        ) : (
          <ol className="history__list">
            {history.map((item) => (
              <li className="history__item" key={item.id}>
                <div className="history__meta">
                  <span className="history__expression">{item.expression}</span>
                  <time dateTime={item.createdAt}>{formatHistoryDate(item.createdAt)}</time>
                </div>
                <button
                  type="button"
                  className="history__result"
                  aria-label={`Usar resultado ${item.result}`}
                  onClick={() => reuseResult(item.result)}
                >
                  {item.result}
                </button>
              </li>
            ))}
          </ol>
        )}
      </aside>
      </div>
    </main>
  )
}
