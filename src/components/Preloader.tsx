'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Absolute strict scroll blocking
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    const preventKeys = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown'].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventKeys, { passive: false });

    const releaseScroll = () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeys);
    };

    // 2. Animate the counter from 0 to 90 over a safe maximum time (10 seconds)
    // This allows the estimated time to be mathematically consistent.
    const duration = 10.0; 
    const counterObj = { val: 0 };
    
    let isVideoReady = (window as any).heroVideoReady || false;
    let tween: gsap.core.Tween;
    
    const handleVideoReady = () => {
      isVideoReady = true;
      finishLoading();
    };

    window.addEventListener('hero-video-ready', handleVideoReady);

    // Strict real-time countdown every 1000ms
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => Math.max(1, prev - 1));
    }, 1000);

    tween = gsap.to(counterObj, {
      val: 90,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        const p = Math.round(counterObj.val);
        setProgress(p);
      },
      onComplete: () => {
        if (isVideoReady) {
          finishLoading();
        }
      }
    });

    const finishLoading = () => {
      if (counterObj.val === 100) return;
      
      // Kill the slow tween if it finishes early!
      if (tween) tween.kill();
      clearInterval(timerInterval);
      
      gsap.to(counterObj, {
        val: 100,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          setProgress(Math.round(counterObj.val));
          setTimeLeft(0);
        },
        onComplete: () => {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            delay: 0.2,
            onComplete: () => {
              releaseScroll();
              if (containerRef.current) {
                 containerRef.current.style.display = 'none';
              }
              window.dispatchEvent(new Event('preloader-finished'));
            }
          });

          gsap.to(counterRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    };

    return () => {
      window.removeEventListener('hero-video-ready', handleVideoReady);
      clearInterval(timerInterval);
      releaseScroll();
    };

  }, []);

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
      
      <div ref={counterRef} className="relative z-10 flex flex-col items-center gap-4">
        <div className="overflow-hidden">
          <p className="text-[12vw] md:text-[8vw] font-[var(--font-playfair)] italic text-white leading-none tracking-tighter">
            {progress}%
          </p>
        </div>
        <div className="w-[200px] h-[1px] bg-white/20 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex flex-col items-center gap-1 mt-4">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 font-mono">
            Loading Experience
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white font-mono font-semibold tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            Est. Time: 00:0{timeLeft}
          </p>
        </div>
      </div>
    </div>
  );
}
