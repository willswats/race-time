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

// const CACHE = 'race-time';
// const CACHEABLE = [
//   './',
//   './sw.js',
//   './register-sw.js',
//   './index.html',
//   './manifest.json',
//   './race-results/index.html',
//   './components/race-timer.js',
//   './components/race-results.js',
// ];

/* Prepare and populate a cache. */
// async function prepareCache() {
//   const c = await caches.open(CACHE);
//   await c.addAll(CACHEABLE);
//   console.log('Cache prepared.');
// }

// install the event listener so it can run in the background.
// self.addEventListener('install', prepareCache);
// self.addEventListener('fetch', interceptFetch);
console.log('Service Worker that logs fetch events is now running.');

async function interceptFetch(evt) {
  console.log(evt.request.method, evt.request.url);
  return await fetch(evt.request);
}

self.addEventListener('fetch', interceptFetch);
