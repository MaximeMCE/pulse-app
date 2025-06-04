import { getAllArtistProfiles } from './artistProfileDB';

export const searchLocalProfiles = async (filters) => {
  const profiles = await getAllArtistProfiles();

  const results = Object.values(profiles).filter((profile) => {
    const {
      genres = [],
      monthlyListeners = 0,
      preview_url = '',
    } = profile;

    // ✅ Genre filter (case-insensitive, partial match)
    if (filters.genres && filters.genres.length > 0) {
      if (!Array.isArray(genres) || genres.length === 0) return false;

      const lowerGenres = filters.genres.map((g) => g.toLowerCase());
      const profileGenres = genres.map((g) => g.toLowerCase());

      const hasMatch = lowerGenres.every((g) =>
        profileGenres.some((pg) => pg.includes(g))
      );

      if (!hasMatch) return false;
    }

    // ✅ Listener range filter
    const min = filters.minListeners ?? 0;
    const max = filters.maxListeners ?? Infinity;
    if (monthlyListeners < min || monthlyListeners > max) return false;

    // ✅ Preview required
    if (filters.requirePreview && !preview_url) return false;

    return true;
  });

  console.log(`✅ Local filter returned ${results.length} artists`);
  return results;
};
