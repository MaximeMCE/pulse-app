import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const ProtectedLayout = () => {
  const [token, setToken] = useState(localStorage.getItem('spotify_access_token'));

  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem('spotify_access_token');
      if (current !== token) {
        setToken(current);
      }
    }, 200); // check every 200ms for login update

    return () => clearInterval(interval);
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
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
