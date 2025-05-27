import React from 'react';
import useTalentPool from '../hooks/useTalentPool';

const ArtistCard = ({
  artist,
  isOpen,
  onToggleDropdown,
  onSaveLead,
  campaignList,
  isSavedTo,
  assignedCampaigns = [],
  onRemoveFromCampaign
}) => {
  const {
    addToPool,
    removeFromPool,
    isInPool
  } = useTalentPool();

  const handlePoolToggle = () => {
    const baseArtist = {
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || '',
      genres: artist.genres || [],
      monthlyListeners: artist.followers?.total || 0,
      preview_url: artist.preview_url || '',
      platforms: ['spotify']
    };
    isInPool(artist.id) ? removeFromPool(artist.id) : addToPool(baseArtist);
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow">
      {/* === Artist Header === */}
      <div className="flex items-center">
        {artist.images[0] && (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="rounded-full mr-4 object-cover"
            style={{
              width: '80px',
              height: '80px',
              minWidth: '80px',
              minHeight: '80px',
              maxWidth: '80px',
              maxHeight: '80px',
            }}
          />
        )}
        <div className="flex-1">
          <div className="font-semibold">{artist.name}</div>
          <div className="text-sm text-gray-500">
            Followers: {artist.followers.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            Genres: {artist.genres.slice(0, 2).join(', ') || 'N/A'}
          </div>
        </div>
      </div>

      {/* === Campaign Tags === */}
      {assignedCampaigns.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {assignedCampaigns.map((camp) => (
            <div
              key={camp}
              className="flex items-center bg-gray-100 text-xs text-gray-700 border border-gray-300 px-2 py-1 rounded"
            >
              {camp}
              <button
                onClick={() => onRemoveFromCampaign(artist.id, camp)}
                className="ml-2 text-red-500 hover:text-red-700"
                title={`Remove from ${camp}`}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      {/* === Visually Detached Button Section === */}
      <div className="mt-4 pt-3 border-t flex gap-2 flex-wrap">
        <button
          onClick={handlePoolToggle}
          className={`text-xs px-3 py-1 rounded border ${
            isInPool(artist.id)
              ? 'border-red-400 text-red-600 hover:bg-red-50'
              : 'border-gray-400 text-gray-800 hover:bg-gray-100'
          }`}
        >
          {isInPool(artist.id) ? '❌ Pool' : '+ Pool'}
        </button>

        <button
          onClick={() => onToggleDropdown(artist.id)}
          className="text-xs px-3 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          + Campaign
        </button>
      </div>

      {/* === Dropdown Campaign Selector === */}
      {isOpen && (
        <div className="mt-2">
          <div className="bg-white border p-3 rounded shadow max-w-xs">
            <div className="text-xs font-semibold text-gray-600 mb-2">Choose campaign:</div>
            <div className="flex flex-wrap gap-2">
              {campaignList
                .filter((c) => c !== 'Talent Pool')
                .map((c) => (
                  <button
                    key={c}
                    onClick={() => onSaveLead(artist, c)}
                    disabled={isSavedTo(artist.id, c)}
                    className={`px-3 py-1 rounded text-sm border ${
                      isSavedTo(artist.id, c)
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'hover:bg-blue-50 border-gray-400 text-black'
                    }`}
                  >
                    {isSavedTo(artist.id, c) ? `✅ ${c}` : c}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistCard;
