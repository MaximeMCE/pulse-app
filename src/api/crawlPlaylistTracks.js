// /api/crawlPlaylistTracks.js
import axios from 'axios';

export const crawlPlaylistTracks = async (token, playlistId) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        fields: 'items(track(name,preview_url,artists(id,name),album(images)))',
        limit: 100
      }
    }
  );

  const items = response.data.items || [];

  // ✅ Return raw full track objects as expected by crawlArtistsByGenre
  return items
    .map(item => item.track)
    .filter(track => track && Array.isArray(track.artists));
};
