import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";
import AudioPlayer from "@/components/AudioPlayer";

// Dynamically import downstream components to dramatically reduce initial load time and JS bundle size
const AboutPortrait = dynamic(() => import('@/components/AboutPortrait'));
const Monograph = dynamic(() => import('@/components/Monograph'));
const Videography = dynamic(() => import('@/components/Videography'));
const InfoSections = dynamic(() => import('@/components/InfoSections'));

export default function Home() {
  return (
    <main className="w-full bg-black">
      <AudioPlayer />
      <Hero />
      <AboutPortrait />

      {/* Cinematic Monograph sequence replacing ZoomParallax & Gallery3D */}
      <Monograph />

      {/* Scroll-Driven Video Portfolio */}
      <Videography />

      {/* Bottom Half: Brands, Services, Process, Gear, Footer */}
      <InfoSections />
    </main>
  );
}
