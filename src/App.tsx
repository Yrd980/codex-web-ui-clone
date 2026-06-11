import { useEffect, useState } from "react";
import { appActionFromShortcut, reduceAppAction } from "./actions/appActions";
import { AppFrame } from "./components/AppFrame";
import { ChatWorkspace } from "./components/ChatWorkspace";
import { CommandPalette } from "./components/CommandPalette";
import { SettingsView } from "./components/SettingsView";
import { projectGroups } from "./data/scenarios/threadScenario";
import type { ActiveView, PaletteMode, SettingsSection } from "./types";

export default function App() {
  const [appState, setAppState] = useState({
    activeView: "chat" as ActiveView,
    isCommandPaletteOpen: false,
    paletteMode: "threads" as PaletteMode,
    settingsSection: "General" as SettingsSection,
  });
  const [activeThreadId, setActiveThreadId] = useState("thread-1");

  const openPalette = (mode: PaletteMode) => {
    setAppState((state) => reduceAppAction(state, { type: "open-palette", mode }));
  };

  const setActiveView = (view: ActiveView) => {
    setAppState((state) => reduceAppAction(state, { type: "set-view", view }));
  };

  const setSettingsSection = (section: SettingsSection) => {
    setAppState((state) => reduceAppAction(state, { type: "set-settings-section", section }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = appActionFromShortcut(event);
      if (!action) return;

      event.preventDefault();
      setAppState((state) => reduceAppAction(state, action));
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
      {appState.activeView === "settings" ? (
        <SettingsView activeSection={appState.settingsSection} onSetSection={setSettingsSection} />
      ) : (
        <ChatWorkspace activeView={appState.activeView} onOpenCommandMenu={() => openPalette("commands")} onSetView={setActiveView} />
      )}
      <CommandPalette
        open={appState.isCommandPaletteOpen}
        mode={appState.paletteMode}
        onClose={() => setAppState((state) => reduceAppAction(state, { type: "close-palette" }))}
        onRunCommand={(row) => setAppState((state) => reduceAppAction(state, { type: "run-command", commandId: row.id, view: row.view }))}
      />
    </AppFrame>
  );
}
