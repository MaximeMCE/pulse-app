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

  const artistsMap = new Map();

  for (const item of items) {
    const track = item.track;
    const mainArtist = track.artists?.[0];

    if (mainArtist && !artistsMap.has(mainArtist.id)) {
      artistsMap.set(mainArtist.id, {
        id: mainArtist.id,
        name: mainArtist.name,
        preview_url: track.preview_url,
        images: track.album?.images || []
      });
    }
  }

  return Array.from(artistsMap.values());
};
