import type { CSSProperties } from "react";

const FALLBACK_VIEWPORT_WIDTH = 1440;

const SIDEBAR_MIN_RATIO = 0.13;
const SIDEBAR_MAX_RATIO = 0.2;
const SIDEBAR_DEFAULT_RATIO = 0.18;
const SIDEBAR_COLLAPSE_RATIO = 0.075;
const SIDEBAR_FLOATING_EDGE_RATIO = 0.031;

const TOOL_PANEL_MIN_RATIO = 0.3;
const TOOL_PANEL_MAX_RATIO = 0.58;
const TOOL_PANEL_DEFAULT_RATIO = 0.42;
const CHAT_MIN_RATIO = 0.34;
const CHAT_TRACK_RATIO = 0.78;
const ENVIRONMENT_PANEL_RATIO = 0.238;
const ENVIRONMENT_RIGHT_INSET_RATIO = 0.01;
const ENVIRONMENT_TOP_INSET_RATIO = 0.018;
const TOOL_SWITCHER_WIDTH_RATIO = 0.4;
const TOOL_SWITCHER_HEIGHT_RATIO = 0.54;
const TOOL_SWITCHER_EDGE_GAP_RATIO = 0.035;
const TOOL_SWITCHER_VERTICAL_CLEARANCE_RATIO = 0.12;
const COMPOSER_BOTTOM_RATIO = 0.033;
const COMPOSER_TOP_FADE_RATIO = 0.059;
const COMPOSER_TEXTAREA_RATIO = 0.031;
const COMPOSER_INLINE_PAD_RATIO = 0.01;
const COMPOSER_SURFACE_PAD_Y_RATIO = 0.008;
const CHAT_STREAM_BOTTOM_RATIO = 0.22;
const CHAT_TRACK_INLINE_GUARD_RATIO = 0.026;
const PANEL_OVERLAY_EDGE_RATIO = 0.018;
const BROWSER_PREVIEW_INSET_X_RATIO = 0.058;
const BROWSER_PREVIEW_INSET_Y_RATIO = 0.064;
const ENVIRONMENT_MIN_VISIBLE_ASPECT_RATIO = 1.15;

function ratioPercent(value: number, whole: number) {
  return `${whole ? (value / whole) * 100 : 0}%`;
}

export const codexShellGeometryDefaults = {
  sidebarRatio: SIDEBAR_DEFAULT_RATIO,
  toolPanelRatio: TOOL_PANEL_DEFAULT_RATIO,
};

export interface SidebarFrame {
  width: number;
  floatingEdge: number;
  style: CSSProperties;
}

export interface WorkspaceSize {
  width: number;
  height: number;
}

export interface ChatWorkspaceGeometryInput extends WorkspaceSize {
  environmentOpen: boolean;
  hasToolOverlay: boolean;
}

export interface ChatWorkspaceGeometry {
  canReserveEnvironment: boolean;
  environmentPanelWidth: number;
  environmentRightInset: number;
  environmentTopInset: number;
  environmentReservedWidth: number;
  environmentStyle: CSSProperties;
  chatTrackWidth: number;
  chatTrackOffset: number;
  composerTrackWidth: number;
  composerTrackOffset: number;
  composerBottomPad: number;
  composerTopFade: number;
  composerInlinePad: number;
  composerSurfacePadY: number;
  composerTextareaHeight: number;
  chatTrackStyle: CSSProperties;
}

export interface ToolSurfaceGeometryInput extends WorkspaceSize {
  toolPanelRatio: number;
}

export interface ToolSurfaceGeometry {
  toolSwitcherStyle: CSSProperties;
  toolPanelStyle: CSSProperties;
  browserPreviewStyle: CSSProperties;
  toolPanelWidth: number;
  browserPreviewInsetX: number;
  browserPreviewInsetY: number;
}

export function getViewportWidth() {
  return typeof window === "undefined" ? FALLBACK_VIEWPORT_WIDTH : window.innerWidth;
}

export function getSidebarBounds(containerWidth = getViewportWidth()) {
  const min = Math.round(containerWidth * SIDEBAR_MIN_RATIO);
  const max = Math.max(min, Math.round(containerWidth * SIDEBAR_MAX_RATIO));
  return { min, max };
}

export function clampSidebarWidth(width: number, containerWidth = getViewportWidth()) {
  const { min, max } = getSidebarBounds(containerWidth);
  return Math.min(Math.max(width, min), max);
}

export function getDefaultSidebarWidth(containerWidth = getViewportWidth()) {
  return clampSidebarWidth(Math.round(containerWidth * SIDEBAR_DEFAULT_RATIO), containerWidth);
}

export function getCollapseSidebarWidth(containerWidth = getViewportWidth()) {
  return Math.round(containerWidth * SIDEBAR_COLLAPSE_RATIO);
}

export function getSidebarFrame(input: { docked: boolean; ratio: number; viewportWidth: number }): SidebarFrame {
  const width = input.docked ? clampSidebarWidth(Math.round(input.viewportWidth * input.ratio), input.viewportWidth) : getDefaultSidebarWidth(input.viewportWidth);
  const floatingEdge = Math.round(input.viewportWidth * SIDEBAR_FLOATING_EDGE_RATIO);

  return {
    width,
    floatingEdge,
    style: {
      "--sidebar-width": `${(width / input.viewportWidth) * 100}vw`,
      "--sidebar-floating-edge": `${SIDEBAR_FLOATING_EDGE_RATIO * 100}vw`,
    } as CSSProperties,
  };
}

