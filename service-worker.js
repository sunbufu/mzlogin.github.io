var cacheStorageKey = 'minimal-pwa-1'
var cacheList=[
    '/',
    'index.html',
    '/assets/vendor/primer-css/css/primer.css',
    '/assets/vendor/primer-markdown/dist/user-content.min.css',
    '/assets/vendor/octicons/octicons/octicons.css',
    '/assets/css/components/collection.css',
    '/assets/css/components/repo-card.css',
    '/assets/css/sections/repo-list.css'
]
self.addEventListener('install',e =>{
    e.waitUntil(
        caches.open(cacheStorageKey)
            .then(cache => cache.addAll(cacheList))
            .then(() => self.skipWaiting())
    )
})