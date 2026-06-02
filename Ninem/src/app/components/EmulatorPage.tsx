import { useState, useRef, useEffect, useCallback } from "react";

// Images map: public folder paths
const CORE_IMAGES: Record<string, string> = {
  nes:  "/nes-black-box-header-e1537450784635.webp",   // NES black box art
  snes: "/91HdJ-Cb6kL.jpg",                            // Super Mario Kart SNES
  n64:  "/64.png", // SM64
  gb:   "/ai9zb87e19811.jpg",                          // Game Boy Tetris
  gbc:  "/retro-video-games-consoles-game-boy-color-grape-boxed-1-1200x1201.jpg", // GBC grape
  gba:  "/177488390475.jpg",                           // GBA blue
  nds:  "/s-l400.jpg",                                 // DS games
};

const CORES = [
  { id: "nes",  label: "NES",       desc: "Nintendo Entertainment System (.nes)" },
  { id: "snes", label: "SNES",      desc: "Super Nintendo (.smc, .sfc)" },
  { id: "n64",  label: "N64",       desc: "Nintendo 64 (.n64, .z64)" },
  { id: "gb",   label: "Game Boy",  desc: "Game Boy (.gb)" },
  { id: "gbc",  label: "GBC",       desc: "Game Boy Color (.gbc)" },
  { id: "gba",  label: "GBA",       desc: "Game Boy Advance (.gba)" },
  { id: "nds",  label: "DS",        desc: "Nintendo DS (.nds)" },
];

