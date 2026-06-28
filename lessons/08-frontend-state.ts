type ViewState = {
  selectedLesson: string;
  sidebarOpen: boolean;
};

const state: ViewState = {
  selectedLesson: "hello-world",
  sidebarOpen: true,
};

console.log(`${state.selectedLesson}:${state.sidebarOpen}`);
