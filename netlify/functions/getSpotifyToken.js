const axios = require('axios');

exports.handler = async function (event) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing environment variables' }),
    };
  }

  const { code, codeVerifier } = JSON.parse(event.body || '{}');

  if (!code || !codeVerifier) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing code or code_verifier' }),
    };
  }

  try {
    const tokenRes = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(tokenRes.data),
    };
  } catch (err) {
    console.error("Spotify Token Error:", err.response?.data || err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to exchange token', details: err.response?.data || err.message }),
    };
  }
};
