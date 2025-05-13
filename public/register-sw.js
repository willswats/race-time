async function registerServiceWorker() {
  if (navigator.serviceWorker) {
    await navigator.serviceWorker.register('/sw.js');
  }
}

window.addEventListener('load', registerServiceWorker);
