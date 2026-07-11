'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. BRANDS MARQUEE
// ==========================================
const BRANDS = ['Alcatel', 'Boya', 'Motul', 'Samsung', 'Torras', 'Triumph', 'Hosteller', 'carrypro', 'ID sShoe'];

function BrandsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Motion graphics while scrolling - shift the whole marquee slightly based on scroll
      gsap.to('.marquee-wrap', {
        x: '-10%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full pt-16 pb-32 overflow-hidden relative border-t border-white/5">
      <div className="w-full max-w-[1600px] mx-auto px-[5vw] mb-12">
        <div className="w-full h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
        <p className="text-center text-[11px] uppercase tracking-[0.4em] font-mono text-white/50 mt-6">
          Trusted by Industry Leaders
        </p>
      </div>

      <div className="marquee-container relative flex overflow-x-hidden group py-8">
        <div className="marquee-wrap w-full flex">
          <div className="animate-marquee flex whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
              <span 
                key={idx} 
                className="mx-8 md:mx-16 text-[8vw] md:text-[5vw] font-black uppercase tracking-tighter text-white/30 transition-transform duration-500 hover:scale-110 hover:text-white cursor-default"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
              >
                {brand}
              </span>
            ))}
          </div>
          <div className="absolute top-8 animate-marquee2 flex whitespace-nowrap group-hover:[animation-play-state:paused] pointer-events-none">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
              <span 
                key={`overlay-${idx}`} 
                className="mx-8 md:mx-16 text-[8vw] md:text-[5vw] font-black uppercase tracking-tighter text-white/30 transition-colors duration-500"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-[1600px] mx-auto px-[5vw] mt-12">
        <div className="w-full h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </div>
    </section>
  );
}

// ==========================================
// 2. SERVICES ACCORDION
// ==========================================
const SERVICES_DATA = [
  { category: 'Photography', items: ['Travel Photography', 'Landscape Photography', 'Lifestyle Photography', 'Commercial Photography', 'Product Photography', 'Hospitality Photography', 'Architecture Photography', 'Event Photography'] },
  { category: 'Cinematography', items: ['Travel Films', 'Commercial Advertisements', 'Brand Campaign Films', 'Tourism Promotion Videos', 'Lifestyle Films', 'Promotional Videos', 'Social Media Content', 'Product Videos'] },
  { category: 'Aerial Filmmaking', items: ['Drone Cinematography', 'Aerial Photography', 'Landscape Drone Films', 'Real Estate Drone Coverage', 'Tourism & Destination Films', 'Resort & Hospitality Aerial Videos'] },
  { category: 'Brand & Commercial Content', items: ['Brand Storytelling', 'Product Launch Campaigns', 'Commercial Shoots', 'Social Media Campaigns', 'Digital Advertising Content', 'Marketing Visuals', 'Promotional Campaigns'] },
  { category: 'Tourism & Hospitality', items: ['Tourism Board Campaigns', 'Luxury Resorts', 'Boutique Stays', 'Hotels & Homestays', 'Destination Marketing', 'Experience-Based Travel Films'] },
  { category: 'Automotive', items: ['Motorcycle Cinematography', 'Car Commercials', 'Road Trip Films', 'Automotive Brand Campaigns'] },
  { category: 'Content Creation', items: ['Instagram Reels', 'Short-form Cinematic Content', 'Long-form Travel Films', 'Creator Collaborations', 'Behind-the-Scenes Content', 'Creative Direction'] },
  { category: 'Post Production', items: ['Professional Video Editing', 'Cinematic Color Grading', 'Sound Design', 'Motion Graphics', 'Visual Storytelling', 'Content Optimization'] }
];

const CREATIVE_EXPERTISE = ['Cinematic Storytelling', 'Photography', 'Cinematography', 'Drone Filmmaking', 'Commercial Production', 'Travel Documentation', 'Lifestyle Content', 'Color Grading', 'Video Editing', 'Visual Direction', 'Creative Direction', 'Brand Storytelling'];
const WORKING_WITH = ['Tourism Boards', 'Hotels & Resorts', 'Travel Brands', 'Automotive Brands', 'Camera & Tech Brands', 'Lifestyle Brands', 'Outdoor Brands', 'Creative Agencies', 'Startups', 'Personal Brands', 'Digital Creators', 'Commercial Businesses'];

