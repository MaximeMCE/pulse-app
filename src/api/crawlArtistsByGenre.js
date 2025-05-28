import { fetchPlaylistsByGenre } from './fetchPlaylistsByGenre';
import { crawlPlaylistTracks } from './crawlPlaylistTracks';

export async function crawlArtistsByGenre(token, filters) {
  const allArtists = {};
  const genre = filters.genres[0];

  const playlists = await fetchPlaylistsByGenre(token, genre);
  const topPlaylists = playlists.slice(0, 3);

  for (const playlist of topPlaylists) {
    const tracks = await crawlPlaylistTracks(token, playlist.id);

    tracks.forEach(track => {
      if (!track || !Array.isArray(track.artists)) {
        console.warn('❌ Skipping invalid track:', track);
        return;
      }

      const validArtist = track.artists.find(a => a && a.id && a.name);
      if (!validArtist) {
        console.warn('⚠️ Skipping track with malformed artist:', track.artists);
        return;
      }

      if (allArtists[validArtist.id]) return;

      try {
        allArtists[validArtist.id] = {
          id: validArtist.id,
          name: validArtist.name,
          images: validArtist.images || [],
          genres: validArtist.genres || [],
          listeners: validArtist.followers?.total || 0,
          preview_url: track.preview_url || null,
          releaseDaysAgo: track.releaseDaysAgo || null,
        };
      } catch (e) {
        console.error('💥 Error parsing artist:', validArtist, e);
      }
    });
  }

  console.log('✅ Final artist count:', Object.keys(allArtists).length);
  return Object.values(allArtists);
}
