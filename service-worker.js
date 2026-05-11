// Service Worker for Expense Tracker PWA
const CACHE_NAME = 'expense-tracker-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/style.css',
    './assets/js/db.js',
    './assets/js/utils.js',
    './assets/js/ui.js',
    './assets/js/charts.js',
    './assets/js/app.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff2',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Cache failed:', error);
            })
    );
    
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return from cache if available
                if (response) {
                    return response;
                }

                // Try network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache successful responses
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Offline fallback
                        console.warn('Fetch failed, serving from cache or offline page');
                        
                        // Try to return a cached version
                        return caches.match(event.request)
                            .then((cachedResponse) => {
                                return cachedResponse || new Response('Offline - please check your connection', {
                                    status: 503,
                                    statusText: 'Service Unavailable',
                                    headers: new Headers({
                                        'Content-Type': 'text/plain'
                                    })
                                });
                            });
                    });
            })
    );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        caches.open(CACHE_NAME)
            .then((cache) => {
                cache.addAll(event.data.urls);
                event.ports[0].postMessage({ success: true });
            })
            .catch((error) => {
                event.ports[0].postMessage({ success: false, error: error.message });
            });
    }
});

// Background sync event (future feature)
self.addEventListener('sync', (event) => {
    console.log('Background sync event:', event.tag);
    
    if (event.tag === 'sync-expenses') {
        event.waitUntil(
            // Implement background sync logic here
            Promise.resolve()
        );
    }
});

// Push notification event (future feature)
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event.data);
    
    const notificationData = event.data ? event.data.json() : {};
    const notification = new Notification('Expense Tracker', {
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23667eea" width="192" height="192"/><text x="50%" y="50%" font-size="120" fill="white" text-anchor="middle" dy=".3em">💰</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23667eea" width="192" height="192"/><text x="50%" y="50%" font-size="120" fill="white" text-anchor="middle" dy=".3em">💰</text></svg>',
        ...notificationData
    });
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification.title);
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Periodic background sync (future feature - requires periodic-background-sync permission)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-expenses') {
        event.waitUntil(
            // Implement periodic sync logic here
            Promise.resolve()
        );
    }
});

console.log('Service Worker loaded');
