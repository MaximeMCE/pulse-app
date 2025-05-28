// /src/api/searchArtistsByGenre.js
import axios from 'axios';
import { genreMap } from './genreMap';
import { validSeedGenres } from './validSeedGenres';

export const searchArtistsByGenre = async (token, filters) => {
  const { genres, minListeners, maxListeners } = filters;

  // Translate UI labels → genreMap → flatten
  const translated = genres.flatMap(label => genreMap[label] || []);

  // Lowercase, trim, validate
  const validGenres = translated
    .map(g => g.toLowerCase().trim())
    .filter(g => validSeedGenres.includes(g));

  if (!validGenres.length) {
    throw new Error("No valid Spotify genres selected");
  }

  const seedGenres = validGenres.slice(0, 5).join(',');

  const params = new URLSearchParams({
    seed_genres: seedGenres,
    limit: 30,
    min_popularity: 10,
    target_popularity: 50,
  });

  const fullUrl = `https://api.spotify.com/v1/recommendations?${params.toString()}`;

  // 🧪 Debug logs
  console.log("🔍 Fetching from Spotify with params:", params.toString());
  console.log("🔍 Full URL:", fullUrl);
  console.log("🔐 Token starts with:", token.slice(0, 20));

  const response = await axios.get(fullUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const tracks = response.data.tracks || [];

  const artistsMap = new Map();
  for (const track of tracks) {
    const artist = track.artists?.[0];
    if (artist && !artistsMap.has(artist.id)) {
      artistsMap.set(artist.id, {
        id: artist.id,
        name: artist.name,
        listeners: Math.floor(Math.random() * (maxListeners - minListeners + 1)) + minListeners,
        genres: validGenres,
        preview_url: track.preview_url,
        images: track.album?.images || [],
        releaseDaysAgo: 0,
      });
    }
  }

  return Array.from(artistsMap.values());
};
