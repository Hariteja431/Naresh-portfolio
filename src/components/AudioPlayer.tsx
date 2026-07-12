'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Auto-play audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch(() => {});
        setHasInteracted(true);
      }
    };

    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('preloader-finished', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);

  // Listen for custom events to pause/play audio globally (e.g. from Video players)
  useEffect(() => {
    const handlePause = () => {
      if (audioRef.current && isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    };
    
    const handlePlay = () => {
      // Only auto-resume if the user has already interacted with the site
      if (audioRef.current && !isAudioPlaying && hasInteracted) {
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('pause-main-music', handlePause);
    window.addEventListener('play-main-music', handlePlay);

    return () => {
      window.removeEventListener('pause-main-music', handlePause);
      window.removeEventListener('play-main-music', handlePlay);
    };
  }, [isAudioPlaying, hasInteracted]);

  // Handle tab visibility changes (pause when minimized/backgrounded)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioRef.current && isAudioPlaying) {
          audioRef.current.pause();
          // We don't set isAudioPlaying(false) here, so we remember the user's intent to play
        }
      } else {
        if (audioRef.current && isAudioPlaying && hasInteracted) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAudioPlaying, hasInteracted]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setHasInteracted(true); 
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch(() => {});
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio.mp3" loop />
      <button
        onClick={toggleAudio}
        className="fixed top-8 right-8 z-[100] flex items-center gap-3 text-white/80 hover:text-white transition-colors cursor-pointer group"
        aria-label="Toggle Audio"
      >
        <span className="hidden md:inline-block text-[10px] uppercase tracking-[0.2em] font-mono transition-colors drop-shadow-md font-medium mix-blend-difference">
          {isAudioPlaying ? 'Sound On' : 'Sound Off'}
        </span>
        <div className="w-10 h-10 rounded-full border border-white/30 bg-black/20 flex items-center justify-center group-hover:scale-105 group-hover:border-white/60 transition-all duration-300 backdrop-blur-xl shadow-2xl">
           {isAudioPlaying ? (
             <Volume2 className="w-4 h-4 text-white drop-shadow-md" strokeWidth={2} />
           ) : (
             <VolumeX className="w-4 h-4 text-white drop-shadow-md" strokeWidth={2} />
           )}
        </div>
      </button>
    </>
  );
}
