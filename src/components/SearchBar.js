"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SearchBar({ query, setQuery }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchResults, setFetchResults] = useState(null);

  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setFetchResults(null);

    try {
      const { data: fetchData } = await axios.get(
        `http://localhost:5000/fetch-semantic-scholar`,
        { params: { query } }
      );
      console.log("Fetched results:", fetchData);
      setFetchResults(fetchData);

      const { data: ingestionData } = await axios.post(
        `http://localhost:5000/ingest`,
        fetchData
      );
      console.log("Ingestion results:", ingestionData);

      const { data: simData } = await axios.get(
        `http://localhost:5000/similarity-search`,
        { params: { query } }
      );
      console.log("Similarity search results:", simData);

      sessionStorage.setItem("similaritySearchResults", JSON.stringify(simData[0]));
      router.push("/search");
    } catch (err) {
      console.error("Axios error:", err);
      setError(
        err.response
          ? `Error ${err.response.status}: ${err.response.statusText}`
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 space-y-3">
      <div className="flex w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your academic search query..."
          className="flex-grow bg-white px-4 py-2 rounded-l-full focus:outline-none focus:text-gray-600 text-gray-600 placeholder:text-gray-400 placeholder:text-sm text-sm"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className={`px-5 py-2 rounded-r-full text-white transition ${
            loading ? "bg-amber-900 cursor-not-allowed" : "bg-amber-800 hover:bg-amber-900 cursor-pointer"
          } flex items-center justify-center`}
        >
          {loading ? (
            "Searching…"
          ) : (
            // Search icon (SVG)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth={2} />
            </svg>
          )}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* {fetchResults && (
        <pre className="w-full max-w-lg bg-gray-100 text-black p-4 rounded-lg text-xs overflow-auto">
          {JSON.stringify(fetchResults, null, 2)}
        </pre>
      )} */}
    </div>
  );

  
}
