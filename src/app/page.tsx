import Hero from "@/components/Hero";
import AboutPortrait from "@/components/AboutPortrait";
import AudioPlayer from "@/components/AudioPlayer";
import Monograph from "@/components/Monograph";
import Videography from "@/components/Videography";
import InfoSections from "@/components/InfoSections";

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
