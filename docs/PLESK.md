# Installation auf Plesk

## Voraussetzungen

- PHP 8.2 oder neuer, aktuelle Sicherheitsupdates, Erweiterungen PDO, pdo_mysql, mbstring, JSON und sessions.
- MariaDB 10.6+ oder MySQL 8.0.16+ mit InnoDB und CHECK-Constraints.
- HTTPS-Subdomain und geplante Aufgaben (Cron). Apache bzw. nginx mit PHP-FPM.
- Eine leere Datenbank. Der MVP benötigt keine Node-Installation und keinen Build.

## 1. Dateien und Webroot

Das Git-Repository `hnrgsko/medienblick` enthält diesen Projektordner direkt auf der Hauptebene. In Plesk muss dessen Checkout-Verzeichnis außerhalb des öffentlichen Document Roots liegen oder der **Document Root auf den Unterordner `public/`** gesetzt werden, z. B. `/var/www/vhosts/example.org/medienblick/public`. Wenn Plesk in `httpdocs` auscheckt, dort den Document Root auf `httpdocs/public` setzen. Der Document Root darf **nicht** direkt auf den Checkout zeigen.

Nur `public/` darf im Web erreichbar sein. `app`, `config`, `database`, `bin`, `tests` und `docs` bleiben außerhalb. Die `.htaccess`-Dateien sind zusätzliche Absicherung; bei nginx-only gelten sie nicht. Kein Directory Listing aktivieren.

Die Anwendung kann auch in einem URL-Unterverzeichnis betrieben werden. `base_url` muss dann dieses Unterverzeichnis enthalten. Kein abschließender Slash.

## 2. Datenbank und Konfiguration

Eine neue utf8mb4-Datenbank und einen eigenen Benutzer anlegen. Für die einmalige Schemaanlage DDL-Rechte nutzen; im laufenden Webbetrieb genügen SELECT, INSERT, UPDATE und DELETE auf dieser Datenbank. Referenzimport und Schlüsselverwaltung benötigen ebenfalls diese DML-Rechte. Optional zusätzliche Einschränkungen nach Tabelle vornehmen.

Empfohlenes Plesk-Layout: Git stellt das Repository in `medienblick.harzenetter.eu/httpdocs` bereit; der Dokumentenstamm zeigt auf `medienblick.harzenetter.eu/httpdocs/public`. Daneben liegt die Konfiguration unter `medienblick.harzenetter.eu/private/config.php`, außerhalb des Git-Bereitstellungsordners und des öffentlichen Webroots.

`config/config.example.php` als Vorlage für diese private `config.php` verwenden und DSN, Benutzer, Passwort, `base_url`, Kontaktadresse und Betreiberangaben eintragen. Die Datei nur für den Hostingbenutzer lesbar halten, z. B. `chmod 600`. Keine Zugangsdaten ins Repository aufnehmen.

Die App und die CLI-Skripte finden `../private/config.php` relativ zum Repository-Hauptordner automatisch. Dafür ist keine Umgebungsvariable nötig. Falls diese Datei fehlt, wird weiterhin `config/config.php` innerhalb des Repository-Hauptordners unterstützt. Eine gesetzte Umgebungsvariable `HANDY_CONFIG` hat Vorrang vor beiden Pfaden; bei einer ungültigen expliziten Pfadangabe erfolgt kein Fallback. Für ein anderes Layout kann sie auf den absoluten Pfad der gewünschten Konfigurationsdatei zeigen. Web-FPM und Cron müssen dann denselben Pfad verwenden.

Für Produktivbetrieb:

```php
'secure_cookies' => true,
'base_url' => 'https://medienblick.harzenetter.eu',
'contact_email' => 'betreiber@example.org',
'legal_notice' => "Verantwortlicher: …\nAnschrift: …\nDatenschutzkontakt: …\nHosting / Rechtsgrundlage / Betroffenenrechte: …",
```

Die integrierte Datenschutzseite beschreibt die Technik. Sie ersetzt keine auf den konkreten Betreiber und schulischen Einsatz abgestimmten rechtlichen Angaben.

## 3. Schema installieren

Über phpMyAdmin `database/schema.sql` in die leere Datenbank importieren. Alternativ per SSH/CLI:

```sh
/opt/plesk/php/8.3/bin/php bin/install.php
```

Das Skript bricht bei nicht leerer Datenbank ab. Kein öffentliches Installationsformular, kein Standard-Adminpasswort. `projects-phase2.sql` **nicht** in die Befragungsdatenbank importieren; es ist ein Planungsartefakt für einen separaten späteren Datenbereich.

## 4. PHP und Sessions

In Plesk `display_errors=Off`, `log_errors=On` und ein privates beschreibbares Session-Verzeichnis verwenden. Falls die Hostingvorgabe nicht funktioniert, `session_path` in der Konfiguration auf einen privaten Ordner außerhalb `public/` setzen. Dateirechte nur für den Hostingbenutzer.

Cookies sind HttpOnly, SameSite=Strict und bei Produktion Secure. Das Sitzungscookie enthält keinen Klassenzugang; die Session hält nur CSRF- und kurzlebige Rate-Limit-Zufallswerte. Hostseitige Sessionbereinigung aktiv lassen (30 Minuten Leerlauf vorgesehen).

`Authorization` muss PHP erreichen. Die beiliegende Apache-Regel setzt die CGI-Umgebungsvariable. Bei eigener FastCGI-Konfiguration entsprechend `HTTP_AUTHORIZATION` weiterreichen. Nach Installation ausdrücklich testen: Adminlink öffnen und persönlichen Fragebogen speichern.

