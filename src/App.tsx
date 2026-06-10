import { useState } from "react";
import { AppFrame } from "./components/AppFrame";
import { ChatWorkspace } from "./components/ChatWorkspace";
import { CommandPalette } from "./components/CommandPalette";
import { SettingsView } from "./components/SettingsView";
import { projectGroups } from "./data/mockData";
import type { ActiveView } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <AppFrame
      activeThreadId={activeThreadId}
      groups={projectGroups}
      onOpenPalette={() => setIsCommandPaletteOpen(true)}
      onSelectThread={setActiveThreadId}
      onSetView={setActiveView}
    >
      {activeView === "settings" ? <SettingsView /> : <ChatWorkspace activeView={activeView} onSetView={setActiveView} />}
      <CommandPalette open={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </AppFrame>
  );
}