export function EmulatorPage() {
  const [romFile, setRomFile] = useState<File | null>(null);
  const [selectedCore, setSelectedCore] = useState("nes");
  const [isRunning, setIsRunning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUrlRef = useRef<string>("");

  const stopEmulator = useCallback(() => {
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    setIsRunning(false);
    setError("");
  }, []);

  useEffect(() => {
    if (!isRunning || !activeUrlRef.current) return;
    const gameDiv = gameContainerRef.current;
    if (!gameDiv) return;
    gameDiv.id = "ejs-game";
    const w = window as Record<string, unknown>;
    w["EJS_player"] = "#ejs-game";
    w["EJS_core"] = selectedCore;
    w["EJS_gameUrl"] = activeUrlRef.current;
    w["EJS_pathtodata"] = "https://cdn.emulatorjs.org/stable/data/";
    w["EJS_color"] = "#E4000F";
    w["EJS_startOnLoaded"] = true;
    w["EJS_backgroundColor"] = "#0d0010";
    w["EJS_fullscreenOnLoaded"] = false;
    w["EJS_Buttons"] = {
      playPause: true, restart: true, mute: true, settings: true,
      fullscreen: true, saveState: true, loadState: true,
      screenRecord: false, gamepad: true, cheat: false, volume: true,
      saveSavFiles: true, loadSavFiles: true, quickSave: true,
      quickLoad: true, screenshot: true, cacheManager: false,
    };
    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    script.onerror = () => { setError("Failed to load EmulatorJS. Check your internet connection."); setIsRunning(false); };
    document.body.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [isRunning, selectedCore]);

  useEffect(() => {
    return () => { if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current); };
  }, []);

  const handleFileSelect = (file: File) => {
    if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current);
    const url = URL.createObjectURL(file);
    activeUrlRef.current = url;
    setRomFile(file);
    setError("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    const extMap: Record<string, string> = {
      nes: "nes", smc: "snes", sfc: "snes",
      n64: "n64", z64: "n64", v64: "n64",
      gb: "gb", gbc: "gbc", gba: "gba", nds: "nds",
    };
    if (ext && extMap[ext]) setSelectedCore(extMap[ext]);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleStart = () => {
    if (!romFile || !activeUrlRef.current) { setError("Please select a ROM file first."); return; }
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    setIsRunning(true);
  };

  const selectedCoreInfo = CORES.find((c) => c.id === selectedCore);

  return (
    <div style={{ background: "transparent", minHeight: "100vh", color: "#f0f0f0" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .core-btn:hover { transform: translateY(-3px) !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "rgba(15,15,34,0.85)", borderBottom: "4px solid #E4000F", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(14px, 3vw, 28px)", color: "#E4000F", marginBottom: 12, textShadow: "2px 2px 0 #000" }}>
          💾 EMULATOR
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: "#888" }}>
          Upload your ROM file and play classic Nintendo games in your browser
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        {isRunning ? (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={stopEmulator} style={{ background: "#E4000F", color: "#fff", border: "3px solid #fff", boxShadow: "3px 3px 0 #000", fontFamily: "'Press Start 2P', monospace", fontSize: 8, padding: "10px 16px", cursor: "pointer" }}>
                ◄ BACK
              </button>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#00FF41" }}>
                ● NOW PLAYING: {romFile?.name}
              </div>
            </div>
            <div style={{ background: "#000", border: "4px solid #E4000F", boxShadow: "0 0 40px rgba(228,0,15,0.4), 8px 8px 0 #000", position: "relative", minHeight: 500 }}>
              <div ref={gameContainerRef} style={{ width: "100%", minHeight: 500 }} />
            </div>
            <div style={{ marginTop: 16, padding: "12px 20px", background: "rgba(15,15,34,0.85)", border: "2px solid #333", fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#555", lineHeight: 2 }}>
              TIP: Use the toolbar at the bottom of the emulator to save/load states, change settings, or go fullscreen. Gamepad controllers are also supported!
            </div>
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Legal notice */}
            <div style={{ background: "rgba(26,16,0,0.85)", border: "3px solid #FFD700", padding: "16px 20px", marginBottom: 32, boxShadow: "4px 4px 0 #000" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#FFD700", marginBottom: 8 }}>⚠ NOTICE</div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#aaa", lineHeight: 1.5 }}>
                This emulator is powered by EmulatorJS (open source). Only use ROMs for games you own legally.
                ROM files are processed locally in your browser — nothing is uploaded to any server.
              </div>
            </div>

            {/* Step 1: Console selection */}
            <div style={{ background: "rgba(15,15,34,0.85)", border: "3px solid #333", padding: 24, marginBottom: 24, boxShadow: "4px 4px 0 #000" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#E4000F", marginBottom: 20 }}>
                STEP 1: SELECT CONSOLE
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12 }}>
                {CORES.map((core) => {
                  const isSelected = selectedCore === core.id;
                  return (
                    <button
                      key={core.id}
                      className="core-btn"
                      onClick={() => setSelectedCore(core.id)}
                      style={{
                        background: isSelected ? "rgba(228,0,15,0.2)" : "rgba(10,10,26,0.8)",
                        border: `3px solid ${isSelected ? "#E4000F" : "#333"}`,
                        boxShadow: isSelected ? "0 0 16px rgba(228,0,15,0.4), 3px 3px 0 #000" : "2px 2px 0 #000",
                        color: "#fff",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflow: "hidden",
                        transition: "all 0.15s",
                      }}
                    >
                      {/* Console image */}
                      <div style={{ width: "100%", height: 80, overflow: "hidden", position: "relative" }}>
                        <img
                          src={CORE_IMAGES[core.id]}
                          alt={core.label}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        {isSelected && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(228,0,15,0.15)", border: "2px solid #E4000F" }} />
                        )}
                      </div>
                      {/* Label */}
                      <div style={{ padding: "8px 4px", fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: isSelected ? "#E4000F" : "#888", width: "100%", textAlign: "center" }}>
                        {core.label}
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedCoreInfo && (
                <div style={{ marginTop: 16, fontFamily: "'VT323', monospace", fontSize: 18, color: "#666" }}>
                  Accepts: {selectedCoreInfo.desc}
                </div>
              )}
            </div>

            {/* Step 2: ROM upload */}
            <div style={{ background: "rgba(15,15,34,0.85)", border: "3px solid #333", padding: 24, marginBottom: 24, boxShadow: "4px 4px 0 #000" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#E4000F", marginBottom: 20 }}>
                STEP 2: LOAD ROM
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `4px dashed ${isDragging ? "#E4000F" : romFile ? "#00FF41" : "#444"}`,
                  background: isDragging ? "rgba(228,0,15,0.05)" : romFile ? "rgba(0,255,65,0.03)" : "transparent",
                  padding: "48px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: isDragging ? "0 0 20px rgba(228,0,15,0.3)" : "none",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".nes,.smc,.sfc,.n64,.z64,.v64,.gb,.gbc,.gba,.nds,.bin,.rom"
                  style={{ display: "none" }}
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }}
                />
                {romFile ? (
                  <>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#00FF41", marginBottom: 8 }}>💾 ROM LOADED</div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#aaa" }}>{romFile.name}</div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#666", marginTop: 8 }}>
                      {(romFile.size / 1024 / 1024).toFixed(2)} MB &nbsp;|&nbsp; Click to change
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>💾</div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#888", marginBottom: 8 }}>DROP ROM HERE</div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#555" }}>or click to browse files</div>
                  </>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(26,0,0,0.9)", border: "3px solid #E4000F", padding: "16px 20px", marginBottom: 24, fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#E4000F" }}>
                ✕ {error}
              </div>
            )}

            {/* Step 3: Launch */}
            <div style={{ background: "rgba(15,15,34,0.85)", border: "3px solid #333", padding: 24, boxShadow: "4px 4px 0 #000" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#E4000F", marginBottom: 20 }}>
                STEP 3: POWER ON
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                <div style={{ background: "rgba(10,10,26,0.8)", border: "2px solid #333", padding: "12px 20px", flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={CORE_IMAGES[selectedCore]} alt={selectedCoreInfo?.label} style={{ width: 40, height: 40, objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#555", marginBottom: 4 }}>CONSOLE</div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: "#fff" }}>{selectedCoreInfo?.label}</div>
                  </div>
                </div>
                <div style={{ background: "rgba(10,10,26,0.8)", border: "2px solid #333", padding: "12px 20px", flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#555", marginBottom: 4 }}>ROM FILE</div>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: romFile ? "#fff" : "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {romFile ? romFile.name : "No file selected"}
                  </div>
                </div>
              </div>
              <button
                onClick={handleStart}
                disabled={!romFile}
                style={{ width: "100%", background: romFile ? "#E4000F" : "#1a1a1a", color: romFile ? "#fff" : "#444", border: `4px solid ${romFile ? "#fff" : "#333"}`, boxShadow: romFile ? "4px 4px 0 #000" : "none", fontFamily: "'Press Start 2P', monospace", fontSize: 14, padding: "20px", cursor: romFile ? "pointer" : "not-allowed", letterSpacing: 2, transition: "all 0.1s" }}
                onMouseEnter={(e) => { if (romFile) { (e.currentTarget as HTMLElement).style.background="#cc0000"; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; } }}
                onMouseLeave={(e) => { if (romFile) { (e.currentTarget as HTMLElement).style.background="#E4000F"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; } }}
              >
                {romFile ? "▶ POWER ON" : "SELECT A ROM TO CONTINUE"}
              </button>
            </div>

            {/* Supported formats */}
            <div style={{ marginTop: 32, padding: 24, background: "rgba(15,15,34,0.85)", border: "2px solid #1a1a2e" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#444", marginBottom: 16 }}>SUPPORTED FORMATS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[".nes", ".smc", ".sfc", ".n64", ".z64", ".v64", ".gb", ".gbc", ".gba", ".nds"].map((ext) => (
                  <div key={ext} style={{ background: "rgba(10,10,26,0.8)", border: "2px solid #222", padding: "6px 12px", fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#555" }}>
                    {ext}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: "center", fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#333" }}>
              Powered by EmulatorJS — Open Source Browser Emulation
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
