import { useState, useEffect } from "react";

type Console = {
  id: string;
  name: string;
  year: number;
  era: string;
  eraColor: string;
  sold: string;
  description: string;
  facts: string[];
  accentColor: string;
};

// Helper: should text on this color be dark?
const needsDarkText = (color: string) =>
  ["#DDDDDD", "#CCCCCC", "#AAAAAA", "#999999", "#888888", "#888", "#9BBC0F", "#FFD700", "#FFFFFF", "#ffffff"].includes(color);

const CONSOLES: Console[] = [
  {
    id: "color-tv",
    name: "Color TV-Game",
    year: 1977,
    era: "Color TV-Game",
    eraColor: "#D2691E",
    sold: "~3 million",
    description: "Nintendo's very first gaming hardware — a series of dedicated home consoles with built-in games. Six variants were produced, including Light Tennis and Block Breaker. Sold exclusively in Japan, it showed Nintendo's potential in gaming hardware.",
    facts: ["Japan-exclusive release", "Built-in games, no cartridges", "Designed by Masayuki Uemura", "Six different variants made"],
    accentColor: "#D2691E",
  },
  {
    id: "game-watch",
    name: "Game & Watch",
    year: 1980,
    era: "Game & Watch",
    eraColor: "#888888",
    sold: "43.4 million",
    description: "Revolutionary handheld electronic games designed by the legendary Gunpei Yokoi. This series introduced the iconic D-pad controller that became the industry standard. 59 unique titles shipped across multiple form factors, including the original clamshell design.",
    facts: ["Invented the D-pad controller", "Designed by Gunpei Yokoi", "59 unique game titles", "Inspired the Game Boy design"],
    accentColor: "#888888",
  },
  {
    id: "nes",
    name: "Nintendo Entertainment System",
    year: 1983,
    era: "NES",
    eraColor: "#E4000F",
    sold: "61.91 million",
    description: "The console that saved the video game industry after the crash of 1983. Launching as the Famicom in Japan, the NES introduced iconic franchises like Super Mario Bros., The Legend of Zelda, and Metroid. Its strict licensing system ensured quality control across all games.",
    facts: ["Revived the video game industry", "Home to Super Mario Bros.", "Strict third-party licensing system", "Known as Famicom in Japan"],
    accentColor: "#E4000F",
  },
  {
    id: "gameboy",
    name: "Game Boy",
    year: 1989,
    era: "Game Boy",
    eraColor: "#9BBC0F",
    sold: "118.69 million",
    description: "The iconic grey brick that revolutionized portable gaming. Designed by Gunpei Yokoi with a philosophy of durability over raw power, the Game Boy prioritized long battery life. Bundled with Tetris, it became a worldwide phenomenon. It even survived a Gulf War bombing.",
    facts: ["118.69 million units sold", "Tetris bundled as killer app", "Prioritized battery life over graphics", "Survived a Gulf War bombing"],
    accentColor: "#9BBC0F",
  },
  {
    id: "snes",
    name: "Super Nintendo",
    year: 1990,
    era: "Super Nintendo",
    eraColor: "#7B68EE",
    sold: "49.10 million",
    description: "The 16-bit powerhouse that won the console wars. With revolutionary Mode 7 graphics that enabled pseudo-3D effects, stereo sound, and a library packed with masterpieces, the SNES set the gold standard for console gaming. Chrono Trigger, A Link to the Past, Super Metroid — legends all.",
    facts: ["Pioneered Mode 7 graphics technology", "49.10 million units sold", "Won the 16-bit console wars vs Sega", "Featured stereo sound output"],
    accentColor: "#7B68EE",
  },
  {
    id: "virtualboy",
    name: "Virtual Boy",
    year: 1995,
    era: "Virtual Boy",
    eraColor: "#8B0000",
    sold: "770,000",
    description: "Nintendo's most ambitious failure. The world's first portable stereoscopic 3D console used red LED displays and parallax scrolling for depth. Despite being ahead of its time conceptually, the bulky head-mounted design and limited monochrome red library led to rapid discontinuation.",
    facts: ["First attempt at portable 3D", "Only 770,000 units sold", "Red monochrome LED display", "Discontinued after 6 months in US"],
    accentColor: "#CC2222",
  },
  {
    id: "n64",
    name: "Nintendo 64",
    year: 1996,
    era: "Nintendo 64",
    eraColor: "#228B22",
    sold: "32.93 million",
    description: "The first console to bring true 3D gaming to the masses. Super Mario 64 single-handedly defined 3D game design. GoldenEye 007 invented the modern console FPS. The distinctive three-pronged controller with its analog stick changed how we interact with games forever.",
    facts: ["Super Mario 64 defined 3D gaming", "First console with built-in analog stick", "Cartridges vs competitors' CDs", "GoldenEye 007 defined console FPS"],
    accentColor: "#228B22",
  },
  {
    id: "gbc",
    name: "Game Boy Color",
    year: 1998,
    era: "Game Boy Color",
    eraColor: "#008080",
    sold: "~78 million",
    description: "The Game Boy's colorful upgrade brought a vibrant display to Nintendo's beloved handheld line. Fully backward compatible with original Game Boy titles while supporting exclusive full-color games, it kept Nintendo dominant in the handheld market. Pokémon Gold & Silver were system sellers.",
    facts: ["Full backward compatibility with GB", "Pokémon Gold & Silver exclusives", "56 simultaneous colors from 32,768", "Kept same general form factor"],
    accentColor: "#008080",
  },
  {
    id: "gba",
    name: "Game Boy Advance",
    year: 2001,
    era: "Game Boy Advance",
    eraColor: "#8A2BE2",
    sold: "81.51 million",
    description: "A quantum leap in handheld power. The GBA packed SNES-level graphics into a pocket-sized device, enabling amazing ports and original titles. The later Game Boy Advance SP added a clamshell design and frontlit screen, while the Micro was ultra-compact. 81.51 million units across all variants.",
    facts: ["SNES-equivalent processing power", "Three form factors: GBA, SP, Micro", "81.51 million total units sold", "No backlight on original model"],
    accentColor: "#8A2BE2",
  },
  {
    id: "gamecube",
    name: "Nintendo GameCube",
    year: 2001,
    era: "GameCube",
    eraColor: "#6A0DAD",
    sold: "21.74 million",
    description: "Nintendo's compact, quirky purple cube took on Sony and Microsoft with unique mini-DVD discs and an unconventional controller beloved by competitive players. Despite lower sales, it hosted timeless classics: Super Smash Bros. Melee, Metroid Prime, Wind Waker, and Resident Evil 4.",
    facts: ["Used proprietary mini-DVD discs", "Handle on the back for portability", "Melee still played competitively today", "Lost commercially but won critically"],
    accentColor: "#9B59B6",
  },
  {
    id: "nds",
    name: "Nintendo DS",
    year: 2004,
    era: "Nintendo DS",
    eraColor: "#888888",
    sold: "154.02 million",
    description: "The best-selling Nintendo console of all time. Dual screens — with the bottom being a touchscreen — opened entirely new gameplay possibilities. Brain Age attracted non-traditional gamers. New Super Mario Bros., Mario Kart DS, Pokémon Diamond/Pearl, and Animal Crossing made it essential.",
    facts: ["Best-selling Nintendo platform ever", "154.02 million units sold", "Dual screens with bottom touchscreen", "Brain Age attracted non-gamers"],
    accentColor: "#888888",
  },
  {
    id: "wii",
    name: "Wii",
    year: 2006,
    era: "Wii",
    eraColor: "#CCCCCC",
    sold: "101.63 million",
    description: "The motion control revolution that brought gaming to everyone. While competitors chased raw power, Nintendo's white waggle-stick changed who played video games. Grandparents bowled. Parents golfed. Families played together. Wii Sports became the most watched physical activity in many retirement communities.",
    facts: ["101.63 million units sold", "Wii Sports included in every box", "Motion controls attracted non-gamers", "Outsold both PS3 and Xbox 360"],
    accentColor: "#CCCCCC",
  },
  {
    id: "ndsi",
    name: "Nintendo DSi",
    year: 2008,
    era: "Nintendo DSi",
    eraColor: "#999999",
    sold: "Part of DS family",
    description: "An enhanced DS iteration featuring cameras on both sides, a larger screen, and the DSiWare downloadable game shop. It removed the Game Boy Advance slot to slim down the profile. The DSi laid the software infrastructure groundwork for the future 3DS platform and online store.",
    facts: ["Added front and rear cameras", "Introduced DSiWare digital storefront", "Removed Game Boy Advance cartridge slot", "Foundation for 3DS software ecosystem"],
    accentColor: "#999999",
  },
  {
    id: "3ds",
    name: "Nintendo 3DS",
    year: 2011,
    era: "Nintendo 3DS",
    eraColor: "#00CED1",
    sold: "75.94 million",
    description: "Glasses-free 3D gaming in your pocket using autostereoscopic display technology. Beyond the gimmick, the 3DS had an outstanding library: Super Mario 3D Land, Fire Emblem Awakening, Pokémon X/Y, ORAS, Sun/Moon, and Breath of the Wild's prequel Hyrule Warriors. StreetPass made passive multiplayer fun.",
    facts: ["Glasses-free autostereoscopic 3D", "75.94 million units sold", "StreetPass passive multiplayer", "Fire Emblem Awakening saved the franchise"],
    accentColor: "#00CED1",
  },
  {
    id: "wiiu",
    name: "Wii U",
    year: 2012,
    era: "Wii U",
    eraColor: "#DDDDDD",
    sold: "13.56 million",
    description: "Misunderstood by the public but beloved by its players. The GamePad controller with its own screen was a bold, ahead-of-its-time hybrid concept that directly inspired the Switch. Its library included Super Mario Maker, Splatoon, Mario Kart 8, and Bayonetta 2 — all later ported to Switch.",
    facts: ["Only 13.56 million units sold", "GamePad inspired the Switch concept", "Splatoon made its debut here", "Best Mario Kart 8 version released here"],
    accentColor: "#DDDDDD",
  },
  {
    id: "switch",
    name: "Nintendo Switch",
    year: 2017,
    era: "Nintendo Switch",
    eraColor: "#E4000F",
    sold: "146.04 million",
    description: "The game-changer that proved the hybrid concept works. Play on your TV, then snap out the Joy-Con and take it anywhere. Breath of the Wild launched alongside it and redefined open-world game design. Animal Crossing: New Horizons sold 43.35 million copies alone during the pandemic.",
    facts: ["146.04 million units sold", "Play at home or anywhere", "Breath of the Wild redefined open-world", "Animal Crossing sold 43M during COVID"],
    accentColor: "#E4000F",
  },
  {
    id: "switch2",
    name: "Nintendo Switch 2",
    year: 2025,
    era: "Nintendo Switch 2",
    eraColor: "#222222",
    sold: "Released 2025",
    description: "The next evolution of the hybrid revolution. The Switch 2 delivers significantly more processing power, a larger 8-inch display, and enhanced Joy-Con controllers with a new magnetic attachment mechanism and a mouse mode. Mario Kart World, a massive open-world racing game, served as the flagship launch title.",
    facts: ["Larger 8-inch display screen", "Magnetic Joy-Con attachment system", "Backward compatible with Switch games", "Mario Kart World as launch title"],
    accentColor: "#222222",
  },
];

