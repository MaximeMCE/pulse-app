import { fetchPlaylistsByGenre } from './fetchPlaylistsByGenre';
import { crawlPlaylistTracks } from './crawlPlaylistTracks';

export async function crawlArtistsByGenre(token, filters) {
  const allArtists = {};
  const genre = filters.genres[0]; // use the first selected genre for now

  const playlists = await fetchPlaylistsByGenre(token, genre);
  const topPlaylists = playlists.slice(0, 3); // limit to top 3 for performance

  for (const playlist of topPlaylists) {
    const tracks = await crawlPlaylistTracks(token, playlist.id);

    tracks.forEach(track => {
      const artist = track.artists?.[0];
      if (!artist || allArtists[artist.id]) return;

      allArtists[artist.id] = {
        id: artist.id,
        name: artist.name,
        images: artist.images || [],
        genres: artist.genres || [],
        listeners: artist.followers?.total || 0,
        preview_url: track.preview_url || null,
        releaseDaysAgo: track.releaseDaysAgo || null,
      };
    });
  }

  return Object.values(allArtists);
}
