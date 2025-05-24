import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const ProtectedLayout = () => {
  const token = localStorage.getItem('spotify_access_token');

  console.log("🧪 ProtectedLayout loaded");
  console.log("🧪 Token from localStorage:", token);

  if (!token) {
    console.log("🧪 No token, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("🧪 Token found, rendering app layout");
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
