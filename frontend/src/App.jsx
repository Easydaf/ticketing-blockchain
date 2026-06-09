import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import DashboardAdmin from './pages/DashboardAdmin';
import DetailEvent from './pages/DetailEvent';
import MyTickets from './pages/MyTickets';
import TicketValidation from './pages/TicketValidation';

function AppContent({ account, setAccount }) {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {showNavbar && (
        <Navbar account={account} setAccount={setAccount} />
      )}

      <main className={showNavbar ? 'max-w-7xl mx-auto' : ''}>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<DashboardAdmin account={account} />} />
          <Route path="/event/:id" element={<DetailEvent account={account} />} />
          <Route path="/my-tickets" element={<MyTickets account={account} />} />
          <Route path="/validasi" element={<TicketValidation />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [account, setAccount] = useState(null);

  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <AppContent account={account} setAccount={setAccount} />
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
