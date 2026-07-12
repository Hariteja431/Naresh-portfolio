'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Disable scrolling initially (in case it wasn't already caught by the body class)
    document.body.style.overflow = 'hidden';

    // 2. Animate the counter from 0 to 100
    const duration = 2.5; // Simulate load time
    const counterObj = { val: 0 };
    
    gsap.to(counterObj, {
      val: 100,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        setProgress(Math.round(counterObj.val));
      },
      onComplete: () => {
        // 3. When 100% is reached, smoothly animate the preloader away
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.2, // Tiny pause at 100% before swiping up
          onComplete: () => {
            // Restore scrolling
            document.body.style.overflow = 'auto';
            document.body.classList.remove('overflow-hidden');
            // Hide preloader from DOM visually completely if needed (though it's off-screen)
            if (containerRef.current) {
               containerRef.current.style.display = 'none';
            }
            
            // Dispatch custom event to trigger page entrance animations
            window.dispatchEvent(new Event('preloader-finished'));
          }
        });

        // Also fade out the counter text slightly before the container swipes up
        gsap.to(counterRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });

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
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 font-mono mt-4">
          Loading Experience
        </p>
      </div>
    </div>
  );
}
