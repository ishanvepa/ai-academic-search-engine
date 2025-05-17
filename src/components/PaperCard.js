import React from 'react'

export default function PaperCard({title, authors, year, url, abstract, score}) {
  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-md border border-white/20 hover:scale-[1.01] transition">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-200 mb-2">{authors}</p>
      <p className="text-sm text-gray-400 mb-4">Published: {year}</p>
      <p className="text-sm text-gray-400 mb-4">Score: {(score*100).toFixed(1)}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-orange-300 hover:underline"
      >
        View on Semantic Scholar →
      </a>
    </div>
    )
}
