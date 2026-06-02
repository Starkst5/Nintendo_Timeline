import { HashRouter, Routes, Route } from "react-router";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { TimelinePage } from "./components/TimelinePage";
import { EmulatorPage } from "./components/EmulatorPage";
import { useEffect, useRef } from "react";

function SynthwaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const W = canvas.width;
      const H = canvas.height;

      // Solid dark purple background
      ctx.fillStyle = "#0d0010";
      ctx.fillRect(0, 0, W, H);

      const spacing = 60;

      // Vertical lines
      for (let x = 0; x <= W; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.strokeStyle = "rgba(255, 30, 100, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= H; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = "rgba(255, 30, 100, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

export default function App() {
  return (
    // MARKER-MAKE-KIT-INVOKED
    <HashRouter>
      <div
        style={{
          minHeight: "100vh",
          background: "#0d0010",
          fontFamily: "'VT323', monospace",
          position: "relative",
        }}
      >
        <SynthwaveBackground />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/emulator" element={<EmulatorPage />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
