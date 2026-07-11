import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-black">
      <Hero />
      
      {/* Spacer section to demonstrate what comes next */}
      <section className="w-full h-screen flex items-center justify-center bg-black text-white">
        <h2 className="text-4xl font-light text-neutral-500">The journey begins...</h2>
      </section>
      
      <section className="w-full h-screen bg-neutral-900"></section>
    </main>
  );
}