## 5. Automatisches Löschen

In Plesk → Geplante Aufgaben, alle fünf Minuten, unter dem Hostingbenutzer:

```cron
*/5 * * * * /opt/plesk/php/8.3/bin/php /var/www/vhosts/example.org/handy-experiment/bin/cleanup.php
```

Falls die Konfiguration extern liegt:

```cron
*/5 * * * * HANDY_CONFIG=/privater/pfad/config.php /opt/plesk/php/8.3/bin/php /var/www/vhosts/example.org/handy-experiment/bin/cleanup.php
```

UTC wird intern verwendet; die Oberfläche zeigt die lokale Browserzeit. Cleanup löscht Klassen und über Foreign Keys alle Antworten, Wochenkontexte und Moderationsdaten. Rate-Limit-Einträge laufen nach 1–10 Minuten aus. Zusätzlich räumt jede API-Anfrage abgelaufene Klassen auf. Daten sind nach Ablauf auch vor dem nächsten Cronlauf nicht mehr abrufbar.

Cron-Fehler melden lassen. Einmal manuell ausführen und Rückgabecode prüfen. Im laufenden Betrieb die erfolgreiche Ausführung überwachen, nicht Antwortdaten protokollieren.

## 6. Lehrkräfteschlüssel

Ein Betreiber erstellt hochentropische Schlüssel lokal/über SSH:

```sh
php bin/teacher-key.php create 'Kollegium A' 365
php bin/teacher-key.php list
php bin/teacher-key.php disable 3
```

Der Klartext wird einmal ausgegeben und privat an die berechtigte Person weitergegeben. Kein Schlüssel in URL, Weblog, Repository oder öffentliches Ticket. Gespeichert wird nur SHA-256 des zufälligen 256-Bit-Schlüssels. Ablauf und Sperre werden bei jeder Verlängerung geprüft. Ein Schlüssel allein eröffnet keine Klasse; zusätzlich ist deren Admin-Token erforderlich.

## 7. JIM-Daten

Siehe `JIM.md`. Ohne Import funktioniert das Experiment vollständig; Referenzfelder sagen ausdrücklich, dass kein Wert vorliegt. Die mitgelieferte Platzhalter-Version enthält keine Zahlen. Neue verifizierte Datensätze gelten für neu erstellte Klassen; bestehende bleiben auf ihrer ursprünglichen Version.

## 8. Webserver, Logs und Sicherungen

- HTTPS erzwingen; nach erfolgreicher HTTPS-Konfiguration HSTS am Host setzen.
- Keine Request-Bodies, Authorization-Header, Cookies oder URL-Fragmente in Diagnose-/Proxy-/WAF-Logs aufnehmen.
- Die Anwendung liest keine IP-Adresse zur Identifikation. Plesk/nginx/Apache können trotzdem IPs protokollieren: Logging deaktivieren oder datensparsam passend konfigurieren.
- Den temporären Befragungsdatenbestand von dauerhaften Backups/Exporten ausschließen. MySQL-Binlogs, Snapshots, Replikate und Provider-Backups berücksichtigen. Ohne diese Betreiberentscheidung kann keine endgültige Löschung aus allen Sicherungen zugesagt werden.
- Keine Analytics, Tagmanager, externen Schriftarten oder externen QR-Code-Dienste ergänzen.
- Kein Caching vor `index.php` und `api.php`; deren `Cache-Control: no-store` respektieren.
- Datenbankzugriff nicht öffentlich öffnen; Anwendung nicht mit DB-Root betreiben.

## 9. Abnahme am Zielhost

Mit künstlichen Daten eine Testklasse anlegen, Adminlink sichern, QR-Code mit einem Smartphone scannen, Entwurf fortsetzen, fünf Abgaben erzeugen, Live-WIR und Druck prüfen. Danach Klasse löschen und sowohl Admin- als auch Antwortzugang erneut aufrufen: kein Zugriff mehr. Cleanup und Schlüsselverwaltung separat testen.

Für Fehlersuche niemals echte Schülerantworten anfordern. HTTP-Status, ungefähren Zeitpunkt und den fehlerhaften Bedienungsschritt beschreiben lassen. Die Anwendung gibt keine SQL-Fehler oder Tokens aus.

## Betriebshinweis

Die integrierten Limits arbeiten pro kurzlebiger Session und global, nicht über IPs. Für einen stark frequentierten öffentlichen Host müssen Kapazität und globale Grenzwerte überprüft werden. Sessionwechsel können individuelle Limits umgehen; vollständige Doppelteilnahmeverhinderung ist bewusst kein Produktziel.

## Update: frei wählbare Beobachtungsdauer

Bei vorhandenen Installationen in phpMyAdmin die bestehende Datenbank auswählen und ausschließlich `database/migrations/002-flexible-weeks.sql` importieren. **Nicht das komplette schema.sql erneut importieren.** Das Update erhält Klassen und Antworten und kann wiederholt werden. Danach die Seite neu laden: 1–52 Wochen, Standard sechs, mit vier Wochenarten stehen zur Verfügung. Die Beobachtungsdauer verändert die Speicherfrist (270 Minuten / maximal 28 Tage) nicht.

Bis zum Import läuft die App mit sechs Wochen weiter; die Dauerauswahl bleibt gesperrt. Neue Installationen nutzen das aktualisierte schema.sql.
