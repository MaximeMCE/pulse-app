import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ this line was missing too
import ProtectedLayout from './ProtectedLayout';

import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import Login from './pages/Login';
import Settings from './pages/Settings';
import ArtistProfile from './pages/ArtistProfile';

import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';

function App() {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
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

        {/* Campaign Routes */}
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
    </>
  );
}

export default App;
