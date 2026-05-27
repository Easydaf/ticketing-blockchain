import { Link } from "react-router-dom";

export default function MyTickets() {
  // Simulasi data tiket yang sudah dibeli
  const myPurchasedTickets = [
    {
      id: "TKT-001",
      match: "Final: Brazil vs Germany",
      venue: "Lusail Stadium",
      date: "15 Juli 2026",
      time: "20:00 WITA",
      qty: 2,
      status: "Valid",
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-cupBlue mb-8 border-l-4 border-cupGold pl-3">
        My Digital Tickets
      </h2>

      {myPurchasedTickets.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-xl shadow">
          <p className="text-gray-500 mb-4">
            Kamu belum memiliki tiket pertandingan apa pun.
          </p>
          <Link to="/" className="text-cupGold font-bold hover:underline">
            Cari Pertandingan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {myPurchasedTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl shadow-xl border-2 border-green-500 overflow-hidden flex flex-col sm:flex-row relative">
              {/* Pita Status Valid */}
              <div className="absolute top-4 right-[-35px] bg-green-500 text-white font-bold py-1 px-10 transform rotate-45 shadow-md">
                {ticket.status}
              </div>

              {/* Bagian Kiri: Info Pertandingan */}
              <div className="bg-cupDark text-white p-6 sm:w-2/3 flex flex-col justify-between border-r-2 border-dashed border-gray-400">
                <div>
                  <p className="text-cupGold font-bold text-sm mb-1">
                    {ticket.id}
                  </p>
                  <h3 className="text-2xl font-extrabold mb-2">
                    {ticket.match}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    📍 {ticket.venue}
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>📅 {ticket.date}</span>
                    <span>⏰ {ticket.time}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-600 flex justify-between font-bold">
                    <span>Jumlah Tiket:</span>
                    <span className="text-cupGold">{ticket.qty} Tiket</span>
                  </div>
                </div>
              </div>

              {/* Bagian Kanan: QR Code */}
              <div className="p-6 sm:w-1/3 flex flex-col items-center justify-center bg-gray-50">
                <p className="text-xs text-gray-500 font-bold mb-2 text-center uppercase">
                  Scan for Entry
                </p>
                {/* Placeholder QR Code */}
                <div className="w-32 h-32 bg-white border-4 border-cupDark p-2 rounded-lg flex items-center justify-center shadow-inner">
                  <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HelloWorld')] bg-contain bg-no-repeat bg-center opacity-80"></div>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-3">
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
