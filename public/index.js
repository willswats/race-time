const ui = {};

function getHandles() {
  ui.nav = document.querySelector('nav');
  ui.main = document.querySelector('main');
}

function setupNavButtons() {
  const buttons = ui.nav.querySelectorAll('button');
  for (const button of buttons) {
    button.addEventListener('click', () =>
      changeContent(button.dataset.screen),
    );
  }
}

async function fetchScreenContent(screen) {
  const url = `/screens/${screen}.inc`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.text();
  } else {
    return `sorry, a ${response.status} error ocurred retrieving section data for: <code>${url}</code>`;
  }
}

async function populateContent(screen) {
  const content = await fetchScreenContent(screen);
  const article = document.createElement('article');
  article.dataset.screen = screen;
  article.innerHTML = content;
  ui.article = article;
  ui.main.append(article);
}

export function changeContent(screen) {
  if (ui.article.dataset.screen !== screen) {
    ui.main.removeChild(ui.article);
    storeState(screen);
    populateContent(screen);
  }
}

function loadScreen() {
  const path = readPath();
  // Remove previous article if it exists
  if (ui.article && ui.article.dataset.screen !== path) {
    ui.main.removeChild(ui.article);
  }
  populateContent(path);
}

function storeState(screen) {
  history.pushState(null, null, `/app/${screen}`);
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
  setupNavButtons();
  // this event listener is needed so that loadScreen
  // will run when the user presses the forward and
  // back buttons on the browser
  window.addEventListener('popstate', loadScreen);
  loadScreen();
}

main();
