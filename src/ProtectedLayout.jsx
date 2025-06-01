import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const ProtectedLayout = () => {
  const token = localStorage.getItem('spotify_access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Fixed Sidebar */}
      <div className="w-64 fixed left-0 top-0 h-screen bg-white border-r z-10 shadow-sm">
        <Sidebar />
      </div>

      {/* Main Content shifted right */}
      <div className="flex-1 ml-64 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
