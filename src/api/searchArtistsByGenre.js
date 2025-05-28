import axios from 'axios';
import { genreMap } from './genreMap';
import { validSeedGenres } from './validSeedGenres';

export const searchArtistsByGenre = async (token, filters) => {
  const { genres, minListeners, maxListeners } = filters;

  // Translate UI genre labels to Spotify-compatible genres
  const translated = genres.flatMap(label => genreMap[label] || []);
  const validGenres = translated
    .map(g => g.toLowerCase().trim())
    .filter(g => validSeedGenres.includes(g));

  if (!validGenres.length) {
    throw new Error("No valid Spotify genres selected");
  }

  const genreQuery = `"${validGenres.join('" OR "')}"`;

  const url = `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(genreQuery)}&type=artist&limit=50`;

  console.log("🎯 Spotify Search URL:", url);

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const artists = response.data.artists?.items || [];

  return artists.map(artist => ({
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    listeners: Math.floor(Math.random() * (maxListeners - minListeners + 1)) + minListeners, // Fake it
    images: artist.images || [],
    releaseDaysAgo: 0,
    preview_url: null, // Not available in /search
  }));
};
