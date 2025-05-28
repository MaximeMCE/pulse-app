// netlify/functions/getSpotifyClientId.js
exports.handler = async function () {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing SPOTIFY_CLIENT_ID' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ clientId }),
  };
};
