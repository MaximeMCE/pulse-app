import { useState, useEffect } from 'react';

const RECENT_KEY = 'recent_searches';

const useRecentSearches = () => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setRecent(parsed);
      } else {
        console.warn('⚠️ Stored recent searches are not an array:', parsed);
      }
    } catch (e) {
      console.error('💥 Error parsing recent searches from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch (e) {
      console.error('💥 Failed to store recent searches:', e);
    }
  }, [recent]);

  const addSearch = (label) => {
    if (!label || typeof label !== 'string') return;
    const exists = Array.isArray(recent) && recent.find((item) => item.label === label);
    if (exists) return;
    setRecent([{ label, pinned: false }, ...(Array.isArray(recent) ? recent : [])].slice(0, 10));
  };

  const togglePin = (label) => {
    if (!Array.isArray(recent)) return;
    const updated = recent.map((item) =>
      item.label === label ? { ...item, pinned: !item.pinned } : item
    );
    setRecent(updated);
  };

  const renameSearch = (oldLabel, newLabel) => {
    if (!Array.isArray(recent)) return;
    const updated = recent.map((item) =>
      item.label === oldLabel ? { ...item, label: newLabel } : item
    );
    setRecent(updated);
  };

  const clearSearches = () => setRecent([]);

  return {
    recent,
    addSearch,
    togglePin,
    renameSearch,
    clearSearches,
  };
};

export default useRecentSearches;
