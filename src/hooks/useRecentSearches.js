import { useState, useEffect } from 'react';

const RECENT_KEY = 'explorer_recent';
const STORAGE_LIMIT = 50;

export default function useRecentSearches() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    setRecent(Array.isArray(stored) ? stored : []);
  }, []);

  const addSearch = (query) => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const filtered = stored.filter((item) => item.query !== query);
    const newEntry = { query, pinned: false, label: '' };
    const updated = [newEntry, ...filtered];

    // Cap localStorage to 50 items
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated.slice(0, STORAGE_LIMIT)));
    setRecent(updated);
  };

  const clearSearches = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  const togglePin = (query) => {
    const updated = recent.map((item) =>
      item.query === query ? { ...item, pinned: !item.pinned } : item
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecent(updated);
  };

  const renameSearch = (query, newLabel) => {
    const updated = recent.map((item) =>
      item.query === query ? { ...item, label: newLabel } : item
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecent(updated);
  };

  const sorted = [
    ...recent.filter((item) => item.pinned),
    ...recent.filter((item) => !item.pinned)
  ];

  return {
    recent: sorted,
    addSearch,
    clearSearches,
    togglePin,
    renameSearch
  };
}
