// src/pages/Login.jsx
import React from 'react';

const Login = () => {
  const handleLogin = () => {
    // Replace with your Spotify auth URL
    window.location.href = "https://accounts.spotify.com/authorize?...";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Pulse</h1>
        <p className="mb-4 text-gray-300">Track emerging artists before anyone else.</p>
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
