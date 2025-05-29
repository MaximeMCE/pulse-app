import axios from 'axios';

const token = 'BQDWoTXY9WE7TieZw3-RvJAxz4H3gBgaDNrGASWOdqyFzrs_FKneU_8Svqb1w12tUA9UvCLO99FXF3li6LoaA-92kcIEbgxpAKLi8rxnp_OKS1nh4DAg6_lxyAMVPtpcYys_Cr7cJvN7GS7JaMASMLde5P-ADH1sQvRRpf7awTZfw9EeC3zCJDUZFi0rIBRbzkQHb5luZkhZrncDJtNkcbV5bviDQ5vX';
const playlistId = '37i9dQZF1DX6VdMW310YC7'; // Techno Bunker playlist

(async () => {
  const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      limit: 5
    }
  });

  for (const item of res.data.items) {
    const img = item.track?.album?.images?.[0]?.url;
    console.log('🎨 Album image:', img);
  }
})();

