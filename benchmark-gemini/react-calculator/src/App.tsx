import { useEffect, useCallback } from 'react';
import './App.css';
import Calculator from './components/Calculator';
import History from './components/History';
import { useCalculator } from './hooks/useCalculator';
import { useHistory } from './hooks/useHistory';

function App() {
  const { history, addHistoryItem, clearHistory } = useHistory();
  const calculator = useCalculator(addHistoryItem);
  const { handleKeyPress, setCurrentOperand } = calculator;

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      e.preventDefault();
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [handleKeyPress]);
  
  const handleReuseResult = useCallback((result: string) => {
    setCurrentOperand(result);
  }, [setCurrentOperand]);

  return (
    <div className="app-wrapper">
      <div className="App">
        <Calculator {...calculator} />
      </div>
      <History
        history={history}
        onClearHistory={clearHistory}
        onReuseResult={handleReuseResult}
      />
    </div>
  );
}

export default App;
