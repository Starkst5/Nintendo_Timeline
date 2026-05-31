import { useState } from "react";
import { SnakeGame } from "./games/SnakeGame";
import { BreakoutGame } from "./games/BreakoutGame";
import { WhackAMole } from "./games/WhackAMole";

type GameId = "snake" | "breakout" | "whack" | null;

const GAMES = [
  {
    id: "snake" as GameId,
    title: "SNAKE",
    subtitle: "Game Boy Style",
    desc: "Guide the snake to eat the red pixels. Don't hit the walls or yourself. Classic NES-era fun.",
    icon: "🐍",
    color: "#00FF41",
    glow: "rgba(0,255,65,0.3)",
    controls: "Arrow Keys / WASD / Swipe",
    year: "1976",
    difficulty: "★★☆",
  },
  {
    id: "breakout" as GameId,
    title: "BREAKOUT",
    subtitle: "Arcade Classic",
    desc: "Destroy all the bricks with your ball and paddle. Don't let the ball fall. Inspired by the 1976 Atari classic.",
    icon: "🧱",
    color: "#FFD700",
    glow: "rgba(255,215,0,0.3)",
    controls: "Mouse / Arrow Keys / Touch",
    year: "1976",
    difficulty: "★★★",
  },
  {
    id: "whack" as GameId,
    title: "WHACK-A-MOLE",
    subtitle: "Arcade Favorite",
    desc: "Moles are popping up! Click them before they disappear. How many can you whack in 30 seconds?",
    icon: "🐹",
    color: "#E4000F",
    glow: "rgba(228,0,15,0.3)",
    controls: "Mouse Click / Touch",
    year: "1976",
    difficulty: "★☆☆",
  },
];

export function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameId>(null);

  return (
    <div style={{ background: "#0a0a1a", minHeight: "100vh", color: "#f0f0f0" }}>
      <style>{`
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes pulse-border { 0%,100% { box-shadow: 4px 4px 0 #000, 0 0 10px rgba(228,0,15,0.3) } 50% { box-shadow: 4px 4px 0 #000, 0 0 30px rgba(228,0,15,0.6) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: "#0f0f22",
          borderBottom: "4px solid #FFD700",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(14px, 3vw, 28px)",
            color: "#FFD700",
            marginBottom: 12,
            textShadow: "2px 2px 0 #000",
          }}
        >
          ARCADE MODE
        </div>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 22,
            color: "#888",
          }}
        >
          Browser-based retro games — no download required
        </div>
        <div
          style={{
            marginTop: 16,
            display: "inline-flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00FF41",
              boxShadow: "0 0 6px #00FF41",
              animation: "blink 1s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: "#00FF41",
            }}
          >
            PLAYER 1 — INSERT COIN
          </span>
        </div>
      </div>

      {/* If game is active */}
      {activeGame ? (
        <div style={{ padding: "24px 20px", maxWidth: 1000, margin: "0 auto" }}>
          {/* Back button + title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <button
              onClick={() => setActiveGame(null)}
              style={{
                background: "#0f0f22",
                color: "#fff",
                border: "3px solid #E4000F",
                boxShadow: "3px 3px 0 #000",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              ◄ BACK
            </button>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(8px, 1.5vw, 12px)",
                color: "#FFD700",
              }}
            >
              {GAMES.find((g) => g.id === activeGame)?.title}
            </div>
          </div>

          {/* Game container */}
          <div
            style={{
              background: "#050510",
              border: "4px solid #333",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "8px 8px 0 #000",
            }}
          >
            {/* CRT bezel */}
            <div
              style={{
                background: "#111",
                border: "6px solid #222",
                borderRadius: 8,
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
                padding: 16,
                position: "relative",
              }}
            >
              {activeGame === "snake" && <SnakeGame />}
              {activeGame === "breakout" && <BreakoutGame />}
              {activeGame === "whack" && <WhackAMole />}

              {/* CRT corner decorations */}
              {([
                { top: 0, left: 0 },
                { top: 0, right: 0 },
                { bottom: 0, left: 0 },
                { bottom: 0, right: 0 },
              ] as React.CSSProperties[]).map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    ...pos,
                    width: 12,
                    height: 12,
                    background: "#333",
                  }}
                />
              ))}
            </div>

            {/* Controls reference */}
            <div
              style={{
                marginTop: 20,
                padding: "12px 24px",
                background: "#0a0a0a",
                border: "2px solid #333",
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: "#555",
                  marginBottom: 4,
                }}
              >
                CONTROLS:
              </div>
              {activeGame === "snake" && (
                <Controls items={["↑↓←→ or WASD", "Swipe on mobile"]} />
              )}
              {activeGame === "breakout" && (
                <Controls items={["← → Arrow Keys", "Mouse to move paddle", "Touch on mobile"]} />
              )}
              {activeGame === "whack" && (
                <Controls items={["Click / Tap the moles", "Don't miss!"]} />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Game selection grid */
        <div style={{ padding: "48px 20px", maxWidth: 1000, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {GAMES.map((game, i) => (
              <div
                key={game.id}
                style={{
                  background: "#0f0f22",
                  border: `3px solid ${game.color}`,
                  boxShadow: `4px 4px 0 #000, 0 0 20px ${game.glow}`,
                  padding: 28,
                  cursor: "pointer",
                  transition: "transform 0.1s, box-shadow 0.1s",
                  animation: `fadeUp 0.5s ${i * 0.15}s both`,
                }}
                onClick={() => setActiveGame(game.id)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `4px 10px 0 #000, 0 0 40px ${game.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 #000, 0 0 20px ${game.glow}`;
                }}
              >
                {/* Game icon + animated preview */}
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    background: "#050510",
                    border: `2px solid ${game.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 64,
                    marginBottom: 20,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      animation: "float 2s ease-in-out infinite alternate",
                    }}
                  >
                    {game.icon}
                  </div>
                  {/* Scanlines */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 12,
                    color: game.color,
                    marginBottom: 6,
                    textShadow: `1px 1px 0 #000`,
                  }}
                >
                  {game.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: "#555",
                    marginBottom: 12,
                  }}
                >
                  {game.subtitle}
                </div>

                {/* Description */}
                <div
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 18,
                    color: "#aaa",
                    lineHeight: 1.4,
                    marginBottom: 16,
                  }}
                >
                  {game.desc}
                </div>

                {/* Difficulty + controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#555" }}>
                    DIFFICULTY:{" "}
                    <span style={{ color: game.color }}>{game.difficulty}</span>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: "#555",
                    marginBottom: 20,
                  }}
                >
                  🎮 {game.controls}
                </div>

                {/* Play button */}
                <button
                  style={{
                    width: "100%",
                    background: game.color,
                    color: "#000",
                    border: "3px solid #fff",
                    boxShadow: "3px 3px 0 #000",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 10,
                    padding: "12px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => { e.stopPropagation(); setActiveGame(game.id); }}
                >
                  ▶ PLAY NOW
                </button>
              </div>
            ))}
          </div>

          {/* High scores section */}
          <div
            style={{
              marginTop: 60,
              background: "#0f0f22",
              border: "3px solid #333",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: "#FFD700",
                marginBottom: 20,
              }}
            >
              🏆 HALL OF FAME
            </div>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: "#666",
                lineHeight: 1.8,
              }}
            >
              Play the games above to set your high scores!
              <br />
              Scores are tracked locally in your session.
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float { from { transform: translateY(0); } to { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}

function Controls({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#1a1a1a",
            border: "2px solid #333",
            padding: "6px 12px",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: "#888",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
