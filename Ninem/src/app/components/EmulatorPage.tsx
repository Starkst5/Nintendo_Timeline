import { useState, useRef, useEffect, useCallback } from "react";

const CORES = [
  { id: "nes", label: "NES", emoji: "🎮", desc: "Nintendo Entertainment System (.nes)" },
  { id: "snes", label: "SNES", emoji: "🎯", desc: "Super Nintendo (.smc, .sfc)" },
  { id: "n64", label: "N64", emoji: "🔷", desc: "Nintendo 64 (.n64, .z64)" },
  { id: "gb", label: "Game Boy", emoji: "🟩", desc: "Game Boy (.gb)" },
  { id: "gbc", label: "GBC", emoji: "🌈", desc: "Game Boy Color (.gbc)" },
  { id: "gba", label: "GBA", emoji: "💜", desc: "Game Boy Advance (.gba)" },
  { id: "nds", label: "DS", emoji: "📱", desc: "Nintendo DS (.nds)" },
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
    w["EJS_backgroundColor"] = "#0a0a1a";
    w["EJS_fullscreenOnLoaded"] = false;
    w["EJS_Buttons"] = {
      playPause: true,
      restart: true,
      mute: true,
      settings: true,
      fullscreen: true,
      saveState: true,
      loadState: true,
      screenRecord: false,
      gamepad: true,
      cheat: false,
      volume: true,
      saveSavFiles: true,
      loadSavFiles: true,
      quickSave: true,
      quickLoad: true,
      screenshot: true,
      cacheManager: false,
    };

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    script.onerror = () => {
      setError("Failed to load EmulatorJS. Check your internet connection.");
      setIsRunning(false);
    };
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
    return () => {
      if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current);
    };
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
    if (!romFile || !activeUrlRef.current) {
      setError("Please select a ROM file first.");
      return;
    }
    // Remove any existing emulator script before starting fresh
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    setIsRunning(true);
  };

  const selectedCoreInfo = CORES.find((c) => c.id === selectedCore);

  return (
    <div style={{ background: "#0a0a1a", minHeight: "100vh", color: "#f0f0f0" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: "#0f0f22",
          borderBottom: "4px solid #E4000F",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(14px, 3vw, 28px)",
            color: "#E4000F",
            marginBottom: 12,
            textShadow: "2px 2px 0 #000",
          }}
        >
          💾 EMULATOR
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: "#888" }}>
          Upload your ROM file and play classic Nintendo games in your browser
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        {isRunning ? (
          /* Emulator running view */
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={stopEmulator}
                style={{
                  background: "#E4000F",
                  color: "#fff",
                  border: "3px solid #fff",
                  boxShadow: "3px 3px 0 #000",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                ◄ BACK
              </button>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#00FF41" }}>
                ● NOW PLAYING: {romFile?.name}
              </div>
            </div>

            <div
              style={{
                background: "#000",
                border: "4px solid #E4000F",
                boxShadow: "0 0 40px rgba(228,0,15,0.4), 8px 8px 0 #000",
                position: "relative",
                minHeight: 500,
              }}
            >
              <div ref={gameContainerRef} style={{ width: "100%", minHeight: 500 }} />
            </div>

            <div
              style={{
                marginTop: 16,
                padding: "12px 20px",
                background: "#0f0f22",
                border: "2px solid #333",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: "#555",
                lineHeight: 2,
              }}
            >
              TIP: Use the toolbar at the bottom of the emulator to save/load states, change settings, or go fullscreen.
              Gamepad controllers are also supported!
            </div>
          </div>
        ) : (
          /* Setup form */
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Legal notice */}
            <div
              style={{
                background: "#1a1000",
                border: "3px solid #FFD700",
                padding: "16px 20px",
                marginBottom: 32,
                boxShadow: "4px 4px 0 #000",
              }}
            >
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#FFD700", marginBottom: 8 }}>
                ⚠ NOTICE
              </div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#aaa", lineHeight: 1.5 }}>
                This emulator is powered by EmulatorJS (open source). Only use ROMs for games you own legally.
                ROM files are processed locally in your browser — nothing is uploaded to any server.
              </div>
            </div>

            {/* Step 1: Console selection */}
            <div
              style={{
                background: "#0f0f22",
                border: "3px solid #333",
                padding: 24,
                marginBottom: 24,
                boxShadow: "4px 4px 0 #000",
              }}
            >
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#E4000F", marginBottom: 20 }}>
                STEP 1: SELECT CONSOLE
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
                {CORES.map((core) => (
                  <button
                    key={core.id}
                    onClick={() => setSelectedCore(core.id)}
                    style={{
                      background: selectedCore === core.id ? "#E4000F" : "#0a0a1a",
                      border: `3px solid ${selectedCore === core.id ? "#fff" : "#333"}`,
                      boxShadow: selectedCore === core.id ? "3px 3px 0 #000" : "none",
                      color: "#fff",
                      padding: "12px 8px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.1s",
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{core.emoji}</span>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: selectedCore === core.id ? "#fff" : "#888" }}>
                      {core.label}
                    </span>
                  </button>
                ))}
              </div>
              {selectedCoreInfo && (
                <div style={{ marginTop: 16, fontFamily: "'VT323', monospace", fontSize: 18, color: "#666" }}>
                  Accepts: {selectedCoreInfo.desc}
                </div>
              )}
            </div>

            {/* Step 2: ROM upload */}
            <div
              style={{
                background: "#0f0f22",
                border: "3px solid #333",
                padding: 24,
                marginBottom: 24,
                boxShadow: "4px 4px 0 #000",
              }}
            >
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {romFile ? (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#00FF41", marginBottom: 8 }}>ROM LOADED</div>
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
              <div
                style={{
                  background: "#1a0000",
                  border: "3px solid #E4000F",
                  padding: "16px 20px",
                  marginBottom: 24,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: "#E4000F",
                }}
              >
                ✕ {error}
              </div>
            )}

            {/* Step 3: Launch */}
            <div
              style={{
                background: "#0f0f22",
                border: "3px solid #333",
                padding: 24,
                boxShadow: "4px 4px 0 #000",
              }}
            >
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#E4000F", marginBottom: 20 }}>
                STEP 3: POWER ON
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                <div style={{ background: "#0a0a1a", border: "2px solid #333", padding: "12px 20px", flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#555", marginBottom: 4 }}>CONSOLE</div>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: "#fff" }}>
                    {selectedCoreInfo?.emoji} {selectedCoreInfo?.label}
                  </div>
                </div>
                <div style={{ background: "#0a0a1a", border: "2px solid #333", padding: "12px 20px", flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#555", marginBottom: 4 }}>ROM FILE</div>
                  <div
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: 20,
                      color: romFile ? "#fff" : "#444",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {romFile ? romFile.name : "No file selected"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!romFile}
                style={{
                  width: "100%",
                  background: romFile ? "#E4000F" : "#1a1a1a",
                  color: romFile ? "#fff" : "#444",
                  border: `4px solid ${romFile ? "#fff" : "#333"}`,
                  boxShadow: romFile ? "4px 4px 0 #000" : "none",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 14,
                  padding: "20px",
                  cursor: romFile ? "pointer" : "not-allowed",
                  letterSpacing: 2,
                  transition: "all 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (romFile) {
                    (e.currentTarget as HTMLElement).style.background = "#cc0000";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (romFile) {
                    (e.currentTarget as HTMLElement).style.background = "#E4000F";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }
                }}
              >
                {romFile ? "▶ POWER ON" : "SELECT A ROM TO CONTINUE"}
              </button>
            </div>

            {/* Supported formats */}
            <div style={{ marginTop: 32, padding: 24, background: "#0f0f22", border: "2px solid #1a1a2e" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#444", marginBottom: 16 }}>SUPPORTED FORMATS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[".nes", ".smc", ".sfc", ".n64", ".z64", ".v64", ".gb", ".gbc", ".gba", ".nds"].map((ext) => (
                  <div
                    key={ext}
                    style={{
                      background: "#0a0a1a",
                      border: "2px solid #222",
                      padding: "6px 12px",
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: "#555",
                    }}
                  >
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
