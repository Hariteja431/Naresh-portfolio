"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", // Decreased tightness for faster reveal
          scrub: 1.2,
          pin: true,
          refreshPriority: 0,
        },
      });

      // Initial states
      gsap.set(imageWrapperRef.current, { 
        clipPath: "inset(30% 10% 30% 10%)", // Much tighter initial crop
        scale: 0.85 
      });
      gsap.set(imageRef.current, { scale: 1.3, y: 50 }); // Extreme parallax scale
      gsap.set(textLinesRef.current, { yPercent: 100, rotateX: -45, opacity: 0 });
      gsap.set(subTextRef.current, { opacity: 0, x: -50 });

      // The Wow Factor: Extreme Parallax & Dynamic Masking
      tl.to(imageWrapperRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        ease: "power3.inOut",
        duration: 2,
      }, 0)
      .to(imageRef.current, {
        scale: 1,
        y: 0,
        ease: "power3.inOut",
        duration: 2,
      }, 0);

      // Massive overlapping text reveals like a rolling wave
      tl.to(textLinesRef.current, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "power4.out",
        duration: 1.8,
      }, 0.2);

      tl.to(subTextRef.current, {
        opacity: 1,
        x: 0,
        ease: "power3.out",
        duration: 1.5
      }, 1);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const headline = [
    { text: "EVERY FRAME", outline: false },
    { text: "IS A DIALOGUE", outline: false },
    { text: "OF SHADOW", outline: true },
    { text: "AND LIGHT", outline: false },
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden perspective-[1000px]"
    >
      <div className="relative w-full max-w-[1800px] h-full flex items-center justify-center">
        
        {/* Right Portrait (Dominating the background) */}
        <div className="absolute right-0 md:right-12 lg:right-[5%] w-[100vw] md:w-[65vw] h-[100vh] md:h-[85vh] flex items-center justify-center z-0">
          <div 
            ref={imageWrapperRef} 
            className="relative w-full h-full overflow-hidden shadow-2xl"
          >
            <Image
              ref={imageRef}
              src="/Hero-Portrait.png"
              alt="Naresh Portrait"
              fill
              className="object-cover object-center contrast-[1.15] saturate-[1.2] brightness-90"
              sizes="(max-width: 768px) 100vw, 65vw"
              priority
            />
            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 md:from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Left Typography (Massive, overlapping) */}
        <div className="absolute left-6 md:left-12 lg:left-24 z-20 pointer-events-none flex flex-col justify-center h-full">
          <h2 className="text-[3.5rem] md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter leading-[0.85] uppercase drop-shadow-2xl">
            {headline.map((line, index) => (
              <span key={index} className="block overflow-hidden pb-4 md:pb-6" style={{ perspective: "800px" }}>
                <span 
                  ref={el => { textLinesRef.current[index] = el; }} 
                  className={`block transform-gpu origin-bottom ${line.outline ? 'text-transparent' : 'text-[#d6e5d8]'}`}
                  style={line.outline ? { WebkitTextStroke: "2px #d6e5d8", color: "transparent" } : {}}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h2>
          
          <div ref={subTextRef} className="mt-8 md:mt-12 overflow-hidden">
            <span 
              className="block text-xs md:text-sm font-medium text-[#a3b8a6] tracking-[0.4em] max-w-sm font-[var(--font-geist-mono)] uppercase leading-relaxed drop-shadow-md"
            >
              Independent Indian visual storyteller specializing in cinematography and aerial filmmaking.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
