import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';

const STORAGE_KEY = 'calculator-history';

describe('useHistory', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with an empty array if localStorage is empty', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });

  it('should initialize with data from localStorage', () => {
    const mockHistory = [{ expression: '1 + 1', result: '2', timestamp: new Date().toLocaleString() }];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHistory));
    
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual(mockHistory);
  });

  it('should add an item to history and save to localStorage', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addHistoryItem({ expression: '2 + 3', result: '5' });
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].expression).toBe('2 + 3');
    expect(result.current.history[0].result).toBe('5');
    
    const storedHistory = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(storedHistory).toHaveLength(1);
    expect(storedHistory[0].result).toBe('5');
  });

  it('should clear history and remove from localStorage', () => {
    const mockHistory = [{ expression: '1 + 1', result: '2', timestamp: '...' }];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHistory));

    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toHaveLength(1); // Ensure it's loaded

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('[]');
  });
});
