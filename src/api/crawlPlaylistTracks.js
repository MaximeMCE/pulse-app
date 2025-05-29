import axios from 'axios';
import { fetchArtistsByIds } from './fetchArtistsByIds.js';

export const crawlPlaylistTracks = async (token, playlistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 100,
        },
      }
    );

    const items = Array.isArray(response.data?.items) ? response.data.items : [];

    const artistTrackMap = new Map();

    for (const item of items) {
      const track = item.track;
      const artist = track?.artists?.[0];

      if (!track || !artist?.id) continue;
      if (track.is_local || track.type !== 'track') continue;

      const releaseDate = track.album?.release_date;
      const releaseDaysAgo = releaseDate
        ? Math.floor((Date.now() - new Date(releaseDate)) / (1000 * 60 * 60 * 24))
        : undefined;

      if (!artistTrackMap.has(artist.id)) {
        artistTrackMap.set(artist.id, {
          id: artist.id,
          name: artist.name || 'Unknown',
          preview_url: track.preview_url || '',
          albumImage: track.album?.images?.[0]?.url || '',
          releaseDaysAgo, // ✅ ADD HERE
        });
      }
    }

    const uniqueArtistIds = Array.from(artistTrackMap.keys());
    if (uniqueArtistIds.length === 0) return [];

    const enrichedArtists = await fetchArtistsByIds(token, uniqueArtistIds);

    return enrichedArtists.map((a) => {
      const base = artistTrackMap.get(a.id) || {};

      const finalArtist = {
        id: a.id,
        name: a.name || base.name || 'Unknown',
        preview_url: base.preview_url || '',
        image:
          (Array.isArray(a.images) && a.images[0]?.url) ||
          base.albumImage ||
          'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
        genres: Array.isArray(a.genres) ? a.genres : [],
        monthlyListeners: a.monthlyListeners || 0,
        releaseDaysAgo: base.releaseDaysAgo, // ✅ INCLUDE HERE
      };

      console.log('🎯 Final Enhanced Artist:', finalArtist);
      return finalArtist;
    });
  } catch (err) {
    console.error('❌ Error crawling playlist tracks:', err.message);
    return [];
  }
};
