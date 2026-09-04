# Denkraum Heidi

Eine interaktive, textnahe Diskussionsplattform zu Johanna Spyris *Heidi* für die Sekundarstufe II. Sechs kontroverse Räume führen von Beobachtung über Deutung zu einem begründeten Urteil.

## Enthalten

- sechs vollständige Diskussionsräume mit Leitthese, Textankern, Fragen in drei Niveaus und je sechs Impulsen
- Positionslinie, Vorher-/Nachher-Abstimmung und Abschlussreflexion
- Belegkarten, Figurenperspektiven und kuratierte Gegenargumente
- vier Diskussionsmodi mit pausierbarem Timer
- Figurenfokus zu Dete und Almöhi sowie Glossar heutiger Analysebegriffe
- lokaler Lehrpersonenbereich mit Zusatzfrage, Rollenzuteilung und Beobachtungsbogen
- automatische lokale Speicherung ohne Login
- optionaler Cloud-Lernraum auf Cloudflare D1 für Lernstände und Beiträge
- Druckansicht sowie Export als Markdown und JSON
- zweiter Modus «Heidi · Clara · Peter»: ein verzweigter Austausch aus Briefen und abspielbaren Sprachnachrichten
- «Fadenspiel» als erzählerische Moderation: Nachklänge aus den Nachrichten öffnen neue Themen, Grossmamas Fadenbriefe verbinden sie
- externe Reaktionen von Fräulein Rottenmeier, Dete, Herr Sesemann und Almöhi

## Lokal starten

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

Die lokale Adresse wird im Terminal angezeigt.

## Prüfen und bauen

```bash
npm test
npm run lint
npm run build
```

Der reguläre Build enthält die Cloudflare-API. Der separate Pages-Build liegt in `out/`:

```bash
npm run build:pages
```

## GitHub Pages

Der Workflow `.github/workflows/deploy-pages.yml` baut und veröffentlicht die Seite bei jedem Push auf `main`. In den Repository-Einstellungen unter **Pages → Source** muss **GitHub Actions** gewählt sein. Das statische Frontend verwendet die öffentliche Denkraum-API als sichere Brücke zur Cloudflare-Datenbank; die Datenbank selbst ist nie direkt aus dem Browser erreichbar.

Der Unterpfad wird automatisch aus dem Repository-Namen gesetzt. Für einen manuellen Build unter einem Unterpfad:

```bash
BASE_PATH=/repository-name \
NEXT_PUBLIC_API_BASE_URL=https://denkraum-heidi.patrickoliverfischer.chatgpt.site \
npm run build:pages
```

Für eine Root-Domain bleibt `BASE_PATH` leer.

## Cloudflare D1

Die Sites-Konfiguration bindet D1 unter `DB` ein. Das Schema liegt in `db/schema.ts`, die generierte Migration unter `drizzle/`.

```bash
npm run db:generate
```

Die API unter `/api/learning-room` erstellt geschützte Lernräume, synchronisiert die beiden Lernmodi und speichert Beiträge. Jeder Raum erhält eine zufällige Raum-ID und einen 192-Bit-Zugangsschlüssel. In D1 wird nur dessen SHA-256-Prüfwert gespeichert. Abfragen verwenden gebundene Parameter; Eingaben und Nutzlastgrössen werden serverseitig begrenzt.

## Datenschutz und Speicherung

Arbeitsstände werden zunächst im Browser (`localStorage`) gespeichert. Cloud-Synchronisierung ist optional und wird ausdrücklich ausgelöst. Sie benötigt weder Namen noch E-Mail-Adresse; für Beiträge genügt ein Kürzel. Raum-ID und Schlüssel bleiben lokal im Browser und sollten nicht öffentlich geteilt werden. Der Lehrpersonenbereich ist organisatorisch getrennt, aber nicht zugangsgeschützt.

## Textgrundlage

Johanna Spyri, *Heidi. Vollständige Ausgabe. Erster und Zweiter Teil*. Die Plattform verwendet Kapitel- und Situationsverweise statt längerer Textzitate. Moderne Begriffe werden ausdrücklich als heutige Deutungsangebote behandelt.
