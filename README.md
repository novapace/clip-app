# novapace Clip — Patienten-App

Die Web-Bluetooth-App für den novapace Clip:

**https://novapace.github.io/clip-app/**

> **Umzug auf `https://app.novapace.de/` ist vorbereitet, aber noch nicht
> aktiv.** Der Build erzeugt bereits eine `CNAME`-Datei; sie liegt hier noch
> nicht im Repo. Sobald am DNS ein `CNAME`-Eintrag `app` → `novapace.github.io`
> steht, wird sie mit eingecheckt — Pages liefert dann unter der Subdomain aus
> und leitet die Adresse oben dorthin weiter. Vorher einchecken hieße: die alte
> Adresse leitet auf einen Namen weiter, den es noch nicht gibt.

> **Dieses Repo wird nicht von Hand gepflegt.** Alle Dateien außer dieser
> README sind **gebaut**: Quelle ist `tools/client_app.html` im Firmware-Repo
> `novapace/sole_hardware_clip_P4`, gebaut von `tools/build_app.py --publish`.
> Wer hier editiert, verliert es beim nächsten Build.

## Warum GitHub Pages unter eigener Subdomain

Web Bluetooth gibt es nur in Chromium-Browsern und nur in einem **Secure
Context**. Pages liefert über `https://` aus — damit ist die Bedingung ohne
Tunnel, Zertifikat oder Port-Forwarding erfüllt.

Die künftige Adresse ist bewusst eine Subdomain und kein Unterverzeichnis von
`novapace.de`: Pages belegt immer einen ganzen Host, `novapace.de/app` ginge
also gar nicht, ohne die Website mit umzuziehen. So hängt die Patienten-Adresse
an nichts — die WordPress-Seite kann umgebaut oder ersetzt werden, ohne sie zu
brechen. `CNAME` in diesem Repo hält die Zuordnung; verschwindet die Datei,
fällt Pages auf `novapace.github.io` zurück.

## Voraussetzungen am Telefon

- **Chrome für Android** (oder Edge). **iOS geht nicht** — Safari hat kein Web
  Bluetooth, und jeder iOS-Browser ist darunter Safari.
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

Der Verlauf hängt am **Origin**: Was unter `file://`, `http://localhost` oder
der früheren Adresse `novapace.github.io/clip-app/` gesammelt wurde, ist hier
nicht sichtbar und umgekehrt. Für eine Testreihe bei einem Weg bleiben.

Das Repo ist öffentlich, damit Pages ohne bezahlten Plan ausliefert — die
veröffentlichte Seite ist damit für jeden erreichbar, der die URL hat. Es
gehören deshalb **keine Patientendaten und keine Zugangsdaten** hier hinein,
und die Entwicklungs-App (`tools/development_app.html`) bleibt im Firmware-Repo:
sie ist ein Werkzeug für die Werkbank, nicht für Patienten
(`docs/SECURITY_CONCEPT.md`, § L5).

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | die App — `client_app.html` plus zwei Blöcke aus `tools/pwa/` |
| `novapace_logo_horizontal_green_F1uoio.png` | Logo in der Kopfzeile |
| `manifest.webmanifest` | macht die Seite installierbar (Name, Icons, Farben) |
| `sw.js` | Service Worker: Offline-Start; `CACHE` ist ein Inhalts-Hash aus dem Build |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Icons für den Startbildschirm |
| `CNAME` | die Subdomain, unter der Pages ausliefert — noch nicht eingecheckt, s. o. |
| `.nojekyll` | schaltet die Jekyll-Verarbeitung von Pages ab |

## Veröffentlichen

Im Firmware-Repo:

```bash
python tools/build_app.py --publish ../novapace-clip-app
cd ../novapace-clip-app && git add -A && git commit -m "..." && git push
```

Das Skript nennt vorher die Dateien, die sich ändern. Pages veröffentlicht ein
bis zwei Minuten nach dem Push den Stand von `main` aus dem Wurzelverzeichnis
(*Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`*).

`CACHE` in `sw.js` von Hand hochzuzählen entfällt: der Build leitet den Namen
aus einem Hash über die gebauten Dateien ab. Gleicher Inhalt, gleicher Name —
eine Änderung kann also nicht mehr unbemerkt auf den Telefonen ausbleiben, und
ein Build ohne Änderung wirft dort auch nichts weg.
