import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contractInfo';
import { getLockedTicketTokenURI, isValidLockedTicketTokenURI } from '../nftConfig';

// Data dummy yang sama seperti di Home (Nanti ditarik dari Smart Contract)
const DUMMY_EVENTS = [
  {
    id: 1,
    title: "Final: Brazil vs Germany",
    date: "15 Juli 2026",
    time: "20:00 WITA",
    venue: "Lusail Stadium",
    price: 0.01,
    sisaTiket: 12,
  },
  {
    id: 2,
    title: "Semi-Final: Argentina vs France",
    date: "12 Juli 2026",
    time: "22:00 WITA",
    venue: "Al Bayt Stadium",
    price: 0.01,
    sisaTiket: 45,
  },
  {
    id: 3,
    title: "Quarter-Final: Portugal vs Spain",
    date: "10 Juli 2026",
    time: "19:00 WITA",
    venue: "Education City Stadium",
    price: 0.001,
    sisaTiket: 0,
  },
];

export default function DetailEvent() {
  const { id } = useParams(); // Mengambil ID dari URL
  const event = DUMMY_EVENTS.find((e) => e.id === parseInt(id));
  const navigate = useNavigate();

  // State untuk melacak jumlah tiket yang mau dibeli
  const [ticketCount, setTicketCount] = useState(1);

  if (!event) {
    return (
      <div className="p-8 text-center text-2xl font-bold">
        Event tidak ditemukan!
      </div>
    );
  }

  // Fungsi untuk mengatur jumlah tiket (Anti-Scalping: Maksimal 2)
  const handleAdd = () => {
    if (ticketCount < 2) setTicketCount(ticketCount + 1);
  };
  const handleMin = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  // State to disable the button while the transaction is mining
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleBuyTicket = async () => {
    // 1. Double check they are connected to MetaMask
    if (!window.ethereum) {
      alert("Please connect your MetaMask wallet first!");
      return;
    }

    try {
      setIsPurchasing(true); // Start loading

      // 2. Set up the Ethers Engine (v6 syntax)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // 3. Connect to YOUR specific Smart Contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // 4. Use a locked, canonical metadata URI to prevent malformed tokenURIs.
      const tokenURI = getLockedTicketTokenURI();
      if (!isValidLockedTicketTokenURI(tokenURI)) {
        throw new Error("Invalid locked ticket metadata URI configuration.");
      }

      // 5. Call the buyTicket function and send exactly 0.01 ETH
      console.log("Sending transaction to the blockchain...");
      const transaction = await contract.buyTicket(tokenURI, {
        value: ethers.parseEther("0.01") 
      });

      // 6. Wait for the block to be mined
      console.log("Waiting for block confirmation...");
      await transaction.wait();

      alert("🎉 Ticket purchased successfully!");
      
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Transaction failed. Check the console for details.");
    } finally {
      setIsPurchasing(false); // Stop loading
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Tombol Kembali */}
      <Link
        to="/"
        className="text-cupBlue hover:text-cupGold font-semibold mb-6 inline-block">
        ← Kembali ke Daftar Pertandingan
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        {/* Kolom Kiri: Detail Visual (Placeholder Denah Stadion) */}
        <div className="md:w-1/2 bg-cupDark p-10 text-white flex flex-col justify-center items-center border-b md:border-b-0 md:border-r-4 border-cupGold">
          <h2 className="text-3xl font-bold text-center mb-2">{event.title}</h2>
          <p className="text-cupGold text-lg mb-8">{event.venue}</p>

          <div className="w-full h-48 border-2 border-dashed border-gray-500 flex items-center justify-center rounded-xl bg-gray-800 opacity-70">
            <span className="text-gray-400">
              🏟️ [Placeholder Denah Stadion]
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Detail Pembelian */}
        <div className="md:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
              Informasi Pertandingan
            </h3>
            <ul className="space-y-3 text-gray-600 mb-8">
              <li>
                <strong>📅 Tanggal:</strong> {event.date}
              </li>
              <li>
                <strong>⏰ Waktu:</strong> {event.time}
              </li>
              <li>
                <strong>🎟️ Ketersediaan:</strong> {event.sisaTiket} Tiket
                Tersisa
              </li>
              <li>
                <strong>💎 Harga Satuan:</strong> {event.price} ETH
              </li>
            </ul>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
              <p className="text-sm text-blue-800 font-semibold mb-3">
                🛡️ Keamanan Anti-Scalping Aktif
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Jumlah Tiket (Maks. 2):</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMin}
                    className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold text-gray-700">
                    -
                  </button>
                  <span className="font-bold text-lg w-4 text-center">
                    {ticketCount}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold text-gray-700">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-500 font-semibold">Total Harga:</span>
              <span className="text-3xl font-bold text-cupBlue">
                {(event.price * ticketCount).toFixed(2)} ETH
              </span>
            </div>

            <button 
              onClick={handleBuyTicket} 
              disabled={isPurchasing}
              className="w-full bg-blue-600 text-white font-bold text-lg px-6 py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-lg"
            >
              {isPurchasing ? "Minting Ticket..." : "Buy Ticket (0.01 ETH)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}