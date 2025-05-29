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
            Authorization: `Bearer ${token}`
          },
          params: {
            ids: batch.join(',')
          }
        }
      );

      if (Array.isArray(response.data?.artists)) {
        results.push(...response.data.artists);
      }
    } catch (err) {
      console.error('❌ Error fetching artist batch:', batch, err?.response?.data || err.message);
    }
  }

  return results;
};
