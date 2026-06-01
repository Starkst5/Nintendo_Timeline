import { useState, useEffect, useRef, useCallback } from "react";

const HOLES = 9;
const GAME_DURATION = 30;

type MoleState = "hidden" | "rising" | "up" | "hit" | "falling";

export function WhackAMole() {
  const [moles, setMoles] = useState<MoleState[]>(Array(HOLES).fill("hidden"));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [status, setStatus] = useState<"idle" | "playing" | "done">("idle");
  const [misses, setMisses] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moleTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const moleStateRef = useRef<MoleState[]>(Array(HOLES).fill("hidden"));
  const scoreRef = useRef(0);
  const statusRef = useRef<"idle" | "playing" | "done">("idle");

  const spawnMole = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const available = moleStateRef.current
      .map((s, i) => (s === "hidden" ? i : -1))
      .filter((i) => i >= 0);
    if (available.length === 0) return;

    const idx = available[Math.floor(Math.random() * available.length)];
    moleStateRef.current[idx] = "rising";
    setMoles([...moleStateRef.current]);

    const t1 = setTimeout(() => {
      if (moleStateRef.current[idx] === "rising") {
        moleStateRef.current[idx] = "up";
        setMoles([...moleStateRef.current]);
      }
    }, 250);

    const stayDuration = 700 + Math.random() * 700;
    const t2 = setTimeout(() => {
      if (moleStateRef.current[idx] === "up") {
        moleStateRef.current[idx] = "falling";
        setMoles([...moleStateRef.current]);
        const t3 = setTimeout(() => {
          if (moleStateRef.current[idx] === "falling") {
            moleStateRef.current[idx] = "hidden";
            setMoles([...moleStateRef.current]);
          }
        }, 250);
        moleTimersRef.current.push(t3);
      }
    }, stayDuration);

    moleTimersRef.current.push(t1, t2);

    // Schedule next spawn
    const nextSpawn = 400 + Math.random() * 600;
    const t4 = setTimeout(spawnMole, nextSpawn);
    moleTimersRef.current.push(t4);
  }, []);

  const endGame = useCallback(() => {
    statusRef.current = "done";
    setStatus("done");
    moleTimersRef.current.forEach(clearTimeout);
    moleTimersRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    moleStateRef.current = Array(HOLES).fill("hidden");
    setMoles(Array(HOLES).fill("hidden"));
    setHighScore((h) => Math.max(h, scoreRef.current));
  }, []);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    statusRef.current = "playing";
    moleStateRef.current = Array(HOLES).fill("hidden");
    setScore(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setStatus("playing");
    setMoles(Array(HOLES).fill("hidden"));

    moleTimersRef.current.forEach(clearTimeout);
    moleTimersRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);

    // Spawn initial moles
    spawnMole();
    spawnMole();

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [spawnMole, endGame]);

  const whackMole = (idx: number) => {
    if (statusRef.current !== "playing") return;
    if (moleStateRef.current[idx] === "up" || moleStateRef.current[idx] === "rising") {
      moleStateRef.current[idx] = "hit";
      setMoles([...moleStateRef.current]);
      scoreRef.current += 10;
      setScore(scoreRef.current);
      const t = setTimeout(() => {
        moleStateRef.current[idx] = "hidden";
        setMoles([...moleStateRef.current]);
      }, 300);
      moleTimersRef.current.push(t);
    } else if (moleStateRef.current[idx] === "hidden") {
      setMisses((m) => m + 1);
    }
  };

  useEffect(() => {
    return () => {
      moleTimersRef.current.forEach(clearTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getMoleStyle = (state: MoleState) => {
    const base: React.CSSProperties = {
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 60,
      height: 60,
      borderRadius: "50% 50% 40% 40%",
      transition: "bottom 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 36,
      cursor: "pointer",
      userSelect: "none",
    };

    switch (state) {
      case "hidden":
        return { ...base, bottom: -70, opacity: 0 };
      case "rising":
        return { ...base, bottom: -30, opacity: 1 };
      case "up":
        return { ...base, bottom: 5, opacity: 1 };
      case "hit":
        return { ...base, bottom: 10, opacity: 1, filter: "brightness(3)" };
      case "falling":
        return { ...base, bottom: -60, opacity: 0.5 };
      default:
        return base;
    }
  };

  const timeColor = timeLeft <= 10 ? "#E4000F" : timeLeft <= 20 ? "#FFD700" : "#00FF41";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        fontFamily: "'Press Start 2P', monospace",
        position: "relative",
      }}
    >
      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          gap: 24,
          fontSize: 9,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#FFD700" }}>SCORE: {score}</span>
        <span style={{ color: timeColor }}>TIME: {timeLeft}s</span>
        <span style={{ color: "#888" }}>BEST: {highScore}</span>
      </div>

      {/* Game grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          padding: 20,
          background: "#0a2a0a",
          border: "4px solid #00CC44",
          boxShadow: "0 0 20px rgba(0,200,68,0.3), 4px 4px 0 #000",
        }}
        onClick={(e) => {
          // Click on background = miss
          if ((e.target as HTMLElement).closest("[data-mole]") === null) {
            if (status === "playing") setMisses((m) => m + 1);
          }
        }}
      >
        {Array(HOLES)
          .fill(null)
          .map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 110,
                height: 90,
                background: "#0d1f0d",
                border: "3px solid #1a3a1a",
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => whackMole(idx)}
              data-mole={idx}
            >
              {/* Hole */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 70,
                  height: 30,
                  background: "#000",
                  borderRadius: "50% 50% 0 0",
                }}
              />

              {/* Mole */}
              <div
                style={getMoleStyle(moles[idx])}
                data-mole={idx}
              >
                {moles[idx] === "hit" ? "💥" : "🐹"}
              </div>
            </div>
          ))}
      </div>

      {/* Overlay */}
      {status !== "playing" && (
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
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#0a1a0a",
              border: "4px solid #00CC44",
              boxShadow: "0 0 30px rgba(0,200,68,0.4)",
              padding: 40,
              textAlign: "center",
            }}
          >
            {status === "done" ? (
              <>
                <div style={{ color: "#FFD700", fontSize: 14, marginBottom: 16 }}>
                  TIME UP!
                </div>
                <div style={{ color: "#fff", fontSize: 10, marginBottom: 8 }}>
                  FINAL SCORE: {score}
                </div>
                <div style={{ color: "#888", fontSize: 8, marginBottom: 24 }}>
                  BEST: {highScore}
                </div>
              </>
            ) : (
              <>
                <div style={{ color: "#00FF41", fontSize: 14, marginBottom: 16 }}>
                  WHACK-A-MOLE
                </div>
                <div style={{ color: "#888", fontSize: 8, marginBottom: 24, lineHeight: 2 }}>
                  CLICK THE MOLES
                  <br />
                  BEFORE THEY HIDE!
                </div>
              </>
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
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              {status === "done" ? "PLAY AGAIN" : "START"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
