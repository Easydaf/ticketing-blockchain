import { Link } from "react-router-dom";

const features = [
  {
    icon: "🔗",
    title: "Aman di Blockchain",
    description:
      "Setiap tiket dicetak sebagai NFT di Ethereum. Kepemilikan dapat diverifikasi dan anti-pemalsuan.",
  },
  {
    icon: "🛡️",
    title: "Anti-Caló",
    description:
      "Aturan smart contract membatasi pembelian per dompet, menjaga kursi tetap di tangan penggemar sejati.",
  },
  {
    icon: "🎟️",
    title: "Tiket NFT",
    description:
      "Tiket pertandingan Anda tersimpan di blockchain — pindai, verifikasi, dan masuk stadion dengan percaya diri.",
  },
];

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-cupDark text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cupBlue/40 via-cupDark to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cupGold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cupBlue/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 animate-[fadeIn_0.8s_ease-out]">
          <p className="text-cupGold font-semibold tracking-widest uppercase text-sm mb-4">
            World Cup 2026
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            MetaCup{" "}
            <span className="text-cupGold">Tickets</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            E-ticketing terdesentralisasi untuk panggung terbesar sepak bola.
            Aman, transparan, dan bebas caló — didukung smart contract.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-14">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors animate-[slideUp_0.6s_ease-out_both]"
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="font-bold text-lg mb-2 text-cupGold">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <Link
          to="/home"
          className="animate-[slideUp_0.6s_ease-out_0.65s_both] bg-cupGold text-cupDark font-bold text-lg px-10 py-4 rounded-xl hover:bg-orange-400 transition-colors shadow-lg shadow-cupGold/20"
        >
          Jelajahi Pertandingan →
        </Link>

        <p className="mt-8 text-xs text-gray-500 animate-[fadeIn_1s_ease-out_1s_both]">
          Hubungkan dompet MetaMask di jaringan Sepolia testnet untuk membeli tiket
        </p>
      </div>
    </div>
  );
}
