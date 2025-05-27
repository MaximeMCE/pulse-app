import React from 'react';

const ArtistCard = ({
  artist,
  isOpen,
  onToggleDropdown,
  onSaveLead,
  campaignList,
  isSavedTo
}) => {
  return (
    <div key={artist.id} className="border-b py-4 flex items-center">
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
        <div className="mt-2 flex gap-2 flex-wrap">
          <button
            onClick={() => onSaveLead(artist, 'Talent Pool')}
            className="bg-white text-gray-800 text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
          >
            + Pool
          </button>
          <button
            onClick={() => onToggleDropdown(artist.id)}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
          >
            + Campaign
          </button>
        </div>

        {isOpen && (
          <div className="mt-2 bg-white border p-3 rounded shadow max-w-xs">
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
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