export function clampToolPanelWidth(width: number, containerWidth: number) {
  const chatMinWidth = Math.round(containerWidth * CHAT_MIN_RATIO);
  const availableForPanel = Math.max(0, containerWidth - chatMinWidth);
  const minWidth = Math.min(Math.round(containerWidth * TOOL_PANEL_MIN_RATIO), availableForPanel);
  const maxWidth = Math.max(minWidth, Math.min(Math.round(containerWidth * TOOL_PANEL_MAX_RATIO), availableForPanel));
  return Math.min(Math.max(width, minWidth), maxWidth);
}

export function getChatWorkspaceGeometry({
  width,
  height,
  environmentOpen,
  hasToolOverlay,
}: ChatWorkspaceGeometryInput): ChatWorkspaceGeometry {
  const canReserveEnvironment = width > height * ENVIRONMENT_MIN_VISIBLE_ASPECT_RATIO;
  const environmentPanelWidth = Math.round(width * ENVIRONMENT_PANEL_RATIO);
  const environmentRightInset = Math.round(width * ENVIRONMENT_RIGHT_INSET_RATIO);
  const environmentTopInset = Math.round(height * ENVIRONMENT_TOP_INSET_RATIO);
  const environmentReservedWidth = environmentOpen && !hasToolOverlay && canReserveEnvironment ? environmentPanelWidth + environmentRightInset : 0;
  const chatTrackWidth = Math.round((width - environmentReservedWidth) * CHAT_TRACK_RATIO);
  const chatTrackOffset = 0;
  const composerTrackWidth = chatTrackWidth;
  const composerTrackOffset = chatTrackOffset;
  const composerBottomPad = Math.round(height * COMPOSER_BOTTOM_RATIO);
  const composerTopFade = Math.round(height * COMPOSER_TOP_FADE_RATIO);
  const composerInlinePad = Math.round(width * COMPOSER_INLINE_PAD_RATIO);
  const composerSurfacePadY = Math.round(height * COMPOSER_SURFACE_PAD_Y_RATIO);
  const composerTextareaHeight = Math.round(height * COMPOSER_TEXTAREA_RATIO);
  const chatStreamBottomPad = Math.round(height * CHAT_STREAM_BOTTOM_RATIO);
  const chatTrackInlineGuard = Math.round(width * CHAT_TRACK_INLINE_GUARD_RATIO);

  return {
    canReserveEnvironment,
    environmentPanelWidth,
    environmentRightInset,
    environmentTopInset,
    environmentReservedWidth,
    environmentStyle: {
      "--environment-panel-width": `${ENVIRONMENT_PANEL_RATIO * 100}%`,
      "--environment-right-inset": `${ENVIRONMENT_RIGHT_INSET_RATIO * 100}%`,
      "--environment-top-inset": `${ENVIRONMENT_TOP_INSET_RATIO * 100}%`,
    } as CSSProperties,
    chatTrackWidth,
    chatTrackOffset,
    composerTrackWidth,
    composerTrackOffset,
    composerBottomPad,
    composerTopFade,
    composerInlinePad,
    composerSurfacePadY,
    composerTextareaHeight,
    chatTrackStyle: {
      "--chat-track-width": `${CHAT_TRACK_RATIO * 100}%`,
      "--chat-track-offset": ratioPercent(chatTrackOffset, width),
      "--chat-stream-bottom-pad": ratioPercent(chatStreamBottomPad, height),
      "--chat-track-inline-guard": ratioPercent(chatTrackInlineGuard, width),
    } as CSSProperties,
  };
}

export function getToolSurfaceGeometry({ width, height, toolPanelRatio }: ToolSurfaceGeometryInput): ToolSurfaceGeometry {
  const toolSwitcherEdgeGap = Math.round(width * TOOL_SWITCHER_EDGE_GAP_RATIO);
  const toolSwitcherWidth = Math.round(width * TOOL_SWITCHER_WIDTH_RATIO);
  const toolSwitcherHeight = Math.round(height * TOOL_SWITCHER_HEIGHT_RATIO);
  const toolPanelWidth = clampToolPanelWidth(Math.round(width * toolPanelRatio), width);
  const panelOverlayEdge = Math.round(width * PANEL_OVERLAY_EDGE_RATIO);
  const browserPreviewInsetX = Math.round(toolPanelWidth * BROWSER_PREVIEW_INSET_X_RATIO);
  const browserPreviewInsetY = Math.round(height * BROWSER_PREVIEW_INSET_Y_RATIO);

  return {
    toolPanelWidth,
    browserPreviewInsetX,
    browserPreviewInsetY,
    toolPanelStyle: {
      "--tool-panel-width": ratioPercent(toolPanelWidth, width),
      "--panel-overlay-edge": ratioPercent(panelOverlayEdge, width),
    } as CSSProperties,
    toolSwitcherStyle: {
      "--tool-switcher-width": ratioPercent(toolSwitcherWidth, width),
      "--tool-switcher-height": ratioPercent(toolSwitcherHeight, height),
      "--tool-switcher-edge-gap": ratioPercent(toolSwitcherEdgeGap, width),
      "--tool-switcher-vertical-clearance": `${TOOL_SWITCHER_VERTICAL_CLEARANCE_RATIO * 100}%`,
    } as CSSProperties,
    browserPreviewStyle: {
      "--browser-preview-inset-x": `${BROWSER_PREVIEW_INSET_X_RATIO * 100}%`,
      "--browser-preview-inset-y": `${BROWSER_PREVIEW_INSET_Y_RATIO * 100}%`,
    } as CSSProperties,
  };
}
