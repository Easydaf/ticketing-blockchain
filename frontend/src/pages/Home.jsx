import { Link } from "react-router-dom";

// Data dummy sementara (Nanti data ini akan diambil dari Blockchain oleh Firas)
const DUMMY_EVENTS = [
  {
    id: 1,
    title: "Final: Brazil vs Germany",
    date: "15 Juli 2026",
    time: "20:00 WITA",
    venue: "Lusail Stadium",
    price: "0.05",
    sisaTiket: 12,
  },
  {
    id: 2,
    title: "Semi-Final: Argentina vs France",
    date: "12 Juli 2026",
    time: "22:00 WITA",
    venue: "Al Bayt Stadium",
    price: "0.03",
    sisaTiket: 45,
  },
  {
    id: 3,
    title: "Quarter-Final: Portugal vs Spain",
    date: "10 Juli 2026",
    time: "19:00 WITA",
    venue: "Education City Stadium",
    price: "0.02",
    sisaTiket: 0,
  },
];

export default function Home() {
  return (
    <div className="p-8">
      {/* Bagian Hero / Banner Atas */}
      <div className="bg-cupDark text-white p-10 rounded-2xl shadow-xl mb-10 text-center border-b-4 border-cupGold">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          YOUR SECURED SEAT ON THE CHAIN
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Sistem e-ticketing World Cup terdesentralisasi. Bebas calo, aman, dan
          transparan menggunakan teknologi Smart Contract.
        </p>
      </div>

      {/* Judul Daftar Pertandingan */}
      <h2 className="text-2xl font-bold text-cupBlue mb-6 border-l-4 border-cupGold pl-3">
        Featured Matches
      </h2>

      {/* Grid Kartu Pertandingan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_EVENTS.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            {/* Bagian Atas Kartu (Warna Biru) */}
            <div className="bg-cupBlue text-white p-4">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-300 opacity-80">{event.venue}</p>
            </div>

            {/* Bagian Bawah Kartu (Info & Tombol) */}
            <div className="p-5">
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>📅 {event.date}</span>
                <span>⏰ {event.time}</span>
              </div>

              <div className="flex justify-between items-center mb-5 font-semibold">
                <span className="text-xl text-cupBlue">{event.price} ETH</span>
                {event.sisaTiket > 0 ? (
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                    Sisa: {event.sisaTiket} Tiket
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Tombol Beli */}
              <Link
                to={`/event/${event.id}`}
                className={`block w-full text-center py-2 rounded-lg font-bold transition-colors ${
                  event.sisaTiket > 0
                    ? "bg-cupGold text-cupDark hover:bg-orange-400"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                }`}>
                {event.sisaTiket > 0 ? "Beli Tiket" : "Habis Terjual"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
