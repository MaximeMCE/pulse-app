import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  const token = localStorage.getItem('spotify_access_token');
  console.log('Token in ProtectedLayout:', token);  // Add this

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
