import { useEffect, useState } from "react";
import { AppFrame } from "./components/AppFrame";
import { ChatWorkspace } from "./components/ChatWorkspace";
import { CommandPalette } from "./components/CommandPalette";
import { SettingsView } from "./components/SettingsView";
import { projectGroups } from "./data/mockData";
import type { ActiveView, PaletteMode, SettingsSection } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("threads");
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("General");

  const openPalette = (mode: PaletteMode) => {
    setPaletteMode(mode);
    setIsCommandPaletteOpen(true);
  };

  const openSettings = (section: SettingsSection) => {
    setSettingsSection(section);
    setActiveView("settings");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette("commands");
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "g") {
        event.preventDefault();
        openPalette("threads");
      }
      if ((event.ctrlKey || event.metaKey) && event.key === ",") {
        event.preventDefault();
        openSettings("General");
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        openSettings("Keyboard Shortcuts");
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setActiveView((view) => (view === "terminal" ? "chat" : "terminal"));
      }
      if (event.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setActiveView((view) => (view === "settings" ? view : "chat"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppFrame
      activeThreadId={activeThreadId}
      groups={projectGroups}
      onOpenPalette={() => openPalette("threads")}
      onSelectThread={setActiveThreadId}
      onSetView={setActiveView}
    >
      {activeView === "settings" ? (
        <SettingsView activeSection={settingsSection} onSetSection={setSettingsSection} />
      ) : (
        <ChatWorkspace activeView={activeView} onOpenCommandMenu={() => openPalette("commands")} onSetView={setActiveView} />
      )}
      <CommandPalette
        open={isCommandPaletteOpen}
        mode={paletteMode}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenSettings={openSettings}
        onSetView={setActiveView}
      />
    </AppFrame>
  );
}
