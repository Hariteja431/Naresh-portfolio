'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROMO_VIDEOS = [
  { filename: 'Alcatel.mp4', title: 'Alcatel', description: 'A sleek, high-energy visual campaign showcasing modern tech.' },
  { filename: 'Boya.mp4', title: 'Boya', description: 'Crisp audio meets crisp visuals in this commercial product shoot.' },
  { filename: 'Hosteller.mp4', title: 'The Hosteller', description: 'Capturing the vibrant, nomadic spirit of modern backpacking.' },
  { filename: 'Hosteller promotion 2.mp4', title: 'Hosteller', description: 'An immersive promotional journey through unique stays.' },
  { filename: 'ID sShoe.mp4', title: 'ID Shoes', description: 'Dynamic footwork and gritty urban aesthetics.' },
  { filename: 'Motul.mp4', title: 'Motul', description: 'High-octane automotive storytelling fueled by pure adrenaline.' },
  { filename: 'Samsung.mp4', title: 'Samsung', description: 'Minimalist, premium cinematography for a global brand.' },
  { filename: 'Torras.mp4', title: 'Torras', description: 'Highlighting innovative product design with fluid camera work.' },
  { filename: 'Triumph.mp4', title: 'Triumph', description: 'Raw power and heritage captured on the open road.' },
  { filename: 'carrypro.mp4', title: 'CarryPro', description: 'Showcasing rugged utility with cinematic flair.' },
  { filename: 'control z.mp4', title: 'Control Z', description: 'A fast-paced, contemporary promotional sequence.' },
  { filename: 'doodle.mp4', title: 'Doodle', description: 'Creative, vibrant, and deeply engaging brand storytelling.' },
  { filename: 'AAFT.mp4', title: 'AAFT', description: 'Capturing the essence of education and artistic pursuit.' }
];

const TRAVEL_VIDEOS = [
  { filename: 'City Dawn.mp4', title: 'City Dawn', description: 'A quiet, sweeping look at the metropolis as it wakes.' },
  { filename: 'Kerala.mp4', title: 'Kerala', description: 'Lush greenery and serene backwaters in God\'s Own Country.' },
  { filename: 'Leh Ladhakh.mp4', title: 'Leh Ladakh', description: 'Breathtaking aerials over majestic, rugged mountainscapes.' },
  { filename: 'Munnar.mp4', title: 'Munnar', description: 'Mist-kissed tea gardens captured from the clouds.' },
  { filename: 'Nature drone shot.mp4', title: 'Nature', description: 'An ethereal drone sequence floating through the wilderness.' },
  { filename: 'Night Aerial.mp4', title: 'Night Aerial', description: 'The electric pulse of the city captured from above.' },
  { filename: 'Qutub Shahi Tombs.mp4', title: 'Qutub Shahi', description: 'Ancient heritage preserved in sweeping, cinematic light.' },
  { filename: 'Uttrakhand.mp4', title: 'Uttarakhand', description: 'A soulful journey through the majestic northern peaks.' },
  { filename: 'cinemetography.mp4', title: 'Cinematography', description: 'A curated montage of lighting, composition, and mood.' },
  { filename: 'Shoot2.mp4', title: 'Creative Vision', description: 'Behind the lens of a highly stylized creative project.' },
  { filename: 'Shoot3.mp4', title: 'The Process', description: 'Raw, unfiltered moments of cinematic creation.' },
  { filename: 'Shoot4.mp4', title: 'Wanderlust', description: 'A visual diary of movement and exploration.' },
  { filename: 'shoot1.mp4', title: 'Visual Poetry', description: 'Experimental lighting and atmospheric storytelling.' }
];

interface CategoryStageProps {
  categoryId: string;
  title: string;
  subtitle: string;
  videos: { filename: string; title: string; description: string }[];
}

