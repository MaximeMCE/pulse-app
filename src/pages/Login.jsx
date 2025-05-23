import React from 'react';

const Login = () => {
  const handleLogin = () => {
    const clientId = "43d52d0d3774470688a3fec0bc7e3378"; // Your real client ID
    const redirectUri = "https://pulse-app.netlify.app/callback"; // ← UPDATE if you rename the Netlify site
    const scopes = [
      "user-read-email",
      "playlist-read-private",
      "user-top-read",
      "user-read-recently-played"
    ].join(" ");

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Pulse</h1>
        <p className="mb-4 text-gray-300">Track emerging artists before they blow up.</p>
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-full font-semibold"
        >
          Connect with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;
