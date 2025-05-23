import { useEffect } from 'react';

const Callback = () => {
	useEffect(() => {
		const hash = window.location.hash;
		if (!hash) return;

		const params = new URLSearchParams(hash.substring(1)); // skip '#'
		const accessToken = params.get('access_token');

		if (accessToken) {
			console.log('✅ Access Token:', accessToken);
			// TEMP: just store in localStorage
			localStorage.setItem('spotifyAccessToken', accessToken);
		} else {
			console.log('❌ No token found in URL');
		}
	}, []);

	return (
		<div style={{ backgroundColor: 'black', color: 'lime', padding: '20px' }}>
			✅ Callback received — token should be in console!
		</div>
	);
};

export default Callback;
