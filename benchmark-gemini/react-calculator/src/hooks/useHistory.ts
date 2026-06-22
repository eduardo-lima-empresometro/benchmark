import { useState, useEffect, useCallback } from 'react';

export type HistoryItem = {
  expression: string;
  result: string;
  timestamp: string;
};

const STORAGE_KEY = 'calculator-history';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const storedHistory = window.localStorage.getItem(STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Failed to read history from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history to localStorage', error);
    }
  }, [history]);

  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'timestamp'>) => {
    const newHistoryItem: HistoryItem = {
      ...item,
      timestamp: new Date().toLocaleString(),
    };
    setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addHistoryItem, clearHistory };
};
