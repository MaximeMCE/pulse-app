export const formatNumber = (val) => {
  return typeof val === 'number' && val > 0 ? val.toLocaleString() : '—';
};

export const getTopGenres = (genres = [], count = 2) => {
  return Array.isArray(genres) && genres.length > 0
    ? genres.slice(0, count).join(', ')
    : 'N/A';
};

export const getSpotifyData = (artist = {}) => {
  return {
    id: artist.id || '',
    name: artist.name || 'Unknown Artist',
    image:
      artist.image ||
      artist.albumImage ||
      'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    genres: Array.isArray(artist.genres) ? artist.genres : [],
    followers:
      typeof artist.followers === 'number' ? artist.followers : 0,
    monthlyListeners:
      typeof artist.monthlyListeners === 'number'
        ? artist.monthlyListeners
        : typeof artist.listeners === 'number'
        ? artist.listeners
        : 0,
    previewUrl: artist.preview_url || '',
  };
};
