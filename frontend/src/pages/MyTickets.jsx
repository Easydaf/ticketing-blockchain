import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

export default function MyTickets({ account }) {
  const { getUserTickets } = useEvents();
  const myPurchasedTickets = account ? getUserTickets(account) : [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="section-title mb-8">My Digital Tickets</h2>

      {myPurchasedTickets.length === 0 ? (
        <div className="text-center glass-card p-10">
          <p className="text-gray-400 mb-4">
            {account
              ? "Kamu belum memiliki tiket pertandingan apa pun."
              : "Silahkan connect wallet terlebih dahulu untuk melihat tiket Anda."}
          </p>
          <Link to="/home" className="link-accent">
            Cari Pertandingan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {myPurchasedTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="glass-card border-2 border-green-500/50 overflow-hidden flex flex-col sm:flex-row relative"
            >
              <div className="absolute top-4 right-[-35px] bg-green-500 text-white font-bold py-1 px-10 transform rotate-45 shadow-md">
                {ticket.status}
              </div>

              <div className="bg-cupDark/80 text-white p-6 sm:w-2/3 flex flex-col justify-between border-r-2 border-dashed border-white/20">
                <div>
                  <p className="text-cupGold font-bold text-sm mb-1">{ticket.id}</p>
                  <h3 className="text-2xl font-extrabold mb-2">{ticket.eventTitle}</h3>
                  <p className="text-gray-300 text-sm mb-4">📍 {ticket.eventVenue}</p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <div className="flex justify-between text-sm">
                    <span>📅 {ticket.eventDate}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex justify-between font-bold">
                    <span>Jumlah Tiket:</span>
                    <span className="text-cupGold">{ticket.quantity} Tiket</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:w-1/3 flex flex-col items-center justify-center bg-white/5">
                <p className="text-xs text-gray-400 font-bold mb-2 text-center uppercase">
                  Scan for Entry
                </p>
                <div className="w-32 h-32 bg-white border-4 border-cupDark p-2 rounded-lg flex items-center justify-center shadow-inner">
                  <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HelloWorld')] bg-contain bg-no-repeat bg-center opacity-80"></div>
                </div>
                <p className="text-[10px] text-gray-500 text-center mt-3">
                  Secured by Smart Contract
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
