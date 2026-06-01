import { useState, useEffect } from "react";
import { Link } from "react-router";

const MILESTONES = [
  { year: "1889", event: "Nintendo founded as a playing card company" },
  { year: "1977", event: "First gaming hardware: Color TV-Game" },
  { year: "1981", event: "Donkey Kong becomes an arcade phenomenon" },
  { year: "1985", event: "Super Mario Bros. launches on NES" },
  { year: "1989", event: "Game Boy sells 1 million units in weeks" },
  { year: "1996", event: "Super Mario 64 redefines 3D gaming" },
  { year: "2006", event: "Wii changes gaming forever with motion control" },
  { year: "2017", event: "Switch sells 1M units in 3 days" },
];

export function HomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const cards = [
    {
      to: "/timeline",
      title: "HISTORY",
      subtitle: "1977 — 2025",
      desc: "Explore every Nintendo console ever made. From the Color TV-Game to the Switch 2.",
      icon: "📅",
      color: "#FFD700",
      glow: "rgba(255,215,0,0.3)",
    },
    {
      to: "/games",
      title: "ARCADE",
      subtitle: "PLAY NOW",
      desc: "Classic retro mini-games playable right in your browser. Snake, Breakout, Whack-a-Mole.",
      icon: "🕹️",
      color: "#00FF41",
      glow: "rgba(0,255,65,0.3)",
    },
    {
      to: "/emulator",
      title: "EMULATOR",
      subtitle: "UPLOAD & PLAY",
      desc: "Upload your own ROM files and play them with our built-in browser emulator.",
      icon: "💾",
      color: "#E4000F",
      glow: "rgba(228,0,15,0.3)",
    },
  ];

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100vh",
        color: "#f0f0f0",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes glow { from { text-shadow: 0 0 10px #E4000F, 0 0 20px #E4000F; } to { text-shadow: 0 0 20px #E4000F, 0 0 40px #E4000F, 0 0 60px #ff4444; } }
        @keyframes float { from { transform: translateY(0px); } to { transform: translateY(-12px); } }
        @keyframes scroll-in { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
      `}</style>

      {/* HERO */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        {/* Main logo */}
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(28px, 6vw, 72px)",
            color: "#E4000F",
            animation: "glow 2s ease-in-out infinite alternate",
            letterSpacing: "0.1em",
            marginBottom: 8,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          NINEM
        </div>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(8px, 2vw, 14px)",
            color: "#fff",
            letterSpacing: "0.3em",
            marginBottom: 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.3s",
          }}
        >
          NINTENDO LEGACY ARCHIVE
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            marginTop: 48,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: "#555",
            animation: "float 1.5s ease-in-out infinite alternate",
          }}
        >
          ▼ SCROLL ▼
        </div>
      </div>

      {/* Stats section */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "#E4000F",
          padding: "40px 20px",
          borderTop: "4px solid #fff",
          borderBottom: "4px solid #fff",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 24,
            textAlign: "center",
          }}
        >
          {[
            { value: "17", label: "CONSOLES" },
            { value: "136+", label: "YEARS" },
            { value: "5B+", label: "GAMES SOLD" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "clamp(24px, 4vw, 40px)",
                  color: "#fff",
                  textShadow: "3px 3px 0 #000",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 8,
                  letterSpacing: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About section */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px 40px",
        }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(10px, 2vw, 16px)",
            color: "#E4000F",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          THE STORY OF NINTENDO
        </div>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 22,
            color: "#ccc",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Founded in 1889 in Kyoto, Japan by Fusajiro Yamauchi as a playing card company,
          Nintendo evolved into the world's most beloved video game company. Through decades
          of innovation, failure, and triumph, Nintendo has consistently changed what games
          mean to people — not just players, but everyone. From the NES that saved an
          entire industry, to the Wii that brought families together, to the Switch that
          let you take console gaming anywhere.
        </div>
      </div>

      {/* Navigation cards */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 60px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 1.2s",
        }}
      >
        {cards.map((card, i) => (
          <Link
            key={card.to}
            to={card.to}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "rgba(15, 15, 34, 0.85)",
                border: `3px solid ${card.color}`,
                boxShadow: `4px 4px 0 #000, 0 0 20px ${card.glow}`,
                padding: 24,
                cursor: "pointer",
                transition: "transform 0.1s, box-shadow 0.1s",
                textAlign: "left",
                animation: `scroll-in 0.6s ${0.2 * i}s both`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `4px 8px 0 #000, 0 0 40px ${card.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 #000, 0 0 20px ${card.glow}`;
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{card.icon}</div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 12,
                  color: card.color,
                  marginBottom: 4,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: "#666",
                  marginBottom: 12,
                }}
              >
                {card.subtitle}
              </div>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 18,
                  color: "#aaa",
                  lineHeight: 1.4,
                }}
              >
                {card.desc}
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: card.color,
                }}
              >
                ENTER ▶
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Timeline ticker */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          background: "rgba(5, 5, 16, 0.85)",
          border: "3px solid #E4000F",
          padding: "12px 0",
          marginBottom: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            animation: "ticker 25s linear infinite",
            whiteSpace: "nowrap",
          }}
        >
          {[...MILESTONES, ...MILESTONES].map((m, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: "#FFD700",
              }}
            >
              {m.year}: {m.event}{"  ★  "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}