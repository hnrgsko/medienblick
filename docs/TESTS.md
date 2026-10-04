# Testnachweis – 03.10.2026

**105 erfolgreiche Prüfungen: 88 API-/Datenbankprüfungen und 17 Browserprüfungen.**

Getestet mit PHP 8.3.6, MariaDB 10.11.7/InnoDB und Chrome Headless 154.0.8037.97 über Playwright. API-Tests liefen über echte HTTP-Anfragen und eine echte MariaDB; keine In-Memory-Datenbank und kein simuliertes Backend. Für Konkurrenztests vier PHP-Serverworker.

## Backend

Geprüft: Klassenanlage, sechs Kontexte, exakt 270 Minuten, CSRF, getrennte Zugriffsrechte, Entwürfe, Fortsetzen, Validierung, Ausschluss von Tagesrohdaten, Sperre vor Abgabe, n=1…6, unveränderliche Abgabe, idempotente Wiederholung, Live-Mittelwerte, Wochen-n-Grenze, Median und Kontextaggregation, private Reflexion, Alias-Deduplizierung, App-Moderation, öffentliche Freigabe, Schlüsselvalidierung und Sperre, 28-Tage-Grenze, versionierter JIM-Import, Referenz-Pinning, Kaskadenlöschung bei Ablauf und vorzeitige Löschung.

Zusätzlich wurden gleichzeitige Abgaben derselben Response sowie zwei gleichzeitige Verlängerungen getestet. Abgaben zählen genau einmal; beide Verlängerungsschritte bleiben erhalten. Fehlgeschlagene Schlüsselversuche werden auch bei zurückgerollter Fachtransaktion gezählt und begrenzt.

Die vollständige Liste steht in `tests/integration-result.json`.

## Browser

Desktop 1440 × 1000 und Smartphone 390 × 844: Klassenerstellung, lokaler QR-Code, sieben echte Fragebogenschritte, lokale Berechnung aus zwei vorhandenen Tagen, keine Übertragung von Tagesfeldern, Fortsetzen nach Reload, sicheres Rendern von HTML-artigem Freitext, endgültige Abgabe, automatische Sichtbarkeit nach der fünften Teilnahme, App-Balken, Vierer-Detailansicht, keine horizontale Überbreite, öffentliche Ansicht ohne Reflexion, Präsentationsmodus und Escape, Entfernung des Admin-Fragments sowie lokale Tokenbereinigung nach Live-Löschung.

Keine JavaScript-Laufzeitfehler. Vollständige Prüfliste: `tests/browser-result.json`. Screenshots und künstliche Testdrucke: `docs/screenshots/`. Diese enthalten ausschließlich synthetische Testdaten.

Persönlicher Druck und Klassenbericht wurden in Chromium als A4-PDF erzeugt. Der Klassenbericht wurde gerendert und visuell auf Tabellen, Diagramme und Seitenumbrüche geprüft. Die Druck-CSS wurde dabei verdichtet; der Klassen-Testbericht umfasst sechs Seiten.

## Tests erneut ausführen

Nur eine **wegwerfbare Testdatenbank mit Namen auf `_test`** verwenden. Der API-Test verweigert sonst seine destruktiven Prüfungen. Niemals gegen die Produktivdatenbank testen. Die Tests löschen Testdatensätze, Referenzfixtures, Lehrkräfteschlüssel und Rate-Limit-Zeilen.

1. Leere Testdatenbank erstellen und separate Konfiguration anlegen.
2. `HANDY_CONFIG=/pfad/test.php php bin/install.php`
3. `HANDY_CONFIG=/pfad/test.php PHP_CLI_SERVER_WORKERS=4 php -S 127.0.0.1:8087 -t public`
4. In zweitem Terminal: `HANDY_CONFIG=/pfad/test.php HANDY_PHP=php python3 tests/integration.py`
5. Für Browserprüfungen nur in der Entwicklungsumgebung Playwright installieren, Chromium bereitstellen und `node tests/browser.cjs` ausführen. Optional `HANDY_CHROME=/pfad/chrome-headless-shell`; `HANDY_TEST_URL` wählt den lokalen Testserver.

Die produktive App benötigt Python, Node, Playwright und Chromium nicht.

## Noch am realen Zielsystem zu prüfen

Plesk-FPM/Authorization-Weiterleitung, HTTPS/Secure-Cookies, echter Smartphone-QR-Scan, Cron-Ausführung, DB-Berechtigungen, technische Logs, Backup-/Binlog-Regeln und die Betreiberangaben. Kein Lasttest für einen landesweiten öffentlichen Betrieb, kein unabhängiges Penetrationstest-Zertifikat und keine vollständige WCAG-Auditierung.

Numerische JIM-Referenzen wurden nur mit ausdrücklich synthetischen, nach dem Test gelöschten Fixtures auf Importfunktion geprüft. Es werden keine erfundenen Studienwerte ausgeliefert.
