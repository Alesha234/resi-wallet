const CACHE="resi-wallet-v2";
const FILES=["./","index.html","qrcode.js","manifest.webmanifest","favicon.svg","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
  }else if(u.hostname.endsWith("fonts.googleapis.com")||u.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res;})));
  }
});
