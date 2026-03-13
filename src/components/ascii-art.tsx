import { useEffect, useRef, useState, useCallback } from "react";

const CHARSETS: Record<string, string> = {
  standard: " .,:;i1tfLCG08@",
  blocks: " ░▒▓█",
  binary: " 01",
  dots: " ·•●",
  minimal: " .:░▒",
  braille: " ⠁⠃⠇⠏⠟⠿⡿⣿",
  circles: " ○◔◑◕●",
  squares: " ▢▣▤▥▦▧▨▩",
  hash: " -=#",
};

interface AsciiArtProps {
  src: string;
  resolution?: number;
  charset?: keyof typeof CHARSETS | string;
  color?: string;
  inverted?: boolean;
  animated?: boolean;
  animationSpeed?: number;
  className?: string;
}

export function AsciiArt({
  src,
  resolution = 80,
  charset = "blocks",
  color = "#645AE6",
  inverted = false,
  animated = true,
  animationSpeed = 20,
  className = "",
}: AsciiArtProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [visibleLines, setVisibleLines] = useState(0);
  const [fontSize, setFontSize] = useState(4);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const computeFontSize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    setFontSize(w / (resolution * 0.602));
  }, [resolution]);

  useEffect(() => {
    computeFontSize();
    window.addEventListener("resize", computeFontSize);
    return () => window.removeEventListener("resize", computeFontSize);
  }, [computeFontSize]);

  useEffect(() => {
    const chars = CHARSETS[charset] || charset;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const charAspect = 0.6;
      const cols = resolution;
      const imgAspect = img.width / img.height;
      const rows = Math.round((cols / imgAspect) * charAspect);

      canvas.width = cols;
      canvas.height = rows;
      ctx.drawImage(img, 0, 0, cols, rows);

      const imageData = ctx.getImageData(0, 0, cols, rows);
      const pixels = imageData.data;
      const result: string[] = [];

      for (let row = 0; row < rows; row++) {
        let line = "";
        for (let col = 0; col < cols; col++) {
          const idx = (row * cols + col) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];

          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const value = inverted ? 1 - brightness : brightness;
          const charIdx = Math.round(value * (chars.length - 1));
          line += chars[Math.min(charIdx, chars.length - 1)];
        }
        result.push(line);
      }

      setLines(result);
      if (!animated) {
        setVisibleLines(result.length);
      }
    };

    img.src = src;
  }, [src, resolution, charset, inverted, animated]);

  useEffect(() => {
    if (!animated || lines.length === 0) return;
    setVisibleLines(0);

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setVisibleLines(frame);
      if (frame >= lines.length) clearInterval(interval);
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [lines, animated, animationSpeed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="hidden" />
      <pre
        style={{
          color,
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          letterSpacing: "0px",
          fontFamily: "var(--font-mono)",
          fontWeight: 400,
          margin: 0,
          padding: 0,
          overflow: "hidden",
          whiteSpace: "pre",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {lines.slice(0, visibleLines).map((line, i) => (
          <span
            key={i}
            style={{
              opacity: animated
                ? Math.min(1, (visibleLines - i) / 5)
                : 1,
              display: "block",
              height: `${fontSize}px`,
            }}
          >
            {line}
          </span>
        ))}
      </pre>
    </div>
  );
}
