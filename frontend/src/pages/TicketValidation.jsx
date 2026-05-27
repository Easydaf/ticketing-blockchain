import { useState } from "react";
import { Link } from "react-router-dom";

export default function TicketValidation() {
  const [ticketCode, setTicketCode] = useState("");
  const [scanResult, setScanResult] = useState(null);

  const handleManualCheck = (e) => {
    e.preventDefault();
    // Simulasi hasil pengecekan tiket ke Smart Contract
    if (ticketCode === "TKT-001") {
      setScanResult({
        status: "valid",
        message: "Tiket Valid! Penonton diizinkan masuk.",
        owner: "0x12...abcd",
      });
    } else if (ticketCode === "TKT-002") {
      setScanResult({
        status: "used",
        message: "Akses Ditolak: Tiket ini sudah digunakan!",
        owner: "0x99...efgh",
      });
    } else {
      setScanResult({
        status: "invalid",
        message: "Akses Ditolak: Tiket tidak ditemukan di Blockchain.",
        owner: "-",
      });
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        to="/panitia"
        className="text-cupBlue hover:text-cupGold font-semibold mb-6 inline-block">
        ← Kembali ke Dashboard Panitia
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-cupDark p-6 text-center text-white border-b-4 border-cupGold">
          <h2 className="text-2xl font-bold">Scanner Validasi Tiket</h2>
          <p className="text-gray-300 text-sm mt-1">
            Arahkan QR Code tiket penonton ke kamera
          </p>
        </div>

        <div className="p-8">
          {/* Placeholder Area Kamera Scanner */}
          <div className="w-full h-64 bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center mb-8 shadow-inner">
            <div className="absolute inset-0 border-4 border-green-500 opacity-50 m-8 rounded-lg animate-pulse"></div>
            <div className="absolute w-full h-1 bg-green-400 opacity-70 top-1/2 shadow-[0_0_15px_#4ade80] animate-[bounce_2s_infinite]"></div>
            <span className="text-gray-500 font-semibold z-10">
              Kamera Aktif...
            </span>
          </div>

          <div className="text-center text-gray-500 mb-4 font-semibold">
            — ATAU INPUT MANUAL —
          </div>

          {/* Form Input Manual */}
          <form onSubmit={handleManualCheck} className="flex gap-3 mb-8">
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="Masukkan Kode Tiket (Cth: TKT-001 / TKT-002)"
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cupBlue font-mono uppercase"
            />
            <button
              type="submit"
              className="bg-cupBlue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">
              Cek Tiket
            </button>
          </form>

          {/* Hasil Scan / Pengecekan */}
          {scanResult && (
            <div
              className={`p-6 rounded-xl border-2 text-center ${
                scanResult.status === "valid"
                  ? "bg-green-50 border-green-500 text-green-800"
                  : scanResult.status === "used"
                    ? "bg-orange-50 border-orange-500 text-orange-800"
                    : "bg-red-50 border-red-500 text-red-800"
              }`}>
              <h3 className="text-2xl font-extrabold mb-2">
                {scanResult.status === "valid"
                  ? "✅ AKSES DITERIMA"
                  : "❌ AKSES DITOLAK"}
              </h3>
              <p className="font-semibold text-lg mb-2">{scanResult.message}</p>
              <p className="text-sm opacity-80">
                Pemilik Dompet:{" "}
                <span className="font-mono">{scanResult.owner}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
