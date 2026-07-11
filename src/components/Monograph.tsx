'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  '4.jpg', '2.jpg', '3.jpg', 
  '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', 
  '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', 'Screenshot_20260710_214902_Instagram.jpg', 
  'Screenshot_20260710_214924_Instagram.jpg', 'Screenshot_20260710_215029_Instagram.jpg', 'Screenshot_20260710_215202_Instagram.jpg',
  'Screenshot_20260710_215210_Instagram.jpg', 'Screenshot_20260710_215219_Instagram.jpg', 'Screenshot_20260710_215235_Instagram.jpg', 
  'Screenshot_20260710_215242_Instagram.jpg', 'Screenshot_20260710_215254_Instagram.jpg', 'Screenshot_20260710_215320_Instagram.jpg',
  'Screenshot_20260710_215329_Instagram.jpg', 'Screenshot_20260710_215336_Instagram.jpg', 'Screenshot_20260710_215343_Instagram.jpg', 
  'Screenshot_20260710_215401_Instagram.jpg', 'Screenshot_20260710_215846_Instagram.jpg', 'Screenshot_20260710_215916_Instagram.jpg',
  'Screenshot_20260710_215942_Instagram.jpg', 'Screenshot_20260710_222949_Instagram.jpg', '1.jpg'
];

