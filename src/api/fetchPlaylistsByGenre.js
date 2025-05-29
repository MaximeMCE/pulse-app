import axios from 'axios';

export const fetchPlaylistsByGenre = async (token, genre) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(genre)}&type=playlist&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const playlists = response?.data?.playlists?.items;

    if (!Array.isArray(playlists)) {
      console.warn('⚠️ No playlists returned for genre:', genre, response?.data);
      return [];
    }

    console.log(`🎧 Found ${playlists.length} playlists for genre "${genre}"`);
    return playlists.map((p) => ({
      id: p?.id || '',
      name: p?.name || 'Unnamed Playlist',
      description: p?.description || '',
      image: p?.images?.[0]?.url || '',
      owner: p?.owner?.display_name || 'Unknown',
    }));
  } catch (err) {
    console.error('💥 Error in fetchPlaylistsByGenre:', err?.response?.data || err);
    return [];
  }
};
