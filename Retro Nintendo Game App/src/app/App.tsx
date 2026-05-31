import { HashRouter, Routes, Route } from "react-router";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { TimelinePage } from "./components/TimelinePage";
import { GamesPage } from "./components/GamesPage";
import { EmulatorPage } from "./components/EmulatorPage";

export default function App() {
  return (
    // MARKER-MAKE-KIT-INVOKED
    <HashRouter>
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a1a",
          fontFamily: "'VT323', monospace",
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/emulator" element={<EmulatorPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
