# JIM: Referenzen, Import und Vergleichbarkeit

Die sieben Itemformulierungen stammen aus dem Arbeitsauftrag und entsprechen den allgemeinen Aussagen im offiziellen mpfs-Mediencheck: https://mpfs.de/mediencheck/ (geprüft am 03.10.2026). Die Kategorien sind „voll und ganz“, „weitgehend“, „weniger“, „gar nicht“; intern 4, 3, 2, 1.

Die Studie 2025 ist unter https://mpfs.de/app/uploads/2025/11/JIM_2025_PDF_barrierearm.pdf veröffentlicht. Die im Bericht genannten Gesamtwerte werden hier **nicht** stillschweigend auf die vier Altersgruppen übertragen. In diesem Paket liegen keine numerischen Altersreferenzen vor. Der Seed `jim-2025-pending` dokumentiert das ausdrücklich.

## Wichtige methodische Unterschiede

- Heft: tägliche „Heute …“-Beobachtung. Abschluss: allgemeine Aussage, subjektiver Rückblick auf sechs Wochen.
- Gleicher Wortlaut und gleiche Skala sind keine Garantie für gleiche Erhebungssituation, Stichprobe oder Zeitbasis.
- Smartphone-Bildschirmzeit ist nicht allgemeine Onlinezeit. Diese Metriken niemals austauschen.
- Drei subjektiv wichtigste Apps sind nicht Nutzungsdauer-Rangfolge und nicht tägliche Nutzungsfrequenz.
- Das Klassenalter ist eine gewählte Referenzgruppe, kein einzeln erhobenes Geburtsdatum.
- Zustimmung fasst 3 und 4 zusammen. Alle vier Originalwerte bleiben für andere Darstellungen gespeichert.
- Fehlende Wochen werden nicht mit Null belegt. Gesamtmittel: persönliche Mittelwerte vorhandener Wochen, dann Mittel über Personen. Bei unvollständigen Wochen ist das kein garantiert vollständiger 42-Tage-Durchschnitt.

## Versioniertes Importformat

Die folgende Form zeigt ausschließlich die Struktur, **keine Referenzdaten zum direkten Import**:

```text
{
  "study_year": <Jahr>,
  "source_version": "<eindeutige unveränderliche Versionskennung>",
  "source": "https://mpfs.de/<offizielle Quelle>",
  "population": "<Basis, Erhebungszeitraum, Fundstelle/Seite und Einschränkungen>",
  "values": [
    {
      "age_group": "14-15",
      "metric_type": "item_distribution",
      "item_id": "jim_01",
      "response_value": 4,
      "percentage": <verifizierter Prozentwert>
    }
  ]
}
```

Unterstützte Typen:

| metric_type | item_id | response_value | Messwert |
|---|---|---|---|
| item_distribution | jim_01 … jim_07 | 1,2,3,4 vollständig | percentage |
| item_agreement | jim_01 … jim_07 | 0 | percentage (3+4) |
| screen_mean | smartphone_minutes | 0 | numeric_value (Minuten) |
| app_percentage | kanonischer App-Name | 0 | percentage |

Für jede vorhandene Viererverteilung verlangt der Import vier Kategorien und eine Summe im Rundungskorridor um 100 %. Nur veröffentlichte Zustimmung vorhanden? Dann `item_agreement` verwenden und die Detailansicht bewusst leer lassen. Unterschiedliche Quellen/Fundstellen ggf. als eigene Versionen dokumentieren.

## Betreiberablauf

1. Offizielle Quelle, Jahr, Altersgruppe, Basis, konkrete Frage, Antwortkategorien und Metrik verifizieren. Fundstelle in `population` angeben.
2. JSON erstellen; keine Testzahlen verwenden.
3. Import ausführen:

```sh
php bin/import-jim.php /privater/pfad/jim-verifiziert.json --verified
```

4. Neue Testklasse erstellen, Referenzanzeige überprüfen.

Der Import ist append-only: Eine vorhandene `source_version` wird nicht überschrieben. Bestehende Klassen behalten ihre dataset_id. Neue Klassen erhalten die jüngste verifizierte Version. Ein neues Dataset darf unterschiedliche Metriken und Altersgruppen enthalten; nicht gelieferte Werte bleiben ausdrücklich fehlend.

Die Software kann numerische Plausibilität, Vollständigkeit und Versionskonflikte prüfen. Ob eine Zahl sachlich zur offiziellen Quelle passt, muss die redaktionelle Prüfung sicherstellen. Der Import stellt keinen automatischen Studienabruf dar.
