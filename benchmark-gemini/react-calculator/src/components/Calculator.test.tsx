import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

describe('Calculator', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure isolation
    window.localStorage.clear();
  });

  it('should render the calculator', () => {
    render(<App />);
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should perform a simple calculation via clicks', () => {
    render(<App />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));
    const display = screen.getByTestId('display');
    expect(within(display).getByText('3')).toBeInTheDocument();
  });

  it('should handle keyboard input', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: '5' });
    fireEvent.keyDown(window, { key: '*' });
    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: 'Enter' });
    const display = screen.getByTestId('display');
    expect(within(display).getByText('10')).toBeInTheDocument();
  });

  it('should show division by zero error', () => {
    render(<App />);
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('÷'));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText('='));
    const display = screen.getByTestId('display');
    expect(within(display).getByText('Error: Division by zero')).toBeInTheDocument();
  });

  describe('Full History Integration Flow', () => {
    it('should perform a calculation, add it to history, and reuse the result', () => {
      render(<App />);
      const display = screen.getByTestId('display');

      // 1. Perform calculation: 9 * 3 = 27
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '×' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      // Check result in display
      expect(within(display).getByText('27')).toBeInTheDocument();

      // 2. Check if it's in the history
      const historyPanel = screen.getByRole('complementary', { name: /histórico/i });
      expect(within(historyPanel).getByText('9 × 3 =')).toBeInTheDocument();
      const historyResult = within(historyPanel).getByText('27');
      expect(historyResult).toBeInTheDocument();

      // 3. Start a new calculation that will be overwritten: 1 + ...
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      
      // 4. Reuse the old result from history
      fireEvent.click(historyResult);
      
      // Check if the display was updated with the reused result
      expect(within(display).getByText('27')).toBeInTheDocument();
      
      // 5. Complete the calculation: ... + 3 = 30
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      expect(within(display).getByText('30')).toBeInTheDocument();
    });
  });
});
