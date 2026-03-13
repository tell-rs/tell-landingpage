import { createFileRoute } from "@tanstack/react-router";
import { AsciiArt } from "../components/ascii-art";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="min-h-screen pt-[140px] pb-32 px-6">
      <div className="max-w-[1340px] mx-auto md:px-8">
        <h1 className="text-[48px] leading-[1] tracking-[-0.022em] text-white mb-16" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
          Team
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="group">
            <div className="aspect-square rounded-xl border border-zinc-800/60 bg-[#f0ecff] overflow-hidden">
              <AsciiArt
                src="https://avatars.githubusercontent.com/u/12730967?s=600&u=658556fc794c77258d190fd33ed046582d525bc1&v=1"
                resolution={180}
                charset=" ·░▒▓█"
                color="#645AE6"
                inverted
                animated
                animationSpeed={12}
                className="w-full h-full"
              />
            </div>
            <div className="mt-4">
              <p className="text-white text-[15px] font-medium">Your Name</p>
              <p className="text-zinc-500 text-[13px]">Founder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
