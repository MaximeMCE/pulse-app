import axios from 'axios';
import { fetchArtistsByIds } from './fetchArtistsByIds.js';

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

  const items = Array.isArray(response.data?.items) ? response.data.items : [];

  const artistTrackMap = new Map();

  for (const item of items) {
    const track = item.track;
    const artist = track?.artists?.[0];

    if (!artist?.id) continue;

    if (!artistTrackMap.has(artist.id)) {
      artistTrackMap.set(artist.id, {
        id: artist.id,
        name: artist.name,
        preview_url: track.preview_url || '',
        albumImage: track.album?.images?.[0]?.url || ''
      });
    }
  }

  const uniqueArtistIds = Array.from(artistTrackMap.keys());
  const enrichedArtists = await fetchArtistsByIds(token, uniqueArtistIds);

  return enrichedArtists.map((a) => {
    const base = artistTrackMap.get(a.id) || {};

    return {
      id: a.id,
      name: a.name || 'Unknown',
      preview_url: base.preview_url || '',
      image: a.images?.[0]?.url || '',
      albumImage: base.albumImage || '',
      genres: a.genres || [],
      followers: a.followers?.total || 0
    };
  });
};
