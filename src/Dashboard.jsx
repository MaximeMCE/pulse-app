// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import ArtistProfile from './pages/ArtistProfile';
import Leads from './pages/Leads';
import Settings from './pages/Settings';

const App = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explorer />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;


// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-60 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">Pulse</h1>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-yellow-400">Dashboard</Link>
        <Link to="/explore" className="block hover:text-yellow-400">Explore</Link>
        <Link to="/leads" className="block hover:text-yellow-400">Leads</Link>
        <Link to="/settings" className="block hover:text-yellow-400">Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;


// pages/Dashboard.jsx
import React from 'react';
const Dashboard = () => <h2 className="text-xl font-semibold">Dashboard Overview</h2>;
export default Dashboard;

// pages/Explorer.jsx
import React from 'react';
const Explorer = () => <h2 className="text-xl font-semibold">Artist Explorer</h2>;
export default Explorer;

// pages/ArtistProfile.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
const ArtistProfile = () => {
  const { id } = useParams();
  return <h2 className="text-xl font-semibold">Artist Profile: {id}</h2>;
};
export default ArtistProfile;

// pages/Leads.jsx
import React from 'react';
const Leads = () => <h2 className="text-xl font-semibold">Lead Tracker</h2>;
export default Leads;

// pages/Settings.jsx
import React from 'react';
const Settings = () => <h2 className="text-xl font-semibold">Settings</h2>;
export default Settings;
