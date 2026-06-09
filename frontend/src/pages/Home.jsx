import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

export default function Home() {
  const { getAllEvents } = useEvents();
  const events = getAllEvents();

  return (
    <div className="p-8">
      <div className="text-center mb-10">
        <p className="text-cupGold font-semibold tracking-widest uppercase text-sm mb-3">
          MetaCup Tickets
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
          YOUR SECURED SEAT ON THE CHAIN
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Sistem e-ticketing World Cup terdesentralisasi. Bebas calo, aman, dan
          transparan menggunakan teknologi Smart Contract.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="section-title">Featured Matches</h2>
        <p className="text-gray-400 mt-2 pl-4 text-sm">
          Pilih pertandingan dan beli tiket NFT Anda secara aman di blockchain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const available = event.seatQuantity - event.ticketsSold;
          const isSoldOut = available <= 0;

          return (
            <div
              key={event.id}
              className="glass-card-hover overflow-hidden"
            >
              <div className="bg-gradient-to-r from-cupBlue/80 to-cupBlue/40 text-white p-4 border-b border-white/10">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-300">{event.venue}</p>
              </div>

              <div className="p-5">
                <div className="flex justify-between text-sm text-gray-300 mb-4">
                  <span>📅 {event.date}</span>
                  <span>⏰ {event.time}</span>
                </div>

                <div className="flex justify-between items-center mb-5 font-semibold">
                  <span className="text-xl text-cupGold">{event.price} ETH</span>
                  {!isSoldOut ? (
                    <span className="text-green-300 bg-green-500/20 px-2 py-1 rounded text-xs">
                      Sisa: {available} Tiket
                    </span>
                  ) : (
                    <span className="text-red-300 bg-red-500/20 px-2 py-1 rounded text-xs">
                      Sold Out
                    </span>
                  )}
                </div>

                {!isSoldOut ? (
                  <Link
                    to={`/event/${event.id}`}
                    className="w-full block text-center bg-cupGold text-cupDark font-bold py-2.5 rounded-lg hover:bg-orange-400 transition-colors"
                  >
                    View & Buy
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-center bg-white/10 text-gray-500 font-semibold py-2.5 rounded-lg cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
