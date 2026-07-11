'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface VideoData {
  filename: string;
  description: string;
}

const PROMO_VIDEOS: VideoData[] = [
  { filename: 'AAFT.mp4', description: 'Cinematic promotional campaign for AAFT.' },
  { filename: 'Alcatel.mp4', description: 'High-impact product promo for Alcatel.' },
  { filename: 'Boya.mp4', description: 'Dynamic audio gear promotion for Boya.' },
  { filename: 'carrypro.mp4', description: 'Lifestyle product showcase for CarryPro.' },
  { filename: 'control z.mp4', description: 'Sleek tech promotion for Control Z.' },
  { filename: 'doodle.mp4', description: 'Creative brand spot for Doodle.' },
  { filename: 'Hosteller promotion 2.mp4', description: 'Immersive travel promotion for The Hosteller.' },
  { filename: 'Hosteller.mp4', description: 'Lifestyle and destination shoot for The Hosteller.' },
  { filename: 'ID sShoe.mp4', description: 'Urban footwear campaign for ID Shoes.' },
  { filename: 'Motul.mp4', description: 'High-octane automotive promotion for Motul.' },
  { filename: 'Triumph.mp4', description: 'Adrenaline-fueled motorcycle spot for Triumph.' },
  { filename: 'Torras.mp4', description: 'Modern accessory promotion for Torras.' },
  { filename: 'Samsung.mp4', description: 'Premium tech showcase for Samsung.' },
];

const TRAVEL_VIDEOS: VideoData[] = [
  { filename: 'cinemetography.mp4', description: 'Atmospheric cinematic reel.' },
  { filename: 'City Dawn.mp4', description: 'Urban awakening captured at first light.' },
  { filename: 'Kerala.mp4', description: 'Lush landscapes and vibrant culture of Kerala.' },
  { filename: 'Leh Ladhakh.mp4', description: 'Expansive mountain vistas of Leh Ladakh.' },
  { filename: 'Munnar.mp4', description: 'Serene tea gardens and rolling hills of Munnar.' },
  { filename: 'Nature drone shot.mp4', description: 'Breathtaking aerial perspective of untouched nature.' },
  { filename: 'Night Aerial.mp4', description: 'Cinematic drone journey through the night sky.' },
  { filename: 'Qutub Shahi Tombs.mp4', description: 'Architectural majesty of the Qutub Shahi Tombs.' },
  { filename: 'shoot1.mp4', description: 'Visual storytelling and creative cinematography.' },
  { filename: 'Shoot2.mp4', description: 'Dynamic action and narrative sequence.' },
  { filename: 'Uttrakhand.mp4', description: 'Majestic alpine landscapes of Uttarakhand.' },
  { filename: 'Shoot4.mp4', description: 'Experimental cinematography and visual flow.' },
  { filename: 'Shoot3.mp4', description: 'Evocative mood piece and lighting study.' },
];

