// tools/bulkSeedSpotifyGenres.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const ACCESS_TOKEN = process.env.SPOTIFY_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ SPOTIFY_TOKEN not found in env');
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

// Rate-limit safe fetch
const fetchWithRetry = async (url, options = {}, attempt = 1) => {
  const res = await fetch(url, options);
  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('Retry-After') || '5', 10);
    console.warn(`⏳ Rate limited. Retrying after ${retryAfter}s...`);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return fetchWithRetry(url, options, attempt + 1);
  }
  return res;
};

const genres = [
  'house', 'techno', 'indie', 'rap', 'afro', 'latin',
  'hyperpop', 'trap', 'pop', 'electronic', 'ambient',
  'disco', 'funk', 'lofi', 'rnb'
];

const searchPlaylists = async (genre) => {
  const q = encodeURIComponent(genre);
  const res = await fetchWithRetry(`https://api.spotify.com/v1/search?q=${q}&type=playlist&limit=10`, { headers: HEADERS });
  const data = await res.json();
  return data.playlists?.items || [];
};

const getPlaylistTracks = async (playlistId) => {
  let allTracks = [];
  let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

  while (nextUrl) {
    const res = await fetchWithRetry(nextUrl, { headers: HEADERS });
    const data = await res.json();
    if (!data || !data.items) break;
    allTracks.push(...data.items);
    nextUrl = data.next;
  }

  return allTracks;
};

const getArtistsMetadata = async (artistIds) => {
  const chunks = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    const ids = artistIds.slice(i, i + 50).join(',');
    const res = await fetchWithRetry(`https://api.spotify.com/v1/artists?ids=${ids}`, { headers: HEADERS });
    const data = await res.json();
    chunks.push(...(data.artists || []));
  }
  return chunks;
};

const seedGenre = async (genre) => {
  console.log(`\n🔍 Seeding genre: ${genre}`);
  const playlists = await searchPlaylists(genre);
  if (!playlists.length) return console.warn(`⚠️ No playlists found for ${genre}`);

  const allArtistIds = new Set();
  for (const p of playlists) {
    const tracks = await getPlaylistTracks(p.id);
    for (const t of tracks) {
      if (!t || !t.track || !Array.isArray(t.track.artists)) continue;
      const artist = t.track.artists[0];
      if (artist?.id) allArtistIds.add(artist.id);
    }
  }

  const uniqueIds = [...allArtistIds];
  if (!uniqueIds.length) return console.warn(`⚠️ No artists found for ${genre}`);

  const artists = await getArtistsMetadata(uniqueIds);
  const enriched = artists.map((a) => ({
    id: a.id,
    name: a.name,
    genres: a.genres,
    followers: a.followers.total,
    monthlyListeners: 0,
    image: a.images?.[0]?.url || '',
    preview_url: '',
    source: 'spotify',
    savedAt: new Date().toISOString(),
  }));

  const outputDir = path.resolve('output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  const filePath = path.join(outputDir, `${genre}_seed.json`);
  fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2));
  console.log(`✅ ${enriched.length} artists saved to ${filePath}`);
};

const run = async () => {
  for (const genre of genres) {
    try {
      await seedGenre(genre);
      await new Promise((r) => setTimeout(r, 2000)); // Small pause between genres
    } catch (err) {
      console.error(`❌ Failed to process ${genre}:`, err.message);
    }
  }
};

run();
