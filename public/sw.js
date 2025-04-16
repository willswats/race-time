async function interceptFetch(evt) {
  console.log(evt.request.method, evt.request.url);
  return await fetch(evt.request);
}

const CACHE = 'race-time';
const CACHEABLE = [
  './',
  './sw.js',
  './register-sw.js',
  './index.html',
  './race-results/index.html',
  './components/race-timer.js',
  './components/race-results.js',
];

/* Prepare and populate a cache. */
async function prepareCache() {
  const c = await caches.open(CACHE);
  await c.addAll(CACHEABLE);
  console.log('Cache prepared.');
}

// install the event listener so it can run in the background.
self.addEventListener('install', prepareCache);
self.addEventListener('fetch', interceptFetch);
