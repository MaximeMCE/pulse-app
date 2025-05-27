import React from 'react';
import useTalentPool from '../hooks/useTalentPool';
import useCampaigns from '../hooks/useCampaigns';

const TalentPool = () => {
  const { pool, removeFromPool } = useTalentPool();
  const { campaigns, moveLeadToCampaign } = useCampaigns();

  const handleMove = (artist, campaignId) => {
    moveLeadToCampaign(artist, campaignId);
    removeFromPool(artist.id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <h2 className="text-2xl font-bold mb-6">🎯 Talent Pool</h2>

      {pool.length === 0 ? (
        <p className="text-gray-500">Your pool is empty. Add artists from Explorer.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pool.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={artist.image || 'https://via.placeholder.com/60'}
                  alt={artist.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold">{artist.name}</p>
                  <p className="text-sm text-gray-500">Status: {artist.status || 'New'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  onChange={(e) => handleMove(artist, e.target.value)}
                  defaultValue=""
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="" disabled>
                    Move to Campaign
                  </option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => removeFromPool(artist.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TalentPool;
