# Medienblick – Mein Handy-Experiment

Mobile-first PHP/MySQL-Anwendung zur anonymen Auswertung eines sechswöchigen analogen Unterrichtsprojekts.

**BEOBACHTEN → ICH → WIR → JIM → REFLEKTIEREN → GESTALTEN**

Die Anwendung ist kein Sucht-Screening. Das private Protokollheft bleibt die Grundlage. Es werden keine 42 Tagesdatensätze hochgeladen.

## Einstieg

1. [Architektur, Nutzerflüsse und Sicherheitsanalyse](docs/ARCHITEKTUR.md)
2. [Plesk-Installation und Betrieb](docs/PLESK.md)
3. [Vollständiges Datenbankschema](database/schema.sql)
4. [API-Vertrag](docs/API.md)
5. [JIM-Referenzimport und Methodik](docs/JIM.md)
6. [Testnachweise und Grenzen](docs/TESTS.md)

## Implementiert

- Kontoarme Klassenerstellung mit sechs frei benannten Wochen, optionalen Zeiträumen, Vergleichsalter und Teilnehmerzahl.
- Gut lesbarer Klassencode, lokaler QR-Code, privater Adminlink, Ablaufanzeige.
- Getrennte, kryptografisch zufällige Admin- und Antworttokens; auf dem Server nur Hashes.
- Sieben einzeln dargestellte Abschlussitems, große Antwortfelder und Heft-Hinweis.
- Entwürfe, Fortsetzen auf demselben Gerät, Zusammenfassung und atomare endgültige Abgabe.
- Sechs freiwillige Wochenmittel; rein lokale Rechenhilfe für vorhandene Tagesminuten.
- Offene App-Eingabe, Autocomplete, Alias-Normalisierung und Deduplizierung pro Person.
- Private optionale Reflexion; keine Auslieferung an Lehrkraft oder Öffentlichkeit.
- Live-WIR ab fünf vollständigen Abgaben; zusätzliche n≥5-Grenze für jede Bildschirmzeitstatistik.
- Persönliche ICH–WIR–JIM-Ansicht und freigabepflichtige WIR–JIM-Klassenansicht.
- Zustimmungsanteile, Vierer-Verteilungen, Mittelwert, Median, Wochenverlauf und Kontextvergleich.
- App-Wortwolke, Rangliste und Balken; Moderation unbekannter Begriffe vor Veröffentlichung.
- Lehrkraft-Cockpit ohne Einzelantworten, Präsentationsmodus, Browserdruck / PDF.
- Lehrkräfteschlüssel erstellen, auflisten und sperren über Betreiber-CLI.
- Verlängerung um sieben Tage, absolute 28-Tage-Grenze, vorzeitige Löschung und Cleanup.
- Versionierter, append-only JIM-Import und klare Anzeige fehlender Referenzen.
- Informationsseite, Datenschutz-/Kontaktbereich und gemeinsamer Fachprojektauftrag mit Beispielideen.

## Bewusste Grenzen dieser Lieferung

- **Keine numerischen JIM-Altersreferenzen mitgeliefert.** Die offiziellen Itemtexte sind übernommen; passende Zahlen müssen anhand der offiziellen Quelle verifiziert und importiert werden. Kein Beispielwert erscheint als echter Studienwert.
- **Projektideenbereich ist redaktionelle Information.** Dauerhafter bearbeitbarer Themenpool mit Freigabeworkflow und eigenständiger Redaktion ist Phase 2; ein separates Schema liegt bei. Keine Projektwahl implementiert.
- **Keine Reflexions-Wortwolke.** Reflexionstexte bleiben privat. Die implementierte Wortwolke nutzt moderierte App-Begriffe.
- **Nicht auf einem realen Plesk-Host veröffentlicht.** Getestet mit PHP 8.3 und MariaDB 10.11 sowie Chromium. Installation, TLS, Betreiberangaben, Cronjob und hostseitige Logging-/Backup-Konfiguration müssen am Zielsystem erfolgen.
- Live-Aggregate sind keine Differential Privacy. Individuelle zeitliche Beobachtung neuer Abgaben kann Rückschlüsse ermöglichen. Keine Untergruppenfilter oder personenbezogenen Verknüpfungen.

## Struktur

```text
handy-experiment/
├── app/                 PHP-Domänenlogik, Validierung, PDO, Statistik
├── bin/                 Installation, Cleanup, Schlüssel, Referenzimport
├── config/              Konfigurationsvorlage (echte Konfiguration privat)
├── database/            MVP-Schema und separates Phase-2-Schema
├── docs/                Architektur, API, Betrieb, Methodik, Testnachweise
├── public/              EINZIGER Webroot: index.php, api.php, assets/
├── tests/               API- und Browser-Akzeptanztests
└── var/                 reserviert für private Betriebsdateien
```

Keine Node-/Build-Pipeline im Produktivbetrieb. Node und Playwright werden nur für die Browser-Entwicklungstests gebraucht. QR-Code-Generator 1.4.4 (MIT) ist lokal gebündelt; keine externen Browser-Dienste, Fonts, CDNs oder Tracker.
