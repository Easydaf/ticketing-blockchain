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

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("User rejected the connection or an error occurred:", error);
      }
    } else {
      alert("Please install the MetaMask extension to use this DApp!");
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setAdminUsername('');
    setAdminPassword('');
    setLoginError('');
  };

  return (
    <>
      <nav className="bg-cupDark/80 backdrop-blur-md border-b border-white/10 p-4 shadow-md flex justify-between items-center text-white">
        <div className="font-bold text-2xl text-cupGold">
          MetaCup Tickets
        </div>

        <div className="flex gap-6 items-center font-semibold">
          <Link to="/home" className="hover:text-cupGold transition-colors">Home</Link>
          <Link to="/my-tickets" className="hover:text-cupGold transition-colors">My Tickets</Link>

          {isAdminLoggedIn ? (
            <>
              <Link to="/admin" className="hover:text-cupGold transition-colors text-purple-300 font-bold">Admin Dashboard</Link>
              <button
                onClick={logoutAdmin}
                className="bg-red-600/80 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Exit Admin
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-purple-600/80 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Admin Login
            </button>
          )}

          {account ? (
            <div className="bg-green-600/80 px-4 py-2 rounded-lg text-sm border border-green-400/50">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-cupGold text-cupDark px-4 py-2 rounded-lg hover:bg-orange-400 transition font-bold"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="glass-card p-8 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => {
                    setAdminUsername(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="admin123"
                  className="input-dark"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="••••••••"
                  className="input-dark"
                />
              </div>

              {loginError && <p className="text-red-400 text-sm font-semibold">{loginError}</p>}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20 transition border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
