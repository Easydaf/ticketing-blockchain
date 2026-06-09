import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ account, setAccount }) {
  const { isAdminLoggedIn, loginAdmin, logoutAdmin } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(adminUsername, adminPassword)) {
      setShowLoginModal(false);
      setAdminUsername('');
      setAdminPassword('');
      setLoginError('');
    } else {
      setLoginError('Username atau password salah!');
    }
  };

  // The Web3 Connection Function
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request permission to connect
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        // 🚨 FIXED: Use setAccount to tell the whole app we connected!
        setAccount(address);
        console.log("Connected to wallet:", address);
        
      } catch (error) {
        console.error("User rejected the connection or an error occurred:", error);
      }
    } else {
      alert("Please install the MetaMask extension to use this DApp!");
    }
  };

  return (
    <nav className="bg-cupBlue p-4 shadow-md flex justify-between items-center text-white">
      <div className="font-bold text-2xl text-cupGold">
        MetaCup Tickets
      </div>
      
      <div className="flex gap-6 items-center font-semibold">
        <Link to="/home" className="hover:text-cupGold transition-colors">Home</Link>
        <Link to="/my-tickets" className="hover:text-cupGold transition-colors">My Tickets</Link>
        
        {/* ADMIN LOGIN/LOGOUT BUTTON */}
        {isAdminLoggedIn ? (
          <>
            <Link to="/admin" className="hover:text-cupGold transition-colors text-purple-300 font-bold">Admin Dashboard</Link>
            <button
              onClick={logoutAdmin}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Exit Admin
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Admin Login
          </button>
        )}
        
        {/* 🚨 FIXED: The button now perfectly toggles between Login and the Green Address Box */}
        {account ? (
          <div className="bg-green-600 px-4 py-2 rounded-lg text-sm border-2 border-green-400">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-cupGold text-cupBlue px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* ADMIN LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h2>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => {
                    setAdminUsername(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="admin123"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="••••••••"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>
              
              {loginError && <p className="text-red-600 text-sm font-semibold">{loginError}</p>}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setAdminUsername('');
                    setAdminPassword('');
                    setLoginError('');
                  }}
                  className="flex-1 bg-gray-400 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
