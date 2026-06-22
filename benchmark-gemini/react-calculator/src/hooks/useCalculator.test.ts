import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useCalculator } from './useCalculator';

describe('useCalculator', () => {
  // Existing tests ...
  it('should handle number clicks', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleNumberClick('7');
    });
    expect(result.current.state.currentOperand).toBe('7');
  });

  it('should handle multiple number clicks', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleNumberClick('1');
      result.current.handleNumberClick('2');
    });
    expect(result.current.state.currentOperand).toBe('12');
  });

  it('should handle decimal clicks', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleNumberClick('1');
      result.current.handleNumberClick('.');
      result.current.handleNumberClick('5');
    });
    expect(result.current.state.currentOperand).toBe('1.5');
  });

  it('should prevent multiple decimals', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleNumberClick('1');
      result.current.handleNumberClick('.');
      result.current.handleNumberClick('5');
      result.current.handleNumberClick('.');
    });
    expect(result.current.state.currentOperand).toBe('1.5');
  });
  
  it('should handle addition', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleNumberClick('2');
      result.current.handleOperationClick('+');
      result.current.handleNumberClick('3');
      result.current.handleEquals();
    });
    expect(result.current.state.currentOperand).toBe('5');
  });
  
  it('should handle division by zero', () => {
    const onCalcComplete = vi.fn();
    const { result } = renderHook(() => useCalculator(onCalcComplete));
    act(() => {
      result.current.handleNumberClick('5');
      result.current.handleOperationClick('÷');
      result.current.handleNumberClick('0');
      result.current.handleEquals();
    });
    expect(result.current.state.error).toBe('Error: Division by zero');
    expect(onCalcComplete).not.toHaveBeenCalled();
  });

  it('should clear the calculation', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleNumberClick('5');
      result.current.handleOperationClick('+');
      result.current.handleNumberClick('5');
      result.current.handleClear();
    });
    expect(result.current.state.currentOperand).toBe('0');
    expect(result.current.state.previousOperand).toBe('');
    expect(result.current.state.operation).toBe(null);
  });

  describe('History Integration', () => {
    it('should call onCalculationComplete on successful equals', () => {
      const onCalcComplete = vi.fn();
      const { result } = renderHook(() => useCalculator(onCalcComplete));
      
      act(() => {
        result.current.handleNumberClick('10');
        result.current.handleOperationClick('+');
        result.current.handleNumberClick('5');
        result.current.handleEquals();
      });

      expect(onCalcComplete).toHaveBeenCalledTimes(1);
      expect(onCalcComplete).toHaveBeenCalledWith({
        expression: '10 + 5',
        result: '15',
      });
      expect(result.current.state.currentOperand).toBe('15');
    });

    it('should not call onCalculationComplete if equals fails', () => {
      const onCalcComplete = vi.fn();
      const { result } = renderHook(() => useCalculator(onCalcComplete));

      act(() => {
        result.current.handleNumberClick('5');
        result.current.handleOperationClick('÷');
        result.current.handleNumberClick('0');
        result.current.handleEquals();
      });

      expect(onCalcComplete).not.toHaveBeenCalled();
      expect(result.current.state.error).toBe('Error: Division by zero');
    });

    it('should set current operand when setCurrentOperand is called', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.setCurrentOperand('123.45');
      });

      expect(result.current.state.currentOperand).toBe('123.45');
      expect(result.current.state.previousOperand).toBe('');
      expect(result.current.state.operation).toBe(null);
      expect(result.current.state.overwrite).toBe(false);
    });
  });
});
