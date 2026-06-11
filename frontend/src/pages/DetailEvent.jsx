import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contractInfo';
import { getLockedTicketTokenURI, isValidLockedTicketTokenURI } from '../nftConfig';
import { useEvents } from "../hooks/useEvents";

export default function DetailEvent({ account }) {
  const { id } = useParams();
  const { getEventById, addUserTicket, getUserTickets } = useEvents();
  const event = getEventById(parseInt(id));

  const myTickets = account ? getUserTickets(account) : [];
  const ticketsBoughtForThisEvent = myTickets
    .filter(t => t.eventId === event?.id)
    .reduce((sum, t) => sum + t.quantity, 0);

  const maxAllowedToBuy = Math.max(0, 2 - ticketsBoughtForThisEvent);
  const isLimitReached = ticketsBoughtForThisEvent >= 2;

  const [ticketCount, setTicketCount] = useState(maxAllowedToBuy > 0 ? 1 : 0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    setTicketCount(maxAllowedToBuy > 0 ? 1 : 0);
  }, [maxAllowedToBuy]);

  if (!event) {
    return (
      <div className="p-8 text-center text-2xl font-bold text-white">
        Event tidak ditemukan!
      </div>
    );
  }

  const handleAdd = () => {
    if (ticketCount < maxAllowedToBuy) setTicketCount(ticketCount + 1);
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

    if (ticketsBoughtForThisEvent + ticketCount > 2) {
      alert(`❌ Gagal: Anda tidak dapat membeli ${ticketCount} tiket lagi. Batas maksimal adalah 2 tiket per pertandingan (Anda sudah memiliki ${ticketsBoughtForThisEvent} tiket).`);
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

      const valueToSend = ethers.parseEther((0.01 * ticketCount).toFixed(2));
      const transaction = await contract.buyTicket(event.id, ticketCount, tokenURI, {
        value: valueToSend
      });

      await transaction.wait();
      addUserTicket(account, event.id, ticketCount, transaction.hash);

      alert("🎉 Ticket purchased successfully!");
      setTicketCount(maxAllowedToBuy > 0 ? 1 : 0);
    } catch (error) {
      console.error("Purchase failed:", error);
      
      let userMsg = "Transaction failed. Check the console for details.";
      const errMsg = error.message || "";
      
      // Parse revert error reasons
      if (errMsg.includes("Purchase limit exceeded") || (error.reason && error.reason.includes("Purchase limit exceeded"))) {
        userMsg = "❌ Purchase Limit Exceeded: You can only buy a maximum of 2 tickets per match.";
      } else if (errMsg.includes("Not enough ETH") || (error.reason && error.reason.includes("Not enough ETH"))) {
        userMsg = "❌ Insufficient Funds: Not enough ETH sent to buy the tickets.";
      } else if (errMsg.includes("sold out") || (error.reason && error.reason.includes("sold out"))) {
        userMsg = "❌ Sold Out: Sorry, this match is sold out!";
      } else if (errMsg.includes("user rejected") || errMsg.includes("action Rejected")) {
        userMsg = "ℹ️ Transaction canceled by user.";
      }
      
      alert(userMsg);
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
        <div className="md:w-1/2 bg-cupDark/80 p-8 text-white flex flex-col justify-center items-center border-b md:border-b-0 md:border-r-4 border-cupGold">
          <h2 className="text-3xl font-bold text-center mb-2">{event.title}</h2>
          <p className="text-cupGold text-lg mb-8">{event.venue}</p>

          <div className="w-full bg-black/45 rounded-2xl p-6 border border-white/10 flex flex-col items-center">
            <p className="text-xs text-cupGold uppercase font-bold tracking-wider mb-4">
              Peta Kursi Stadion ({event.venue})
            </p>
            
            {/* Seating Layout Mock */}
            <div className="relative w-full aspect-[4/3] max-w-[280px] rounded-full border-4 border-white/10 flex items-center justify-center p-6 bg-gradient-to-b from-cupDark to-black/80 shadow-inner">
              {/* Inner ring (Pitch) */}
              <div className="w-2/3 h-2/3 rounded-3xl border-2 border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center relative overflow-hidden">
                {/* Pitch Lines */}
                <div className="absolute inset-0 border border-white/5 m-2 flex items-center justify-center">
                  <div className="w-1/2 h-full border-r border-white/5" />
                  <div className="absolute w-10 h-10 rounded-full border border-white/5" />
                </div>
                <span className="text-[10px] text-emerald-400/40 font-bold uppercase tracking-widest z-10">PITCH</span>
              </div>
              
              {/* Tribune Sections */}
              {/* VIP / Main Tribune (Top) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-[9px] px-2.5 py-0.5 rounded font-bold text-purple-300 transition-all cursor-pointer">
                VIP TRIBUN (BARAT)
              </div>
              {/* East Tribune (Bottom) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-[9px] px-2.5 py-0.5 rounded font-bold text-blue-300 transition-all cursor-pointer">
                TRIBUN TIMUR
              </div>
              {/* North Tribune (Left) */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 bg-cupGold/10 hover:bg-cupGold/20 border border-cupGold/30 text-[9px] px-2.5 py-0.5 rounded font-bold text-cupGold transition-all cursor-pointer">
                TRIBUN UTARA
              </div>
              {/* South Tribune (Right) */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 bg-cupGold/10 hover:bg-cupGold/20 border border-cupGold/30 text-[9px] px-2.5 py-0.5 rounded font-bold text-cupGold transition-all cursor-pointer">
                TRIBUN SELATAN
              </div>
            </div>
            
            <div className="flex justify-between w-full mt-4 text-[9px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-purple-500/40 border border-purple-500 rounded-sm" />
                <span>VIP (0.02 ETH)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-cupGold/20 border border-cupGold rounded-sm" />
                <span>Reguler (0.01 ETH)</span>
              </div>
            </div>
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
                    disabled={ticketCount <= (maxAllowedToBuy > 0 ? 1 : 0)}
                    className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg w-4 text-center text-white">
                    {ticketCount}
                  </span>
                  <button
                    onClick={handleAdd}
                    disabled={ticketCount >= maxAllowedToBuy}
                    className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
              {ticketsBoughtForThisEvent > 0 && (
                <p className="text-xs text-yellow-400 mt-3 font-semibold">
                  ℹ️ Anda sudah memiliki {ticketsBoughtForThisEvent} tiket untuk match ini. (Maks. 2 per match)
                </p>
              )}
              {isLimitReached && (
                <p className="text-xs text-red-400 mt-3 font-semibold">
                  🚫 Batas Pembelian Tercapai: Anda tidak dapat membeli tiket lagi untuk match ini.
                </p>
              )}
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
              disabled={isPurchasing || availableSeats <= 0 || isLimitReached}
              className="w-full bg-cupGold text-cupDark font-bold text-lg px-6 py-4 rounded-xl hover:bg-orange-400 disabled:bg-white/20 disabled:text-gray-500 transition-colors shadow-lg"
            >
              {isPurchasing 
                ? "Minting Ticket..." 
                : availableSeats <= 0 
                  ? "Sold Out" 
                  : isLimitReached 
                    ? "Batas Limit Tercapai" 
                    : `Buy Ticket (${(event.price * ticketCount).toFixed(2)} ETH)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