function CategoryStage({ categoryId, title, subtitle, videos }: CategoryStageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // High-Impact Motion Graphic Reveal (Vertical Slit -> Full Screen)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current, {
          clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
          opacity: 0,
          scale: 0.85,
          filter: 'blur(10px)'
        }, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%', 
            toggleActions: 'play none none reverse'
          }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIndex) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [activeIndex]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const changeVideo = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // If the user UNMUTES a video in this section, automatically pause the main background song
    if (!newMutedState) {
      window.dispatchEvent(new Event('pause-main-music'));
    }
  };

  return (
    <div ref={sectionRef} className={`w-full py-16 md:py-24 flex flex-col items-center relative z-10 ${categoryId}-stage will-change-[transform,clip-path] perspective-[1200px]`}>
      
      {/* Dynamic Aurora Ambient Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[150%] max-w-[1200px] h-[80%] bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-emerald-400/30 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms] opacity-60" />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 relative z-20 flex flex-col items-center">
        
        {/* Cinematic Header */}
        <div className="mb-4 md:mb-6 flex flex-col items-center text-center">
           <h2 className="text-[10vw] md:text-[5vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 leading-none mb-2 md:mb-3 drop-shadow-2xl">{title}</h2>
           <p className="text-[10px] md:text-sm text-zinc-400 tracking-[0.2em] uppercase font-light">{subtitle}</p>
        </div>

        {/* Featured Video Stage (9:16 Vertical Monolith) */}
        <div className="relative w-full flex flex-col items-center perspective-[1000px]">
           
           {/* WOW Factor: 3D Stage Tilt */}
           <div 
             className="relative h-[48vh] md:h-[55vh] max-h-[600px] min-h-[350px] aspect-[9/16] rounded-xl overflow-hidden border border-white/5 bg-zinc-950 shadow-[0_20px_50px_rgba(255,255,255,0.02)] group/stage transition-transform duration-700 ease-out hover:scale-[1.02]"
           >
             
             {videos.map((data, idx) => {
               const isActive = idx === activeIndex;
               // Pure, elegant crossfade to prevent any black clipping or unequal zoom
               return (
                 <video
                   key={data.filename}
                   ref={el => { videoRefs.current[idx] = el }}
                   src={isActive ? `/video/${data.filename}` : undefined} // FIXED: use undefined instead of '' to prevent crash
                   poster={isActive ? undefined : '/placeholder.jpg'}
                   muted={isMuted}
                   playsInline
                   loop
                   suppressHydrationWarning
                   onTimeUpdate={isActive ? handleTimeUpdate : undefined}
                   className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-[opacity,transform] ${
                     isActive 
                       ? 'opacity-100 scale-100 z-10' 
                       : 'opacity-0 scale-[1.01] z-0'
                   }`}
                 />
               );
             })}

             {/* Animated Progress Line (Inside Bottom Edge) */}
             <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/60 z-20 transition-opacity duration-1000">
               <div 
                 className="h-full bg-gradient-to-r from-white/40 via-white to-white/40 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                 style={{ width: `${progress}%` }} 
               />
             </div>
           </div>

           {/* Dynamic Video Title & One-Liner Description */}
           <div className="mt-4 md:mt-6 flex flex-col items-center text-center px-4 max-w-xl h-[55px] md:h-[60px] justify-start transition-opacity duration-500">
              <h3 className="text-base md:text-xl font-bold text-white tracking-[0.2em] uppercase opacity-90">{videos[activeIndex].title}</h3>
              <p className="text-[10px] md:text-sm text-zinc-400 mt-1 md:mt-2 font-light tracking-wide">{videos[activeIndex].description}</p>
           </div>

           {/* External Controls & Film Strip (Centered matching the mock) */}
           <div className="w-full mt-2 flex flex-col items-center z-30 pointer-events-auto">
              
              {/* Controls Row (Perfectly Centered & Uniform Layout) */}
              <div className="relative flex items-center justify-between w-full max-w-[360px] md:max-w-[500px] mb-6 md:mb-8 px-2 md:px-0">
                
                {/* Left: Nav Buttons */}
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 w-[100px] md:w-[128px] justify-start z-10">
                  <button 
                     onClick={() => changeVideo((activeIndex - 1 + videos.length) % videos.length)}
                     className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#141414] flex items-center justify-center border border-white/5 hover:bg-white hover:text-black transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex-shrink-0"
                  >
                     <ArrowLeft strokeWidth={1.5} className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
                  <button 
                     onClick={() => changeVideo((activeIndex + 1) % videos.length)}
                     className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#141414] flex items-center justify-center border border-white/5 hover:bg-white hover:text-black transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex-shrink-0"
                  >
                     <ArrowRight strokeWidth={1.5} className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
                </div>
                
                {/* Center: IG Link (Absolutely Centered for perfect visual balance) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-0 whitespace-nowrap">
                  <a 
                     href="https://www.instagram.com/filmedby.naresh/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="group/btn flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[13px] text-white/80 hover:text-white uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold transition-colors duration-300"
                  >
                     <span>View on IG</span>
                     <ArrowUpRight strokeWidth={2} className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:-translate-y-[2px] group-hover/btn:translate-x-[2px] transition-transform duration-300" />
                  </a>
                </div>

                {/* Right: Sleek Modern Sound Button */}
                <div className="flex items-center justify-end flex-shrink-0 w-[100px] md:w-[128px] z-10">
                  <button 
                     onClick={toggleMute}
                     className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#141414] flex items-center justify-center border border-white/5 hover:bg-white hover:text-black transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-white/80 hover:text-black flex-shrink-0"
                     aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                     {isMuted ? <VolumeX strokeWidth={1.5} className="w-4 h-4 md:w-6 md:h-6" /> : <Volume2 strokeWidth={1.5} className="w-4 h-4 md:w-6 md:h-6" />}
                  </button>
                </div>
              </div>

              {/* Ultra-Realistic Film Strip Rail */}
              <div 
                 className="w-full max-w-[1000px] flex flex-col relative overflow-hidden rounded-[4px] border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.07)] mt-4"
                 style={{ 
                   background: 'linear-gradient(to bottom, #111 0%, #1c1c1c 10%, #0d0d0d 25%, #000 50%, #0d0d0d 75%, #1c1c1c 90%, #111 100%)',
                   boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                 }}
              >
                 {/* Glossy Celluloid Sheen Overlay */}
                 <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.08] via-white/[0.01] to-transparent z-20"></div>
                 
                 {/* Top Perforation Strip */}
                 <div className="w-full h-10 flex items-center justify-between px-2 relative z-10 border-b border-black/80">
                    {Array.from({ length: 65 }).map((_, i) => (
                       <div 
                          key={`top-${i}`} 
                          className="w-3 h-4 rounded-[3px] bg-black flex-shrink-0 mx-[5px]" 
                          style={{ boxShadow: 'inset 0 3px 6px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.15)' }} 
                       />
                    ))}
                 </div>
                 
                 {/* Main Video Track */}
                 <div className="w-full py-5 relative overflow-hidden z-10 bg-[#050505]/90 border-y border-white/[0.02]">
                    <div 
                       className="flex items-center gap-4 transition-transform duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                       style={{ transform: `translateX(calc(50% - ${(activeIndex * 164) + 74}px))` }} // 148px width + 16px gap = 164px. Center = 148/2 = 74px
                    >
                       {videos.map((data, idx) => {
                          const isActive = idx === activeIndex;
                          return (
                             <div 
                                key={data.filename}
                                onClick={() => changeVideo(idx)}
                                className={`flex-shrink-0 relative w-[148px] aspect-[16/9] rounded-sm overflow-hidden cursor-pointer transition-all duration-500 ${
                                   isActive 
                                    ? 'border-[1.5px] border-white/90 scale-100 z-10 brightness-100 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                                    : 'border border-transparent scale-[0.95] z-0 brightness-[0.25] grayscale hover:brightness-[0.5]'
                                }`}
                             >
                                <video 
                                  src={`/video/${data.filename}`} 
                                  className="w-full h-full object-cover pointer-events-none"
                                  preload="metadata"
                                  suppressHydrationWarning
                                />
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 {/* Bottom Perforation Strip */}
                 <div className="w-full h-10 flex items-center justify-between px-2 relative z-10 border-t border-black/80">
                    {Array.from({ length: 65 }).map((_, i) => (
                       <div 
                          key={`bottom-${i}`} 
                          className="w-3 h-4 rounded-[3px] bg-black flex-shrink-0 mx-[5px]"
                          style={{ boxShadow: 'inset 0 -3px 6px rgba(0,0,0,1), 0 -1px 0 rgba(255,255,255,0.12)' }} 
                       />
                    ))}
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

export default function Videography() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="relative w-full bg-black pt-12 md:pt-32 pb-24 overflow-clip font-[var(--font-geist-sans)]">
      
      {/* Category 1: Promotional */}
      {/* Simple, subtle reveal animations are handled inside each CategoryStage component */}
      <CategoryStage 
        categoryId="promo"
        title="Promotional"
        subtitle="Brand Campaigns & Shoots."
        videos={PROMO_VIDEOS}
      />

      {/* Category 2: Travel & Cinematography */}
      {/* Removed the heavy pinned shutter transition completely to avoid black screens and long scrolls */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16 md:my-32" />
      
      <CategoryStage 
        categoryId="cinema"
        title="Cinematography"
        subtitle="Nature, Aerial, & Travel."
        videos={TRAVEL_VIDEOS}
      />

    </section>
  );
}

