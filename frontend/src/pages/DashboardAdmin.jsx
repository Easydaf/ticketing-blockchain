import { Link } from 'react-router-dom';

export default function DashboardAdmin() {
  // Data Dummy untuk tabel Admin
  const activeEvents = [
    { id: 1, title: "Final: Brazil vs Germany", panitia: "0x34...99ac", sold: 138, status: "Active" },
    { id: 2, title: "Semi-Final: Argentina vs France", panitia: "0x88...12bb", sold: 89, status: "Active" }
  ];

  const recentTransactions = [
    { hash: "0xabc123...def456", buyer: "0x99...abcd", event: "Final: Brazil vs Germany", qty: 2, amount: "0.10 ETH", time: "5 menit lalu" },
    { hash: "0xdef456...abc123", buyer: "0x77...fedc", event: "Semi-Final: Argentina vs France", qty: 1, amount: "0.03 ETH", time: "12 menit lalu" }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 border-l-4 border-purple-500 pl-3">
        Command Center Admin 👑
      </h2>

      {/* Baris Statistik Global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-500">
          <p className="text-gray-500 font-semibold text-sm">Total Event Aktif</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-green-500">
          <p className="text-gray-500 font-semibold text-sm">Total Tiket Terjual Global</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">1,240</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-purple-500">
          <p className="text-gray-500 font-semibold text-sm">Total Volume Transaksi</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">35.6 <span className="text-lg text-gray-400">ETH</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabel Manajemen Event */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Manajemen Event Pertandingan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 rounded-tl-lg">Nama Event</th>
                  <th className="p-3">Terjual</th>
                  <th className="p-3 rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-semibold text-gray-700">{event.title}</td>
                    <td className="p-3">{event.sold} Tiket</td>
                    <td className="p-3">
                      <button className="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-500 px-2 py-1 rounded">
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabel Log Transaksi Global */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Log Transaksi Blockchain</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 rounded-tl-lg">Tx Hash</th>
                  <th className="p-3">Event</th>
                  <th className="p-3 rounded-tr-lg">Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-blue-600 font-mono text-xs">{tx.hash.slice(0,10)}...</td>
                    <td className="p-3 text-gray-700 truncate max-w-[150px]">{tx.event}</td>
                    <td className="p-3 font-semibold text-green-600">{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/" className="block text-center mt-4 text-sm text-cupBlue font-semibold hover:underline">
            Lihat Semua Transaksi di Explorer →
          </Link>
        </div>
      </div>
    </div>
  );
}