import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedLayout from './ProtectedLayout';

import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import LeadsLegacy from './pages/LeadsLegacy';
import ArtistProfile from './pages/ArtistProfile';
import ArtistSearch from './pages/ArtistSearch'; // NEW
import Settings from './pages/Settings';
import Login from './pages/Login';
import Callback from './Callback';

function App() {
  // 👇 This line reads the token saved after login
  const accessToken = localStorage.getItem('access_token');

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/leads" element={<LeadsLegacy />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<ArtistSearch token={accessToken} />} />
      </Route>
    </Routes>
  );
}

export default App;
