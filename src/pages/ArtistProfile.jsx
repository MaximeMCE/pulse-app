import React from 'react';
import { useParams } from 'react-router-dom';

const ArtistProfile = () => {
  const { id } = useParams();
  return <h2 className="text-xl font-semibold">Artist Profile: {id}</h2>;
};

export default ArtistProfile;
