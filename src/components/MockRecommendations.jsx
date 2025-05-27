import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const mockArtists = [
  { name: 'DJ Aurora', genre: 'House', region: 'Amsterdam' },
  { name: 'Bassline Syndicate', genre: 'Techno', region: 'Berlin' },
  { name: 'Luna Fade', genre: 'Electropop', region: 'Paris' },
  { name: 'Night Drip', genre: 'Trap', region: 'Rotterdam' },
  { name: 'Sonic Bloom', genre: 'Ambient', region: 'London' },
];

const MockRecommendations = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('campaigns');
    if (!stored) return;

    const all = JSON.parse(stored);
    const found = all.find((c) => c.id === id);
    if (!found) return;
    setCampaign(found);

    const keywords = (found.goal || '').toLowerCase();
    const region = (found.region || '').toLowerCase();

    const results = mockArtists.filter((artist) => {
      const genreMatch = keywords.includes(artist.genre.toLowerCase());
      const regionMatch = region && artist.region.toLowerCase().includes(region);
      return genreMatch || regionMatch;
    });

    setSuggested(results.slice(0, 3));
  }, [id]);

  if (!campaign) return null;

  return (
    <div>
      {suggested.length > 0 ? (
        <ul className="space-y-2">
          {suggested.map((artist, index) => (
            <li
              key={index}
              className="border rounded px-3 py-2 bg-gray-50 flex justify-between items-center"
            >
              <span>
                <strong>{artist.name}</strong> — {artist.genre} ({artist.region})
              </span>
              <button className="text-sm text-blue-600 hover:underline">
                + Add to campaign
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No relevant suggestions found yet.</p>
      )}
    </div>
  );
};

export default MockRecommendations;
