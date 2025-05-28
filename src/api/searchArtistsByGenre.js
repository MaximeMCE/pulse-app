import { genreMap } from './genreMap';
import { crawlPlaylistTracks } from './crawlPlaylistTracks';

export const searchArtistsByGenre = async (token, filters) => {
  const { genres, minListeners, maxListeners } = filters;

  if (!Array.isArray(genres)) {
    console.error('❌ Expected genres to be an array but got:', genres);
    return [];
  }

  // Translate UI labels to playlist IDs
  const playlistIds = genres.flatMap(label => Array.isArray(genreMap[label]) ? genreMap[label] : []);
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
          ...artist,
          listeners: Math.floor(Math.random() * (maxListeners - minListeners + 1)) + minListeners,
          genres,
          releaseDaysAgo: 0
        });
      }
    }
  }

  return artists;
};
