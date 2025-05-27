import axios from 'axios';

export const searchArtists = async (token, query, filters = {}) => {
  const { minListeners = 0, maxListeners = 100000, recentRelease = '30' } = filters;

  try {
    const searchRes = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        type: 'artist',
        limit: 30,
      },
    });

    const artists = searchRes.data.artists.items || [];
    const filtered = [];

    for (const artist of artists) {
      // Get full artist info (followers, genres)
      const artistDetails = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const followers = artistDetails.data?.followers?.total || 0;
      if (followers < minListeners || followers > maxListeners) continue;

      // Get latest release
      const releaseRes = await axios.get(
        `https://api.spotify.com/v1/artists/${artist.id}/albums`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            include_groups: 'album,single',
            market: 'US',
            limit: 1,
          },
        }
      );

      const latest = releaseRes.data.items?.[0]?.release_date;
      const daysLimit = parseInt(recentRelease, 10);

      if (latest && recentRelease !== 'off') {
        const releasedAt = new Date(latest);
        const cutoff = new Date(Date.now() - daysLimit * 24 * 60 * 60 * 1000);
        if (releasedAt < cutoff) continue;
      }

      // Push enriched artist
      filtered.push({
        ...artist,
        followers,
        genres: artistDetails.data.genres,
        preview_url: artist.preview_url || null,
      });
    }

    return filtered;
  } catch (error) {
    console.error('Error searching artists with filters:', error);
    return [];
  }
};
