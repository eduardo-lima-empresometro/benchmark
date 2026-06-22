import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { HISTORY_STORAGE_KEY } from './history'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('calcula usando os botões', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '6' }))
    await user.click(screen.getByRole('button', { name: 'Multiplicar' }))
    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: 'Calcular resultado' }))

    expect(screen.getByLabelText('Resultado')).toHaveTextContent('42')
  })

  it('aceita entrada pelo teclado e pode limpar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('12+8{Enter}')
    expect(screen.getByLabelText('Resultado')).toHaveTextContent('20')

    await user.keyboard('{Escape}')
    expect(screen.getByLabelText('Resultado')).toHaveTextContent('0')
  })

  it('adiciona um cálculo concluído ao histórico com data e resultado', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('10+5{Enter}')

    const history = screen.getByRole('complementary', { name: 'Histórico' })
    expect(history).toHaveTextContent('10 + 5 =')
    expect(history).toHaveTextContent('15')
    expect(history.querySelector('time')).toHaveAttribute('datetime')
  })

  it('persiste o histórico no localStorage e o recupera ao renderizar novamente', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.keyboard('7*8{Enter}')
    await waitFor(() => {
      expect(localStorage.getItem(HISTORY_STORAGE_KEY)).toContain('56')
    })

    unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Usar resultado 56' })).toBeInTheDocument()
  })

  it('limpa todo o histórico', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('3+4{Enter}')

    await user.click(screen.getByRole('button', { name: 'Limpar histórico' }))

    expect(screen.getByText('Seus cálculos aparecerão aqui.')).toBeInTheDocument()
    await waitFor(() => {
      expect(localStorage.getItem(HISTORY_STORAGE_KEY)).toBe('[]')
    })
  })

  it('reutiliza um resultado do histórico no visor', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('4+5{Enter}')
    await user.click(screen.getByRole('button', { name: 'Limpar' }))

    await user.click(screen.getByRole('button', { name: 'Usar resultado 9' }))

    expect(screen.getByLabelText('Resultado')).toHaveTextContent('9')
  })

  it('não adiciona cálculos com erro ao histórico', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('9/0{Enter}')

    expect(screen.getByLabelText('Erro no cálculo')).toHaveTextContent('Erro')
    expect(screen.getByText('Seus cálculos aparecerão aqui.')).toBeInTheDocument()
    await waitFor(() => {
      expect(localStorage.getItem(HISTORY_STORAGE_KEY)).toBe('[]')
    })
  })
})
