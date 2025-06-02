'use client'; // Make sure this is a client component
import { useEffect, useState } from "react";
import PaperCard from "@/components/PaperCard";

export default function SearchPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("similaritySearchResults");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result){
    return (
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="z-20 w-full max-w-3xl">
          <div className="flex flex-col gap-4 max-h-[90vh] overflow-y-auto bg-gray-300/20 p-10 rounded-3xl">
          {[...Array(5).keys()].map((i) => (
            <div
            key={i}
            className="animate-pulse opacity-75 rounded-3xl bg-gray-300/20 h-36 w-full"
            style={{
              animationDelay: `${i * 0.05}s`,
              animationDuration: "1s",
            }}
            />
          ))}
          </div>
        </div>
      </main>
    );
  }
    
  
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 bg-gray-300/20 rounded-3xl p-10 max-w-5xl w-full text-center shadow-xl">
        <div className="grid grid-cols-1 gap-4 max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {console.log("Rendering search results:", result)}
          {Object.values(result).map((item, index) => (
            <PaperCard key={index} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}
