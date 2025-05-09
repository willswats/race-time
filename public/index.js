import { showElement, hideElement } from './utils.js';

const pages = [
  {
    screen: 'home',
    title: 'Home',
  },
  {
    screen: 'race-results',
    title: 'Race Results',
  },
  {
    screen: 'race-result',
    title: 'Race Result',
  },
  {
    screen: 'error',
    title: 'Error',
  },
];

const ui = {};
const templates = {};

// Set up handles for use later
function getHandles() {
  ui.screens = {};
  ui.nav = document.querySelector('nav');
  ui.main = document.querySelector('main');
  ui.getScreens = () => Object.values(ui.screens);
  templates.screen = document.querySelector('#tmp-screen');
}

// Create section elements and append them to main
// Add to ui.screens for use later
function buildScreen(template, screen) {
  const section = template.content.cloneNode(true).firstElementChild;
  section.dataset.name = screen;
  ui.main.append(section);
  ui.screens[screen] = section;
}

// Execute for all pages
function buildScreens() {
  const template = templates.screen;
  for (const page of pages) {
    buildScreen(template, page.screen);
  }
}

// Add event listeners to nav buttons
function setupNavButtons() {
  const buttons = ui.nav.querySelectorAll('button');
  for (const button of buttons) {
    if (button.dataset.screen === 'race-results') {
      // The race-results button needs to be able to refresh its data in case a user submits new data
      addEventListenersChangeContentButtonRefresh(button);
    } else {
      addEventListenersChangeContentButton(button);
    }
  }
}

// Fetch content from public/screens
async function fetchScreenContent(screen) {
  const url = `/screens/${screen}.inc`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.text();
  } else {
    return `sorry, a ${response.status} error ocurred retrieving section data for: <code>${url}</code>`;
  }
}

// Fetch content and put it into an article
// Add the article to the ui.screens section (buildScreen)
async function getContent(screen) {
  const content = await fetchScreenContent(screen);
  const article = document.createElement('article');
  article.innerHTML = content;
  ui.screens[screen].append(article);
}

// Execute for all pages
function getPageContent() {
  for (const page of pages) {
    getContent(page.screen);
  }
}

function addEventListenersChangeContentButton(button) {
  button.addEventListener('click', show);
  button.addEventListener('click', storeState);
}

// For buttons that require a content refresh
export function addEventListenersChangeContentButtonRefresh(button) {
  button.addEventListener('click', refreshContent);
  addEventListenersChangeContentButton(button);
}

// Remove element from <main>
// Delete the element in ui.screens
// Refresh the screen by running getContent and buildScreen for it
function refreshContent(event) {
  const screen = event?.target?.dataset?.screen;
  if (screen) {
    ui.main.removeChild(ui.screens[screen]);
    delete ui.screens[screen];

    getContent(screen);
    buildScreen(templates.screen, screen);
  }
}

function show(event) {
  const screen = event?.target?.dataset?.screen ?? 'home';
  showScreen(screen);
}

function showScreen(screen) {
  hideAllScreens();

  if (!ui.screens[screen]) {
    screen = 'error';
  }

  ui.current = screen;
  document.title = `Race Time | ${screen}`;
  showElement(ui.screens[screen]);
}

function loadScreen() {
  ui.current = readPath();
  showScreen(ui.current);
}

function storeState() {
  history.pushState(null, null, `/app/${ui.current}`);
}

function hideAllScreens() {
  for (const screen of ui.getScreens()) {
    hideElement(screen);
  }
}

function readPath() {
  const path = window.location.pathname.slice(5);
  if (path) {
    return path;
  }
  return 'home';
}

function main() {
  getHandles();
  getPageContent();
  buildScreens();
  setupNavButtons();
  // this event listener is needed so that loadScreen
  // will run when the user presses the forward and
  // back buttons on the browser
  window.addEventListener('popstate', loadScreen);
  loadScreen();
}

main();
