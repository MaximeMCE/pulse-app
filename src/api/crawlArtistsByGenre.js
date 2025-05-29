import { fetchPlaylistsByGenre } from './fetchPlaylistsByGenre.js';
import { crawlPlaylistTracks } from './crawlPlaylistTracks.js';

export async function crawlArtistsByGenre(token, filters) {
  const allArtists = {};
  const genre = filters.genres[0];

  const playlists = await fetchPlaylistsByGenre(token, genre);
  const topPlaylists = playlists.slice(0, 3);

  for (const playlist of topPlaylists) {
    if (!playlist?.id) {
      console.warn('⚠️ Skipping playlist with no ID:', playlist);
      continue;
    }

    try {
      const artists = await crawlPlaylistTracks(token, playlist.id);

      if (!Array.isArray(artists)) {
        console.warn('❌ Skipping playlist with invalid artist response:', playlist.name, artists);
        continue;
      }

      artists.forEach(artist => {
        if (!artist || !artist.id || !artist.name) {
          console.warn('⚠️ Skipping invalid artist:', artist);
          return;
        }

        if (allArtists[artist.id]) return;

        const enhanced = {
          id: artist.id,
          name: artist.name,
          image: artist.image || '',
          genres: artist.genres || [],
          monthlyListeners: artist.monthlyListeners || 0,
          releaseDaysAgo: artist.releaseDaysAgo ?? undefined, // ✅ NEW
          preview_url: artist.preview_url || '',
        };

        console.log('🎯 Final Enhanced Artist (Genre Crawler):', enhanced);
        allArtists[artist.id] = enhanced;
      });
    } catch (e) {
      console.error('💥 Error crawling playlist ID:', playlist.id, e.message);
    }
  }

  const validResults = Object.values(allArtists).filter(
    a => a && typeof a === 'object' && a.id && a.name
  );

  console.log('✅ Final enriched artists array:', validResults);
  console.log('✅ Final artist count:', validResults.length);

  return validResults;
}
