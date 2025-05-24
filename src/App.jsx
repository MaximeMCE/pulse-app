import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';

import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import Login from './pages/Login';
import Callback from './Callback';
import Settings from './pages/Settings';
import ArtistProfile from './pages/ArtistProfile';

import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';

function App() {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/explorer"
        element={
          <ProtectedLayout>
            <Explorer />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        }
      />
      <Route
        path="/artist/:id"
        element={
          <ProtectedLayout>
            <ArtistProfile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/campaigns"
        element={
          <ProtectedLayout>
            <Campaigns />
          </ProtectedLayout>
        }
      />
      <Route
        path="/campaigns/:id"
        element={
          <ProtectedLayout>
            <CampaignDetails />
          </ProtectedLayout>
        }
      />
    </Routes>
  );
}

export default App;
