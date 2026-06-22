import React from 'react';
import Button from './Button';
import { useCalculator } from '../hooks/useCalculator';

type CalculatorProps = Omit<ReturnType<typeof useCalculator>, 'handleKeyPress'>;

const Calculator: React.FC<CalculatorProps> = ({
  state,
  handleNumberClick,
  handleOperationClick,
  handleEquals,
  handleClear,
  handleDelete,
  handleToggleSign,
  handlePercentage,
}) => {
  return (
    <div className="calculator-grid">
      <div className="display" data-testid="display">
        {state.error ? (
          <div className="error">{state.error}</div>
        ) : (
          <>
            <div className="previous-operand">
              {state.previousOperand} {state.operation}
            </div>
            <div className="current-operand">{state.currentOperand}</div>
          </>
        )}
      </div>
      <Button label="AC" onClick={() => handleClear()} className="special" />
      <Button label="+/-" onClick={() => handleToggleSign()} className="special" />
      <Button label="%" onClick={() => handlePercentage()} className="special" />
      <Button label="÷" onClick={() => handleOperationClick('÷')} className="operator" />
      <Button label="7" onClick={() => handleNumberClick('7')} />
      <Button label="8" onClick={() => handleNumberClick('8')} />
      <Button label="9" onClick={() => handleNumberClick('9')} />
      <Button label="×" onClick={() => handleOperationClick('×')} className="operator" />
      <Button label="4" onClick={() => handleNumberClick('4')} />
      <Button label="5" onClick={() => handleNumberClick('5')} />
      <Button label="6" onClick={() => handleNumberClick('6')} />
      <Button label="-" onClick={() => handleOperationClick('-')} className="operator" />
      <Button label="1" onClick={() => handleNumberClick('1')} />
      <Button label="2" onClick={() => handleNumberClick('2')} />
      <Button label="3" onClick={() => handleNumberClick('3')} />
      <Button label="+" onClick={() => handleOperationClick('+')} className="operator" />
      <Button label="0" onClick={() => handleNumberClick('0')} className="span-two" />
      <Button label="." onClick={() => handleNumberClick('.')} />
      <Button label="=" onClick={() => handleEquals()} className="operator" />
       <Button label="DEL" onClick={() => handleDelete()} className="special" />
    </div>
  );
};

export default Calculator;
