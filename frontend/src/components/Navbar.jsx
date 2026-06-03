import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

export default function Navbar({ account, setAccount }) {
  // TODO: Nanti ganti string ini dengan address wallet asli milik Harry & Daffa
  const adminAddress = "0xAlamatWalletAdminNantiDisini".toLowerCase();
  const panitiaAddress = "0xAlamatWalletHarryNantiDisini".toLowerCase();

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
        <Link to="/" className="hover:text-cupGold transition-colors">Home</Link>
        <Link to="/my-tickets" className="hover:text-cupGold transition-colors">My Tickets</Link>
        
        {/* LOGIKA ROLE ACCESS */}
        {(!account || account === panitiaAddress) && (
          <Link to="/panitia" className="hover:text-cupGold transition-colors text-orange-300">⚙️ Panitia</Link>
        )}
        
        {(!account || account === adminAddress) && (
          <Link to="/admin" className="hover:text-cupGold transition-colors text-purple-300">👑 Admin</Link>
        )}
        
        {/* 🚨 FIXED: The button now perfectly toggles between Login and the Green Address Box */}
        {account ? (
          <div className="bg-green-600 px-4 py-2 rounded-lg text-sm border-2 border-green-400">
            ✅ {account.slice(0, 6)}...{account.slice(-4)}
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
    </nav>
  );
}