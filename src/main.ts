import { ALL_TRACKS, formatRun, lessons, lessonsForTrack, tracks, type Lesson, type TrackFilter } from "./course";
import "./styles.css";

type AppState = {
  filter: TrackFilter;
  selectedId: string;
  railOpen: boolean;
  terminal: string;
};

const state: AppState = {
  filter: ALL_TRACKS,
  selectedId: lessons[0]?.id ?? "",
  railOpen: true,
  terminal: "Ready. Choose a chapter and press Run.",
};

const app = requireElement<HTMLDivElement>("#app");
const trackOptions: readonly TrackFilter[] = [ALL_TRACKS, ...tracks];

render();

function render(): void {
  const visibleLessons = lessonsForTrack(state.filter);
  const selected = getSelectedLesson(visibleLessons);

  app.innerHTML = `
    <main class="shell ${state.railOpen ? "" : "rail-closed"}">
      <aside class="rail" aria-label="Lesson navigation">
        <div class="traffic" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="brand">
          <span class="brand-icon">TS</span>
          <span class="brand-label"><strong>TypeScript</strong><small>from zero to hero</small></span>
        </div>
        <button class="icon-button rail-button" type="button" data-action="toggle-rail" aria-label="Toggle sidebar">
          <span></span>
        </button>
        <nav class="chapters">
          ${visibleLessons.map((lesson) => renderChapterButton(lesson)).join("")}
        </nav>
      </aside>

      <section class="workspace">
        <header class="toolbar">
          <div class="path"><span>typescript-demo</span><strong>${escapeHtml(selected.title)}</strong></div>
          <nav class="track-tabs" aria-label="Track filters">
            ${trackOptions.map((track) => renderTrackButton(track)).join("")}
          </nav>
        </header>

        <section class="content">
          <article class="lesson">
            <div class="lesson-meta">
              <span>${escapeHtml(selected.chapter)}</span>
              <span>${escapeHtml(selected.track)}</span>
            </div>
            <div class="title-row">
              <div>
                <h1>${escapeHtml(selected.title)}</h1>
                <p>${escapeHtml(selected.summary)}</p>
              </div>
              <button class="run-button" type="button" data-action="run">Run</button>
            </div>
            <div class="goals" aria-label="Lesson goals">
              ${selected.goals.map((goal) => `<span>${escapeHtml(goal)}</span>`).join("")}
            </div>
            <section class="terminal" aria-live="polite">
              <div><span>Terminal</span><strong>${escapeHtml(selected.command)}</strong></div>
              <pre>${escapeHtml(state.terminal)}</pre>
            </section>
          </article>

          <aside class="editor" aria-label="Lesson source code">
            <div class="editor-bar">
              <span>${escapeHtml(selected.command)}</span>
              <button type="button" data-action="copy">Copy</button>
            </div>
            <pre><code>${escapeHtml(selected.source)}</code></pre>
          </aside>
        </section>
      </section>
    </main>
  `;

  bindActions();
}

function bindActions(): void {
  document.querySelector<HTMLButtonElement>("[data-action='toggle-rail']")?.addEventListener("click", () => {
    state.railOpen = !state.railOpen;
    render();
  });

  document.querySelector<HTMLButtonElement>("[data-action='run']")?.addEventListener("click", () => {
    state.terminal = formatRun(getSelectedLesson(lessonsForTrack(state.filter)));
    render();
  });

  document.querySelector<HTMLButtonElement>("[data-action='copy']")?.addEventListener("click", () => {
    void copySelectedCommand();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-lesson-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.lessonId;
      if (!id) return;
      state.selectedId = id;
      state.terminal = "Ready. Choose a chapter and press Run.";
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-track]").forEach((button) => {
    button.addEventListener("click", () => {
      const track = button.dataset.track;
      if (!track || !isTrackFilter(track)) return;
      const visibleLessons = lessonsForTrack(track);
      state.filter = track;
      state.selectedId = visibleLessons[0]?.id ?? lessons[0]?.id ?? "";
      state.terminal = "Ready. Choose a chapter and press Run.";
      render();
    });
  });
}

async function copySelectedCommand(): Promise<void> {
  const selected = getSelectedLesson(lessonsForTrack(state.filter));

  if (!navigator.clipboard) {
    state.terminal = selected.command;
    render();
    return;
  }

  await navigator.clipboard.writeText(selected.command);
  state.terminal = `Copied ${selected.command}`;
  render();
}

function getSelectedLesson(visibleLessons: readonly Lesson[]): Lesson {
  return visibleLessons.find((lesson) => lesson.id === state.selectedId) ?? visibleLessons[0] ?? lessons[0]!;
}

function renderChapterButton(lesson: Lesson): string {
  const activeClass = lesson.id === state.selectedId ? "active" : "";
  return `
    <button class="chapter ${activeClass}" type="button" data-lesson-id="${escapeHtml(lesson.id)}" title="${escapeHtml(lesson.title)}">
      <span class="chapter-number">${escapeHtml(lesson.chapter)}</span>
      <span class="chapter-copy"><strong>${escapeHtml(lesson.title)}</strong><small>${escapeHtml(lesson.track)}</small></span>
    </button>
  `;
}

function renderTrackButton(track: TrackFilter): string {
  const activeClass = track === state.filter ? "active" : "";
  return `<button class="${activeClass}" type="button" data-track="${escapeHtml(track)}">${escapeHtml(track)}</button>`;
}

function isTrackFilter(value: string): value is TrackFilter {
  return value === ALL_TRACKS || tracks.some((track) => track === value);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}
