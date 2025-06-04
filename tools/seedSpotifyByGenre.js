// tools/seedSpotifyByGenre.js
import { searchPlaylists } from './helpers/searchPlaylists.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const ACCESS_TOKEN = process.env.SPOTIFY_TOKEN; // Set in shell: export SPOTIFY_TOKEN='...'

const HEADERS = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

const getPlaylistTracks = async (playlistId) => {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`, { headers: HEADERS });
  const data = await res.json();
  return data.items || [];
};

const getArtistsMetadata = async (artistIds) => {
  const chunks = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    const ids = artistIds.slice(i, i + 50).join(',');
    const res = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, { headers: HEADERS });
    const data = await res.json();
    chunks.push(...data.artists);
  }
  return chunks;
};

const run = async () => {
  const genre = process.argv[2];
  if (!genre) {
    console.error('❌ Please provide a genre name.');
    process.exit(1);
  }

  console.log(`🔍 Searching playlists for genre: ${genre}...`);
  const playlists = await searchPlaylists(genre);
  if (!playlists || playlists.length === 0) {
    console.error('❌ No playlists found for genre:', genre);
    return;
  }

  const allArtistIds = new Set();

  for (const p of playlists) {
    if (!p?.id) continue;

    const tracks = await getPlaylistTracks(p.id);
    if (!tracks || tracks.length === 0) continue;

    for (const t of tracks) {
      const artist = t?.track?.artists?.[0];
      if (artist?.id) allArtistIds.add(artist.id);
    }
  }


  const uniqueIds = [...allArtistIds].slice(0, 100); // Limit to 100 per genre
  console.log(`🎯 Found ${uniqueIds.length} unique artists. Enriching...`);

  const artists = await getArtistsMetadata(uniqueIds);

  const enriched = artists.map((a) => ({
    id: a.id,
    name: a.name,
    genres: a.genres,
    followers: a.followers.total,
    monthlyListeners: 0, // Spotify API does not expose this
    image: a.images?.[0]?.url || '',
    preview_url: '', // not available at artist level
    source: 'spotify',
    savedAt: new Date().toISOString(),
  }));

  const outputDir = path.resolve('output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, `${genre}_seed.json`);
  fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2));

  console.log(`✅ Saved ${enriched.length} artists to ${filePath}`);
};

run();
