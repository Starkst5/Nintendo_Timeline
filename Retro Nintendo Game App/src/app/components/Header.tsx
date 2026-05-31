import { useState } from "react";
import { Link, useLocation } from "react-router";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/timeline", label: "HISTORY" },
    { path: "/games", label: "GAMES" },
    { path: "/emulator", label: "EMULATOR" },
  ];

  return (
    <header
      style={{
        background: "#E4000F",
        borderBottom: "4px solid #fff",
        boxShadow: "0 4px 0 #000",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#fff",
                color: "#E4000F",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 14,
                padding: "6px 12px",
                border: "3px solid #000",
                boxShadow: "3px 3px 0 #000",
                letterSpacing: 2,
                userSelect: "none",
              }}
            >
              NINTENDO
            </div>
            <span
              style={{
                color: "#fff",
                fontSize: 8,
                letterSpacing: 1,
                display: "none",
                // shown on larger screens via inline style override below
              }}
              className="hidden sm:block"
            >
              HERITAGE
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ gap: 8 }} className="hidden md:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: "none",
                    color: active ? "#E4000F" : "#fff",
                    background: active ? "#fff" : "transparent",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    padding: "8px 12px",
                    border: active ? "2px solid #000" : "2px solid transparent",
                    boxShadow: active ? "2px 2px 0 #000" : "none",
                    transition: "all 0.1s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.target as HTMLElement).style.background =
                        "rgba(255,255,255,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.target as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "2px solid #fff",
              color: "#fff",
              padding: "6px 10px",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
            }}
            className="md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            style={{
              borderTop: "2px solid rgba(255,255,255,0.3)",
              paddingBottom: 12,
            }}
            className="md:hidden"
          >
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: active ? "#E4000F" : "#fff",
                    background: active ? "#fff" : "transparent",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    padding: "12px 16px",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
