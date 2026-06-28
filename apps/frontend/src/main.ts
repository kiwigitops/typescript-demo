import {
  difficulties,
  getRoadmapSummary,
  isDifficulty,
  roadmapItems,
  type Difficulty,
  type RoadmapItem,
  type RoadmapSummary,
} from "../../../src/shared/roadmap";
import apiReadme from "../../../examples/api/README.md?raw";
import apiCode from "../../../examples/api/server.ts?raw";
import lesson01Code from "../../../lessons/01-hello-world/main.ts?raw";
import lesson01Readme from "../../../lessons/01-hello-world/README.md?raw";
import lesson02Code from "../../../lessons/02-types-and-values/main.ts?raw";
import lesson02Readme from "../../../lessons/02-types-and-values/README.md?raw";
import lesson03Code from "../../../lessons/03-functions-and-objects/main.ts?raw";
import lesson03Readme from "../../../lessons/03-functions-and-objects/README.md?raw";
import lesson04Code from "../../../lessons/04-unions-and-narrowing/main.ts?raw";
import lesson04Readme from "../../../lessons/04-unions-and-narrowing/README.md?raw";
import lesson05Code from "../../../lessons/05-generics-and-utilities/main.ts?raw";
import lesson05Readme from "../../../lessons/05-generics-and-utilities/README.md?raw";
import lesson06Code from "../../../lessons/06-async-and-errors/main.ts?raw";
import lesson06Readme from "../../../lessons/06-async-and-errors/README.md?raw";
import lesson07Code from "../../../lessons/07-modules-and-domain-modeling/main.ts?raw";
import lesson07Readme from "../../../lessons/07-modules-and-domain-modeling/README.md?raw";
import frontendReadme from "../README.md?raw";
import frontendCode from "./main.ts?raw";
import "./styles.css";

type Filter = Difficulty | "all";
type SidebarMode = "collapsed" | "expanded";

type RoadmapResponse = {
  items: RoadmapItem[];
  summary: RoadmapSummary;
};

type LessonAsset = {
  code: string;
  readme: string;
};

type UiState = {
  filter: Filter;
  items: RoadmapItem[];
  selectedId: string;
  sidebarMode: SidebarMode;
  source: "api" | "fallback";
  status: string;
  summary: RoadmapSummary;
};

const lessonAssets: Record<string, LessonAsset> = {
  "api-and-frontend": {
    code: apiCode,
    readme: apiReadme,
  },
  "async-and-errors": {
    code: lesson06Code,
    readme: lesson06Readme,
  },
  "frontend-workspace": {
    code: frontendCode,
    readme: frontendReadme,
  },
  "functions-and-objects": {
    code: lesson03Code,
    readme: lesson03Readme,
  },
  "generics-and-utilities": {
    code: lesson05Code,
    readme: lesson05Readme,
  },
  "hello-world": {
    code: lesson01Code,
    readme: lesson01Readme,
  },
  "modules-and-domain-modeling": {
    code: lesson07Code,
    readme: lesson07Readme,
  },
  "typed-api": {
    code: apiCode,
    readme: apiReadme,
  },
  "types-and-values": {
    code: lesson02Code,
    readme: lesson02Readme,
  },
  "unions-and-narrowing": {
    code: lesson04Code,
    readme: lesson04Readme,
  },
};

const state: UiState = {
  filter: "all",
  items: [...roadmapItems],
  selectedId: roadmapItems[0]?.id ?? "",
  sidebarMode: "expanded",
  source: "fallback",
  status: "Loading",
  summary: getRoadmapSummary(roadmapItems),
};

const app = requireElement<HTMLDivElement>("#app");

renderShell();
void refreshRoadmap();

