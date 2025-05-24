import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // ✅ adjust path if needed

const ProtectedLayout = () => {
  const token = localStorage.getItem('spotify_access_token');
  console.log('Token in ProtectedLayout:', token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
