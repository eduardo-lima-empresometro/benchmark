import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import History from './History';
import type { HistoryItem } from '../hooks/useHistory';

const mockHistory: HistoryItem[] = [
  { expression: '10 + 5', result: '15', timestamp: '2023-10-27, 10:00:00 AM' },
  { expression: '20 - 8', result: '12', timestamp: '2023-10-27, 09:59:00 AM' },
];

describe('History component', () => {
  it('should not render if history is empty', () => {
    const { container } = render(
      <History history={[]} onClearHistory={() => {}} onReuseResult={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render the history list', () => {
    render(
      <History history={mockHistory} onClearHistory={() => {}} onReuseResult={() => {}} />
    );
    expect(screen.getByText('Histórico')).toBeInTheDocument();
    expect(screen.getByText('10 + 5 =')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('20 - 8 =')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should call onClearHistory when the clear button is clicked', () => {
    const handleClear = vi.fn();
    render(
      <History history={mockHistory} onClearHistory={handleClear} onReuseResult={() => {}} />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /limpar/i }));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('should call onReuseResult when a result is clicked', () => {
    const handleReuse = vi.fn();
    render(
      <History history={mockHistory} onClearHistory={() => {}} onReuseResult={handleReuse} />
    );

    // Get the result '15' and click it
    const resultElement = screen.getByText('15');
    fireEvent.click(resultElement);

    expect(handleReuse).toHaveBeenCalledTimes(1);
    expect(handleReuse).toHaveBeenCalledWith('15');
  });
});
