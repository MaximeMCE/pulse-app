import React from 'react';

const genreOptions = [
  'Techno',
  'Afrobeats',
  'Indie Pop',
  'House',
  'Trap',
  'Drum & Bass',
  'Experimental',
  'Ambient',
  'Jazz',
  'Synthwave',
];

const GenreSourcePicker = ({ selectedGenre, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
      <h2 className="text-md font-semibold mb-2">🎼 Genre Source</h2>
      <select
        value={selectedGenre}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select a genre...</option>
        {genreOptions.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreSourcePicker;