function Services() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Intense Parallax scrub for background text
      gsap.to('.services-bg-text', {
        x: '-20%',
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full max-w-[1200px] mx-auto px-[5vw] py-24 md:py-40 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center -z-10 opacity-[0.03]">
        <h2 className="services-bg-text text-[30vw] font-black uppercase text-white whitespace-nowrap tracking-tighter">
          SERVICES
        </h2>
      </div>

      <div className="mb-16 md:mb-24 services-header">
        <h2 className="text-[12vw] md:text-[6vw] font-black uppercase tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
          Services <br />
          <span className="font-[var(--font-playfair)] italic font-light lowercase tracking-normal text-transparent pr-4" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.7)', background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.1) 100%)', WebkitBackgroundClip: 'text' }}>
            & expertise.
          </span>
        </h2>
      </div>

      <div className="services-list flex flex-col border-t border-white/20">
        {SERVICES_DATA.map((service, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="service-item border-b border-white/10 overflow-hidden">
              <button 
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left py-6 md:py-8 group"
              >
                <div className="flex items-center gap-4 md:gap-12">
                  <span className="text-white/30 font-mono text-xs md:text-sm tracking-widest group-hover:text-white/80 transition-colors duration-300">
                    0{idx + 1}
                  </span>
                  <h3 className="text-[5.5vw] md:text-[2.5vw] font-medium tracking-tight text-white/80 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-2">
                    {service.category}
                  </h3>
                </div>
                <div className={`transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-45 scale-110' : 'rotate-0 scale-100'}`}>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors">
                    <span className="text-current text-lg font-light leading-none mb-0.5">+</span>
                  </div>
                </div>
              </button>
              
              <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0 pb-0'}`}>
                <div className="overflow-hidden flex flex-wrap gap-2 md:gap-3 pl-[2.5rem] md:pl-[6rem]">
                  {service.items.map((item, i) => (
                    <span key={i} className="text-[10px] md:text-[13px] px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white hover:text-black transition-colors backdrop-blur-md cursor-default">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="expertise-container mt-24 md:mt-32 relative">
        <h4 className="text-white/50 font-mono uppercase tracking-widest text-xs mb-6 md:mb-8 flex items-center gap-4">
          <span className="w-12 h-[1px] bg-gradient-to-r from-white/40 to-transparent" /> Creative Expertise
        </h4>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {CREATIVE_EXPERTISE.map((tag, i) => (
            <span key={i} className="expertise-tag text-[10px] md:text-[11px] uppercase tracking-wider px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform cursor-default">
              {tag}
            </span>
          ))}
        </div>

        <h4 className="text-white/50 font-mono uppercase tracking-widest text-xs mt-12 md:mt-16 mb-6 md:mb-8 flex items-center gap-4">
          <span className="w-12 h-[1px] bg-gradient-to-r from-white/40 to-transparent" /> Working With
        </h4>
        <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-3 text-white/40 text-[10px] md:text-[13px] uppercase tracking-wider font-medium">
          {WORKING_WITH.map((tag, i) => (
            <React.Fragment key={i}>
              <span className="hover:text-white transition-colors cursor-default">{tag}</span>
              {i !== WORKING_WITH.length - 1 && <span className="text-white/20 hidden md:inline">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. CREATIVE PROCESS
// ==========================================
const PROCESS = [
  { step: '01', title: 'Discover', desc: 'Understanding the location, brand, mood, and story before shooting.' },
  { step: '02', title: 'Capture', desc: 'Creating cinematic visuals using photography, filmmaking, and aerial cinematography with a focus on composition, lighting, and movement.' },
  { step: '03', title: 'Craft', desc: 'Editing, color grading, sound design, and refining every frame to create an immersive visual experience.' },
  { step: '04', title: 'Deliver', desc: 'Producing premium cinematic content optimized for brands, campaigns, social media, tourism, and commercial storytelling.' }
];

function CreativeProcess() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Parallax scroll for the header section
      gsap.to('.process-header-wrap', {
        y: 50,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full max-w-[1200px] mx-auto px-[5vw] py-24 md:py-32 border-t border-white/20 relative">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24 relative z-10">
        <div className="process-header-wrap">
          <h2 className="text-[12vw] md:text-[4vw] font-black uppercase tracking-tighter text-white leading-[0.9] mb-6 md:mb-8 drop-shadow-lg">
            Creative <br />
            <span className="text-white/40 font-serif italic tracking-widest text-[9vw] md:text-[3vw]">Process.</span>
          </h2>
          <p className="process-intro text-white/60 text-[13px] md:text-[15px] leading-[1.8] font-light">
            Every project begins with understanding the story behind the subject. Whether it's a destination, a brand, or a commercial campaign, Naresh approaches every shoot with careful planning, cinematic composition, and attention to detail. From pre-production to the final color grade, every frame is crafted with intention to create visuals that people don't just watch — they experience.
          </p>
        </div>

        <div className="process-steps-container flex flex-col gap-8 md:gap-10 mt-4 md:mt-0">
          {PROCESS.map((item, i) => (
            <div key={i} className="process-step flex flex-col md:flex-row gap-2 md:gap-12 border-b border-white/10 pb-8 md:pb-10 last:border-0 group">
              <span className="text-white/20 font-mono text-xl md:text-2xl group-hover:text-white/60 transition-colors">— {item.step}</span>
              <div>
                <h3 className="text-xl md:text-3xl font-medium tracking-tight text-white mb-2 md:mb-3 group-hover:translate-x-2 transition-transform duration-500 ease-out">{item.title}</h3>
                <p className="text-white/50 text-[12px] md:text-[14px] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. GEAR
// ==========================================
const GEAR = [
  { label: 'Primary Camera', value: 'Sony FX30 Cinema Camera' },
  { label: 'Drone', value: 'DJI Air 3' },
  { label: 'Lenses', value: 'Sony E-Mount Lenses' },
  { label: 'Stabilization', value: 'Handheld / Gimbal Setup' },
  { label: 'Post Production', value: 'Professional Color Grading, Cinematic Video Editing, Sound Design, Motion Graphics' },
];

function Equipment() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Background gradient parallax
      gsap.to('.gear-bg-gradient', {
        y: '20%',
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full relative overflow-hidden">
      <div className="gear-bg-gradient absolute inset-0 w-full h-[150%] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none -z-10" />
      
      <div className="w-full max-w-[1200px] mx-auto px-[5vw] py-24 md:py-32 pb-32 md:pb-48 border-t border-white/20">
        <div className="gear-header flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
          <h2 className="text-[10vw] md:text-[4vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 leading-none">
            ARSENAL & GEAR
          </h2>
          <p className="text-white/60 font-mono uppercase tracking-widest text-xs flex items-center gap-4">
            <span className="w-12 h-[1px] bg-gradient-to-r from-white/40 to-transparent hidden md:block" /> Industry Standard Tools
          </p>
        </div>

        {/* REDESIGNED: Sleek, horizontal premium list rows instead of generic boxes */}
        <div className="flex flex-col border-t border-white/10">
          {GEAR.map((item, i) => (
            <div 
              key={i} 
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-white/10 overflow-hidden cursor-default"
            >
              {/* Subtle hover background highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 w-full md:w-1/3 mb-2 md:mb-0">
                <span className="text-white/40 text-[10px] md:text-[11px] uppercase tracking-widest font-mono group-hover:text-white/80 transition-colors duration-500">
                  {item.label}
                </span>
              </div>
              <div className="relative z-10 w-full md:w-2/3">
                <span className="text-white/80 text-[16px] md:text-[22px] tracking-tight font-medium group-hover:text-white group-hover:translate-x-2 inline-block transition-all duration-500">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. FOOTER & CTA
// ==========================================
function FooterCTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Glow expansion scrub
      gsap.fromTo('.footer-glow', 
        { scale: 0.5, opacity: 0.3 },
        { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'bottom bottom', scrub: 1 } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Use mail.google.com link structure to force Gmail in browser
  const emailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=filmedbynaresh@gmail.com&su=Project%20Inquiry%20/%20Collaboration";

  return (
    <section ref={containerRef} className="w-full min-h-[60vh] md:min-h-[70vh] flex flex-col justify-end px-[5vw] pb-12 relative overflow-hidden bg-black border-t border-white/20">
      {/* Background massive ambient glow */}
      <div className="footer-glow absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[150%] md:w-[80%] h-[80%] bg-white/5 blur-[120px] rounded-[100%] pointer-events-none -z-10" />
      
      <div className="w-full max-w-[1600px] mx-auto relative z-10 flex flex-col items-center text-center">
        <h2 className="footer-title text-[15vw] md:text-[10vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-[0.85] mb-12 md:mb-16 drop-shadow-2xl">
          Let's create
        </h2>
        
        <a 
          href={emailLink}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-btn group relative inline-flex items-center gap-4 md:gap-6 px-8 md:px-10 py-4 md:py-5 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-[10px] md:text-[12px] hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          <span>Start a Project</span>
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black flex items-center justify-center text-white transform transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        </a>
      </div>

      <div className="w-full max-w-[1600px] mx-auto mt-24 md:mt-48 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 opacity-70">
        <p className="text-white/40 text-[9px] md:text-[11px] uppercase tracking-widest font-mono text-center md:text-left">
          Collaborations / Commercial Projects
        </p>
        <div className="flex items-center justify-center gap-6 md:gap-12">
          <a href={emailLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-white/60 hover:text-white text-[9px] md:text-[11px] uppercase tracking-widest transition-colors font-medium">
            <Mail className="w-3 h-3 md:w-4 md:h-4 text-white/40 group-hover:text-white transition-colors" />
            <span>Email</span>
          </a>
          <a href="https://www.instagram.com/filmedby.naresh/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-white/60 hover:text-white text-[9px] md:text-[11px] uppercase tracking-widest transition-colors font-medium">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white/40 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MASTER EXPORT
// ==========================================
export default function InfoSections() {
  return (
    <div className="w-full bg-black text-white relative z-10">
      <BrandsMarquee />
      <Services />
      <CreativeProcess />
      <Equipment />
      <FooterCTA />
    </div>
  );
}
