import React from 'react'
import axios from 'axios';

function getScoreColor(score) {
  const percent = score * 100;
  if (percent >= 75) return '#22c55e';
  if (percent >= 50) return '#facc15';
  return '#ef4444';
}

function getScoreGradient(percent) {
  return `linear-gradient(135deg, #ef4444 0%, #22c55e 100%)`;
}

// Helper to detect source from URL
function getSourceLabel(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('semanticscholar.org')) return 'Source: Semantic Scholar';
    if (u.hostname.includes('arxiv.org')) return 'Source: arXiv';
  } catch (e) {
    // ignore invalid URLs
  }
  return null;
}

export default function PaperCard({title, authors, year, url, abstract, score}) {
  const percentScore = (score * 100).toFixed(1);
  const percent = Math.max(0, Math.min(score * 100, 100));
  const scoreColor = getScoreColor(score);
  const [summary, setSummary] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const sourceLabel = getSourceLabel(url);

  const handleSummarize = async () => {
    if (!abstract) {
      console.error("No abstract provided for summarization");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/summarize-abstract',
        { abstract },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSummary(data.summary);
    } catch {
      setSummary('Error summarizing abstract.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl p-8 mb-6 shadow-xl transition hover:scale-[1.015] border border-white/20"
      style={{
        background: 'rgba(30, 41, 59, 0.35)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        border: '1.5px solid rgba(255,255,255,0.18)',
      }}
    >
      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">{title}</h3>
      <div className="flex flex-wrap items-center justify-between mb-2">
        <span className="text-sm text-gray-200">{authors}</span>
        <span className="text-sm text-gray-400">Published: {year}</span>
      </div>
      {sourceLabel && (
        <div className="mb-2">
          <span className="text-xs text-gray-400 italic">{sourceLabel}</span>
        </div>
      )}
      {/* Score Bar */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-400">Score</span>
        <div
          className="relative w-40 h-4 rounded-full bg-white/20 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
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
      {/* Abstract & Summarize */}
      {abstract && (
        <div className="mb-4">
          <button
            className="px-4 py-2 rounded-full bg-white/20 text-orange-300 font-semibold shadow hover:bg-orange-300/20 hover:text-white transition backdrop-blur-md border border-orange-300/30"
            onClick={handleSummarize}
            disabled={loading}
          >
            Summarize
          </button>
        </div>
      )}
      {/* Loading Animation */}
      {loading && (
        <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto bg-gray-300/10 p-4 rounded-2xl mb-2">
          {[...Array(3).keys()].map((i) => (
            <div
              key={i}
              className="animate-pulse opacity-75 rounded-2xl bg-gray-300/20 h-10 w-full"
              style={{
                animationDelay: `${i * 0.05}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )}
      {/* Summary Output */}
      {summary && !loading && (
        <div className="mt-2 p-3 rounded-xl bg-white/10 text-gray-200 shadow-inner border border-white/10">
          <h4 className="font-semibold mb-1 text-orange-200">Summary:</h4>
          <p className="text-gray-100">{summary}</p>
        </div>
      )}
      {/* Link */}
      <div className="mt-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-orange-300 hover:underline hover:text-orange-200 transition"
        >
          View on Semantic Scholar →
        </a>
      </div>
    </div>
  );
}
