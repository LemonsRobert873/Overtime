import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMatchById } from '../services/matchService';
import { Match } from '../types';
import PlyrPlayer from './ui/PlyrPlayer';

const Player: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [match, setMatch] = useState<Match | null>(null);
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const id = searchParams.get('id');
    const cdn = searchParams.get('cdn');

    useEffect(() => {
        const fetchMatchData = async () => {
            if (!id || !cdn) {
                setError("Missing match ID or CDN information in the URL.");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const foundMatch = await getMatchById(id);
                if (!foundMatch) {
                    setError("Match not found.");
                } else {
                    setMatch(foundMatch);
                    const streams = {
                        ...foundMatch.STREAMING_CDN,
                        adfree_stream: foundMatch.adfree_stream,
                        dai_stream: foundMatch.dai_stream
                    };
                    const url = streams[cdn];

                    if (!url || url === "Unavailable") {
                        setError("This stream is currently unavailable.");
                        setStreamUrl(null);
                    } else {
                        setStreamUrl(url);
                    }
                }
            } catch (err) {
                setError("Failed to load match data.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
    }, [id, cdn]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <p className="text-xl text-slate-300">Loading Player...</p>
            </div>
        );
    }
    
    if (error || !streamUrl) {
        return (
             <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-background">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Stream Error</h2>
                <p className="text-slate-400 mb-6">{error || "Stream could not be loaded."}</p>
                <Link to="/" className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors">
                    Go Back Home
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            <header className="flex-shrink-0 p-4 bg-[#0f172a] border-b border-[var(--border-color)] text-center">
                <h1 className="text-lg md:text-xl font-bold text-white truncate">{match?.title || 'Live Match'}</h1>
            </header>
            <main className="flex-grow flex items-center justify-center bg-black min-h-0">
                <PlyrPlayer streamUrl={streamUrl} />
            </main>
            <footer className="flex-shrink-0 p-4 bg-[#0f172a] border-t border-[var(--border-color)] text-center">
                 <Link to="/" className="inline-block px-8 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors">
                    &larr; Go Back
                </Link>
            </footer>
        </div>
    );
};

export default Player;