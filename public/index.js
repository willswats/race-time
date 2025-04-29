const pages = [
  {
    screen: 'home',
    title: 'Home',
  },
  {
    screen: 'race-results',
    title: 'Race Results',
  },
];

const ui = {};

const templates = {};

const getHandles = () => {
  ui.screens = {};
  ui.mainnav = document.querySelector('header > nav');
  ui.main = document.querySelector('main');
  ui.getScreens = () => Object.values(ui.screens);
  ui.getButtons = () => Object.values(ui.buttons);
  templates.screen = document.querySelector('#tmp-screen');
};

function buildScreens() {
  const template = templates.screen;
  for (const page of pages) {
    // by default we get a document fragment containing our <section>, so
    // we have to ask for its firstElementChild.
    // Not intuitive, but there you go
    const section = template.content.cloneNode(true).firstElementChild;

    section.dataset.id = `sect-${page.screen}`;
    section.dataset.name = page.screen;

    ui.main.append(section);
    // store this screen in the ui global for eas(ier) access later.
    ui.screens[page.screen] = section;
  }
}

function setupNav() {
  ui.buttons = {};
  for (const page of pages) {
    if (page.screen === 'error') {
      continue;
    }
    const button = document.createElement('button');
    button.textContent = page.title;
    button.dataset.screen = page.screen;
    button.addEventListener('click', show);
    button.addEventListener('click', storeState);
    ui.mainnav.append(button);
    ui.buttons[page.screen] = button;
  }
}

async function fetchScreenContent(s) {
  const url = `/screens/${s}.inc`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.text();
  } else {
    return `sorry, a ${response.status} error ocurred retrieving section data for: <code>${url}</code>`;
  }
}

async function getContent() {
  for (const page of pages) {
    const content = await fetchScreenContent(page.screen);
    const article = document.createElement('article');
    article.innerHTML = content;
    ui.screens[page.screen].append(article);
  }
}

function hideAllScreens() {
  for (const screen of ui.getScreens()) {
    hideElement(screen);
  }
}
/*
 Enable all the header nav buttons
*/
function enableAllButtons() {
  for (const button of ui.getButtons()) {
    button.removeAttribute('disabled');
  }
}

function show(event) {
  // ui.previous is used after one of the buttons on the login screen
  // is pressed to return the user to where they were.
  ui.previous = ui.current;
  const screen = event?.target?.dataset?.screen ?? 'home';
  showScreen(screen);
}

function showScreen(name) {
  hideAllScreens();
  enableAllButtons();
  if (!ui.screens[name]) {
    name = 'error';
  }
  showElement(ui.screens[name]);
  // store the current application state (i.e. which screen is currently showing)
  // used by storeState() to push this onto the browser's history stack
  ui.current = name;
  document.title = `Race Time | ${name}`;
  if (name !== 'error') {
    ui.buttons[name].disabled = 'disabled';
  }
}

function storeState() {
  history.pushState(ui.current, ui.current, `/${ui.current}`);
}

function readPath() {
  const path = window.location.pathname.slice(5);
  if (path) {
    return path;
  }
  return 'home';
}

function showElement(e) {
  e.classList.remove('hidden');
}

function hideElement(e) {
  e.classList.add('hidden');
}

function loadInitialScreen() {
  ui.current = readPath();
  showScreen(ui.current);
}

const main = async () => {
  getHandles();
  buildScreens();
  setupNav();
  await getContent();
  window.addEventListener('popstate', loadInitialScreen);
  loadInitialScreen();
};

main();
