# Weiterdenken: Projektwerkstatt

Stand: 08.10.2026. Die bisherige Acht-Ideen-Folge wurde durch drei Bereiche ersetzt:

1. **Gemeinsam reflektieren:** Bildschirmzeit, Apps und Datenspuren, sieben Gesprächsstunden sowie Klassenchat und Prävention.
2. **Im Fach gestalten:** 17 exemplarische Projekte mit Fachfilter und Suche. Sport, Kunst, Politik/Gesellschaftslehre, Biologie, Geschichte, Informatik, Physik, Chemie, Mathematik, Deutsch, Fremdsprachen, Musik, Geografie, Ethik/Religion, Wirtschaft/Arbeitslehre und Technik/Werken. Fachbezeichnungen und Themen werden vor Ort an die Curricula angepasst.
3. **An der Schule verankern:** Pilot, Jahrgänge und flexible Zeitfenster, Rollen, fairer Gerätezugang, Leistungsvereinbarung, Prävention und Evaluation.

## Inhalt und Materialien

`public/assets/project-data.js` enthält die 21 Projekte, sieben Reflexionsanlässe und beschriftete Quellen. Die Oberfläche rendert diese Daten ohne Build-Schritt. `project-data.js` muss vor `app.js` geladen werden.

Alle Projekte verwenden dasselbe ausfüllbare `public/assets/material/projektprotokoll.html?project=<id>`. Ohne Kennung ist der Bogen leer. Der Auftrag und seine Quellen bleiben im Browser einsehbar; das gedruckte Ergebnis besteht aus dem gemeinsamen Protokoll. `schulkonzept.html` ist ein eigenständig nutzbarer Gesprächs- und Planungsbogen für Kollegium und Schulleitung.

Die Formulare übertragen keine Eingaben und verwenden keine automatische Browser-Speicherung. Entwürfe können als lokale JSON-Datei heruntergeladen und wieder geöffnet werden. Importierte Inhalte werden ausschließlich als Text bzw. Feldwerte verarbeitet. Druck/PDF nutzt eigene Textdarstellungen, damit ausgefüllte Textfelder nicht an ihrer Bildschirmhöhe abgeschnitten werden. Vor dem Schließen ist eine bewusste Sicherung erforderlich.

Die bisherigen `projekt-1.html` bis `projekt-8.html` bleiben als ältere direkt verlinkbare Materialien erhalten; die neue Werkstatt verwendet das gemeinsame Protokoll.

## Didaktische und fachliche Grenzen

- ICH bleibt privat. WIR besteht aus anonymen Aggregaten. JIM ist eine ausgewiesene Vergleichsstichprobe; die Klasse ist keine repräsentative Deutschland-Stichprobe.
- Medizinische Leitlinien, Studien, Verbandspositionen und Alltagserfahrungen werden unterschieden. Quellenangaben benennen die Art der Aussage.
- AWMF (S2k-Leitlinie 2023) und WHO-Gaming-Kriterien ersetzen keine individuelle Diagnostik. Die WHO-Kriterien werden nicht pauschal auf beliebige Mediennutzung übertragen.
- Cochrane zu Blaufilter-Brillen (2023) betrifft untersuchte Erwachsene. Augenbelastung, Schlaf und Netzhautschutz werden nicht zu einem pauschalen Schaden- oder Nutzenversprechen zusammengezogen.
- Gaming und Kognition: Bediou und Sala (2018) sowie Zhao et al. (2026) dienen dem Vergleich von Studiendesigns, spezifischen Aufgaben und Transfergrenzen. Kleine Effekte oder Zusammenhänge sind keine Empfehlung für längere Spielzeiten.
- Das Kommunikationsquadrat hat vier Seiten. Der FTC-Fall X-Mode ist ein konkreter dokumentierter US-Fall, kein Nachweis über jede App oder über Aussagen beliebiger Interviewpartner.
- Präventionsmodule nutzen fiktive Fälle und fachkundige Partner. Es werden keine Täterkontakte, Schlafentzugsversuche oder öffentlichen Problem-Rankings vorgeschlagen.
- Ersatz- oder Zusatzleistungen sind vor Beginn nach den einschlägigen Regeln zu prüfen und zu vereinbaren. Das vorgeschlagene Raster ist keine verbindliche schulrechtliche Regel. Private Nutzungsdaten und persönliche Einstellungen werden nicht benotet.

## Prüfung

`node tests/workshop.cjs`: vollständige Projektaufträge, eindeutige IDs, gültige Quellenverweise und zentrale fachliche Unterscheidungen.

`node tests/workshop-browser.cjs`: statische Browserprüfung mit Playwright, ohne Backend/Datenbank. Optional `HANDY_CHROME` für ein installiertes Chromium und `HANDY_TEST_OUTPUT` für die Prüfartefakte. Playwright ist nur eine Entwicklungsabhängigkeit.

Geprüft: alle drei Bereiche bei 1440 und 390 Pixeln, Auswahl und Tastatursteuerung, Fachfilter, Suche und leere Suchergebnisse, sieben Reflexionskarten, alle 21 Projektblätter, lokaler Entwurfimport inklusive ungültiger Datei, sichere Textdarstellung, unbekannte Projektkennung, Druck von Protokoll und Schulkonzept, keine horizontale Überbreite oder Laufzeitfehler. Druckansichten (drei bzw. fünf Seiten in der geprüften Beispielfüllung) wurden visuell kontrolliert. Bestehende Referenz- und Wochenprüfungen bestehen weiterhin. Produktivhosting und vollständige Backendtests wurden für diese Inhalts- und Oberflächenänderung nicht erneut geprüft.