const FILTER_OPTIONS = ["All", ...CONSOLES.map((c) => c.era)];

export function TimelinePage() {
  const [selectedEra, setSelectedEra] = useState("All");
  const [selectedConsole, setSelectedConsole] = useState<Console | null>(null);
  const [isWide, setIsWide] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsWide(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const filtered = selectedEra === "All"
    ? CONSOLES
    : CONSOLES.filter((c) => c.era === selectedEra);

  return (
    <div style={{ background: "transparent", minHeight: "100vh", color: "#f0f0f0" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      {/* Page header */}
      <div style={{ background: "rgba(15,15,34,0.85)", borderBottom: "4px solid #E4000F", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(14px, 3vw, 28px)", color: "#E4000F", marginBottom: 12, textShadow: "2px 2px 0 #000" }}>
          NINTENDO HISTORY
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: "#888" }}>
          1977 — 2025 &nbsp;|&nbsp; 17 Consoles &nbsp;|&nbsp; A Legacy of Play
        </div>
      </div>

      {/* Console filter */}
      <div style={{ padding: "20px 16px", background: "rgba(10,10,26,0.7)", borderBottom: "2px solid #1a1a2e", overflowX: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#666", whiteSpace: "nowrap", marginRight: 8 }}>
          FILTER:
        </div>
        {FILTER_OPTIONS.map((era) => {
          const match = CONSOLES.find((c) => c.era === era);
          const btnColor = era === "All" ? "#E4000F" : (match?.accentColor ?? "#E4000F");
          const isSelected = selectedEra === era;
          const darkText = needsDarkText(btnColor);
          return (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              style={{
                background: isSelected ? btnColor : "rgba(15,15,34,0.85)",
                color: isSelected ? (darkText ? "#000" : "#fff") : "#888",
                border: `2px solid ${isSelected ? btnColor : "#333"}`,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 6,
                padding: "8px 10px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: isSelected ? "2px 2px 0 #000" : "none",
              }}
            >
              {era}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0, width: 4,
            background: "linear-gradient(to bottom, #E4000F, transparent)",
            transform: "translateX(-50%)", display: isWide ? "block" : "none",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {filtered.map((console_, idx) => (
              <div
                key={console_.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: isWide ? "1fr 60px 1fr" : "1fr",
                  gap: 16, alignItems: "center",
                  animation: "fadeIn 0.5s ease forwards",
                }}
              >
                {isWide ? (idx % 2 === 0 ? <ConsoleCard console_={console_} onSelect={setSelectedConsole} align="right" /> : <div />) : null}

                {/* Year marker — solid colored dot, no emoji */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 52, height: 52,
                    background: console_.accentColor,
                    border: "4px solid #fff",
                    boxShadow: `0 0 20px ${console_.accentColor}88, 4px 4px 0 #000`,
                    flexShrink: 0, zIndex: 1,
                  }} />
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: console_.accentColor, textAlign: "center" }}>
                    {console_.year}
                  </div>
                </div>

                {isWide
                  ? (idx % 2 === 1 ? <ConsoleCard console_={console_} onSelect={setSelectedConsole} align="left" /> : <div />)
                  : <ConsoleCard console_={console_} onSelect={setSelectedConsole} align="left" />
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedConsole && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setSelectedConsole(null)}
        >
          <div
            style={{ background: "#0f0f22", border: `4px solid ${selectedConsole.accentColor}`, boxShadow: `0 0 40px ${selectedConsole.accentColor}66, 8px 8px 0 #000`, maxWidth: 600, width: "100%", maxHeight: "85vh", overflowY: "auto", animation: "slideIn 0.3s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ background: selectedConsole.accentColor, padding: "20px 24px" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: needsDarkText(selectedConsole.accentColor) ? "#000" : "#fff", textShadow: needsDarkText(selectedConsole.accentColor) ? "none" : "2px 2px 0 #000", marginBottom: 4 }}>
                {selectedConsole.name}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: needsDarkText(selectedConsole.accentColor) ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)" }}>
                {selectedConsole.year} &nbsp;|&nbsp; {selectedConsole.era}
              </div>
            </div>

            <div style={{ padding: 24 }}>
              {/* Units sold */}
              <div style={{ background: "#1a1a2e", border: `2px solid ${selectedConsole.accentColor}44`, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#666", marginBottom: 4 }}>UNITS SOLD</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: selectedConsole.accentColor }}>
                  {selectedConsole.sold}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ccc", lineHeight: 1.6, marginBottom: 24 }}>
                {selectedConsole.description}
              </div>

              {/* Key facts */}
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: selectedConsole.accentColor, marginBottom: 12 }}>KEY FACTS</div>
              {selectedConsole.facts.map((fact, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid #1a1a2e" }}>
                  <span style={{ color: selectedConsole.accentColor, fontFamily: "'Press Start 2P', monospace", fontSize: 8, flexShrink: 0 }}>▶</span>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ddd" }}>{fact}</span>
                </div>
              ))}

              <button
                onClick={() => setSelectedConsole(null)}
                style={{
                  marginTop: 24,
                  background: selectedConsole.accentColor,
                  color: needsDarkText(selectedConsole.accentColor) ? "#000" : "#fff",
                  border: "3px solid #fff",
                  boxShadow: "3px 3px 0 #000",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9, padding: "12px 20px",
                  cursor: "pointer", width: "100%",
                }}
              >
                CLOSE X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsoleCard({ console_, onSelect, align }: { console_: Console; onSelect: (c: Console) => void; align: "left" | "right" }) {
  return (
    <div style={{ display: "flex", justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      <div
        onClick={() => onSelect(console_)}
        style={{ background: "rgba(15,15,34,0.85)", border: `3px solid ${console_.accentColor}`, boxShadow: `4px 4px 0 #000, 0 0 15px ${console_.accentColor}33`, padding: 20, maxWidth: 380, width: "100%", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `4px 8px 0 #000, 0 0 30px ${console_.accentColor}66`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 #000, 0 0 15px ${console_.accentColor}33`; }}
      >
        {/* Era badge */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "inline-block", background: console_.eraColor, color: needsDarkText(console_.eraColor) ? "#000" : "#fff", fontFamily: "'Press Start 2P', monospace", fontSize: 6, padding: "3px 8px", boxShadow: "2px 2px 0 #000" }}>
            {console_.era}
          </div>
        </div>

        {/* Name */}
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(8px, 1.5vw, 11px)", color: console_.accentColor, marginBottom: 8, lineHeight: 1.6 }}>
          {console_.name}
        </div>

        {/* Short description */}
        <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#aaa", lineHeight: 1.4, marginBottom: 12 }}>
          {console_.description.slice(0, 120)}...
        </div>

        {/* Facts preview */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {console_.facts.slice(0, 2).map((fact, i) => (
            <div key={i} style={{ background: `${console_.accentColor}22`, border: `1px solid ${console_.accentColor}44`, color: "#aaa", fontFamily: "'VT323', monospace", fontSize: 14, padding: "3px 8px" }}>
              {fact}
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: console_.accentColor }}>READ MORE ▶</div>
      </div>
    </div>
  );
}