function renderShell(): void {
  app.innerHTML = `
    <main class="workspace-shell" data-sidebar="${state.sidebarMode}">
      <aside class="sidebar" aria-label="Lesson navigation">
        <div class="sidebar-brand">
          <span class="brand-mark">TS</span>
          <span class="brand-copy">
            <strong>TypeScript</strong>
            <small>Zero to hero</small>
          </span>
        </div>
        <button class="sidebar-toggle" id="sidebarToggle" type="button" aria-label="Toggle sidebar labels" aria-pressed="false">
          <span class="nav-icon">⌘</span>
          <span class="nav-label">Focus rail</span>
        </button>
        <nav class="chapter-nav" id="chapterNav"></nav>
      </aside>

      <section class="workspace">
        <header class="workspace-header">
          <div>
            <p class="eyebrow">Learning workspace</p>
            <h1 id="workspaceTitle">TypeScript Studio</h1>
          </div>
          <nav class="header-nav" aria-label="Workspace filters" id="headerFilters"></nav>
          <div class="sync-pill" id="syncPill" aria-live="polite">
            <span class="sync-dot"></span>
            <span id="syncText">Syncing</span>
          </div>
        </header>

        <section class="workspace-overview" aria-label="Progress overview">
          <div class="metric-strip" id="metricStrip"></div>
          <button class="refresh-button" id="refreshButton" type="button">
            <span>↻</span>
            <strong>Refresh</strong>
          </button>
        </section>

        <section class="lesson-workspace" aria-label="Selected lesson">
          <article class="lesson-panel">
            <div class="lesson-kicker" id="lessonKicker"></div>
            <div id="lessonReadme"></div>
          </article>
          <aside class="code-panel">
            <div class="code-toolbar">
              <span id="codePath"></span>
              <button class="copy-command" id="copyCommandButton" type="button">Copy run command</button>
            </div>
            <pre><code id="lessonCode"></code></pre>
          </aside>
        </section>
      </section>
    </main>
  `;

  requireElement<HTMLButtonElement>("#sidebarToggle").addEventListener("click", toggleSidebar);
  requireElement<HTMLButtonElement>("#refreshButton").addEventListener("click", () => {
    void refreshRoadmap();
  });
  requireElement<HTMLButtonElement>("#copyCommandButton").addEventListener("click", () => {
    void copySelectedCommand();
  });
  renderStaticControls();
  renderApp();
}

function renderStaticControls(): void {
  const filters = requireElement<HTMLElement>("#headerFilters");
  filters.replaceChildren();

  const allFilters: readonly Filter[] = ["all", ...difficulties];
  allFilters.forEach((filter) => {
    const button = document.createElement("button");
    button.className = filter === state.filter ? "header-filter active" : "header-filter";
    button.textContent = formatFilter(filter);
    button.type = "button";
    button.addEventListener("click", () => {
      state.filter = filter;
      renderStaticControls();
      void refreshRoadmap();
    });
    filters.append(button);
  });
}

async function refreshRoadmap(): Promise<void> {
  updateStatus("Syncing", "api");

  try {
    const response = await fetchRoadmap(state.filter);
    state.items = response.items;
    state.summary = response.summary;
    state.source = "api";
    state.status = "Synced";
  } catch {
    const fallbackItems = filterLocalItems(state.filter);
    state.items = fallbackItems;
    state.summary = getRoadmapSummary(fallbackItems);
    state.source = "fallback";
    state.status = "Local";
  }

  if (!state.items.some((item) => item.id === state.selectedId)) {
    state.selectedId = state.items[0]?.id ?? roadmapItems[0]?.id ?? "";
  }

  renderApp();
}

async function fetchRoadmap(filter: Filter): Promise<RoadmapResponse> {
  const path = filter === "all" ? "/api/roadmap" : `/api/roadmap?difficulty=${encodeURIComponent(filter)}`;
  const response = await fetch(path);
  const payload = (await response.json()) as unknown;

  if (!response.ok || !isRoadmapResponse(payload)) {
    throw new Error("Roadmap API unavailable");
  }

  return payload;
}

function renderApp(): void {
  renderSidebar();
  renderMetrics();
  renderSelectedLesson();
  updateStatus(state.status, state.source);
}

function renderSidebar(): void {
  const nav = requireElement<HTMLElement>("#chapterNav");
  nav.replaceChildren();

  state.items.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = item.id === state.selectedId ? "chapter-link active" : "chapter-link";
    button.type = "button";
    button.title = item.title;
    button.addEventListener("click", () => {
      state.selectedId = item.id;
      renderApp();
    });

    const icon = document.createElement("span");
    icon.className = "chapter-icon";
    icon.textContent = String(index + 1).padStart(2, "0");

    const label = document.createElement("span");
    label.className = "chapter-label";
    label.innerHTML = `<strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.difficulty)} · ${item.minutes} min</small>`;

    button.append(icon, label);
    nav.append(button);
  });
}

function renderMetrics(): void {
  const strip = requireElement<HTMLElement>("#metricStrip");
  const metrics = [
    ["Complete", `${state.summary.completedItems}/${state.summary.totalItems}`],
    ["Progress", `${state.summary.completionPercent}%`],
    ["Study Time", `${state.summary.totalMinutes} min`],
    ["Mode", state.source === "api" ? "API synced" : "Local data"],
  ] as const;

  strip.replaceChildren(
    ...metrics.map(([label, value]) => {
      const node = document.createElement("article");
      node.className = "workspace-metric";
      node.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      return node;
    }),
  );
}

