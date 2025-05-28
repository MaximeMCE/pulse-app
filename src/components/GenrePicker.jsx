// /components/GenrePicker.jsx
import React from 'react';
import { genreMap } from '../api/genreMap'; // import curated genre list

const GENRES = Object.keys(genreMap); // display only clean scout labels

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
