import axios from 'axios';

export const fetchPlaylistsByGenre = async (token, genre) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(genre)}&type=playlist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const playlists = response.data?.playlists?.items || [];
  return playlists.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.images?.[0]?.url || '',
    owner: p.owner?.display_name || '',
  }));
};
