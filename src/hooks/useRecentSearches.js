import { useState, useEffect } from 'react';

const RECENT_KEY = 'explorer_recent';

export default function useRecentSearches(max = 3) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    setRecent(stored);
  }, []);

  const addSearch = (query) => {
    const existing = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const updated = [query, ...existing.filter(q => q !== query)].slice(0, max);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecent(updated);
  };

  const clearSearches = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  return { recent, addSearch, clearSearches };
}
