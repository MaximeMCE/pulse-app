import axios from 'axios';

export const fetchArtistsByIds = async (token, ids) => {
  const batches = [];
  const results = [];

  for (let i = 0; i < ids.length; i += 50) {
    batches.push(ids.slice(i, i + 50));
  }

  for (const batch of batches) {
    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/artists',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: batch.join(','),
          },
        }
      );

      // 👇 LOG RAW RESPONSE BEFORE ANY MAPPING
      console.log('🎯 RAW Spotify artist batch response:', response.data);

      if (Array.isArray(response.data?.artists)) {
        const cleanedArtists = response.data.artists.map((artist) => {
          const listeners = artist.followers?.total || 0;

          // 👇 LOG INDIVIDUAL ARTIST OBJECT
          console.log('🎧 Single artist raw:', artist);

          return {
            id: artist.id,
            name: artist.name,
            genres: artist.genres || [],
            images: artist.images || [],
            monthlyListeners: listeners,
          };
        });

        results.push(...cleanedArtists);
      }
    } catch (err) {
      console.error('❌ Error fetching artist batch:', batch, err?.response?.data || err.message);
    }
  }

  return results;
};
