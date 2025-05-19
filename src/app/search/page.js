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
    return <p>Loading or no results found.</p>;
  }
    

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 bg-gray-300/20 rounded-3xl p-10 max-w-5xl w-full text-center shadow-xl">
        <div className="grid grid-cols-1 gap-4 max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {Object.values(result).map((item, index) => (
            <PaperCard key={index} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}
