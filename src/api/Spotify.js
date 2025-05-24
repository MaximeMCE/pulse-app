import axios from 'axios';

export const searchArtists = async (token, query) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'artist',
        limit: 10,
      },
    });

    return response.data.artists.items;
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
};
