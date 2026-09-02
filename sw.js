// Service Worker für die novapace-Patienten-App.
//
// Zweck ist allein die Offline-Fähigkeit: einmal geladen, startet die App auch
// ohne Netz. Mit dem Clip spricht sie über Web Bluetooth, daran hat der Worker
// keinen Anteil — er sieht ausschließlich die statischen Dateien dieser Seite.
//
// WICHTIG: Bei jeder Änderung an index.html oder den Assets CACHE hochzählen.
// Der alte Cache wird beim activate gelöscht; ohne neuen Namen bliebe eine
// bereits installierte App auf ihrer alten Fassung stehen.
const CACHE = 'novapace-clip-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './novapace_logo_horizontal_green_F1uoio.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  // skipWaiting: eine neue Fassung soll nicht erst warten, bis der Patient alle
  // Tabs geschlossen hat.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Seitenaufrufe: erst Netz, dann Cache. So bekommt ein Telefon mit Empfang
  // immer die aktuelle App, und nur ohne Empfang die zuletzt gespeicherte.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Alles andere (Logo, Icons, Manifest): erst Cache, das spart Ladezeit; was
  // fehlt, wird geholt und für das nächste Mal abgelegt.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
