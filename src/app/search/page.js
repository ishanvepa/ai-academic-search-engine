'use client'; // Make sure this is a client component
import { useEffect, useState } from "react";

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
    <div>
      <h1>Search Result</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
