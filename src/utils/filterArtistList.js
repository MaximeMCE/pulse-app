// utils/filterArtistList.js

// Get date X days ago
const daysAgo = (numDays) => {
  const date = new Date();
  date.setDate(date.getDate() - numDays);
  return date;
};

// Main filter function
const filterArtistList = ({ artists = [], audienceTier, recentRelease }) => {
  return artists.filter((artist) => {
    if (!artist || typeof artist !== 'object') return false;

    const listeners = artist.monthlyListeners || 0;
    const releaseDate = artist.latestReleaseDate ? new Date(artist.latestReleaseDate) : null;

    // 🎯 Filter by Audience
    if (audienceTier && audienceTier !== 'any') {
      if (audienceTier === '<10k' && listeners >= 10000) return false;
      if (audienceTier === '10k-50k' && (listeners < 10000 || listeners > 50000)) return false;
      if (audienceTier === '50k-250k' && (listeners < 50000 || listeners > 250000)) return false;
      if (audienceTier === '>250k' && listeners <= 250000) return false;
    }

    // 🕒 Filter by Recent Release
    if (recentRelease && recentRelease !== 'ignore') {
      if (!releaseDate) return false;
      const limitDate = daysAgo(recentRelease === 'last7days' ? 7 : 30);
      if (releaseDate < limitDate) return false;
    }

    return true;
  });
};

export default filterArtistList;
