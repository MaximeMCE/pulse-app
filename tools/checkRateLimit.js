import fetch from 'node-fetch';

const ACCESS_TOKEN = process.env.SPOTIFY_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ SPOTIFY_TOKEN not set');
  process.exit(1);
}

const run = async () => {
  try {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    console.log(`Status Code: ${res.status}`);

    const retryAfter = res.headers.get('retry-after');
    if (retryAfter) {
      console.log(`⏳ Retry After: ${retryAfter} seconds`);
    }

    const body = await res.text();
    console.log('Response:', body);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

run();
