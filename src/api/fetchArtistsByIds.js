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

      if (Array.isArray(response.data?.artists)) {
        const cleanedArtists = response.data.artists.map((artist) => {
          const listeners = artist.followers?.total || 0;

          console.log('🎧 Artist fetched:', {
            name: artist.name,
            followers: artist.followers,
            monthlyListeners: listeners,
          });

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
