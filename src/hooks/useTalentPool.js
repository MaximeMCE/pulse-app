import { useState, useEffect } from 'react';

const POOL_KEY = 'talentPool';

export default function useTalentPool() {
  const [pool, setPool] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(POOL_KEY);
    if (stored) setPool(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(POOL_KEY, JSON.stringify(pool));
  }, [pool]);

  const addToPool = (artist) => {
    if (!pool.find((a) => a.id === artist.id)) {
      setPool([...pool, { ...artist, addedAt: Date.now() }]);
    }
  };

  const removeFromPool = (id) => {
    setPool(pool.filter((a) => a.id !== id));
  };

  const isInPool = (id) => {
    return pool.some((a) => a.id === id);
  };

  return {
    pool,
    addToPool,
    removeFromPool,
    isInPool,
    setPool,
  };
}
