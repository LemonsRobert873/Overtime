import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMatchById } from '../services/matchService';
import { Match } from '../types';
import Plyr from 'plyr';
import Hls from 'hls.js';

const Player: React.FC = () => {
    const [searchParams] = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [match, setMatch] = useState<Match | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const plyrInstanceRef = useRef<Plyr | null>(null);
    const hlsInstanceRef = useRef<Hls | null>(null);

    const id = searchParams.get('id');
    const cdn = searchParams.get('cdn');

    // Effect 1: Fetch match data and handle page loading/error states
    useEffect(() => {
        const fetchMatchData = async () => {
            if (!id || !cdn) {
                setError("Missing match ID or CDN information in the URL.");
                setLoading(false);
                return;
            }

            try {
                const foundMatch = await getMatchById(id);
                if (!foundMatch) {
                    setError("Match not found.");
                } else {
                    setMatch(foundMatch);
                }
            } catch (err) {
                setError("Failed to load match data.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
    }, [id, cdn]);

    // Effect 2: Initialize the player once match data is available and the video element is rendered
    useEffect(() => {
        if (!match || !cdn || !videoRef.current) {
            return;
        }

        const streams = {
            ...match.STREAMING_CDN,
            adfree_stream: match.adfree_stream,
            dai_stream: match.dai_stream
        };
        const streamUrl = streams[cdn];

        if (!streamUrl || streamUrl === "Unavailable") {
            setError("This stream is currently unavailable.");
            return;
        }

        const videoElement = videoRef.current;
        let isEffectActive = true; // Flag to prevent race conditions on cleanup

        const initializePlyr = () => {
            // Check if the effect is still active before initializing the player.
            // This prevents a race condition if the component unmounts quickly.
            if (isEffectActive && videoElement) {
                plyrInstanceRef.current = new Plyr(videoElement, { autoplay: true });
            }
        };
        
        if (streamUrl.includes('.m3u8') && Hls.isSupported()) {
            const hls = new Hls();
            hlsInstanceRef.current = hls;
            hls.loadSource(streamUrl);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, initializePlyr);
        } else {
            videoElement.src = streamUrl;
            initializePlyr();
        }

        return () => {
            isEffectActive = false; // Mark effect as inactive
            plyrInstanceRef.current?.destroy();
            plyrInstanceRef.current = null;
            
            hlsInstanceRef.current?.destroy();
            hlsInstanceRef.current = null;
        };
    }, [match, cdn]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <p className="text-xl text-slate-300">Loading Player...</p>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-background">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Stream Error</h2>
                <p className="text-slate-400 mb-6">{error}</p>
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
                <video ref={videoRef} id="player" playsInline controls className="w-full h-full"></video>
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