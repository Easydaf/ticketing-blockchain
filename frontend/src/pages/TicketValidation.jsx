import { useState } from "react";
import { Link } from "react-router-dom";

export default function TicketValidation() {
  const [ticketCode, setTicketCode] = useState("");
  const [scanResult, setScanResult] = useState(null);

  const handleManualCheck = (e) => {
    e.preventDefault();
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

  const resultStyles = {
    valid: "bg-green-500/20 border-green-500 text-green-300",
    used: "bg-orange-500/20 border-orange-500 text-orange-300",
    invalid: "bg-red-500/20 border-red-500 text-red-300",
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/home" className="link-accent mb-6 inline-block">
        ← Kembali ke Beranda
      </Link>

      <div className="glass-card overflow-hidden">
        <div className="bg-cupDark/80 p-6 text-center text-white border-b-4 border-cupGold">
          <h2 className="text-2xl font-bold">Scanner Validasi Tiket</h2>
          <p className="text-gray-300 text-sm mt-1">
            Arahkan QR Code tiket penonton ke kamera
          </p>
        </div>

        <div className="p-8">
          <div className="w-full h-64 bg-black/40 rounded-xl relative overflow-hidden flex items-center justify-center mb-8 shadow-inner border border-white/10">
            <div className="absolute inset-0 border-4 border-green-500/50 opacity-50 m-8 rounded-lg animate-pulse"></div>
            <div className="absolute w-full h-1 bg-green-400/70 top-1/2 shadow-[0_0_15px_#4ade80] animate-[bounce_2s_infinite]"></div>
            <span className="text-gray-400 font-semibold z-10">Kamera Aktif...</span>
          </div>

          <div className="text-center text-gray-400 mb-4 font-semibold">
            — ATAU INPUT MANUAL —
          </div>

          <form onSubmit={handleManualCheck} className="flex gap-3 mb-8">
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="Masukkan Kode Tiket (Cth: TKT-001 / TKT-002)"
              className="input-dark flex-1 font-mono uppercase"
            />
            <button
              type="submit"
              className="bg-cupGold text-cupDark px-6 py-3 rounded-lg font-bold hover:bg-orange-400 transition-colors"
            >
              Cek Tiket
            </button>
          </form>

          {scanResult && (
            <div
              className={`p-6 rounded-xl border-2 text-center ${resultStyles[scanResult.status]}`}
            >
              <h3 className="text-2xl font-extrabold mb-2">
                {scanResult.status === "valid" ? "✅ AKSES DITERIMA" : "❌ AKSES DITOLAK"}
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
