import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  const token = localStorage.getItem('spotify_access_token');

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
