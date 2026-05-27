import { useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPanitia() {
  // State untuk form Create Event
  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    date: "",
    time: "",
    price: "",
    quota: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    // Nanti disini fungsi untuk menembak Smart Contract buatan Firas
    alert(`Memproses pembuatan event: ${formData.title} ke Blockchain...`);
    setFormData({
      title: "",
      venue: "",
      date: "",
      time: "",
      price: "",
      quota: "",
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-cupBlue mb-8 border-l-4 border-cupGold pl-3">
        Dashboard Panitia 🏟️
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Statistik & Validasi */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="font-bold text-lg text-gray-700 mb-4">
              Statistik Penjualan
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-semibold">
                  Total Tiket Terjual
                </p>
                <p className="text-3xl font-bold text-cupBlue mt-1">
                  138{" "}
                  <span className="text-sm font-normal text-gray-500">
                    Tiket
                  </span>
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm text-green-800 font-semibold">
                  Estimasi Pendapatan
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  4.14{" "}
                  <span className="text-sm font-normal text-gray-500">ETH</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cupDark text-white p-6 rounded-2xl shadow-md border-b-4 border-cupGold">
            <h3 className="font-bold text-lg mb-2">Validasi Tiket Masuk</h3>
            <p className="text-sm text-gray-300 mb-4">
              Gunakan fitur ini di hari H pertandingan untuk memverifikasi QR
              Code penonton.
            </p>
            <Link
              to="/validasi"
              className="block text-center w-full bg-cupGold text-cupDark font-bold py-2 rounded-lg hover:bg-orange-400">
              Buka Scanner QR
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Form Create Event */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-2">
            Buat Pertandingan Baru
          </h3>

          <form onSubmit={handleCreateEvent} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Nama Pertandingan (Kategori/Tim)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Final: Tim A vs Tim B"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cupBlue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Lokasi (Stadion)
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                  placeholder="Contoh: Lusail Stadium"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cupBlue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cupBlue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Waktu (WITA)
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cupBlue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Harga (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="0.05"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cupBlue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Kuota Tiket
                </label>
                <input
                  type="number"
                  name="quota"
                  value={formData.quota}
                  onChange={handleInputChange}
                  required
                  placeholder="1000"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cupBlue"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cupBlue text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-colors mt-4 shadow-lg">
              Deploy Event ke Blockchain
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
