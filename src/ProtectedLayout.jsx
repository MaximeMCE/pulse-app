import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const ProtectedLayout = () => {
  const token = localStorage.getItem('spotify_access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet /> {/* ✅ Correct way to render nested route pages */}
      </main>
    </div>
  );
};

export default ProtectedLayout;
