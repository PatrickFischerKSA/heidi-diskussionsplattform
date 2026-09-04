# Denkraum Heidi

Eine interaktive, textnahe Diskussionsplattform zu Johanna Spyris *Heidi* für die Sekundarstufe II. Sechs kontroverse Räume führen von Beobachtung über Deutung zu einem begründeten Urteil.

## Enthalten

- sechs vollständige Diskussionsräume mit Leitthese, Textankern, Fragen in drei Niveaus und je sechs Impulsen
- Positionslinie, Vorher-/Nachher-Abstimmung und Abschlussreflexion
- Belegkarten, Figurenperspektiven und kuratierte Gegenargumente
- vier Diskussionsmodi mit pausierbarem Timer
- Figurenfokus zu Dete und Almöhi sowie Glossar heutiger Analysebegriffe
- lokaler Lehrpersonenbereich mit Zusatzfrage, Rollenzuteilung und Beobachtungsbogen
- lokale Speicherung ohne Login oder Backend
- Druckansicht sowie Export als Markdown und JSON

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

Der statische Build liegt in `out/`.

## GitHub Pages

Der Workflow `.github/workflows/deploy-pages.yml` baut und veröffentlicht die Seite bei jedem Push auf `main`. In den Repository-Einstellungen unter **Pages → Source** muss **GitHub Actions** gewählt sein.

Der Unterpfad wird automatisch aus dem Repository-Namen gesetzt. Für einen manuellen Build unter einem Unterpfad:

```bash
BASE_PATH=/repository-name npm run build
```

Für eine Root-Domain bleibt `BASE_PATH` leer.

## Datenschutz und Speicherung

Alle Arbeitsstände werden ausschliesslich im Browser (`localStorage`) gespeichert. Der Lehrpersonenbereich ist organisatorisch getrennt, aber nicht zugangsgeschützt. Es werden keine Daten an einen Server übertragen.

## Textgrundlage

Johanna Spyri, *Heidi. Vollständige Ausgabe. Erster und Zweiter Teil*. Die Plattform verwendet Kapitel- und Situationsverweise statt längerer Textzitate. Moderne Begriffe werden ausdrücklich als heutige Deutungsangebote behandelt.
