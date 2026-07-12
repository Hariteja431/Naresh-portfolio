'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [phase, setPhase] = useState<'buffering' | 'countdown'>('buffering');
  const [count, setCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    let isVideoReady = (window as any).heroVideoReady || false;
    
    const handleVideoReady = () => {
      if (!isVideoReady) {
        isVideoReady = true;
        setPhase('countdown');
      }
    };

    if (isVideoReady) {
      setPhase('countdown');
    } else {
      window.addEventListener('hero-video-ready', handleVideoReady);
    }

    return () => {
      window.removeEventListener('hero-video-ready', handleVideoReady);
    };
  }, []);

  useEffect(() => {
    if (phase === 'countdown') {
      let currentCount = 3;
      setCount(currentCount);

      const interval = setInterval(() => {
        currentCount -= 1;
        if (currentCount > 0) {
          setCount(currentCount);
        } else {
          clearInterval(interval);
          finishLoading();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const finishLoading = () => {
    // 3. When 0 is reached, smoothly animate the preloader away
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 0.1,
      onComplete: () => {
        document.body.style.overflow = 'auto';
        document.body.classList.remove('overflow-hidden');
        if (containerRef.current) {
           containerRef.current.style.display = 'none';
        }
        window.dispatchEvent(new Event('preloader-finished'));
      }
    });

    gsap.to(elementsRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <h1 className="text-[20vw] font-black tracking-tighter uppercase whitespace-nowrap text-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
          Naresh
        </h1>
      </div>
      
      <div ref={elementsRef} className="relative z-10 flex flex-col items-center min-h-[120px] justify-center">
        {phase === 'buffering' ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/80 rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono animate-pulse">
              Buffering Cinematic Experience
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[15vw] md:text-[8vw] font-[var(--font-playfair)] italic text-white leading-none tracking-tighter">
              0{count}
            </p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono mt-2">
              Preparing to Immerse
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
