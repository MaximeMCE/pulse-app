import { fetchPlaylistsByGenre } from './fetchPlaylistsByGenre';
import { crawlPlaylistTracks } from './crawlPlaylistTracks';

export async function crawlArtistsByGenre(token, filters) {
  const allArtists = {};
  const genre = filters.genres[0];

  const playlists = await fetchPlaylistsByGenre(token, genre);
  const topPlaylists = playlists.slice(0, 3);

  for (const playlist of topPlaylists) {
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

      try {
        const enhanced = {
          id: artist.id,
          name: artist.name,
          image: artist.images?.[0]?.url || '',
          genres: artist.genres || [],
          monthlyListeners: artist.followers?.total || 0,
          preview_url: artist.preview_url || '',
        };

        console.log('🎯 Final Enhanced Artist:', enhanced);

        allArtists[artist.id] = enhanced;
      } catch (e) {
        console.error('💥 Error parsing artist:', artist, e);
      }
    });
  }

  const validResults = Object.values(allArtists).filter(
    a => a && typeof a === 'object' && a.id && a.name
  );

  console.log('✅ Final artist count:', validResults.length);
  return validResults;
}
