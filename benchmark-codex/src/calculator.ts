export type Operator = '+' | '-' | '*' | '/'

export type CalculatorState = {
  display: string
  storedValue: number | null
  pendingOperator: Operator | null
  waitingForOperand: boolean
  expression: string
  error: boolean
}

export type CalculatorAction =
  | { type: 'digit'; digit: string }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'clear' }
  | { type: 'toggle-sign' }
  | { type: 'percent' }
  | { type: 'backspace' }
  | { type: 'set-value'; value: string }

export const initialState: CalculatorState = {
  display: '0',
  storedValue: null,
  pendingOperator: null,
  waitingForOperand: false,
  expression: '',
  error: false,
}

const symbols: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
}

const calculate = (left: number, right: number, operator: Operator): number => {
  switch (operator) {
    case '+': return left + right
    case '-': return left - right
    case '*': return left * right
    case '/': return right === 0 ? Number.NaN : left / right
  }
}

const formatResult = (value: number): string => {
  if (!Number.isFinite(value)) return 'Erro'
  return Number.parseFloat(value.toPrecision(12)).toString()
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  if (state.error && action.type !== 'clear') {
    if (action.type !== 'digit') return state
    state = initialState
  }

  switch (action.type) {
    case 'digit': {
      if (state.waitingForOperand) {
        return { ...state, display: action.digit, waitingForOperand: false }
      }
      const display = state.display === '0' ? action.digit : state.display + action.digit
      return { ...state, display: display.slice(0, 15) }
    }
    case 'decimal':
      if (state.waitingForOperand) {
        return { ...state, display: '0,', waitingForOperand: false }
      }
      return state.display.includes(',')
        ? state
        : { ...state, display: `${state.display},` }
    case 'clear':
      return initialState
    case 'set-value':
      return { ...initialState, display: action.value }
    case 'toggle-sign':
      return state.display === '0'
        ? state
        : { ...state, display: state.display.startsWith('-') ? state.display.slice(1) : `-${state.display}` }
    case 'percent': {
      const value = Number(state.display.replace(',', '.')) / 100
      return { ...state, display: formatResult(value).replace('.', ',') }
    }
    case 'backspace': {
      if (state.waitingForOperand) return state
      const display = state.display.length > 1 ? state.display.slice(0, -1) : '0'
      return { ...state, display: display === '-' ? '0' : display }
    }
    case 'operator': {
      const input = Number(state.display.replace(',', '.'))
      let storedValue = state.storedValue
      let display = state.display

      if (storedValue !== null && state.pendingOperator && !state.waitingForOperand) {
        const result = calculate(storedValue, input, state.pendingOperator)
        display = formatResult(result).replace('.', ',')
        if (!Number.isFinite(result)) return { ...initialState, display, error: true }
        storedValue = result
      } else {
        storedValue = input
      }

      return {
        ...state,
        display,
        storedValue,
        pendingOperator: action.operator,
        waitingForOperand: true,
        expression: `${display} ${symbols[action.operator]}`,
      }
    }
    case 'equals': {
      if (state.storedValue === null || !state.pendingOperator || state.waitingForOperand) return state
      const input = Number(state.display.replace(',', '.'))
      const result = calculate(state.storedValue, input, state.pendingOperator)
      const display = formatResult(result).replace('.', ',')
      if (!Number.isFinite(result)) return { ...initialState, display, error: true }
      return {
        ...initialState,
        display,
        expression: `${state.expression} ${state.display} =`,
      }
    }
  }
}
