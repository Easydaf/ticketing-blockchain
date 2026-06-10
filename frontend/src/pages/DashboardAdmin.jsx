import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useEvents } from "../hooks/useEvents";
import FundsManagement from "../components/FundsManagement";

const emptyForm = {
  title: "",
  venue: "",
  date: "",
  time: "",
  price: "",
  quota: "",
};

function parseTeamsFromTitle(title) {
  const parts = title.split(/\s+vs\s+/i);
  if (parts.length === 2) {
    return { team1: parts[0].trim(), team2: parts[1].trim() };
  }
  return { team1: title, team2: "TBD" };
}

function formatDateLabel(isoDate) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardAdmin() {
  const { isAdminLoggedIn } = useContext(AuthContext);
  const { events, addEvent, deleteEvent } = useEvents();
  const [formData, setFormData] = useState(emptyForm);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!isAdminLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);
  const totalVolume = events.reduce((sum, e) => sum + e.ticketsSold * e.price, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();

    const teams = parseTeamsFromTitle(formData.title);
    const newId = addEvent({
      title: formData.title,
      teams,
      venue: formData.venue,
      date: formatDateLabel(formData.date),
      time: `${formData.time} WITA`,
      price: parseFloat(formData.price),
      seatQuantity: parseInt(formData.quota, 10),
    });

    setFormData(emptyForm);
    setShowCreateForm(false);
    alert(`Event berhasil dibuat! (ID: ${newId})`);
  };

  const handleDeleteEvent = (eventId, title) => {
    if (window.confirm(`Hapus event "${title}"? Semua tiket terkait juga akan dihapus.`)) {
      deleteEvent(eventId);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="section-title">Command Center Admin</h2>
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="bg-purple-600/80 text-white font-bold px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          {showCreateForm ? "Batal" : "+ Buat Event Baru"}
        </button>
      </div>

      {showCreateForm && (
        <div className="glass-card p-8 mb-10">
          <h3 className="font-bold text-xl text-white mb-6 border-b border-white/10 pb-2">
            Buat Pertandingan Baru
          </h3>

          <form onSubmit={handleCreateEvent} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Nama Pertandingan
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Final: Brazil vs Germany"
                className="input-dark"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Lokasi (Stadion)
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                  placeholder="Contoh: Lusail Stadium"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="input-dark"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Waktu
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Harga (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="0.01"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Kuota Tiket
                </label>
                <input
                  type="number"
                  min="1"
                  name="quota"
                  value={formData.quota}
                  onChange={handleInputChange}
                  required
                  placeholder="1000"
                  className="input-dark"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
            >
              Simpan Event
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 border-t-4 border-blue-500">
          <p className="text-gray-400 font-semibold text-sm">Total Event Aktif</p>
          <p className="text-4xl font-bold text-white mt-2">{events.length}</p>
        </div>
        <div className="glass-card p-6 border-t-4 border-green-500">
          <p className="text-gray-400 font-semibold text-sm">Total Tiket Terjual</p>
          <p className="text-4xl font-bold text-white mt-2">{totalTicketsSold}</p>
        </div>
        <div className="glass-card p-6 border-t-4 border-purple-500">
          <p className="text-gray-400 font-semibold text-sm">Total Volume Transaksi</p>
          <p className="text-4xl font-bold text-white mt-2">
            {totalVolume.toFixed(2)}{" "}
            <span className="text-lg text-gray-400">ETH</span>
          </p>
        </div>
        <FundsManagement />
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold text-lg text-white mb-4 border-b border-white/10 pb-2">
          Manajemen Event Pertandingan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="p-3 rounded-tl-lg">Nama Event</th>
                <th className="p-3">Venue</th>
                <th className="p-3">Terjual</th>
                <th className="p-3">Kuota</th>
                <th className="p-3 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    Belum ada event. Klik &quot;Buat Event Baru&quot; untuk menambahkan.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-white/5 transition-colors text-gray-300">
                    <td className="p-3 font-semibold text-white">{event.title}</td>
                    <td className="p-3">{event.venue}</td>
                    <td className="p-3">{event.ticketsSold} Tiket</td>
                    <td className="p-3">{event.seatQuantity}</td>
                    <td className="p-3 flex gap-2">
                      <Link
                        to={`/event/${event.id}`}
                        className="text-cupGold hover:text-orange-400 font-semibold text-xs border border-cupGold/50 px-2 py-1 rounded"
                      >
                        Lihat
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(event.id, event.title)}
                        className="text-red-400 hover:text-red-300 font-semibold text-xs border border-red-500/50 px-2 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Link to="/home" className="block text-center mt-4 text-sm link-accent">
          Lihat semua event di halaman utama →
        </Link>
      </div>
    </div>
  );
}
