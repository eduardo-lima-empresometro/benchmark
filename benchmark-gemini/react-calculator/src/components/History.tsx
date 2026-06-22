import React from 'react';
import type { HistoryItem } from '../hooks/useHistory';

type HistoryProps = {
  history: HistoryItem[];
  onClearHistory: () => void;
  onReuseResult: (result: string) => void;
};

const History: React.FC<HistoryProps> = ({ history, onClearHistory, onReuseResult }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="history-panel" role="complementary" aria-label="Histórico de Cálculos">
      <div className="history-header">
        <h3>Histórico</h3>
        <button onClick={onClearHistory} className="clear-history-btn">
          Limpar
        </button>
      </div>
      <ul className="history-list">
        {history.map((item, index) => (
          <li key={index} className="history-item">
            <span className="history-expression">{item.expression} =</span>
            <strong
              className="history-result"
              onClick={() => onReuseResult(item.result)}
              title={`Reutilizar ${item.result}`}
            >
              {item.result}
            </strong>
            <span className="history-timestamp">{item.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
