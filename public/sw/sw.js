var cacheName = 'v3'//取一個自己想要的變數名稱

self.addEventListener("install", function (event) {//addEventListener() 方法用于向文档添加事件
    var urlToCache = ['/sw/sw.html']
    event.waitUntil(//event事件物件,waitUntil方法
        //建立或開啟名稱為v1的cache storage
        caches.open(cacheName).then(function (cache) {//caches內建物件
            //將所有的靜態網頁儲存到此storage中
            return cache.addAll(urlToCache);//陣列所有資訊addAll都給他cache進去
        })
    )
})

self.addEventListener('fetch', function (event) {
    event.respondWith(
        //瀏覽的是sw.html,event.request => sw.html
        //到cache storage 比對有沒有sw.html
        //會將比對到網頁傳給response這個參數
        caches.match(event.request).then(function (response) {//match比對
            //response表示比對到的網頁
            if (response) {
                return response;//如果為true就直接回傳這個網頁
            }
            //如果比對不到就透過fetch()
            return fetch(event.request)//重新到Server上要求此網頁
        })
    )
})

//刪除舊的cache storage
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.map(function (name) {//最後回應再做回傳(map陣列中使用的方法)
                //name => v1
                if (name != cacheName) {//cacheName現在是v2
                    return caches.delete(name)
                }
            }))
        })
    )
})