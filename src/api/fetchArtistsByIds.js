// api/fetchArtistsByIds.js
import axios from 'axios';

export const fetchArtistsByIds = async (token, ids) => {
  const results = [];
  const batchSize = 50;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists?ids=${batch.join(',')}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const artists = response.data.artists || [];

      artists.forEach((artist) => {
        if (!artist || !artist.id) return;

        const monthlyListeners = artist.followers?.total || 0;

        console.log('🎧 Verified artist:', {
          id: artist.id,
          name: artist.name,
          monthlyListeners,
          genres: artist.genres,
        });

        results.push({
          id: artist.id,
          name: artist.name,
          genres: artist.genres || [],
          images: artist.images || [],
          followers: artist.followers || {},
          monthlyListeners,
        });
      });
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = parseInt(err.response.headers['retry-after'], 10) || 1;
        console.warn(`⏳ Rate limit hit. Retrying after ${retryAfter}s...`);
        await wait(retryAfter * 1000);
        i -= batchSize; // retry this batch
      } else {
        console.error('❌ Error fetching artist batch:', err?.response?.data || err.message);
      }
    }

    // Small delay to avoid hammering the API
    await wait(200);
  }

  return results;
};
