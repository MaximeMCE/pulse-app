export const getTopGenres = (genres = [], limit = 2) => {
  return Array.isArray(genres) && genres.length > 0
    ? genres.slice(0, limit).join(', ')
    : 'N/A';
};
