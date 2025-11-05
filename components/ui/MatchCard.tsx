
import React from 'react';
import { Match } from '../../types';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
  index: number;
}

const generateButtons = (match: Match, classes: string) => {
  const streams = {
    ...match.STREAMING_CDN,
    adfree_stream: match.adfree_stream,
    dai_stream: match.dai_stream
  };
  
  const buttons = [];
  const id = encodeURIComponent(String(match.match_id ?? ''));

  for (const [key, value] of Object.entries(streams)) {
    if (value && value !== "Unavailable") {
      const label = key.replace(/_/g, ' ').replace(/(cdn|stream)/i, '').trim().toUpperCase() || 'STREAM';
      const href = `/player?id=${id}&cdn=${encodeURIComponent(key)}`;
      buttons.push(
        <Link key={key} to={href} className={`watch-btn text-center text-black font-semibold transition-transform transform hover:scale-105 ${classes}`}>
          {label}
        </Link>
      );
    }
  }
  return buttons.length > 0 ? buttons : <p className="text-xs text-slate-500">Links coming soon...</p>;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, index }) => {
  const isLive = match.status?.toUpperCase() === 'LIVE';
  const imgSrc = match.image || `https://picsum.photos/seed/${match.match_id}/400/225`;
  const buttons = generateButtons(match, 'text-xs px-3 py-2 rounded-md bg-sky-500 hover:bg-sky-400');
  
  return (
    <div 
      className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-2"
      style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${index * 100}ms`, opacity: 0 }}
    >
      <div className="relative">
        <img src={imgSrc} alt={match.title} className="w-full h-48 object-cover" />
        {isLive && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE
            </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-amber-500 text-xs font-semibold mb-1">{match.tournament || ''}</p>
        <h3 className="text-lg font-bold text-slate-100 flex-grow mb-4">{match.title || 'Match Title'}</h3>
        <div className="flex flex-wrap gap-2">{buttons}</div>
      </div>
    </div>
  );
};

// Add keyframes for animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.match-card {
  transform: translateY(20px);
}
`;
document.head.appendChild(style);


export default MatchCard;
