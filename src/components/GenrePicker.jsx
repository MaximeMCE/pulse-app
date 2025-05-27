import React from 'react';

const GENRES = [
  'techno', 'house', 'indie', 'pop', 'hip hop', 'trap', 'electronic',
  'rock', 'ambient', 'experimental', 'funk', 'soul', 'r&b', 'jazz',
  'classical', 'latin', 'afro', 'drum & bass', 'dubstep'
];

const GenrePicker = ({ selectedGenres, onChange }) => {
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter(g => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => {
        const selected = selectedGenres.includes(genre);
        return (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              selected
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
};

export default GenrePicker;
