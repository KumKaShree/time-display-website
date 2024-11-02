/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;
const FILES = `cache${version}`;
const ASSETS = `assets${version}`;

// Add list of files to cache here
const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);

worker.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(FILES)
            .then((cache) => cache.addAll(to_cache))
            .then(() => {
                worker.skipWaiting();
            })
    );
});

worker.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(async (keys) => {
                // delete old caches
                for (const key of keys) {
                    if (key !== FILES && key !== ASSETS) await caches.delete(key);
                }
            }),
            worker.clients.claim(),
        ])
    );
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
    const cache = await caches.open(ASSETS);

    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (err) {
        const response = await cache.match(request);
        if (response) return response;
        throw err;
    }
}

worker.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

    const url = new URL(event.request.url);
    const isHttp = url.protocol.startsWith('http');
    const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;
    const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
    const skipBecauseUncached = event.request.cache === 'only-if-cached' && !isStaticAsset;

    if (!isHttp || isDevServerRequest || skipBecauseUncached) return;

    event.respondWith(
        (async () => {
            // always serve static files and bundler-generated assets from cache
            if (isStaticAsset) {
                const response = await caches.match(event.request);
                if (response) return response;
            }

            // for everything else, try the network first, falling back to cache
            return fetchAndCache(event.request);
        })()
    );
}); 