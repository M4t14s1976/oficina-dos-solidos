/* Oficina dos Sólidos — offline 1.0, 2026-10-25 */
const CACHE="oficina-dos-solidos-v1.0-pwa-20261025-3";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icons/favicon-64.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/apple-touch-icon.png","./icons/oficina-logo.svg"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(Promise.all([
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("oficina-dos-solidos-")&&k!==CACHE).map(k=>caches.delete(k)))),
 self.clients.claim()
 ]));
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(event.request.mode==="navigate"){
   event.respondWith(fetch(event.request).then(response=>{
     if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put("./index.html",copy)));}
     return response;
   }).catch(async()=>await caches.match("./index.html")||Response.error()));
 }else{
   event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
 }
});