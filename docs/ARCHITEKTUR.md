# Medienblick – Mein Handy-Experiment · Architekturentscheidung vor Implementierung

## Pädagogische Grenzen
| Bereich | Inhalt | Zugriff | Lebensdauer |
|---|---|---|---|
| Privates Heft | 42 Tageswerte, wichtige Apps, tägliche Reflexion | nur Lernende | außerhalb der App |
| Lokale Rechenhilfe | maximal sieben Tagesminuten pro Woche | Browser-Arbeitsspeicher, kein Request | bis Seitenwechsel |
| ICH | sieben Viererwerte, sechs optionale Wochenmittel, bis zu drei Apps, private Reflexion | persönlicher zufälliger Token | bis Klassenablauf |
| WIR | ausschließlich aggregierte abgegebene Antworten | Admin, nach Freigabe Klassencode, nach Abgabe persönliche Ansicht | bis Klassenablauf |
| JIM | unveränderliche Referenzversion, Alter, Metrik, Basis, Quelle | erst in Ergebnisansichten | dauerhaft, ohne Personenbezug |
| Projektideen | eigenständiger Themenbestand und Freigabeworkflow | separate spätere Redaktion | dauerhaft; keine Fremdschlüssel zu Antworten |

Der Rückblick auf sechs Wochen ist eine veränderte Erhebungssituation gegenüber JIM. Identischer Itemtext allein begründet keine methodisch identische Untersuchung. Unterschiede sind Gesprächsanlässe, keine Diagnosen und keine Grenzwerte.

## Komponenten und Ordner
- `public/`: alleiniger Document Root; HTML-Shell, CSS, Vanilla JS, API-Dispatcher.
- `app/`: PDO-Zugriff, Autorisierung, Validierung, Aggregation, Serverlogik.
- `database/schema.sql`: MariaDB/MySQL-Schema und App-Aliasse.
- `config/config.example.php`: Installation; echte Konfiguration außerhalb des Webroots.
- `bin/`: CLI-Installation, Cleanup, Lehrkräfteschlüssel, Referenzimport.
- `docs/`: Architektur, Sicherheitsmodell und Plesk-Betrieb.
- `tests/`: Integrationsprüfung gegen echte MariaDB sowie Browserprüfung.
- `var/`: kein Benutzerinhalt; von HTTP ausgeschlossen.

Kein Framework, keine Build-Pipeline. PHP 8.2+, PDO MySQL, mbstring, MariaDB 10.6+ / MySQL 8+. Lokal gebündelter QR-Generator; Diagramme als zugängliches SVG/CSS mit ergänzenden Tabellen. Keine Drittanbieter-Requests im Browser.

## API (JSON; `public/api.php?r=…`)
| Methode | Route | Berechtigung / Inhalt |
|---|---|---|
| GET | bootstrap | CSRF, Itemtexte, Kategorien; keinerlei Vergleichswerte |
| POST | classes | Klasse und sechs Kontexte; Admin-Token einmalig |
| GET | class | Klassencode; nur Metadaten und Abgabeanzahl |
| POST | start | Klassencode; persönlicher Token einmalig |
| GET | response | Response-Bearer; eigener Entwurf / eigene Abgabe |
| POST | draft | Response-Bearer + CSRF; gültige Teilantworten |
| POST | submit | Response-Bearer + CSRF; atomar, endgültig, wiederholbar |
| GET | results | Response-Bearer, nur nach Abgabe; ICH + WIR + JIM |
| GET | public | Klassencode, nur nach Admin-Freigabe; WIR + JIM |
| GET | admin | Admin-Bearer; Metadaten + ausschließlich Aggregate |
| POST | publish | Admin + CSRF; Klassenansicht freigeben / schließen |
| POST | extend | Admin + CSRF + gültiger Lehrkräfteschlüssel |
| POST | moderate | Admin + CSRF; unbekannte App-Begriffe freigeben / sperren |
| POST | delete | Admin + CSRF; Kaskadenlöschung |

Keine Antwortliste für Lehrkräfte. Token niemals in Query-Parametern. Verwaltungslink enthält Token im Fragment; JavaScript entfernt es sofort und sendet es im Authorization-Header. Klassencode ist der einzige öffentliche URL-Parameter. Persönliche Tokens liegen mit Ablaufzeit im lokalen Speicher, Admin-Token nur im Sitzungsspeicher. Links sind Geheimnisse; keine Telemetrie und keine Referrer.

## Schülerfluss
Code → Datenschutz und freiwillige Teilnahme → Start / Fortsetzen → sieben einzeln dargestellte Items mit Heft-Hinweis → sechs Wochenmittel, bei Bedarf lokale Rechenhilfe → bis zu drei offene App-Nennungen → private optionale Reflexion → Zusammenfassung → endgültige Abgabe → ICH/WIR/JIM mit Live-WIR und Druck. Fehlende Wochen dürfen ausdrücklich leer bleiben; nie als Null interpretieren oder Werte erfinden.

