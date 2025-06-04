// utils/artistProfileDB.js
import { get, set } from 'idb-keyval';

const ARTIST_KEY = 'artistProfiles';

export const saveArtistProfile = async (profile, maxProfiles = 250) => {
  const stored = (await get(ARTIST_KEY)) || {};

  if (!profile?.id) return;

  const enriched = {
    ...profile,
    savedAt: Date.now(),
  };

  stored[profile.id] = enriched;

  const entries = Object.entries(stored);

  if (entries.length > maxProfiles) {
    const sorted = entries.sort((a, b) => a[1].savedAt - b[1].savedAt); // oldest first
    const trimmed = sorted.slice(entries.length - maxProfiles); // keep newest N
    const cleaned = Object.fromEntries(trimmed);
    await set(ARTIST_KEY, cleaned);
  } else {
    await set(ARTIST_KEY, stored);
  }
};

export const getAllArtistProfiles = async () => {
  return (await get(ARTIST_KEY)) || {};
};

export const getArtistProfileById = async (id) => {
  if (!id) return null;
  const all = await getAllArtistProfiles();
  return all[id] || null;
};

export const clearArtistProfiles = async () => {
  await set(ARTIST_KEY, {});
};
