const CACHE = "muse-aleatoire-v1";
const FICHIERS = ["index.html", "styles.css", "app.js", "data.js", "icon.svg", "manifest.webmanifest"];

self.addEventListener("install", (evenement) => {
  evenement.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FICHIERS)));
  self.skipWaiting();
});

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(cles.filter((cle) => cle !== CACHE).map((cle) => caches.delete(cle)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evenement) => {
  if (evenement.request.method !== "GET") return;
  evenement.respondWith(
    caches.match(evenement.request).then((cache) => cache || fetch(evenement.request))
  );
});
