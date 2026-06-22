import { useState, useCallback } from 'react';
import type { HistoryItem } from './useHistory';

type State = {
  currentOperand: string;
  previousOperand: string;
  operation: string | null;
  overwrite: boolean;
  error: string | null;
};

const initialState: State = {
  currentOperand: '0',
  previousOperand: '',
  operation: null,
  overwrite: false,
  error: null,
};

function calculate(previousOperand: string, currentOperand: string, operation: string): string {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return '';
    let computation: number;
    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '×': computation = prev * current; break;
        case '÷':
            if (current === 0) throw new Error("Division by zero");
            computation = prev / current;
            break;
        default: return '';
    }
    return computation.toString();
}

export const useCalculator = (
  onCalculationComplete?: (item: Omit<HistoryItem, 'timestamp'>) => void
) => {
  const [state, setState] = useState<State>(initialState);

  const handleNumberClick = useCallback((number: string) => {
    setState(prev => {
      if (prev.error) {
          return { ...initialState, currentOperand: number };
      }
      if (prev.overwrite) {
        return { ...prev, currentOperand: number, overwrite: false };
      }
      if (number === '.' && prev.currentOperand.includes('.')) {
        return prev;
      }
      const newCurrentOperand = prev.currentOperand === '0' && number !== '.' ? number : `${prev.currentOperand}${number}`;
      return { ...prev, currentOperand: newCurrentOperand };
    });
  }, []);

  const handleOperationClick = useCallback((op: string) => {
    setState(prev => {
        if (prev.error) return prev;
        if (prev.currentOperand === '0' && prev.previousOperand === '') {
            return { ...prev, operation: op };
        }
        if (prev.previousOperand === '') {
            return {
                ...prev,
                operation: op,
                previousOperand: prev.currentOperand,
                currentOperand: '0'
            };
        }
        try {
            const result = calculate(prev.previousOperand, prev.currentOperand, prev.operation!);
            return { ...prev, previousOperand: result, operation: op, currentOperand: '0' };
        } catch {
            return { ...initialState, error: 'Error: Division by zero' };
        }
    });
  }, []);

  const handleEquals = useCallback(() => {
      setState(prev => {
          if (!prev.operation || !prev.previousOperand) return prev;
          try {
              const result = calculate(prev.previousOperand, prev.currentOperand, prev.operation);
              onCalculationComplete?.({
                expression: `${prev.previousOperand} ${prev.operation} ${prev.currentOperand}`,
                result,
              });
              return { ...initialState, currentOperand: result, overwrite: true };
          } catch {
              return { ...initialState, error: 'Error: Division by zero' };
          }
      });
  }, [onCalculationComplete]);

  const handleClear = useCallback(() => {
    setState(initialState);
  }, []);

  const handleDelete = useCallback(() => {
    setState(prev => {
      if (prev.error) return initialState;
      if (prev.overwrite) return { ...prev, currentOperand: '0', overwrite: false };
      if (prev.currentOperand.length === 1) return { ...prev, currentOperand: '0' };
      return { ...prev, currentOperand: prev.currentOperand.slice(0, -1) };
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentOperand: (parseFloat(prev.currentOperand) * -1).toString(),
    }));
  }, []);

  const handlePercentage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentOperand: (parseFloat(prev.currentOperand) / 100).toString(),
    }));
  }, []);
  
  const setCurrentOperand = useCallback((value: string) => {
    setState(prev => ({
      ...prev,
      currentOperand: value,
      previousOperand: '',
      operation: null,
      overwrite: false,
      error: null,
    }));
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (key >= '0' && key <= '9' || key === '.') {
        handleNumberClick(key);
    } else if (key === '+' || key === '-') {
        handleOperationClick(key);
    } else if (key === '*') {
        handleOperationClick('×');
    } else if (key === '/') {
        handleOperationClick('÷');
    } else if (key === 'Enter' || key === '=') {
        handleEquals();
    } else if (key === 'Backspace') {
        handleDelete();
    } else if (key === 'Escape') {
        handleClear();
    }
  }, [handleNumberClick, handleOperationClick, handleEquals, handleDelete, handleClear]);

  return { 
    state, 
    handleNumberClick, 
    handleOperationClick, 
    handleEquals, 
    handleClear, 
    handleDelete, 
    handleToggleSign, 
    handlePercentage, 
    handleKeyPress,
    setCurrentOperand,
  };
};
