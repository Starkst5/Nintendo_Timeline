import { useEffect, useRef, useState, useCallback } from "react";

const GRID = 20;
const CELL = 20;
const CANVAS_SIZE = GRID * CELL;
const SPEED = 120;

type Point = { x: number; y: number };
type Dir = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Dir>({ x: 1, y: 0 });
  const nextDirRef = useRef<Dir>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "playing" | "dead">("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid lines
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(CANVAS_SIZE, i * CELL);
      ctx.stroke();
    }

    // Food (red pixel)
    const food = foodRef.current;
    ctx.fillStyle = "#E4000F";
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
    ctx.fillStyle = "#FF6666";
    ctx.fillRect(food.x * CELL + 5, food.y * CELL + 5, 4, 4);

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      if (i === 0) {
        ctx.fillStyle = "#00FF41";
      } else {
        const fade = Math.max(0.4, 1 - i / snake.length);
        ctx.fillStyle = `rgba(0, ${Math.floor(200 * fade)}, ${Math.floor(60 * fade)}, 1)`;
      }
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);

      if (i === 0) {
        // Eyes
        ctx.fillStyle = "#000";
        const dir = dirRef.current;
        const ex = dir.x === 1 ? 14 : dir.x === -1 ? 3 : 7;
        const ey = dir.y === 1 ? 14 : dir.y === -1 ? 3 : 7;
        ctx.fillRect(seg.x * CELL + ex, seg.y * CELL + 4, 3, 3);
        ctx.fillRect(seg.x * CELL + ex, seg.y * CELL + 12, 3, 3);
      }
    });

    // Scanlines overlay
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    for (let y = 0; y < CANVAS_SIZE; y += 4) {
      ctx.fillRect(0, y, CANVAS_SIZE, 2);
    }
  }, []);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus("dead");
      setHighScore((h) => Math.max(h, scoreRef.current));
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus("dead");
      setHighScore((h) => Math.max(h, scoreRef.current));
      return;
    }

    const food = foodRef.current;
    const ate = head.x === food.x && head.y === food.y;

    const newSnake = [head, ...snake];
    if (!ate) newSnake.pop();

    if (ate) {
      foodRef.current = randomFood(newSnake);
      scoreRef.current += 10;
      setScore(scoreRef.current);
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    const startSnake = [{ x: 10, y: 10 }];
    snakeRef.current = startSnake;
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = randomFood(startSnake);
    scoreRef.current = 0;
    setScore(0);
    setStatus("playing");

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, SPEED);
  }, [tick]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const cur = dirRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (cur.y !== 1) nextDirRef.current = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
          if (cur.y !== -1) nextDirRef.current = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
          if (cur.x !== 1) nextDirRef.current = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
          if (cur.x !== -1) nextDirRef.current = { x: 1, y: 0 };
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSwipe = (() => {
    let startX = 0;
    let startY = 0;
    return {
      onTouchStart: (e: React.TouchEvent) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      onTouchEnd: (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        const cur = dirRef.current;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 20 && cur.x !== -1) nextDirRef.current = { x: 1, y: 0 };
          if (dx < -20 && cur.x !== 1) nextDirRef.current = { x: -1, y: 0 };
        } else {
          if (dy > 20 && cur.y !== -1) nextDirRef.current = { x: 0, y: 1 };
          if (dy < -20 && cur.y !== 1) nextDirRef.current = { x: 0, y: -1 };
        }
      },
    };
  })();

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
      {/* Score bar */}
      <div
        style={{
          display: "flex",
          gap: 32,
          color: "#00FF41",
          fontSize: 10,
          letterSpacing: 1,
        }}
      >
        <span>SCORE: {score}</span>
        <span>BEST: {highScore}</span>
      </div>

      {/* Canvas */}
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            border: "4px solid #00FF41",
            boxShadow: "0 0 20px rgba(0,255,65,0.4), 4px 4px 0 #000",
            imageRendering: "pixelated",
            display: "block",
            maxWidth: "100%",
          }}
          {...handleSwipe}
        />

        {/* Overlay for idle/dead states */}
        {status !== "playing" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {status === "dead" && (
              <div style={{ color: "#E4000F", fontSize: 14, textAlign: "center" }}>
                GAME OVER
              </div>
            )}
            {status === "idle" && (
              <div style={{ color: "#00FF41", fontSize: 10, textAlign: "center", lineHeight: 2 }}>
                SNAKE
                <br />
                <span style={{ fontSize: 8, color: "#888" }}>
                  USE ARROW KEYS
                </span>
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
              {status === "dead" ? "RETRY" : "START"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 48px)", gap: 4 }}>
        {[
          { label: "↑", col: 2, row: 1, dir: { x: 0, y: -1 }, opp: { y: 1 } },
          { label: "←", col: 1, row: 2, dir: { x: -1, y: 0 }, opp: { x: 1 } },
          { label: "↓", col: 2, row: 2, dir: { x: 0, y: 1 }, opp: { y: -1 } },
          { label: "→", col: 3, row: 2, dir: { x: 1, y: 0 }, opp: { x: -1 } },
        ].map((btn) => (
          <button
            key={btn.label}
            onTouchStart={(e) => {
              e.preventDefault();
              const cur = dirRef.current;
              const blocked = Object.entries(btn.opp).some(
                ([k, v]) => (cur as Record<string, number>)[k] === v
              );
              if (!blocked) nextDirRef.current = btn.dir;
            }}
            style={{
              gridColumn: btn.col,
              gridRow: btn.row,
              background: "#1a1a1a",
              color: "#00FF41",
              border: "2px solid #00FF41",
              width: 48,
              height: 48,
              cursor: "pointer",
              fontSize: 18,
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
