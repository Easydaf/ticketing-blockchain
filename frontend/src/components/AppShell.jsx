export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-cupDark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cupBlue/40 via-cupDark to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cupGold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cupBlue/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
