// 缓存名称
var cacheName = "sunbufu's blog 003";
// url 匹配规则
var siteRules = [/^http(s)?:\/\/[a-zA-Z]*(\.sunbufu\.)+[a-zA-Z]*/i];
// 缓存白名单
var cacheWhitelist = [
    'index.html',
    '404.html',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png'
];

// 注册事件
this.addEventListener('install', function (e) {
    console.log('cache event')
    // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('adding to cache:', cacheWhitelist)
            return cache.addAll(cacheWhitelist)
        })
    )
});

// 运行触发的事件(清除过期缓存)
this.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (name) {
                if (cacheName != name) {
                    return caches.delete(name);
                }
            }))
        })
    )
});

// 监听页面的请求。
// 只能缓存get请求。
this.addEventListener('fetch', function (e) {
    var request = e.request;
    request.url = request.url.replace('http://', 'https://')
    var url = request.url;
    // 页面，js，css等资源网络优先
    // 超时直接使用缓存。
    if (matchRules(url, [/.(js|css)(\?|#|$)/i]) && matchRules(url)) {
        e.respondWith(networkCacheRace(cacheName, request));
    }
    // 图片缓存
    else if (matchRules(url, [/.(png|jpg|jpeg|gif|webp)(\?|#|$)/i]) && matchRules(url)) {
        e.respondWith(cacheFirst(cacheName, request));
    }
});

// url匹配规则
function matchRules(url) {
    var match = false;
    for (var i = 0, reg; !match && (reg = siteRules[i]); ++i) {
        match = match || reg.test && reg.test(url);
    }
    return match;
}

// 网络优先
function netFirst(cacheName, request) {
    return fetch(request).then(function (response) {
        caches.open(cacheName).then(function (cache) {
            cache.put(request, response);
        });
        return response.clone();
    }).catch(function () {
        return caches.open(cacheName).then(function (cache) {
            return cache.match(request);
        });
    });
}

// 缓存优先
function cacheFirst(cacheName, request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (response) {
            var fetchServer = function () {
                return fetch(request).then(function (newResponse) {
                    cache.put(request, newResponse.clone());
                    return newResponse;
                });
            };
            if (response) {
                setTimeout(fetchServer, 1000);
                return response;
            } else {
                return fetchServer(true);
            }
        });
    })
}

// 网络好的时候使用（超时300ms使用缓存）
function networkCacheRace(cacheName, request) {
    var timeId, TIMEOUT = 300,
        options = {};

    return Promise.race([new Promise(function (resolve, reject) {
        timeId = setTimeout(function () {
            caches.open(cacheName).then(function (cache) {
                cache.match(request).then(function (response) {
                    if (response) {
                        resolve(response);
                    }
                });
            });
        }, TIMEOUT);
    }), fetch(request).then(function (response) {
        clearTimeout(timeId);
        caches.open(cacheName).then(function (cache) {
            cache.put(request, response);
        });
        return response.clone();
    }).catch(function () {
        clearTimeout(timeId);
        return caches.open(cacheName).then(function (cache) {
            return cache.match(request);
        });
    })]);
}