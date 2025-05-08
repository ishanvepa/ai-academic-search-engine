import SearchBar from "./SearchBar";
import ExampleQuery from "./ExampleQuery";

export default function Hero() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-yellow-800/40 to-black/60 blur-3xl" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 bg-black/60 backdrop-blur-xl rounded-2xl p-10 max-w-3xl w-full text-center shadow-xl">
        <h1 className="text-white text-4xl font-semibold mb-4">
          AI Academic Search Engine
        </h1>
        <p className="text-white/80 mb-6 text-lg">
          the <span className="text-orange-400 font-semibold">better</span> way to conduct academic research
        </p>

        <SearchBar />
        <ExampleQuery />
      </div>
    </main>
  );
}
