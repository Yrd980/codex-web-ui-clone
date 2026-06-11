import type { ActiveView, PaletteMode, SettingsSection } from "../types";

export interface AppActionState {
  activeView: ActiveView;
  isCommandPaletteOpen: boolean;
  paletteMode: PaletteMode;
  settingsSection: SettingsSection;
}

export type AppAction =
  | { type: "open-palette"; mode: PaletteMode }
  | { type: "close-palette" }
  | { type: "open-settings"; section: SettingsSection }
  | { type: "set-settings-section"; section: SettingsSection }
  | { type: "set-view"; view: ActiveView }
  | { type: "toggle-view"; view: ActiveView; fallback: ActiveView }
  | { type: "run-command"; commandId: string; view: ActiveView }
  | { type: "escape" };

export function reduceAppAction(state: AppActionState, action: AppAction): AppActionState {
  switch (action.type) {
    case "open-palette":
      return { ...state, paletteMode: action.mode, isCommandPaletteOpen: true };
    case "close-palette":
      return { ...state, isCommandPaletteOpen: false };
    case "open-settings":
      return { ...state, activeView: "settings", settingsSection: action.section, isCommandPaletteOpen: false };
    case "set-settings-section":
      return { ...state, settingsSection: action.section };
    case "set-view":
      return { ...state, activeView: action.view };
    case "toggle-view":
      return { ...state, activeView: state.activeView === action.view ? action.fallback : action.view };
    case "run-command":
      return reduceCommandAction(state, action.commandId, action.view);
    case "escape":
      return {
        ...state,
        isCommandPaletteOpen: false,
        activeView: state.activeView === "settings" ? state.activeView : "chat",
      };
  }
}

export function appActionFromShortcut(event: KeyboardEvent): AppAction | null {
  const modifier = event.ctrlKey || event.metaKey;
  if (!modifier) {
    return event.key === "Escape" ? { type: "escape" } : null;
  }

  const key = event.key.toLowerCase();

  if (key === "k") return { type: "open-palette", mode: "commands" };
  if (key === "g") return { type: "open-palette", mode: "threads" };
  if (event.key === ",") return { type: "open-settings", section: "General" };
  if (event.key === "/") return { type: "open-settings", section: "Keyboard Shortcuts" };
  if (key === "j") return { type: "toggle-view", view: "terminal", fallback: "chat" };

  return null;
}

function reduceCommandAction(state: AppActionState, commandId: string, view: ActiveView): AppActionState {
  if (commandId === "keyboard") {
    return reduceAppAction(state, { type: "open-settings", section: "Keyboard Shortcuts" });
  }

  if (commandId === "settings") {
    return reduceAppAction(state, { type: "open-settings", section: "General" });
  }

  return { ...state, activeView: view, isCommandPaletteOpen: false };
}
