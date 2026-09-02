# novapace Clip — Patienten-App

Die Web-Bluetooth-App für den novapace Clip, ausgeliefert über GitHub Pages:

**https://novapace.github.io/clip-app/**

Dieses Repo enthält nur die App. Firmware, Auswerte-Tools und die
Entwicklungs-App liegen im Firmware-Repo `novapace/sole_hardware_clip_P4`;
`index.html` ist eine Kopie von dessen `tools/client_app.html` (siehe
*Abgleich* weiter unten).

## Warum GitHub Pages

Web Bluetooth gibt es nur in Chromium-Browsern und nur in einem **Secure
Context**. Pages liefert über `https://` aus — damit ist die Bedingung ohne
Tunnel, Zertifikat oder Port-Forwarding erfüllt, und das Telefon braucht zum
Öffnen nichts als die URL.

## Voraussetzungen am Telefon

- **Chrome für Android** (oder Edge). **iOS geht nicht** — Safari hat kein Web
  Bluetooth, und Chrome unter iOS ist Safari darunter.
- Bluetooth an, und für Chrome die Berechtigung **„Geräte in der Nähe"**
  (Android 12+) bzw. **Standort** darunter. Fehlt sie, findet der Scan stumm
  nichts.
- Clip einschalten und **~21 s warten** — vorher advertisiert er nicht.
- Der Clip darf nicht schon mit einem anderen Gerät oder einem zweiten
  offenen Tab verbunden sein.

Über das Chrome-Menü **„Zum Startbildschirm hinzufügen"** wird die Seite zur
installierten App und startet danach auch ohne Netz.

## Was hier nicht passiert

Die Seite ist statisch: kein Backend, kein Analytics, kein externes Skript,
kein `fetch` nach draußen. Alles, was vom Clip kommt, bleibt im Browser des
Telefons; der Aktivitätsverlauf liegt im `localStorage` unter
`novapace.activity` und geht mit den Browserdaten verloren.

Der Verlauf hängt am **Origin**: Was unter `file://` oder `http://localhost`
gesammelt wurde, ist hier nicht sichtbar und umgekehrt. Für eine Testreihe bei
einem Weg bleiben.

Das Repo ist öffentlich, damit Pages ohne bezahlten Plan ausliefert — die
veröffentlichte Seite ist damit für jeden erreichbar, der die URL hat. Es
gehören deshalb **keine Patientendaten und keine Zugangsdaten** hier hinein,
und die Entwicklungs-App (`tools/development_app.html`) bleibt im Firmware-Repo:
sie ist ein Werkzeug für die Werkbank, nicht für Patienten
(`docs/SECURITY_CONCEPT.md`, § L5).

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | die App — Kopie von `tools/client_app.html` plus zwei markierte Blöcke |
| `novapace_logo_horizontal_green_F1uoio.png` | Logo in der Kopfzeile |
| `manifest.webmanifest` | macht die Seite installierbar (Name, Icons, Farben) |
| `sw.js` | Service Worker: Offline-Start |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Icons für den Startbildschirm |
| `.nojekyll` | schaltet die Jekyll-Verarbeitung von Pages ab |

## Abgleich mit dem Firmware-Repo

`index.html` unterscheidet sich von `tools/client_app.html` in **genau zwei
Blöcken**, beide im Quelltext als solche kommentiert: die Manifest- und
Icon-Zeilen am Ende von `<head>` und die Service-Worker-Registrierung am Ende
von `<body>`. Bei einer neuen Fassung also: Datei kopieren, die zwei Blöcke
wieder einsetzen — und **`CACHE` in `sw.js` hochzählen**, sonst bleiben bereits
installierte Telefone auf der alten Fassung stehen.

## Deployment

Pages liefert den Stand von `main` aus dem Wurzelverzeichnis aus
(*Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`*). Ein
`git push` auf `main` ist die Veröffentlichung; nach ein bis zwei Minuten steht
die neue Fassung.
