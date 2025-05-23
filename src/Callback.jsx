import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const verifier = localStorage.getItem('code_verifier');

		if (!code || !verifier) {
			console.error('❌ Missing code or verifier');
			return;
		}

		const body = new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: 'https://celebrated-hotteok-20bdf2.netlify.app/callback',
			client_id: '43d52d0d3774470688a3fec0bc7e3378',
			code_verifier: verifier,
		});

		fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body.toString(),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log('✅ Access token response:', data);
				localStorage.setItem('spotifyAccessToken', data.access_token);

				// 🎧 Fetch the user profile
				fetch('https://api.spotify.com/v1/me', {
					headers: {
						Authorization: `Bearer ${data.access_token}`,
					},
				})
					.then((res) => res.json())
					.then((profile) => {
						console.log('🎧 Spotify Profile:', profile);
						localStorage.setItem('spotifyUserProfile', JSON.stringify(profile));
						navigate('/dashboard');
					})
					.catch((err) => {
						console.error('❌ Failed to fetch profile:', err);
					});
			})
			.catch((err) => {
				console.error('❌ Token exchange failed:', err);
			});
	}, [navigate]);

	return (
		<div style={{ backgroundColor: 'black', color: 'lime', padding: '20px' }}>
			✅ Callback received — token + profile in console. Redirecting...
		</div>
	);
};

export default Callback;
