import {
  difficulties,
  getRoadmapSummary,
  isDifficulty,
  roadmapItems,
  type Difficulty,
  type RoadmapItem,
  type RoadmapSummary,
} from "../../../src/shared/roadmap";
import "./styles.css";

type Filter = Difficulty | "all";

type RoadmapResponse = {
  items: RoadmapItem[];
  summary: RoadmapSummary;
};

type UiState = {
  filter: Filter;
  source: "api" | "fallback";
  status: string;
};

const state: UiState = {
  filter: "all",
  source: "api",
  status: "Loading roadmap...",
};

const app = requireElement<HTMLDivElement>("#app");

renderShell();
void refreshRoadmap();

function renderShell(): void {
  app.innerHTML = `
    <main class="app-shell">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <img class="hero-mark" src="/typescript-mark.svg" alt="" />
          <p class="eyebrow">Zero to hero TypeScript</p>
          <h1 id="page-title">A typed roadmap from hello world to API-backed UI.</h1>
          <p class="lede">
            Run the lessons, inspect the shared domain model, then watch the frontend and API agree on the same types.
          </p>
        </div>
        <aside class="status-panel" aria-live="polite">
          <span class="status-dot"></span>
          <strong id="statusText">Loading roadmap...</strong>
          <p id="sourceText">Waiting for the local API.</p>
        </aside>
      </section>

      <section class="toolbar" aria-label="Roadmap controls">
        <div class="filters" id="filters"></div>
        <button class="refresh-button" id="refreshButton" type="button">Refresh API</button>
      </section>

      <section class="summary-grid" id="summaryGrid" aria-label="Roadmap summary"></section>
      <section class="roadmap-grid" id="roadmapGrid" aria-label="Roadmap lessons"></section>
    </main>
  `;

  renderFilters();
  requireElement<HTMLButtonElement>("#refreshButton").addEventListener("click", () => {
    void refreshRoadmap();
  });
}

function renderFilters(): void {
  const filters = requireElement<HTMLDivElement>("#filters");
  filters.replaceChildren();

  const allFilters: readonly Filter[] = ["all", ...difficulties];
  allFilters.forEach((filter) => {
    const button = document.createElement("button");
    button.className = filter === state.filter ? "filter active" : "filter";
    button.textContent = formatFilter(filter);
    button.type = "button";
    button.addEventListener("click", () => {
      state.filter = filter;
      renderFilters();
      void refreshRoadmap();
    });
    filters.append(button);
  });
}

async function refreshRoadmap(): Promise<void> {
  updateStatus("Loading roadmap...", "api");

  try {
    const response = await fetchRoadmap(state.filter);
    updateStatus("Loaded from local API.", "api");
    renderSummary(response.summary);
    renderRoadmap(response.items);
  } catch (error) {
    const fallbackItems = filterLocalItems(state.filter);
    updateStatus(error instanceof Error ? error.message : "API unavailable. Showing local data.", "fallback");
    renderSummary(getRoadmapSummary(fallbackItems));
    renderRoadmap(fallbackItems);
  }
}

async function fetchRoadmap(filter: Filter): Promise<RoadmapResponse> {
  const path = filter === "all" ? "/api/roadmap" : `/api/roadmap?difficulty=${encodeURIComponent(filter)}`;
  const response = await fetch(path);
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error(readApiError(payload));
  }

  if (!isRoadmapResponse(payload)) {
    throw new Error("API returned an unexpected roadmap shape. Showing local data.");
  }

  return payload;
}

function renderSummary(summary: RoadmapSummary): void {
  const grid = requireElement<HTMLElement>("#summaryGrid");
  const metrics = [
    ["Complete", `${summary.completedItems}/${summary.totalItems}`],
    ["Progress", `${summary.completionPercent}%`],
    ["Study Time", `${summary.totalMinutes} min`],
  ] as const;

  grid.replaceChildren(
    ...metrics.map(([label, value]) => {
      const card = document.createElement("article");
      card.className = "metric-card";
      card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      return card;
    }),
  );
}

function renderRoadmap(items: readonly RoadmapItem[]): void {
  const grid = requireElement<HTMLElement>("#roadmapGrid");
  grid.replaceChildren();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = `lesson-card ${item.status}`;

    const topics = document.createElement("ul");
    topics.className = "topic-list";
    item.topics.forEach((topic) => {
      const node = document.createElement("li");
      node.textContent = topic;
      topics.append(node);
    });

    article.innerHTML = `
      <div class="card-head">
        <span class="difficulty">${item.difficulty}</span>
        <span class="minutes">${item.minutes} min</span>
      </div>
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <span class="status-badge">${item.status}</span>
    `;
    article.append(topics);
    grid.append(article);
  });
}

function filterLocalItems(filter: Filter): RoadmapItem[] {
  if (filter === "all") return [...roadmapItems];
  return roadmapItems.filter((item) => item.difficulty === filter);
}

function updateStatus(message: string, source: UiState["source"]): void {
  state.status = message;
  state.source = source;

  requireElement("#statusText").textContent = message;
  requireElement("#sourceText").textContent =
    source === "api" ? "The browser is using live API data." : "The browser is using bundled fallback data.";
  app.dataset.source = source;
}

function readApiError(payload: unknown): string {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return "API request failed. Showing local data.";
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

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}

