import { getAllArtistProfiles } from './artistProfileDB';

export const searchLocalProfiles = async (filters) => {
  const profiles = await getAllArtistProfiles();
  const results = Object.values(profiles).filter((profile) => {
    const {
      genres = [],
      monthlyListeners = 0,
      preview_url = '',
    } = profile;

    // Genre filter
    if (filters.genres && filters.genres.length > 0) {
      const lowerGenres = filters.genres.map((g) => g.toLowerCase());
      const profileGenres = genres.map((g) => g.toLowerCase());
      const allMatch = lowerGenres.every((g) => profileGenres.includes(g));
      if (!allMatch) return false;
    }

    // Listener range filter
    const min = filters.minListeners ?? 0;
    const max = filters.maxListeners ?? Infinity;
    if (monthlyListeners < min || monthlyListeners > max) return false;

    // Preview required only if filter asks for it (optional for now)
    if (filters.requirePreview && !preview_url) return false;

    return true;
  });

  return results;
};
