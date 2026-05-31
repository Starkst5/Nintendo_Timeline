import { useEffect, useRef, useState, useCallback } from "react";

const W = 400;
const H = 500;
const PADDLE_W = 80;
const PADDLE_H = 12;
const BALL_R = 8;
const BRICK_ROWS = 6;
const BRICK_COLS = 8;
const BRICK_H = 20;
const BRICK_GAP = 4;

const ROW_COLORS = [
  "#E4000F", "#FF6B35", "#FFD700", "#00CC66", "#0099FF", "#CC44FF",
];

type Brick = {
  x: number; y: number; w: number; h: number; alive: boolean; color: string;
};

function makeBricks(): Brick[] {
  const bricks: Brick[] = [];
  const totalGapW = BRICK_GAP * (BRICK_COLS + 1);
  const brickW = (W - totalGapW) / BRICK_COLS;
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: BRICK_GAP + c * (brickW + BRICK_GAP),
        y: 60 + r * (BRICK_H + BRICK_GAP),
        w: brickW,
        h: BRICK_H,
        alive: true,
        color: ROW_COLORS[r],
      });
    }
  }
  return bricks;
}

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    paddle: { x: W / 2 - PADDLE_W / 2, vx: 0 },
    ball: { x: W / 2, y: H - 80, vx: 3, vy: -4 },
    bricks: makeBricks(),
    lives: 3,
    score: 0,
    status: "idle" as "idle" | "playing" | "dead" | "win",
    keys: { left: false, right: false },
    mouseX: -1,
  });

  const [display, setDisplay] = useState({ score: 0, lives: 3, status: "idle" as typeof stateRef.current.status });

  const syncDisplay = () => {
    const s = stateRef.current;
    setDisplay({ score: s.score, lives: s.lives, status: s.status });
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, W, H);

    // Bricks
    s.bricks.forEach((b) => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 5);
    });

    // Paddle
    const px = s.paddle.x;
    ctx.fillStyle = "#fff";
    ctx.fillRect(px, H - 30, PADDLE_W, PADDLE_H);
    ctx.fillStyle = "#E4000F";
    ctx.fillRect(px + 4, H - 30 + 3, PADDLE_W - 8, PADDLE_H - 6);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(px + 4, H - 30 + 2, PADDLE_W - 8, 3);

    // Ball
    const { x: bx, y: by } = s.ball;
    const grad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, BALL_R);
    grad.addColorStop(0, "#fff");
    grad.addColorStop(1, "#ccc");
    ctx.beginPath();
    ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Scanlines
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);

    // Lives display
    ctx.fillStyle = "#E4000F";
    ctx.font = "8px 'Press Start 2P'";
    for (let i = 0; i < s.lives; i++) {
      ctx.fillRect(10 + i * 18, 8, 14, 8);
    }

    // Score
    ctx.fillStyle = "#FFD700";
    ctx.font = "8px 'Press Start 2P'";
    ctx.textAlign = "right";
    ctx.fillText(`${s.score}`, W - 10, 18);
    ctx.textAlign = "left";
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "playing") return;

    // Paddle movement
    const speed = 6;
    if (s.mouseX >= 0) {
      s.paddle.x = Math.max(0, Math.min(W - PADDLE_W, s.mouseX - PADDLE_W / 2));
    } else {
      if (s.keys.left) s.paddle.x = Math.max(0, s.paddle.x - speed);
      if (s.keys.right) s.paddle.x = Math.min(W - PADDLE_W, s.paddle.x + speed);
    }

    // Ball movement
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    // Wall bounce
    if (s.ball.x - BALL_R < 0) { s.ball.x = BALL_R; s.ball.vx *= -1; }
    if (s.ball.x + BALL_R > W) { s.ball.x = W - BALL_R; s.ball.vx *= -1; }
    if (s.ball.y - BALL_R < 0) { s.ball.y = BALL_R; s.ball.vy *= -1; }

    // Bottom = lose life
    if (s.ball.y + BALL_R > H) {
      s.lives--;
      if (s.lives <= 0) {
        s.status = "dead";
        syncDisplay();
        return;
      }
      s.ball = { x: W / 2, y: H - 80, vx: 3 * (Math.random() > 0.5 ? 1 : -1), vy: -4 };
      syncDisplay();
    }

    // Paddle collision
    const px = s.paddle.x;
    const py = H - 30;
    if (
      s.ball.y + BALL_R >= py &&
      s.ball.y - BALL_R <= py + PADDLE_H &&
      s.ball.x >= px &&
      s.ball.x <= px + PADDLE_W
    ) {
      s.ball.vy = -Math.abs(s.ball.vy);
      const hitPos = (s.ball.x - (px + PADDLE_W / 2)) / (PADDLE_W / 2);
      s.ball.vx = hitPos * 5;
    }

    // Brick collision
    let allDead = true;
    for (const b of s.bricks) {
      if (!b.alive) continue;
      allDead = false;
      if (
        s.ball.x + BALL_R >= b.x &&
        s.ball.x - BALL_R <= b.x + b.w &&
        s.ball.y + BALL_R >= b.y &&
        s.ball.y - BALL_R <= b.y + b.h
      ) {
        b.alive = false;
        s.score += 10;
        const fromLeft = Math.abs(s.ball.x - b.x);
        const fromRight = Math.abs(s.ball.x - (b.x + b.w));
        if (fromLeft < BALL_R || fromRight < BALL_R) {
          s.ball.vx *= -1;
        } else {
          s.ball.vy *= -1;
        }
        // Speed up slightly
        const spd = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2);
        if (spd < 8) {
          s.ball.vx *= 1.01;
          s.ball.vy *= 1.01;
        }
        syncDisplay();
        break;
      }
    }

    if (allDead) {
      s.status = "win";
      syncDisplay();
      return;
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const startGame = useCallback(() => {
    stateRef.current = {
      paddle: { x: W / 2 - PADDLE_W / 2, vx: 0 },
      ball: { x: W / 2, y: H - 80, vx: 3, vy: -4 },
      bricks: makeBricks(),
      lives: 3,
      score: 0,
      status: "playing",
      keys: { left: false, right: false },
      mouseX: -1,
    };
    setDisplay({ score: 0, lives: 3, status: "playing" });
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    draw();
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "ArrowLeft" || e.key === "a") s.keys.left = e.type === "keydown";
      if (e.key === "ArrowRight" || e.key === "d") s.keys.right = e.type === "keydown";
      if (e.type === "keydown" && ["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = W / rect.width;
    stateRef.current.mouseX = (e.clientX - rect.left) * scaleX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = W / rect.width;
    stateRef.current.mouseX = (e.touches[0].clientX - rect.left) * scaleX;
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <div style={{ display: "flex", gap: 32, fontSize: 9, color: "#FFD700" }}>
        <span>SCORE: {display.score}</span>
        <span style={{ color: "#E4000F" }}>♥ ♥ ♥</span>
      </div>

      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            border: "4px solid #FFD700",
            boxShadow: "0 0 20px rgba(255,215,0,0.3), 4px 4px 0 #000",
            imageRendering: "pixelated",
            display: "block",
            maxWidth: "100%",
            cursor: "none",
          }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={() => { stateRef.current.mouseX = -1; }}
        />

        {display.status !== "playing" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.88)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                color: display.status === "win" ? "#FFD700" : display.status === "dead" ? "#E4000F" : "#fff",
                fontSize: display.status === "idle" ? 14 : 12,
                textAlign: "center",
                lineHeight: 2,
              }}
            >
              {display.status === "idle" && "BREAKOUT"}
              {display.status === "dead" && "GAME OVER"}
              {display.status === "win" && "YOU WIN!"}
            </div>
            {display.status !== "idle" && (
              <div style={{ color: "#FFD700", fontSize: 9 }}>SCORE: {display.score}</div>
            )}
            {display.status === "idle" && (
              <div style={{ color: "#888", fontSize: 7, textAlign: "center", lineHeight: 2 }}>
                MOUSE / ARROW KEYS
                <br />
                TO MOVE PADDLE
              </div>
            )}
            <button
              onClick={startGame}
              style={{
                background: "#E4000F",
                color: "#fff",
                border: "3px solid #fff",
                boxShadow: "3px 3px 0 #000",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              {display.status === "idle" ? "START" : "PLAY AGAIN"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile touch controls */}
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "◄", action: () => { stateRef.current.keys.left = true; setTimeout(() => { stateRef.current.keys.left = false; }, 150); } },
          { label: "►", action: () => { stateRef.current.keys.right = true; setTimeout(() => { stateRef.current.keys.right = false; }, 150); } },
        ].map((btn) => (
          <button
            key={btn.label}
            onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys[btn.label === "◄" ? "left" : "right"] = true; }}
            onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys[btn.label === "◄" ? "left" : "right"] = false; }}
            onMouseDown={() => stateRef.current.keys[btn.label === "◄" ? "left" : "right"] = true}
            onMouseUp={() => stateRef.current.keys[btn.label === "◄" ? "left" : "right"] = false}
            style={{
              background: "#1a1a1a",
              color: "#FFD700",
              border: "2px solid #FFD700",
              width: 64,
              height: 48,
              cursor: "pointer",
              fontSize: 20,
              fontFamily: "monospace",
              userSelect: "none",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
