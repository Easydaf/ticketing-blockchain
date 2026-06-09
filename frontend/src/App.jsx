import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import Navbar from './components/Navbar';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import DashboardAdmin from './pages/DashboardAdmin';
import DetailEvent from './pages/DetailEvent';
import MyTickets from './pages/MyTickets';
import TicketValidation from './pages/TicketValidation';

function AppContent({ account, setAccount }) {
  const location = useLocation();
  const isOnboarding = location.pathname === '/';

  if (isOnboarding) {
    return (
      <Routes>
        <Route path="/" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Navbar account={account} setAccount={setAccount} />
      <main className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<DashboardAdmin account={account} />} />
          <Route path="/event/:id" element={<DetailEvent account={account} />} />
          <Route path="/my-tickets" element={<MyTickets account={account} />} />
          <Route path="/validasi" element={<TicketValidation />} />
        </Routes>
      </main>
    </AppShell>
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
