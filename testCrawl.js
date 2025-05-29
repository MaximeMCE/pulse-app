import { crawlArtistsByGenre } from './src/api/crawlArtistsByGenre.js';

const token = process.env.SPOTIFY_TOKEN;

const testFilters = {
  genres: ['techno'],
  tier: 'any',
  release: 'any'
};

crawlArtistsByGenre(token, testFilters)
  .then((artists) => {
    console.log('✅ Returned artist count:', artists.length);
    artists.forEach((a, i) => {
      if (!a || !a.id || !a.name) {
        console.warn(`⚠️ Invalid artist at index ${i}:`, a);
      } else {
        console.log(`🧪 ${i}: ${a.name} (${a.id}) - ${a.monthlyListeners} listeners`);
      }
    });
  })
  .catch((err) => {
    console.error('💥 Error during crawl:', err);
  });
