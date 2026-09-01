const CACHE_NAME='pf-v2';
const ASSETS=['/','/index.html','/manifest.json','/offline.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>{console.log('Clearing old cache:',k);return caches.delete(k)}))).then(()=>self.clients.claim()))
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // Network first for documents, cache fallback
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,c));return res}).catch(()=>caches.match('/offline.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
