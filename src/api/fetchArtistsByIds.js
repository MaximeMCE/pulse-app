import axios from 'axios';

export const fetchArtistsByIds = async (token, ids) => {
  const results = [];

  for (const id of ids) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const artist = response.data;

      if (!artist || !artist.id) continue;

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
        followers: artist.followers || {}, // Include raw followers object
        monthlyListeners, // Explicitly defined
      });
    } catch (err) {
      console.error('❌ Error fetching artist:', id, err?.response?.data || err.message);
    }
  }

  return results;
};