function renderSelectedLesson(): void {
  const selected = state.items.find((item) => item.id === state.selectedId) ?? state.items[0] ?? roadmapItems[0];
  if (!selected) return;

  const asset = lessonAssets[selected.id] ?? {
    code: "// Lesson source is not wired yet.",
    readme: `# ${selected.title}\n\n${selected.description}`,
  };

  requireElement("#workspaceTitle").textContent = selected.title;
  requireElement("#lessonKicker").innerHTML = `
    <span>${escapeHtml(selected.difficulty)}</span>
    <span>${escapeHtml(selected.command)}</span>
    <span>${escapeHtml(selected.folder)}</span>
  `;
  requireElement("#lessonReadme").replaceChildren(...markdownToNodes(asset.readme));
  requireElement("#lessonCode").textContent = asset.code.trim();
  requireElement("#codePath").textContent = selected.folder;
}

function toggleSidebar(): void {
  state.sidebarMode = state.sidebarMode === "expanded" ? "collapsed" : "expanded";
  requireElement<HTMLElement>(".workspace-shell").dataset.sidebar = state.sidebarMode;
  requireElement<HTMLButtonElement>("#sidebarToggle").setAttribute("aria-pressed", String(state.sidebarMode === "collapsed"));
}

async function copySelectedCommand(): Promise<void> {
  const selected = state.items.find((item) => item.id === state.selectedId);
  if (!selected) return;

  await navigator.clipboard?.writeText(selected.command);
  const button = requireElement<HTMLButtonElement>("#copyCommandButton");
  button.textContent = "Copied";
  window.setTimeout(() => {
    button.textContent = "Copy run command";
  }, 1200);
}

function filterLocalItems(filter: Filter): RoadmapItem[] {
  if (filter === "all") return [...roadmapItems];
  return roadmapItems.filter((item) => item.difficulty === filter);
}

function updateStatus(message: string, source: UiState["source"]): void {
  state.status = message;
  state.source = source;

  const shell = requireElement<HTMLElement>(".workspace-shell");
  shell.dataset.source = source;
  requireElement("#syncText").textContent = message;
}

function markdownToNodes(markdown: string): Node[] {
  const nodes: Node[] = [];
  const lines = markdown.trim().split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index]?.startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      if (language) code.dataset.language = language;
      code.textContent = codeLines.join("\n");
      pre.append(code);
      nodes.push(pre);
      continue;
    }

    if (line.startsWith("# ")) {
      const h2 = document.createElement("h2");
      h2.textContent = line.slice(2);
      nodes.push(h2);
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const h3 = document.createElement("h3");
      h3.textContent = line.slice(3);
      nodes.push(h3);
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const list = document.createElement("ul");
      while (index < lines.length && lines[index]?.startsWith("- ")) {
        const item = document.createElement("li");
        item.textContent = (lines[index] ?? "").slice(2);
        list.append(item);
        index += 1;
      }
      nodes.push(list);
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index]?.trim() &&
      !lines[index]?.startsWith("#") &&
      !lines[index]?.startsWith("- ") &&
      !lines[index]?.startsWith("```")
    ) {
      paragraphLines.push((lines[index] ?? "").trim());
      index += 1;
    }

    const paragraph = document.createElement("p");
    paragraph.textContent = paragraphLines.join(" ");
    nodes.push(paragraph);
  }

  return nodes;
}

function isRoadmapResponse(value: unknown): value is RoadmapResponse {
  if (!value || typeof value !== "object") return false;

  const candidate = value as RoadmapResponse;
  return Array.isArray(candidate.items) && candidate.items.every(isRoadmapItem) && isRoadmapSummary(candidate.summary);
}

function isRoadmapItem(value: unknown): value is RoadmapItem {
  if (!value || typeof value !== "object") return false;

  const candidate = value as RoadmapItem;
  return (
    typeof candidate.command === "string" &&
    typeof candidate.folder === "string" &&
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    isDifficulty(candidate.difficulty) &&
    typeof candidate.minutes === "number" &&
    Number.isFinite(candidate.minutes) &&
    ["todo", "doing", "done"].includes(candidate.status) &&
    Array.isArray(candidate.topics) &&
    candidate.topics.every((topic) => typeof topic === "string")
  );
}

function isRoadmapSummary(value: unknown): value is RoadmapSummary {
  if (!value || typeof value !== "object") return false;

  const candidate = value as RoadmapSummary;
  return (
    typeof candidate.completedItems === "number" &&
    typeof candidate.completionPercent === "number" &&
    typeof candidate.totalItems === "number" &&
    typeof candidate.totalMinutes === "number"
  );
}

function formatFilter(filter: Filter): string {
  if (filter === "all") return "All";
  return `${filter[0]?.toUpperCase() ?? ""}${filter.slice(1)}`;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}
