import React from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem('spotify_access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {children} {/* ✅ this renders the actual page */}
      </main>
    </div>
  );
};

export default ProtectedLayout;
