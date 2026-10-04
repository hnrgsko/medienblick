# API-Vertrag

Alle Routen laufen über `api.php?r=ROUTE`, optional `&code=K7M4PX`. Keine Tokens in Querystrings. JSON, UTF-8, `Cache-Control: no-store`. Fehler: `{"error":"lesbarer Text"}` mit passendem Status (400/401/403/404/409/410/413/415/422/429/500/503).

## Sicherheitskontext

Zuerst `GET bootstrap` aufrufen; Cookie behalten. Schreibanfragen sind POST mit `Content-Type: application/json` und `X-CSRF-Token` aus dem Bootstrap. Geschützte Routen verlangen zusätzlich `Authorization: Bearer <64 hex characters>`.

Admin- und Response-Tokens sind unterschiedliche Capabilities. Ein Klassencode oder Lehrkräfteschlüssel ersetzt keinen Admin-Token. `bootstrap` und `class` liefern keine WIR-/JIM-Vergleichsdaten.

## Routen

| Route | Methode | Zugang | Payload / Antwort |
|---|---|---|---|
| bootstrap | GET | Sitzung | CSRF, Itemtexte, bekannte App-Namen, öffentliche Betreiberangaben |
| classes | POST | CSRF | `{label, age_group, expected, weeks:[{label,start_date,end_date} ×6]}` → `{class,admin_token}` |
| class | GET | code | `{class}`: Metadaten, Wochen, Ablauf, Abgabezahl; keine Antworten |
| start | POST | code + CSRF | `{}` → `{token,class}` |
| response | GET | Response | `{class,response}` für genau die eigene Teilnahme |
| draft | POST | Response + CSRF | vollständiger aktueller Entwurf, siehe unten |
| submit | POST | Response + CSRF | wie draft; sieben Items müssen vorliegen; atomare Abgabe |
| results | GET | abgegebene Response | `{class,response,wir,jim,as_of}` |
| public | GET | code + Klassenfreigabe | `{class,wir,jim,as_of}`, niemals response |
| admin | GET | Admin | wie public plus unzugeordnete Moderationsbegriffe ab n≥5 |
| publish | POST | Admin + CSRF | `{public:true}` oder `{public:false}` |
| extend | POST | Admin + CSRF | `{key:"Lehrkräfteschlüssel"}` → aktualisierte Klasse |
| moderate | POST | Admin + CSRF | `{id:123,status:"approved"}` bzw. `"blocked"` |
| delete | POST | Admin + CSRF | `{}` → endgültige Kaskadenlöschung |

## Entwurfs- und Abgabeformat

```json
{
  "items": [3, 4, 2, 1, 3, 2, 2],
  "screen": [180.5, 160, null, 140, 155, 130],
  "apps": ["Insta", "WhatsApp"],
  "reflection": "Ein freiwilliger privater Gedanke."
}
```

`items`: exakt sieben Werte 1–4; im Entwurf auch null. `screen`: exakt sechs Zahlen 0–1440 oder null. Null = unbekannt, 0 = tatsächliche Nullnutzung. `apps`: maximal drei Strings à 60 Zeichen; bekanntes Alias wird normalisiert, Dubletten pro Person entfernt. `reflection`: maximal 2000 Zeichen, privat. Andere Payloadfelder werden zurückgewiesen; Tagesdaten sind kein API-Format.

POST submit ist nach bereits erfolgter Abgabe idempotent: Erfolgsmeldung, aber keine Änderung und keine zweite Zählung. POST draft nach Abgabe antwortet 409. GET results vor Abgabe antwortet 403.

## Aggregate

Unter fünf Abgaben: `wir = {n:4,available:false}`. Es gibt keine versteckten Itemwerte in der Antwort. Ab fünf: Item-Zählungen und Prozentwerte, Wochenstatistiken, persönliche Gesamtmittel/Median, Kontextstatistiken und moderierte App-Häufigkeiten. Jede Bildschirmzeitstatistik prüft ihre eigene gültige Fallzahl ≥5.

JIM liefert Metadaten der festgeschriebenen Version und nur geprüfte Werte für die Klassen-Altersgruppe. Fehlend = keine Zahlen; niemals Fallback auf Gesamtpopulation oder einen anderen Jahrgang. Vollständige Viererverteilungen werden nicht aus Zustimmungsprozenten erfunden.

## Transaktionen

Mutationen sperren zuerst Klasse und danach Antwort/Schlüssel. Gleichzeitiges Abschicken derselben Antwort zählt nur einmal; Verlängern kann die Grenze nicht überschreiten; Löschung kaskadiert. Ergebnisanfragen laufen in einem konsistenten Datenbanksnapshot. Nach Ablauf wird kein Klassen-/Antwortzugriff autorisiert.
