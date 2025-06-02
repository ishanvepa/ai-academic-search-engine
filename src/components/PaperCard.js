import React from 'react'
import axios from 'axios';

function getScoreColor(score) {
  // score: 0-1, map to 0-100
  const percent = score * 100;
  // Green (#22c55e) for high, Yellow (#facc15) for mid, Red (#ef4444) for low
  if (percent >= 75) return '#22c55e';
  if (percent >= 50) return '#facc15';
  return '#ef4444';
}

function getScoreGradient(percent) {
  // Two-color gradient: red (#ef4444) to green (#22c55e) from top-left to bottom-right
  return `linear-gradient(135deg, #ef4444 0%, #22c55e 100%)`;
}


export default function PaperCard({title, authors, year, url, abstract, score}) {
  const percentScore = (score * 100).toFixed(1);
  const percent = Math.max(0, Math.min(score * 100, 100));
  const scoreColor = getScoreColor(score);
  const [summary, setSummary] = React.useState("");

  const handleSummarize = async () => {
    // Use the abstract prop from PaperCard, not a hardcoded string
    const abstract = "This is a sample abstract for the paper. It discusses the main findings and contributions of the research.";
    const { data } = await axios.post(
      'http://localhost:5000/summarize-abstract',
      { abstract }, // send as JSON
      { headers: { 'Content-Type': 'application/json' } }
    );
    setSummary(data.summary);
    return data.summary;
  }

  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-md hover:scale-[1.01] transition">
      <div className="flex items-center gap-6">
        {/* Score Section */}
        <div className="flex flex-col items-center min-w-[110px] w-[110px]">
          <span className="text-sm text-gray-400 mb-1">Score</span>
          <div
            className="w-full h-4 rounded-full bg-white/20 backdrop-blur-sm relative overflow-hidden"
            style={{
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percent}%`,
                background: getScoreGradient(percent),
                filter: 'blur(0.5px)',
              }}
            />
            <span
              className="absolute left-1/2 top-1/2 text-xs font-bold"
              style={{
                transform: 'translate(-50%, -50%)',
                color: scoreColor,
                textShadow: '0 1px 4px rgba(0,0,0,0.18)',
              }}
            >
              {Math.round(percent)}
            </span>
          </div>
        </div>
        {/* Info Section */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-200 mb-2">{authors}</p>
          <p className="text-sm text-gray-400 mb-4">Published: {year}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-orange-300 hover:underline"
          >
            View on Semantic Scholar →
          </a>
          <button 
            className="bg-amber-900 m-4 p-2 rounded-4xl transition hover:bg-amber-900/75 text-gray-300"
            onClick={handleSummarize}
          >
            Summarize
          </button>
        {summary && 
          <div className="mt-4 text-sm text-gray-300">
            <h4 className="font-semibold mb-2">summary:</h4>
            <p className="text-gray-200">{summary}</p>
          </div>
        }
        </div>
      </div>
    </div>
  )
}
