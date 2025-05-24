import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const fetchToken = async () => {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			const verifier = localStorage.getItem('spotify_code_verifier');

			if (!code || !verifier) {
				console.error('Missing code or verifier');
				return;
			}

			const body = new URLSearchParams({
				client_id: '43d52d0d3774470688a3fec0bc7e3378',
				grant_type: 'authorization_code',
				code,
				redirect_uri: 'https://pulse-scout.netlify.app/callback',
				code_verifier: verifier,
			});

			try {
				const res = await fetch('https://accounts.spotify.com/api/token', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body,
				});

				const data = await res.json();

				if (data.access_token) {
					localStorage.setItem('spotify_access_token', data.access_token);
					console.log('✅ Access token saved. Redirecting to /campaigns...');
					navigate('/campaigns'); // ✅ updated from /dashboard to /campaigns
				} else {
					console.error('❌ Token error:', data);
				}
			} catch (err) {
				console.error('❌ Fetch error:', err);
			}
		};

		fetchToken();
	}, [navigate]);

	return (
		<div className="flex justify-center items-center min-h-screen">
			<p>Connecting to Spotify...</p>
		</div>
	);
};

export default Callback;