## Lehrkraftfluss
Klasse erstellen → Code, QR, Verwaltungslink sichern → Teilnahme begleiten → aggregiertes Cockpit → öffentliche Ansicht bewusst freigeben → unbekannte App-Begriffe moderieren → Smartboard / Druck → bei Bedarf Schlüssel eingeben (+7 Tage, maximal 28) → Ablauf oder sofort löschen.

## Öffentliche Klassenansicht
Keine persönliche Kennung, keine Reflexionstexte, keine Einzelantworten. Unter fünf Abgaben nur Anzahl/Wartehinweis. Freigabe erforderlich. Polling alle acht Sekunden; bei Ablauf werden angezeigte Daten und lokale Zugangsdaten entfernt. Präsentationsmodus blendet Bedienung aus, Escape beendet ihn.

## Statistik
Nur `submitted`. Zustimmung = Werte 3 und 4. Vierer-Verteilung bleibt erhalten. Wochenmittel verwenden nur vorhandene Werte; n pro Woche wird angezeigt, Wochenaggregate unter n=5 gesperrt. Gesamtwert und Median basieren auf persönlichen Mittelwerten der vorhandenen Wochen; keine Umdeutung fehlender Werte als 0. Kontextvergleich fasst gleich benannte Wochen zusammen, pro Person zunächst mitteln, dann Klassenmittel/Median. Kleine Untergruppen werden nicht ausgegeben. Prozentanteil einer App = Personen mit dieser normalisierten App / alle Abgaben. Doppelte Aliasse zählen pro Person nur einmal.

## Sicherheitsentscheidungen und Grenzen
- TLS, PDO Prepared Statements, genaue Typ-/Längen-/Bereichsvalidierung und HTML-Escaping.
- CSRF an Session gebunden, SameSite Strict, HttpOnly, Secure, keine CORS-Freigabe.
- Zufallstokens mit 256 Bit; nur SHA-256-Hashes dieser hochentropischen Tokens in SQL. Lehrkräfteschlüssel ebenfalls 256 Bit; keine benutzergewählten Passwörter.
- Transaktionen sperren Klasse vor Antwort: Abgabe, Verlängerung, Moderation und Löschung sind gegen konkurrierende Requests geschützt.
- UTC, Expiry-Prüfung bei jedem Klassenzugriff und globaler Cleanup; Hard Cap 28 Tage.
- Rate Limits ohne IP: kurzlebige gehashte Sitzungsschlüssel und globale Limits in SQL; keine Fingerprints. Umgehung durch neue Sitzungen bleibt begrenzt möglich, globale Limits schützen vor Ressourcenüberlastung.
- Alle Ergebnisendpunkte prüfen selbst n≥5; UI allein ist keine Sicherheitsgrenze.
- Freitext-Reflexion wird niemals öffentlich oder Lehrkräften angeboten. Unbekannte App-Namen nur als unzugeordnete Begriffsliste ab n≥5 moderierbar; keine Verknüpfung zu Antworten.
- Live-Aggregate sind keine Differential Privacy: Differenzen aufeinanderfolgender Stände können Rückschlüsse zulassen. Keine Untergruppenfilter, keine zeitlichen Antwortlisten; Betrieb ohne Beobachtung einzelner Abgaben empfohlen.
- Zugriff vor Abgabe auf WIR über den getrennt öffentlich freigegebenen Klassenlink lässt sich ohne Identifizierung nicht vollständig verhindern. Der Teilnahmefluss zeigt nie Vergleichswerte.
- Endgültige Löschung gilt für die Anwendungsdatenbank. Host-Backups, Binlogs und Webserver-/Proxylogs müssen betrieblich entsprechend ausgeschlossen bzw. konfiguriert werden; private Ausdrucke sind nicht fernlöschbar.

## Referenzen und Erweiterung
JIM-Version wird bei Klassenerstellung festgeschrieben. Keine stillen Jahrgangswechsel. Der Import verlangt Quelle, Erhebungsbasis und Versions-ID; identische Versionen werden nie überschrieben. Fehlende Alterswerte und fehlende vollständige Viererverteilungen bleiben fehlend. Keine Kombination von Onlinezeit und Smartphone-Bildschirmzeit. Original-Items nach Nutzerauftrag, gegengeprüft am offiziellen mpfs-Mediencheck (https://mpfs.de/mediencheck/, 03.10.2026). In dieser Lieferung keine unbestätigten numerischen Alterswerte.

Projektpool ist Phase 2: separates SQL-Schema, eigene Redaktion und Berechtigungen. Die MVP-Infoseite enthält einen gemeinsamen Projektauftrag und gekennzeichnete Ideen; keine Schülerwahl, keine erfundene Freigabe. Erst VERÖFFENTLICHT wäre später öffentlich sichtbar.
