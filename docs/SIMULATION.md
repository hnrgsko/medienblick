# Mehrklassen-Simulation, 04.10.2026

Ergebnis: 311 erfolgreiche Prüfungen über echte HTTP-Anfragen gegen PHP 8.3 und eine isolierte MariaDB 10.11. Keine produktiven Klassen angelegt oder verändert. Das ist ein Funktionstest einschließlich kleiner Paralleltests, kein Kapazitätsnachweis für das Plesk-Hosting.

- Bestehende Integration: 88 Prüfungen (u. a. CSRF, Moderation, Token-Trennung, Verlängerungen bis 28 Tage, gesperrte Schlüssel, Rate Limiting, gleichzeitige Doppelabgabe und Verlängerung).
- Variable Wochen: 85 Prüfungen (1, 4, 8 und 52 Wochen, Datenerhalt, Validierung und Löschung).
- Neue Mehrklassen-Simulation: 138 Prüfungen, sechs gleichzeitig bestehende Klassen und 53 abgeschlossene Antworten, anschließend zusätzlicher Entwurf.

| Klasse | Wochen | Abgaben | Fall und geprüftes Ergebnis |
|---|---:|---:|---|
| Minimum | 1 | 5 | Alle Bildschirmzeiten 0: Mittel und Median 0 |
| Unter Schwelle | 6 | 4 | Je 1440 Minuten: keine Aggregate sichtbar |
| Gespalten | 6 | 24 | Hälfte 0, Hälfte 1440: Mittel und Median 720 |
| Lücken | 8 | 5 | Woche 1 fünf Werte, Woche 2 vier, Rest keine: nur Woche 1 sichtbar; Gesamtmittel 140, Median 150 |
| Ausreißer | 52 | 5 | Viermal 60, einmal 1440: Gesamtmittel 336, Median 60 |
| Parallel | 4 | 10 | Zehn unabhängige Sitzungen geben parallel ab: alle genau einmal gezählt, Mittel und Median 104,5 |

Zusätzlich: extreme Viererantworten, identische App-Aliase nur einmal pro Person, keine privaten Reflexionen im Cockpit, unveränderliches ICH, unzulässige Minuten/Antworten/Tagesrohdaten abgelehnt, Entwürfe nicht mitgezählt. Ablauf einer Klasse löscht deren Antworten und Entwürfe, die übrigen fünf Klassen bleiben erreichbar und unverändert.

## Wiederholen

Nur eine wegwerfbare lokale Datenbank verwenden, deren Name auf `_test` endet. Schema frisch importieren, lokale Config über HANDY_CONFIG setzen, secure_cookies=false nur für HTTP auf localhost. PHP-Server mit mehreren Workern starten. HANDY_PHP und HANDY_TEST_URL auf lokale Testinstanz setzen.

1. `python tests/integration.py` (erwartet zunächst den ungeprüften Referenz-Seed).
2. `python tests/flexible-weeks.py`.
3. In der Testdatenbank Rate-Limit-Fixtures leeren und `database/migrations/003-jim-references.sql` importieren.
4. `python tests/extreme-classes.py`.

Das neue Skript erzeugt `tests/extreme-classes-result.json`. Die synthetischen Daten sind keine JIM-Erhebungsdaten. Die temporäre Testdatenbank kann nach dem Lauf komplett verworfen werden.
