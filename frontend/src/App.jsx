import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DashboardPanitia from './pages/DashboardPanitia';
import DashboardAdmin from './pages/DashboardAdmin';
import DetailEvent from './pages/DetailEvent';
import MyTickets from './pages/MyTickets'; // Import halaman MyTickets
import TicketValidation from './pages/TicketValidation'; // Import halaman TicketValidation

function App() {
  // Ini adalah pengganti "Login Session" kita.
  // Jika account berisi teks, berarti user sudah login via MetaMask.
  const [account, setAccount] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        <Navbar account={account} setAccount={setAccount} />
        
        {/* Area Halaman yang berubah-ubah */}
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/panitia" element={<DashboardPanitia />} />
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/event/:id" element={<DetailEvent />} />
            <Route path="/my-tickets" element={<MyTickets />} /> {/* Route untuk MyTickets */}
            <Route path="/validasi" element={<TicketValidation />} /> {/* Route untuk TicketValidation */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;