export default function Monograph() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top top',
          end: '+=300%', 
          pin: true,
          scrub: 1,
        }
      });

      // ==========================================
      // TEXT OVERLAY (GLOSSY, HOVERING EFFECT)
      // Gentle ambient motion to keep the glass text feeling "alive" and floating in front
      // ==========================================
      masterTl.fromTo('.s-text-overlay',
        { scale: 0.95, y: -30 },
        { scale: 1.05, y: 30, ease: 'none', duration: 12 }, 
        0
      );

      // ==========================================
      // SCENE 1: Triptych
      // ==========================================
      masterTl.addLabel('scene1', 0);
      masterTl.fromTo('.scene-1 .img-wrapper', 
        { scale: 1.15, opacity: 0, y: 100 },
        { scale: 1, opacity: 1, y: 0, stagger: 0.1, ease: 'power3.out', duration: 2 },
        'scene1'
      );
      masterTl.to({}, { duration: 0.5 });
      masterTl.addLabel('scene1-out');
      masterTl.to('.scene-1 .img-wrapper', { scale: 0.9, opacity: 0, y: -100, stagger: 0.1, ease: 'power3.in', duration: 1.5 }, 'scene1-out');

      // ==========================================
      // SCENE 2: Flex Column Masonry
      // ==========================================
      masterTl.addLabel('scene2', 'scene1-out+=0.5'); 
      masterTl.set('.scene-2', { zIndex: 20 }, 'scene2');
      masterTl.fromTo('.scene-2 .img-wrapper',
        { clipPath: 'inset(100% 0 0 0)', filter: 'brightness(0)' },
        { clipPath: 'inset(0% 0 0 0)', filter: 'brightness(1)', stagger: 0.1, ease: 'power3.inOut', duration: 2 },
        'scene2'
      );
      masterTl.to({}, { duration: 0.5 });
      masterTl.addLabel('scene2-out');
      masterTl.to('.scene-2 .img-wrapper', { clipPath: 'inset(0 0 100% 0)', filter: 'brightness(0)', stagger: 0.1, ease: 'power3.inOut', duration: 1.5 }, 'scene2-out');

      // ==========================================
      // SCENE 3: Horizontal Filmstrip
      // ==========================================
      masterTl.addLabel('scene3', 'scene2-out+=0.5');
      masterTl.set('.scene-3', { zIndex: 30 }, 'scene3');
      masterTl.fromTo('.s3-strip', { x: '30vw', opacity: 0 }, { x: '-30vw', opacity: 1, ease: 'none', duration: 3 }, 'scene3');
      
      const items3 = gsap.utils.toArray('.scene-3 .img-wrapper');
      items3.forEach((item: any, i) => {
        masterTl.fromTo(item, 
          { y: i % 2 === 0 ? 80 : -80 }, 
          { y: i % 2 === 0 ? -80 : 80, ease: 'none', duration: 3 },
          'scene3'
        );
      });
      masterTl.to({}, { duration: 0.5 });
      masterTl.addLabel('scene3-out');
      masterTl.to('.s3-strip', { opacity: 0, scale: 0.9, duration: 1.5 }, 'scene3-out');

      // ==========================================
      // SCENE 4: Structured Grid
      // ==========================================
      masterTl.addLabel('scene4', 'scene3-out+=0.5');
      masterTl.set('.scene-4', { zIndex: 40 }, 'scene4');
      masterTl.fromTo('.scene-4 .img-wrapper', 
        { scale: 0, rotation: () => (Math.random() - 0.5) * 10, opacity: 0 }, 
        { scale: 1, rotation: 0, opacity: 1, stagger: 0.1, ease: 'back.out(1.5)', duration: 2 },
        'scene4'
      );
      masterTl.to({}, { duration: 0.5 });
      masterTl.addLabel('scene4-out');
      masterTl.to('.scene-4 .img-wrapper', { scale: 0, rotation: () => (Math.random() - 0.5) * 10, opacity: 0, stagger: 0.1, ease: 'back.in(1.5)', duration: 1.5 }, 'scene4-out');

      // ==========================================
      // SCENE 5: Waterfall Columns
      // ==========================================
      masterTl.addLabel('scene5', 'scene4-out+=0.5');
      masterTl.set('.scene-5', { zIndex: 50 }, 'scene5');
      masterTl.fromTo('.scene-5 .img-wrapper', 
        { y: 300, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.1, ease: 'power4.out', duration: 2 },
        'scene5'
      );
      masterTl.to({}, { duration: 0.5 });
      masterTl.addLabel('scene5-out');
      masterTl.to('.scene-5 .img-wrapper', { y: -300, opacity: 0, stagger: 0.1, ease: 'power4.in', duration: 1.5 }, 'scene5-out');

      // ==========================================
      // SCENE 6: Masonry Columns Collage
      // ==========================================
      masterTl.addLabel('scene6', 'scene5-out+=0.5');
      masterTl.set('.scene-6', { zIndex: 60 }, 'scene6');
      masterTl.fromTo('.scene-6 .img-wrapper', 
        { y: () => (Math.random() * 500) + 200, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, ease: 'power4.out', duration: 2 },
        'scene6'
      );
      masterTl.to({}, { duration: 1 });

    }, galleryRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={galleryRef} className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 
        =========================================================================
        THE GLOSSY GLASS TEXT OVERLAY
        Uses background-clip: text with a harsh liquid-glass gradient, combined
        with a bright structural stroke and deep drop shadow to pull it fully "front".
        It is elegant, highly readable, but remains semi-transparent like polished glass.
        =========================================================================
      */}
      <div className="s-text-overlay absolute inset-0 w-full h-full flex flex-col items-center justify-center z-[100] pointer-events-none">
        
        {/* Main "I CREATE;" - Glossy Liquid Glass Treatment */}
        <h2 
          className="text-line-1 text-[11vw] leading-[0.85] font-black uppercase tracking-tighter text-center font-[var(--font-geist-sans)]"
          style={{ 
            // Glossy top fading to transparent bottom
            background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            // Crystal clear edge reflection
            WebkitTextStroke: '1px rgba(255,255,255,0.6)',
            // Deep shadow to pull it into the foreground
            filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.9)) drop-shadow(0px 0px 10px rgba(255,255,255,0.2))'
          }}
        >
          I CREATE;
        </h2>
        
        {/* Subtitle - Elegant, spaced, and brightly frosted */}
        <div className="mt-8 overflow-visible">
          <h3 
            className="text-line-2 text-[2.5vw] font-serif italic tracking-[0.5em] text-center font-light"
            style={{
              color: 'rgba(255,255,255,0.85)',
              textShadow: '0px 4px 15px rgba(0,0,0,0.8)',
              WebkitTextStroke: '0.5px rgba(255,255,255,0.3)'
            }}
          >
            THEREFORE I AM.
          </h3>
        </div>

      </div>

      {/* ALL SCENES ARE ABSOLUTE INSET-0 to stack perfectly in the single pinned container */}

      {/* SCENE 1: THE TRIPTYCH (Images 0-2) */}
      <div className="scene-1 absolute inset-0 w-full h-full flex items-center justify-center z-10 pointer-events-none">
        <div className="w-full max-w-[1200px] flex justify-between items-center px-[5vw] gap-[4vw]">
          <div className="w-[28%]">
            <div className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
              <Image src={`/images/${GALLERY_IMAGES[0]}`} alt="Gallery 1" width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" priority />
            </div>
          </div>
          <div className="w-[40%]">
             <div className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-zinc-900 relative opacity-0">
              <Image src={`/images/${GALLERY_IMAGES[1]}`} alt="Gallery 2" width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" priority />
            </div>
          </div>
          <div className="w-[28%]">
            <div className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
              <Image src={`/images/${GALLERY_IMAGES[2]}`} alt="Gallery 3" width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" priority />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 2: FLEX COLUMN MASONRY (Images 3-8) */}
      <div className="scene-2 absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-[1200px] flex justify-between px-[5vw] gap-[3vw]">
          <div className="flex flex-col gap-[3vh] w-[30%] pt-[2vh]">
            {[3, 4].map(i => (
              <div key={i} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[i]}`} alt={`Gallery ${i}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[4vh] w-[35%]">
             {[5, 6].map(i => (
              <div key={i} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[i]}`} alt={`Gallery ${i}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[5vh] w-[25%] pt-[10vh]">
            {[7, 8].map(i => (
              <div key={i} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[i]}`} alt={`Gallery ${i}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCENE 3: HORIZONTAL FILMSTRIP (Images 9-14) */}
      <div className="scene-3 absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="s3-strip flex gap-[3vw] items-center opacity-0">
          {[9, 10, 11, 12, 13, 14].map((imgIndex) => (
            <div key={imgIndex} className="w-[25vw] shrink-0">
              <div className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative">
                <Image src={`/images/${GALLERY_IMAGES[imgIndex]}`} alt={`Gallery ${imgIndex}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCENE 4: STRUCTURED GRID (Images 15-20) */}
      <div className="scene-4 absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-[1200px] px-[5vw] grid grid-cols-4 gap-[2vw] items-center">
          
          <div className="col-span-1 flex flex-col gap-[2vw]">
            {[15, 16].map((imgIndex) => (
              <div key={imgIndex} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[imgIndex]}`} alt={`Orbit ${imgIndex}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="col-span-2">
            <div className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-zinc-900 relative opacity-0">
              <Image src={`/images/${GALLERY_IMAGES[17]}`} alt="Gallery Hero" width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-[2vw]">
            {[18, 19, 20].map((imgIndex) => (
              <div key={imgIndex} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[imgIndex]}`} alt={`Orbit ${imgIndex}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* SCENE 5: WATERFALL COLUMNS (Images 21-26) */}
      <div className="scene-5 absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-[1100px] px-[5vw] grid grid-cols-3 gap-[3vw] items-start">
          
          <div className="pt-[5vh] flex flex-col gap-[3vw]">
            {[21, 22].map((imgIndex) => (
              <div key={imgIndex} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[imgIndex]}`} alt={`Waterfall ${imgIndex}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="pt-[0vh] flex flex-col gap-[3vw]">
            {[23, 24].map((imgIndex) => (
              <div key={imgIndex} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[imgIndex]}`} alt={`Waterfall ${imgIndex}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="pt-[10vh] flex flex-col gap-[3vw]">
            {[25, 26].map((imgIndex) => (
              <div key={imgIndex} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative opacity-0">
                <Image src={`/images/${GALLERY_IMAGES[imgIndex]}`} alt={`Waterfall ${imgIndex}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* SCENE 6: MASONRY COLUMNS COLLAGE (Images 27-32) */}
      <div className="scene-6 absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-[1200px] px-[5vw] columns-3 gap-[3vw] space-y-[3vw]">
          {[27, 28, 29, 30, 31, 32].map((imgIndex) => (
             <div key={imgIndex} className="img-wrapper w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 relative break-inside-avoid opacity-0">
               <Image src={`/images/${GALLERY_IMAGES[imgIndex]}`} alt={`Collage ${imgIndex}`} width={0} height={0} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
             </div>
          ))}
        </div>
      </div>

    </section>
  );
}