// Reusable Video Player Component 
// Now featuring Glassmorphic interior UI & Hover scaling
function VideoPlayer({ data, index, total, isHero = false }: { data: VideoData; index: number; total: number; isHero?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Intersection Observer for autoplay (strict 50% threshold to save RAM)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      video.pause(); 
      setIsPlaying(false);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);

      if (nextMuted) {
        window.dispatchEvent(new Event('play-main-music'));
      } else {
        window.dispatchEvent(new Event('pause-main-music'));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (!isMuted) {
         window.dispatchEvent(new Event('play-main-music'));
      }
    };
  }, [isMuted]);

  return (
    <div ref={containerRef} className={`video-card flex flex-col gap-4 w-full group cursor-pointer ${isHero ? 'md:w-[60%] mx-auto' : ''}`}>
      <div 
        className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl transition-transform duration-[0.8s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.02] group-hover:z-50 ${isPlaying ? 'scale-[1.01]' : 'scale-100'}`}
        style={{ aspectRatio: isHero ? '16/9' : '9/16' }}
      >
        <video
          suppressHydrationWarning
          ref={videoRef}
          src={`/video/${data.filename}`}
          preload="none"
          muted={isMuted}
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Minimal Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-black/40 z-20">
          <div 
            className="h-full bg-white/70 transition-all duration-75 ease-linear" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Custom Animated Sound Equalizer Toggle */}
        <button 
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-colors group/audio"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white group-hover/audio:text-black transition-colors">
            <rect x="3" y={isMuted ? "11" : "4"} width="4" height={isMuted ? "2" : "16"} className={`origin-center transition-all duration-300 ${!isMuted && 'animate-eq-1'}`} />
            <rect x="10" y={isMuted ? "11" : "8"} width="4" height={isMuted ? "2" : "12"} className={`origin-center transition-all duration-300 ${!isMuted && 'animate-eq-2'}`} />
            <rect x="17" y={isMuted ? "11" : "2"} width="4" height={isMuted ? "2" : "18"} className={`origin-center transition-all duration-300 ${!isMuted && 'animate-eq-3'}`} />
          </svg>
        </button>
      </div>

      {/* Typography Overlay (Below Video) */}
      <div className={`flex flex-col gap-3 px-2 ${isHero ? 'items-center text-center' : ''}`}>
        <p className="text-[13px] md:text-[14px] text-white/80 font-[var(--font-geist-sans)] tracking-wide font-light leading-relaxed">
          {data.description}
        </p>
        <div className={`flex items-center w-full ${isHero ? 'justify-center gap-6' : 'justify-between'}`}>
          <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            {(index + 1).toString().padStart(2, '0')} / {total}
          </span>
          <a 
            href="https://www.instagram.com/filmedby.naresh/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group/btn relative flex items-center gap-2 text-[10px] text-white/50 hover:text-white uppercase tracking-[0.2em] font-medium transition-colors duration-500 pb-1"
          >
            <span className="relative z-10">View on IG</span>
            <div className="relative flex items-center justify-center w-3 h-3 overflow-hidden ml-1">
              <span className="absolute transform -translate-x-full translate-y-full group-hover/btn:translate-x-0 group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                <ArrowUpRight strokeWidth={1.5} className="w-3 h-3" />
              </span>
              <span className="absolute transform translate-x-0 translate-y-0 group-hover/btn:translate-x-full group-hover/btn:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                <ArrowUpRight strokeWidth={1.5} className="w-3 h-3" />
              </span>
            </div>
            {/* Elegant animated underline */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left ease-[cubic-bezier(0.76,0,0.24,1)]" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Reusable Parallax Grid Section Component to prevent overlaps and standardize physics
function ParallaxCategory({ 
  title, 
  subtitle, 
  description, 
  videos, 
  sectionId 
}: { 
  title: string, 
  subtitle: string, 
  description: string, 
  videos: VideoData[],
  sectionId: string
}) {
  // Extract the 13th video to use as a centered Hero Finale
  const gridVideos = videos.slice(0, 12);
  const finaleVideo = videos[12];

  const col1 = gridVideos.filter((_, i) => i % 3 === 0);
  const col2 = gridVideos.filter((_, i) => i % 3 === 1);
  const col3 = gridVideos.filter((_, i) => i % 3 === 2);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // Use matchMedia to disable parallax on mobile completely, preventing overlap
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Central column moves UP faster than scroll
        gsap.to(`.${sectionId}-col-2`, {
          yPercent: -15, 
          ease: 'none',
          scrollTrigger: {
            trigger: `.${sectionId}-wrap`,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
        
        // Outer columns move DOWN slightly against scroll
        gsap.to(`.${sectionId}-col-1, .${sectionId}-col-3`, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: `.${sectionId}-wrap`,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });
      
    });

    return () => ctx.revert();
  }, [sectionId]);

  return (
    <div className={`${sectionId}-wrap w-full max-w-[1600px] mx-auto px-[5vw] mb-12 pb-[5vh] relative`}>
      
      {/* Massive Background Watermark for Wow Factor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center -z-10 opacity-5">
        <h2 className="text-[30vw] font-black uppercase text-white whitespace-nowrap rotate-[-10deg] tracking-tighter">
          {title}
        </h2>
      </div>

      {/* Architectural Glassmorphic Header */}
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/20 pb-8 gap-6 relative z-10">
        <div className="relative">
          {/* Intense Glossy Glassmorphism Effect */}
          <h2 
            className="text-[8vw] sm:text-[7vw] md:text-[8vw] leading-[0.8] font-black uppercase tracking-tighter font-[var(--font-geist-sans)] text-transparent relative z-10 drop-shadow-2xl"
            style={{ 
              WebkitTextStroke: '2px rgba(255,255,255,0.7)',
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.1) 100%)',
              WebkitBackgroundClip: 'text'
            }}
          >
            {title}
          </h2>
          {/* Ambient Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 blur-[100px] -z-10 rounded-full" />
          
          <h3 className="text-[5vw] md:text-[2.5vw] font-serif italic text-white/50 mt-4 tracking-widest relative z-10">
            {subtitle}
          </h3>
        </div>
        <p className="text-white/40 font-mono text-[10px] md:text-[12px] uppercase tracking-widest max-w-[200px] text-left md:text-right">
          {description}
        </p>
      </div>

      {/* 3-Column Parallax Grid (12 Videos) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[15vw] md:gap-[3vw] items-start relative z-20">
        
        {/* Column 1 */}
        <div className={`${sectionId}-col-1 flex flex-col gap-[15vw] md:gap-[6vw] md:pt-[5vh]`}>
          {col1.map((data, idx) => (
            <VideoPlayer key={data.filename} data={data} index={idx * 3} total={videos.length} />
          ))}
        </div>

        {/* Column 2 (The Core Parallax Fast Column) */}
        <div className={`${sectionId}-col-2 flex flex-col gap-[15vw] md:gap-[6vw] md:-mt-[5vh]`}>
          {col2.map((data, idx) => (
            <VideoPlayer key={data.filename} data={data} index={(idx * 3) + 1} total={videos.length} />
          ))}
        </div>

        {/* Column 3 */}
        <div className={`${sectionId}-col-3 flex flex-col gap-[15vw] md:gap-[6vw] md:pt-[15vh]`}>
          {col3.map((data, idx) => (
            <VideoPlayer key={data.filename} data={data} index={(idx * 3) + 2} total={videos.length} />
          ))}
        </div>

      </div>

      {/* Center The 13th Video as a Massive Finale */}
      {finaleVideo && (
        <div className="mt-[20vw] md:mt-[30vh] w-full flex justify-center relative z-30">
          <VideoPlayer data={finaleVideo} index={12} total={videos.length} isHero={true} />
        </div>
      )}

    </div>
  );
}

export default function Videography() {
  return (
    <section className="relative w-full bg-black pt-32 overflow-clip">
      
      <ParallaxCategory 
        sectionId="promo"
        title="PROMOTIONAL"
        subtitle="Brand Campaigns & Shoots."
        description="01 — Commercial portfolio curated for extreme kinetic depth."
        videos={PROMO_VIDEOS}
      />

      <ParallaxCategory 
        sectionId="cinema"
        title="CINEMATOGRAPHY"
        subtitle="Nature, Aerial, & Travel."
        description="02 — Breathtaking landscapes structured for maximum parallax scale."
        videos={TRAVEL_VIDEOS}
      />

    </section>
  );
}
