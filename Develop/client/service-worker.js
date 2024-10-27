import { warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

// Precache the files specified in the manifest
precacheAndRoute(self.__WB_MANIFEST);

// Set up a page cache
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
    }),
  ],
});

// Warm up the cache with specified URLs
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Cache navigational requests (HTML pages)
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Asset caching for JS, CSS, and images
registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60, // Maximum number of files
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
);