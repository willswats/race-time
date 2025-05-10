// function interceptFetch(evt) {
//   evt.respondWith(handleFetch(evt.request));
//   evt.waitUntil(updateCache(evt.request));
// }
//
// /* Retrieve a requested resource from the cache
//  * or return a resolved promise if its not there.
//  */
// async function handleFetch(request) {
//   const c = await caches.open(CACHE);
//   const cachedCopy = await c.match(request);
//   return cachedCopy || Promise.reject(new Error('no-match'));
// }
//
// /* Invoke the default fetch capability to
//  * pull a resource over the network and use
//  * that to update the cache.
//  */
// async function updateCache(request) {
//   const c = await caches.open(CACHE);
//   const response = await fetch(request);
//   console.log('Updating cache ', request.url);
//   return c.put(request, response);
// }

const CACHE = 'race-time';
const CACHEABLE = [
  './',
  './sw.js',
  './register-sw.js',
  './index.html',
  './index.js',
  './index.css',
  './home.css',
  './globals.css',
  './manifest.json',
  './components/race-timer.js',
  './components/race-timer.css',
  './components/race-results.js',
  './components/race-results.css',
  './components/race-result.js',
  './components/race-result.css',
  './components/race-record.js',
  './components/race-record.css',
  './components/role-drop-down.js',
  './components/role-drop-down.css',
  './components/custom-alert.js',
  './components/custom-alert.css',
];

/* Prepare and populate a cache. */
async function prepareCache() {
  const c = await caches.open(CACHE);
  await c.addAll(CACHEABLE);
  console.log('Cache prepared.');
}

// install the event listener so it can run in the background.
self.addEventListener('install', prepareCache);
// self.addEventListener('fetch', interceptFetch);
