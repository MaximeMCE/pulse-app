// /api/searchArtistsByGenre.js
import axios from 'axios';
import { genreMap } from './genreMap';
import { validSeedGenres } from './validSeedGenres'; // ✅ added import

export const searchArtistsByGenre = async (token, filters) => {
  const { genres, minListeners, maxListeners } = filters;

  // Translate UI labels to raw Spotify genres
  const translated = genres.flatMap(label => genreMap[label] || []);

  // ✅ Filter only valid Spotify seed genres
  const validGenres = translated.filter(g => validSeedGenres.includes(g));

  if (!validGenres.length) {
    throw new Error("No valid Spotify genres selected");
  }

  const seed = validGenres.slice(0, 5); // Spotify allows max 5
  const params = new URLSearchParams({
    seed_genres: seed.join(','),
    limit: 30,
    min_popularity: 10,
    target_popularity: 50,
  });

  const response = await axios.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
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
