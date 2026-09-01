const CACHE_NAME='pf-v1';
const ASSETS=['/','/index.html','/manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,c));return res}).catch(()=>caches.match('/index.html'))))});
self.addEventListener('push',e=>{const d=e.data?e.data.json():{};e.waitUntil(self.registration.showNotification(d.title||'Pixel Forge',{body:d.body||'New notification!',icon:'/icons/icon-192.png'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('/'))});
