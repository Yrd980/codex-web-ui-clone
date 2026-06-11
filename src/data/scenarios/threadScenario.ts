import type { ChatMessage, ProjectGroup } from "../../types";

export const projectGroups: ProjectGroup[] = [
  {
    id: "aesthetics",
    name: "aesthetics",
    path: "C:\\Users\\Yrd98\\project\\aesthetics",
    threads: [{ id: "thread-1", title: "检查任务并打开网页", project: "aesthetics", time: "now", active: true }],
  },
  {
    id: "walnut",
    name: "WalnutPi",
    path: "C:\\Users\\Yrd98\\project\\WalnutPi",
    threads: [
      { id: "thread-2", title: "派遣子Agent执行对齐", project: "WalnutPi", time: "now", running: true },
      { id: "thread-3", title: "执行第三方项目对齐", project: "WalnutPi", time: "2h" },
      { id: "thread-4", title: "执行三方项目对齐", project: "WalnutPi", time: "4h" },
      { id: "thread-5", title: "对齐核桃派集成需求", project: "WalnutPi", time: "4h" },
      { id: "thread-6", title: "集成 third 下项目", project: "WalnutPi", time: "5h" },
    ],
  },
  {
    id: "lcsc",
    name: "LCSC_android...",
    path: "C:\\Users\\Yrd98\\project\\LCSC_android",
    threads: [
      { id: "thread-7", title: "收敛打印机NFC BO...", project: "LCSC_android", time: "now", running: true },
      { id: "thread-8", title: "实现 Box 第一条链路", project: "LCSC_android", time: "2m" },
      { id: "thread-9", title: "梳理项目发现", project: "LCSC_android", time: "2h" },
      { id: "thread-10", title: "对齐箱层材料标签设...", project: "LCSC_android", time: "3h" },
      { id: "thread-11", title: "查看BOM逻辑", project: "LCSC_android", time: "6h" },
    ],
  },
  { id: "other", name: "omniclaw", path: "C:\\Users\\Yrd98\\project\\omniclaw", threads: [] },
  { id: "life", name: "digital-life-ho...", path: "C:\\Users\\Yrd98\\project\\digital-life-house", threads: [] },
  { id: "fool", name: "The_FOOL", path: "C:\\Users\\Yrd98\\project\\The_FOOL", threads: [] },
  { id: "companion", name: "companion c...", path: "C:\\Users\\Yrd98\\project\\companion", threads: [] },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "user-1",
    role: "user",
    body: ["参考 docs/superpowers/specs/2026-06-10-codex-web-ui-ux-clone-design.md，把这个网页原型处理到更像 Codex 桌面端。"],
  },
  {
    id: "assistant-1",
    role: "assistant",
    body: [
      "我会保留现有 React 组件结构，只处理和参考截图不一致的地方。",
      "重点是主聊天、工具切换、Review、Files、Settings 和命令面板的视觉语气：低对比、紧凑、桌面应用感。",
    ],
    artifacts: [
      {
        icon: "file",
        title: "Read spec",
        meta: "docs/superpowers/specs/2026-06-10-codex-web-ui-ux-clone-design.md",
      },
      { icon: "folder", title: "Found screenshots", meta: "7 reference images under docs/references" },
    ],
  },
  {
    id: "tool-1",
    role: "tool",
    title: "Editing files",
    body: ["src/styles/tokens.css", "src/components/ChatStream.tsx", "src/components/ReviewWorkspace.tsx"],
    codeTokens: ["Vite", "React", "Tailwind CSS v4"],
  },
  {
    id: "assistant-2",
    role: "assistant",
    body: [
      "我已经把首屏收回到工作台状态：聊天流是正文优先，右侧环境卡浮在画布上，底部 composer 保持固定。",
      "接下来会继续校准工具面板，使 Review 和 Files 看起来是附着在当前线程上的 Codex 工具面，而不是独立 dashboard。",
    ],
  },
];
