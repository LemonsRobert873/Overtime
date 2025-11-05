
import React, { useState, useEffect } from 'react';
import { getMatches } from '../services/matchService';
import { Match } from '../types';
import SpotlightCard from './ui/SpotlightCard';
import MatchCard from './ui/MatchCard';
import CardSkeleton from './ui/CardSkeleton';

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [spotlightMatch, setSpotlightMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const allMatches = await getMatches();
        const firstLiveMatch = allMatches.find(m => m.status?.toUpperCase() === 'LIVE');
        
        if (firstLiveMatch) {
          setSpotlightMatch(firstLiveMatch);
          setMatches(allMatches.filter(m => m.match_id !== firstLiveMatch.match_id));
        } else {
          setMatches(allMatches);
        }
      } catch (err) {
        setError('Could not load matches. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
      return <p className="col-span-full text-center text-red-400">{error}</p>;
    }
    
    if (matches.length === 0 && !spotlightMatch) {
        return <p className="col-span-full text-center text-slate-400">No matches available right now.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match, index) => (
          <MatchCard key={match.match_id} match={match} index={index} />
        ))}
      </div>
    );
  };
  
  return (
    <>
      <header className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-400">
          Overtime
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto">
          Where the game never ends.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        {loading && !spotlightMatch && (
            <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse mb-16"></div>
        )}
        {spotlightMatch && <SpotlightCard match={spotlightMatch} />}

        <div className="mt-16 mb-8 px-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Live & Upcoming</h2>
          <div className="w-20 h-1 mt-2 bg-gradient-to-r from-sky-500 to-amber-500 rounded-full"></div>
        </div>
        
        {renderContent()}
      </main>
    </>
  );
};

export default MatchList;
