import SearchBar from "./SearchBar";
import ExampleQuery from "./ExampleQuery";
import sample_queries from "@/data/sample_queries.json";

export default function Hero() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
    

      {/* Foreground Content */}
      <div className="relative z-10 bg-gray-300/20 backdrop-blur-2xl rounded-2xl p-10 max-w-3xl w-full text-center shadow-xl">
        <h1 className="text-white text-4xl  mb-4">
          AI Academic Search Engine
        </h1>
        <p className="text-white mb-6 text-lg">
          the <span className="italic text-orange-400 font-semibold">better</span> way to conduct academic research
        </p>

        <SearchBar />
        <ExampleQuery text={sample_queries[Math.floor(Math.random() * 100)]}/>
      </div>
    </main>
  );
}
