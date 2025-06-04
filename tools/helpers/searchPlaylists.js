// tools/helpers/searchPlaylists.js
import fetch from 'node-fetch';

export const searchPlaylists = async (genre, limit = 10) => {
  const token = process.env.SPOTIFY_TOKEN;
  if (!token) {
    console.error('❌ SPOTIFY_TOKEN not found in env');
    return [];
  }

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(genre)}&type=playlist&limit=${limit}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('❌ Error fetching playlists:', await res.text());
    return [];
  }

  const data = await res.json();
  return data.playlists?.items || [];
};
