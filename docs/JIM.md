# JIM 2025 und JIMplus 2026

Geprüft am 04.10.2026 anhand der offiziellen mpfs-Berichte. Version `jim-2025-jimplus-2026-v1` ist unveränderlich. Bestehende Klassen behalten ihren Referenzstand; neue Klassen wählen die jüngste verifizierte Version.

## Installation

Nach dem Code-Update `database/migrations/003-jim-references.sql` in phpMyAdmin importieren. Die Datei erweitert ausschließlich den Referenzbestand, kann erneut ausgeführt werden und löscht keine Antworten. Auch bei Neuinstallation nach schema.sql importieren. Anschließend eine neue Klasse erstellen.

Alternativ nach Erweiterung des age_group-Enums: `php bin/import-jim.php data/references/jim-2025-jimplus-2026-v1.json --verified`. Dieser CLI-Import lehnt bereits vorhandene Versionskennungen ab.

## Fundstellen

[JIM 2025, offizieller Bericht](https://mpfs.de/app/uploads/2025/11/JIM_2025_PDF_barrierearm.pdf)

- S. 25 (PDF-Seite 27): Smartphone-Bildschirmzeit nach Alter: 166 / 217 / 249 / 278 Minuten (12–13 / 14–15 / 16–17 / 18–19). Basis insgesamt n=960 mit eigenem Smartphone und ablesbarer Gerätezeit. Kein allgemeiner Onlinezeitwert, kein Langzeitmittel wie im Experiment.
- S. 28 (PDF-Seite 30): fünf wichtigste Apps je Altersgruppe, bis zu drei offene Nennungen, Basis insgesamt n=1.135 mit eigenem Smartphone. Nicht gelistete Apps sind unbekannt, nicht null.
- S. 30 (PDF-Seite 32): sieben Abschlussitems in Reihenfolge jim_01 bis jim_07: 68 / 67 / 39 / 33 / 36 / 21 / 29 Prozent Zustimmung (voll und ganz + weitgehend). Basis n=1.200, Gesamtgruppe 12–19. Keine erfundene altersbezogene oder vollständige Vierer-Verteilung.

Die API liefert die tatsächliche Altersgruppe pro Wert. Gesamtwerte sind nur Fallback, wenn für ein Item keine passende Altersauswertung vorliegt. Ausgewählte Alterswerte haben Vorrang, Verteilungen werden niemals gemischt.

[JIMplus 2026, offizieller Bericht](https://mpfs.de/app/uploads/2026/07/JIMplus-2026_PDF.pdf)

Eigener Reflexionsbereich mit vier ausgewählten Befunden: Wissen 82 % (S. 22), Ablenkung von Belastungen 68 %, Ablenkung von Aufgaben 72 %, weniger Erholungszeit 55 % (S. 20). Paraphrasierte Aussagen, Zustimmung voll/weitgehend, Onlinebefragung n=800, 14–17 Jahre, 13.–27.05.2026. JIMplus hat andere Items und wird nicht als direkter Klassenvergleich verwendet.

## Datenhaltung und Grenzen

Numerische JIM-Referenzen liegen in der Datenbank, das ergänzende JIMplus-Modul in der serverseitigen versionierten JSON-Datei. Keine Referenzzahlen sind im Frontend verdrahtet. Die API liefert sie ausschließlich in berechtigten Ergebnisansichten, nicht vor der Abgabe im Fragebogen. Die Quellen und Altersbasis werden mitgedruckt.

Das analoge Heft bleibt privat; die abschließende Einschätzung ist kein Mittelwert von Kategorien. Zustimmung fasst Originalwerte 3 und 4 zusammen. JIM ist eine Vergleichsgruppe, kein Grenzwert. Unterschiedliche Stichproben, Kontexte und Erhebungszeiträume begrenzen die Vergleichbarkeit.

Neue Studien erfordern redaktionelle Quellenprüfung und eine neue Version. Der Import ist kein automatischer Abruf. Das JSON-Format enthält study_year, source_version, source, population und values. Werte unterstützen item_agreement, vollständige item_distribution, screen_mean und app_percentage; age_group kann zusätzlich `12-19` für veröffentlichte Gesamtwerte sein. Jede Zeile darf eine eigene offizielle HTTPS-Fundstelle auf mpfs.de enthalten.

## Öffentliche Startseite

`home-studies-2026-10-04-v1.json` ist ein eigener redaktioneller Bestand für die Startseite. Er enthält keine sieben Abschlussitems, Bildschirmzeit- oder App-Vergleichswerte. Diese bleiben in den geschützten Ergebnisansichten. Die öffentlichen Befunde dienen der Einführung: JIM 2025 S. 63 (PDF-Seite 65), KI-Nutzungsmotive unter n=1.088 mit KI-Erfahrung, sowie JIMplus 2026 S. 22, n=800. Das kurze Originalzitat ist ein gekennzeichneter Auszug aus der mpfs-Einführung auf der offiziellen JIMplus-2026-Studienseite. Grafiken sind eigene Darstellungen mit Quellenlinks; die Unterrichtsidee ist ausdrücklich kein Studienbefund. Der Bootstrap liefert diesen öffentlichen Bestand getrennt von den versionierten Klassenreferenzen. Dafür ist kein SQL-Import erforderlich.
