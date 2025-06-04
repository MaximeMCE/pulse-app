import { getAllArtistProfiles } from './artistProfileDB';

export const searchLocalProfiles = async (filters) => {
  const profiles = await getAllArtistProfiles();

  const results = Object.values(profiles).filter((profile) => {
    const {
      genres = [],
      monthlyListeners = 0,
      preview_url = '',
    } = profile;

    // ✅ Genre: allow empty or weird test genres to pass
    if (filters.genres && filters.genres.length > 0) {
      const lowerGenres = filters.genres.map((g) => g.toLowerCase());
      const profileGenres = Array.isArray(genres)
        ? genres.map((g) => g.toLowerCase())
        : [];

      // ⬇️ If no match, reject — but don't crash if empty or mock data
      const hasMatch = lowerGenres.some((g) =>
        profileGenres.some((pg) => pg.includes(g))
      );
      if (!hasMatch) return false;
    }

    // ✅ Listener range
    const min = filters.minListeners ?? 0;
    const max = filters.maxListeners ?? Infinity;
    if (monthlyListeners < min || monthlyListeners > max) return false;

    // ✅ Preview logic
    if (filters.requirePreview && !preview_url) return false;

    return true;
  });

  console.log(`✅ Local filter returned ${results.length} artists`);
  return results;
};
