// PayPlan v0.9.58. Offline shell only; no user data cached.
const CACHE='payplan-shell-v0958';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('payplan-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
if(e.request.mode==='navigate'||u.searchParams.has('pp_version_check')||u.searchParams.has('pp_reload')){e.respondWith(fetch(e.request).then(r=>{if(r.ok&&!u.searchParams.has('pp_version_check')){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return r}).catch(()=>caches.match('./index.html')));return}
e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));
});
