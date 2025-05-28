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

  return items.map(item => {
    const track = item.track;

    return {
      preview_url: track.preview_url,
      albumImages: track.album?.images || [],
      artists: track.artists || []
    };
  });
};
