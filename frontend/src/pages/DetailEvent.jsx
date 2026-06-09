import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contractInfo';
import { getLockedTicketTokenURI, isValidLockedTicketTokenURI } from '../nftConfig';
import { useEvents } from "../hooks/useEvents";

export default function DetailEvent({ account }) {
  const { id } = useParams();
  const { getEventById, addUserTicket } = useEvents();
  const event = getEventById(parseInt(id));

  const [ticketCount, setTicketCount] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!event) {
    return (
      <div className="p-8 text-center text-2xl font-bold text-white">
        Event tidak ditemukan!
      </div>
    );
  }

  const handleAdd = () => {
    if (ticketCount < 2) setTicketCount(ticketCount + 1);
  };
  const handleMin = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  const handleBuyTicket = async () => {
    if (!window.ethereum) {
      alert("Please connect your MetaMask wallet first!");
      return;
    }

    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setIsPurchasing(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tokenURI = getLockedTicketTokenURI();
      if (!isValidLockedTicketTokenURI(tokenURI)) {
        throw new Error("Invalid locked ticket metadata URI configuration.");
      }

      const transaction = await contract.buyTicket(tokenURI, {
        value: ethers.parseEther("0.01")
      });

      await transaction.wait();
      addUserTicket(account, event.id, ticketCount);

      alert("🎉 Ticket purchased successfully!");
      setTicketCount(1);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Transaction failed. Check the console for details.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const availableSeats = event.seatQuantity - event.ticketsSold;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link to="/home" className="link-accent mb-6 inline-block">
        ← Kembali ke Daftar Pertandingan
      </Link>

      <div className="glass-card overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-cupDark/80 p-10 text-white flex flex-col justify-center items-center border-b md:border-b-0 md:border-r-4 border-cupGold">
          <h2 className="text-3xl font-bold text-center mb-2">{event.title}</h2>
          <p className="text-cupGold text-lg mb-8">{event.venue}</p>

          <div className="w-full h-48 border-2 border-dashed border-white/20 flex items-center justify-center rounded-xl bg-black/30">
            <span className="text-gray-400">
              🏟️ [Placeholder Denah Stadion]
            </span>
          </div>
        </div>

        <div className="md:w-1/2 p-8 lg:p-10 flex flex-col justify-between text-gray-300">
          <div>
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">
              Informasi Pertandingan
            </h3>
            <ul className="space-y-3 mb-8">
              <li><strong className="text-white">📅 Tanggal:</strong> {event.date}</li>
              <li><strong className="text-white">⏰ Waktu:</strong> {event.time}</li>
              <li><strong className="text-white">🎟️ Ketersediaan:</strong> {availableSeats} Tiket Tersisa</li>
              <li><strong className="text-white">💎 Harga Satuan:</strong> {event.price} ETH</li>
            </ul>

            <div className="bg-cupBlue/30 p-4 rounded-xl border border-white/10 mb-6">
              <p className="text-sm text-cupGold font-semibold mb-3">
                🛡️ Keamanan Anti-Scalping Aktif
              </p>
              <div className="flex justify-between items-center">
                <span>Jumlah Tiket (Maks. 2):</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMin}
                    className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full font-bold text-white"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg w-4 text-center text-white">
                    {ticketCount}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full font-bold text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-400 font-semibold">Total Harga:</span>
              <span className="text-3xl font-bold text-cupGold">
                {(event.price * ticketCount).toFixed(2)} ETH
              </span>
            </div>

            <button
              onClick={handleBuyTicket}
              disabled={isPurchasing || availableSeats <= 0}
              className="w-full bg-cupGold text-cupDark font-bold text-lg px-6 py-4 rounded-xl hover:bg-orange-400 disabled:bg-white/20 disabled:text-gray-500 transition-colors shadow-lg"
            >
              {isPurchasing ? "Minting Ticket..." : availableSeats <= 0 ? "Sold Out" : "Buy Ticket (0.01 ETH)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
