// /api/fetchPlaylistsByGenre.js
import axios from 'axios';

export const fetchPlaylistsByGenre = async (token, genreQuery) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/search`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: genreQuery,
        type: 'playlist',
        limit: 10 // Tune as needed
      }
    }
  );

  const playlists = response.data.playlists?.items || [];

  return playlists.map(p => ({
    id: p.id,
    name: p.name,
    tracksHref: p.tracks.href
  }));
};
