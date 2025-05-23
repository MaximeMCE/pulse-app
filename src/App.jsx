import Dashboard from './pages/Dashboard.jsx';
import Explorer from './pages/Explorer.jsx';
import ArtistProfile from './pages/ArtistProfile.jsx';
import Leads from './pages/Leads.jsx';
import Settings from './pages/Settings.jsx';
import Sidebar from './components/Sidebar.jsx'

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
