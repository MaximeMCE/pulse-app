// /api/searchArtistsByGenre.js
import axios from 'axios';
import { genreMap } from './genreMap';

export const searchArtistsByGenre = async (token, filters) => {
  const { genres, minListeners, maxListeners } = filters;

  // Translate user-selected labels to real Spotify genres
  const translated = genres.flatMap(label => genreMap[label] || []);
  const validGenres = Array.from(new Set(translated)); // remove duplicates

  if (!validGenres.length) {
    throw new Error("No valid Spotify genres selected");
  }

  const seed = validGenres.slice(0, 5); // Spotify allows max 5
  const params = new URLSearchParams({
    seed_genres: seed.join(','), // clean, safe genre string
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
