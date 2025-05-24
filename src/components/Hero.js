"use client";
import SearchBar from "./SearchBar";
import ExampleQuery from "./ExampleQuery";
import PdfUploader from "./PdfUploader";
import sample_queries from "@/data/sample_queries.json";
import { useState, useEffect } from "react";
export default function Hero() {
    const [query, setQuery] = useState("");
    const [randomSampleQuery, setRandomSampleQuery] = useState("");

    // pick a random example once per render
    useEffect(() => {
        setRandomSampleQuery(sample_queries[Math.floor(Math.random() * sample_queries.length)]);
    }, []);
    
    return (
        <main className="min-h-[94vh] flex items-center justify-center relative overflow-hidden">
            {/* Foreground Content */}
            <div className="relative z-10 bg-gray-300/20 rounded-3xl p-10 max-w-3xl w-full text-center shadow-xl">
                <h1 className="text-white text-4xl mb-4">
                AI Academic Search Engine
                </h1>
                <p className="text-white mb-6 text-lg">
                the <span className="pr-[0.15rem] italic bg-gradient-to-r from-orange-400 via-yellow-500 to-amber-200 text-transparent bg-clip-text font-semibold">better</span> way to conduct academic research
                </p>

                <SearchBar query={query} setQuery={setQuery} />

                {!randomSampleQuery && (
                        <div
                            className="animate-pulse opacity-75 rounded-3xl bg-gray-300/40 h-6 w-xs ml-auto mr-auto mt-4"
                            style={{
                            animationDelay: `${0.05}s`,
                            animationDuration: "1s",
                            }}
                        />
                    )
                }

                {randomSampleQuery && (
                        <ExampleQuery 
                            text={randomSampleQuery} 
                            onClick={() => {
                                setQuery(randomSampleQuery);
                                console.log("random sample query clicked");
                            }}
                        />
                    )
                }

                
                <PdfUploader />
                
            </div>
        </main>
    );
}
