import { calculatorReducer, initialState, type CalculatorAction } from './calculator'

const reduce = (actions: CalculatorAction[]) => actions.reduce(calculatorReducer, initialState)

describe('calculatorReducer', () => {
  it.each([
    ['+', '5'],
    ['-', '-1'],
    ['*', '6'],
    ['/', '0,666666666667'],
  ] as const)('calcula 2 %s 3', (operator, expected) => {
    const state = reduce([
      { type: 'digit', digit: '2' },
      { type: 'operator', operator },
      { type: 'digit', digit: '3' },
      { type: 'equals' },
    ])
    expect(state.display).toBe(expected)
  })

  it('encadeia operações', () => {
    const state = reduce([
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '2' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'equals' },
    ])
    expect(state.display).toBe('7')
  })

  it('trata divisão por zero', () => {
    const state = reduce([
      { type: 'digit', digit: '9' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '0' },
      { type: 'equals' },
    ])
    expect(state.display).toBe('Erro')
    expect(state.error).toBe(true)
  })

  it('aceita decimais e porcentagem', () => {
    const decimal = reduce([{ type: 'digit', digit: '2' }, { type: 'decimal' }, { type: 'digit', digit: '5' }])
    expect(decimal.display).toBe('2,5')
    expect(calculatorReducer(decimal, { type: 'percent' }).display).toBe('0,025')
  })
})
