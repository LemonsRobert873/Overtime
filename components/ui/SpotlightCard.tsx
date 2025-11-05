
import React from 'react';
import { Match } from '../../types';
import { Link } from 'react-router-dom';

interface SpotlightCardProps {
  match: Match;
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

const SpotlightCard: React.FC<SpotlightCardProps> = ({ match }) => {
  const imgSrc = match.image || 'https://picsum.photos/seed/spotlight/800/450';
  const buttons = generateButtons(match, 'text-sm px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/30');

  return (
    <div className="mb-16 border border-[var(--border-color)] bg-gradient-to-br from-[var(--card-bg)] to-slate-900/40 backdrop-filter backdrop-blur-2xl rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center gap-8 p-6 md:p-8">
      <div className="relative rounded-lg overflow-hidden aspect-video">
        <img src={imgSrc} alt={match.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="spotlight-live-badge absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-lg flex items-center">
          <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          LIVE NOW
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-amber-400 font-semibold text-sm mb-1">{match.tournament || ''}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{match.title || 'Live Match'}</h2>
        <p className="text-slate-400 text-sm mb-6">{match.language || ''}</p>
        <div className="flex flex-wrap gap-3">{buttons}</div>
      </div>
    </div>
  );
};

export default SpotlightCard;
