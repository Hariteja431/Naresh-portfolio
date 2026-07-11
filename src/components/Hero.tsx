'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
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

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);

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

  const drawMask = (scale: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'destination-out';
    
    ctx.scale(dpr, dpr);
    
    const fontSize = w * 0.12; 
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const line1 = 'FILMED BY';
    const line2 = 'NARESH';
    
    const totalW = ctx.measureText(line1).width;
    const wFI = ctx.measureText('FI').width;
    const wI = ctx.measureText('I').width;
    
    const targetX = (-totalW / 2) + wFI - (wI / 2);
    const targetY = -fontSize * 0.6; 
    
    ctx.translate(w / 2, h / 2);
    ctx.translate(targetX, targetY);
    ctx.scale(scale, scale);
    ctx.translate(-targetX, -targetY);
    
    ctx.fillText(line1, 0, -fontSize * 0.6);
    ctx.fillText(line2, 0, fontSize * 0.6);
    
    ctx.globalCompositeOperation = 'source-over';
  };

  useEffect(() => {
    document.fonts.ready.then(() => drawMask(1));
    
    const proxy = { scale: 1 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%', 
          scrub: 1.5, 
          pin: true,
          onUpdate: () => drawMask(proxy.scale)
        }
      });

      // Canvas Zoom Animation
      tl.to(proxy, {
        scale: 150, 
        ease: 'expo.inOut',
        duration: 1
      }, 0);

      // Fade out the scroll indicator almost immediately when scrolling begins
      tl.to(scrollIndicatorRef.current, {
        opacity: 0,
        ease: 'power2.out',
        duration: 0.05
      }, 0);

    }, containerRef);

    drawMask(1);

    const handleResize = () => drawMask(proxy.scale);
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <video
          ref={videoRef}
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          suppressHydrationWarning
          className="w-full h-full object-cover origin-center" 
        />
      </div>

      {/* Atmospheric Audio */}
      <audio ref={audioRef} src="/audio.mp3" loop />

      {/* Unbreakable HTML5 Canvas Mask */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Cinematic Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef} 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 text-white/50 pointer-events-none"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/60 animate-[scroll-down_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Ultra-Minimalist Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="absolute top-10 right-10 z-50 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-pointer group"
        aria-label="Toggle Audio"
      >
        <span>{isAudioPlaying ? 'Sound On' : 'Sound Off'}</span>
        <div className="flex gap-[3px] items-end h-3 overflow-hidden">
          {/* Equalizer bars that react to playing state */}
          <div className={`w-[2px] bg-current transition-all duration-300 ease-out origin-bottom ${isAudioPlaying ? 'h-2 group-hover:h-3' : 'h-[2px]'}`} />
          <div className={`w-[2px] bg-current transition-all duration-300 ease-out origin-bottom delay-75 ${isAudioPlaying ? 'h-3 group-hover:h-2' : 'h-[2px]'}`} />
          <div className={`w-[2px] bg-current transition-all duration-300 ease-out origin-bottom delay-150 ${isAudioPlaying ? 'h-1.5 group-hover:h-3' : 'h-[2px]'}`} />
        </div>
      </button>
    </section>
  );
}
