// searchArtistsByGenre.js
import { genreMap } from './genreMap';
import { crawlPlaylistTracks } from './crawlPlaylistTracks';

export const searchArtistsByGenre = async (token, filters) => {
  const { genres, minListeners, maxListeners } = filters;

  if (!Array.isArray(genres)) {
    console.error('❌ Expected genres to be an array but got:', genres);
    return [];
  }

  const playlistIds = genres.flatMap(label =>
    Array.isArray(genreMap[label]) ? genreMap[label] : []
  );

  if (!playlistIds.length) throw new Error("No valid playlists for selected genres");

  const seenArtistIds = new Set();
  const artists = [];

  for (const playlistId of playlistIds) {
    const playlistArtists = await crawlPlaylistTracks(token, playlistId);

    for (const artist of playlistArtists) {
      if (!artist || !artist.id || !artist.name) {
        console.warn('⚠️ Skipping invalid artist:', artist);
        continue;
      }

      if (!seenArtistIds.has(artist.id)) {
        seenArtistIds.add(artist.id);

        artists.push({
          id: artist.id,
          name: artist.name,
          images: artist.images || [],
          genres: Array.isArray(artist.genres) ? artist.genres : [],
          monthlyListeners: Math.floor(Math.random() * (maxListeners - minListeners + 1)) + minListeners,
          preview_url: artist.preview_url || null,
          platforms: ['spotify']
        });
      }
    }
  }

  return artists;
};
