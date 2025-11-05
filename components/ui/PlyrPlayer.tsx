import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';

interface PlyrPlayerProps {
  streamUrl: string;
}

const PlyrPlayer: React.FC<PlyrPlayerProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoElement = videoRef.current;
    let hls: Hls | null = null;
    
    const options: Plyr.Options = {
        autoplay: true,
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'fullscreen'],
    };

    if (streamUrl.includes('.m3u8') && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            playerRef.current = new Plyr(videoElement, options);
        });
    } else {
        videoElement.src = streamUrl;
        playerRef.current = new Plyr(videoElement, options);
    }

    return () => {
      // Use the ref to ensure we're destroying the correct instance during cleanup.
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  return <video ref={videoRef} id="player" playsInline className="w-full h-full"></video>;
};

export default PlyrPlayer;