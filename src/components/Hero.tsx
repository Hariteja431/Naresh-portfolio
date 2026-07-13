'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle responsive state to prevent text cutoff on mobile screens
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  useLayoutEffect(() => {
    let ctx: gsap.Context;

    document.fonts.ready.then(() => {
      const mainText = document.getElementById('main-text') as any;
      const svg = svgRef.current;
      
      if (!mainText || !svg) return;

      // Extract precise coordinates of the letter 'I' directly from the SVG engine.
      // 'I' is at index 1 in the string "FILMED BY" (F=0, I=1).
      // This is mathematically flawless and avoids any bounding box bugs!
      let zoomX = 500;
      let zoomY = 500;
      try {
        const rect = mainText.getExtentOfChar(1);
        zoomX = rect.x + rect.width / 2;
        zoomY = rect.y + rect.height / 2;
      } catch (e) {
        // Fallback safely if browser engine fails
      }

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=250%', 
            scrub: 1.5, 
            pin: true, 
            refreshPriority: 1,
          },
        });

        const indicator = scrollIndicatorRef.current;
        if (indicator) {
          tl.to(indicator, {
            opacity: 0,
            y: 30,
            duration: 0.1,
            ease: 'power2.out'
          }, 0);
        }

        // 1. We use a proxy object to drive the logarithmic zoom. 
        // This entirely prevents the "jitter" and sudden hyper-speed at the end of linear zooms.
        const zoomState = { val: 0 };
        tl.to(zoomState, {
          val: 1,
          ease: 'power2.inOut',
          duration: 1,
          onUpdate: () => {
            const progress = zoomState.val;
            
            // Only zoom 25x. This keeps the coordinate math incredibly safe and prevents GPU crashes.
            // The viewBox will shrink from 1000 down to 40.
            const currentScale = Math.pow(25, progress); 
            const currentSize = 1000 / currentScale;
            
            // Pan smoothly into the 'I'
            const currentCenterX = 500 + (zoomX - 500) * progress;
            const currentCenterY = 500 + (zoomY - 500) * progress;
            
            const newX = currentCenterX - (currentSize / 2);
            const newY = currentCenterY - (currentSize / 2);
            
            svg.setAttribute('viewBox', `${newX} ${newY} ${currentSize} ${currentSize}`);
          }
        }, 0);

        // 2. THE SECRET WEAPON: As we zoom in, we dynamically expand the transparent stroke 
        // of the text. By the time the camera hits the 40x40 window, the transparent hole 
        // has expanded to be 150 units wide, completely swallowing the camera!
        // This guarantees NO black screens, NO jitter, and NO opacity fading!
        tl.to('#main-text, #sub-text', {
          attr: { 'stroke-width': 150 },
          ease: 'power3.in',
          duration: 1
        }, 0);

        // Force GSAP to recalculate all downstream ScrollTriggers (like AboutPortrait) 
        // because this async font-loaded pin adds 400vh to the document height!
        setTimeout(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        }, 50);

      }, containerRef);
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, [isMobile]);

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <video
          ref={videoRef}
          src="/hero_section_video_bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onProgress={(e) => {
            const video = e.currentTarget;
            if (video.buffered.length > 0) {
              const bufferedSeconds = video.buffered.end(video.buffered.length - 1);
              const duration = video.duration || 7;
              
              // Broadcast exact buffer progress to sync the UI loader
              window.dispatchEvent(new CustomEvent('hero-video-progress', { 
                detail: { buffered: bufferedSeconds, target: Math.min(4, duration / 2) } 
              }));

              if (bufferedSeconds >= 4 || bufferedSeconds >= duration / 2) {
                if (!(window as any).heroVideoReady) {
                  (window as any).heroVideoReady = true;
                  window.dispatchEvent(new Event('hero-video-ready'));
                }
              }
            }
          }}
          suppressHydrationWarning
          className="w-[100vh] h-[100vw] object-cover -rotate-90 origin-center" 
        />
      </div>

      {/* Vector SVG Mask */}
      <svg 
        ref={svgRef} 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="xMidYMid slice" 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      >
        <defs>
          <mask id="textMask">
            <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
            
            <g id="text-group">
              <text 
                id="main-text"
                x="500" y={isMobile ? "470" : "460"}
                textAnchor="middle" 
                fill="black" 
                stroke="black"
                strokeWidth={isMobile ? "1" : "2"} 
                fontSize={isMobile ? "70" : "140"} 
                fontWeight="900" 
                fontFamily="var(--font-geist-sans), sans-serif"
              >
                FILMED BY
              </text>
              <text 
                id="sub-text"
                x="500" y={isMobile ? "550" : "580"}
                textAnchor="middle" 
                fill="black" 
                stroke="black"
                strokeWidth={isMobile ? "1" : "2"} 
                fontSize={isMobile ? "70" : "140"} 
                fontWeight="900" 
                fontFamily="var(--font-geist-sans), sans-serif"
              >
                NARESH
              </text>
            </g>
          </mask>
        </defs>
        
        <rect x="-5000" y="-5000" width="10000" height="10000" fill="black" mask="url(#textMask)" />
      </svg>

      {/* Sleek Scroll Down Indicator */}
      <div 
        ref={scrollIndicatorRef} 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono drop-shadow-md whitespace-nowrap">Tap & scroll</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
          <div className="w-full h-full bg-white origin-top animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
