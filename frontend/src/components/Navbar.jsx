import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

export default function Navbar({ account, setAccount }) {
  // TODO: Nanti ganti string ini dengan address wallet asli milik Harry & Daffa
  // Pastikan hurufnya kecil semua (lowercase) untuk pencocokan yang akurat
  const adminAddress = "0xAlamatWalletAdminNantiDisini".toLowerCase();
  const panitiaAddress = "0xAlamatWalletHarryNantiDisini".toLowerCase();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address.toLowerCase());
      } catch (error) {
        console.error("Gagal konek MetaMask:", error);
      }
    } else {
      alert("Tolong install ekstensi MetaMask di browser kamu!");
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
        
        {/* LOGIKA ROLE ACCESS: Menu ini hanya muncul jika address cocok atau saat testing (account belum ada) */}
        {(!account || account === panitiaAddress) && (
          <Link to="/panitia" className="hover:text-cupGold transition-colors text-orange-300">⚙️ Panitia</Link>
        )}
        
        {(!account || account === adminAddress) && (
          <Link to="/admin" className="hover:text-cupGold transition-colors text-purple-300">👑 Admin</Link>
        )}
        
        {account ? (
          <div className="bg-green-600 px-4 py-2 rounded-lg text-sm border-2 border-green-400">
            ✅ {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        ) : (
          <button 
            onClick={connectWallet} 
            className="bg-cupGold text-cupDark px-5 py-2 rounded-lg hover:bg-orange-400 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}