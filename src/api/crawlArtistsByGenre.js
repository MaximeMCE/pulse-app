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
      if (!track || !track.artists || !Array.isArray(track.artists)) return;

      const artist = track.artists.find(a => a && a.id && a.name);
      if (!artist || allArtists[artist.id]) return;

      try {
        allArtists[artist.id] = {
          id: artist.id,
          name: artist.name,
          images: artist.images || [],
          genres: artist.genres || [],
          listeners: artist.followers?.total || 0,
          preview_url: track.preview_url || null,
          releaseDaysAgo: track.releaseDaysAgo || null,
        };
      } catch (e) {
        console.warn('Skipping artist due to invalid structure', artist, e);
      }
    });
  }

  return Object.values(allArtists);
}
