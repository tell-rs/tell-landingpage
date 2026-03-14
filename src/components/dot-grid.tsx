import { useRef, useEffect, useCallback } from "react";

// Stable hash per cell
function cellHash(i: number, j: number) {
  let h = (i * 7919 + j * 104729) | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  return ((h >> 16) ^ h) >>> 0;
}

const GLYPHS = ["\u2727", "\u25C6", "\u2726", "+", "\u00D7"]; // ✧ ◆ ✦ + ×

export function DotGrid({ focusPoints }: { focusPoints: [number, number][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stableFocusPoints = useRef(focusPoints);

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const spacing = 18;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const maxDist = Math.sqrt(w * w + h * h) * 0.55;
    const t = time * 0.0006;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;

        let maxInfluence = 0;
        for (const [fx, fy] of stableFocusPoints.current) {
          const dx = x - fx * w;
          const dy = y - fy * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / maxDist);
          if (influence > maxInfluence) maxInfluence = influence;
        }
        if (maxInfluence < 0.03) continue;

        const wave = Math.sin(t + (i + j) * 0.12) * 0.5 + 0.5;
        const alpha = maxInfluence * (0.15 + wave * 0.5);
        if (alpha < 0.03) continue;

        const hash = cellHash(i, j);
        const isGlyph = (hash % 100) < 8; // ~8% are glyphs

        if (isGlyph) {
          const glyph = GLYPHS[hash % GLYPHS.length];
          const fontSize = Math.round(7 + 4 * maxInfluence * wave);
          ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(100,90,230,${alpha})`;
          ctx.fillText(glyph, x, y);
        } else {
          const radius = 2.2 * maxInfluence * (0.15 + wave * 0.85);
          if (radius > 0.3) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100,90,230,${alpha})`;
            ctx.fill();
          }
        }
      }
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement!;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const loop = (time: number) => {
      draw(canvas, ctx, time);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
