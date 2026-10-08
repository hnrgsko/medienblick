// Medienblick: redaktionelle Projektideen; Vorschläge, keine verbindlichen Curricula.
const projectSources = {
  "jim": [
    "mpfs · JIM 2025",
    "https://mpfs.de/studie/jim-studie-2025/",
    "Erhebung und Vergleichsgruppe"
  ],
  "health": [
    "AWMF · Prävention dysregulierten Bildschirmmediengebrauchs",
    "https://www.awmf.org/aktuelles/awmf-aktuell/praevention-dysregulierten-bildschirmmediengebrauchs-in-kindheit-und-jugend",
    "Medizinische S2k-Leitlinie, 2023; gültig bis Juli 2028"
  ],
  "who": [
    "WHO · Gaming disorder",
    "https://www.who.int/news-room/questions-and-answers/item/addictive-behaviours-gaming-disorder",
    "Diagnostische Einordnung speziell für Gaming"
  ],
  "eyes": [
    "Cochrane · Blaufilter-Brillen",
    "https://www.cochrane.org/evidence/CD013244_blue-light-filtering-spectacle-lenses-visual-performance-macular-back-part-eye-protection-and",
    "Systematischer Review, 2023; Studien an Erwachsenen"
  ],
  "parents": [
    "Bundeselternrat und Mitunterzeichnende · Offener Brief",
    "https://d-64.org/medienbildung/",
    "Bildungspolitische Position, August 2025; kein medizinischer Beleg"
  ],
  "students": [
    "Bundesschüler*innenkonferenz · Digitalisierung an Schulen",
    "https://bundesschuelerkonferenz.com/digitalisierung-an-schulen/",
    "Interessenvertretung und bildungspolitische Position, 2020"
  ],
  "data": [
    "FTC · Fall X-Mode / Outlogic",
    "https://www.ftc.gov/legal-library/browse/cases-proceedings/2123038-x-mode-social-inc",
    "Behördlich dokumentierter US-Fall zu sensiblen Standortdaten"
  ],
  "privacy": [
    "BfDI · Datenschutz und Kinderschutz",
    "https://www.bfdi.bund.de/SharedDocs/Downloads/DE/Flyer/Datenschutz-Kinderschutz.pdf?__blob=publicationFile&v=16",
    "Information der Datenschutzaufsicht"
  ],
  "chat": [
    "klicksafe · Regeln für den Klassenchat",
    "https://www.klicksafe.de/news/regeln-fuer-ein-respektvolles-miteinander-im-klassenchat",
    "Unterrichtsmaterial zur gemeinsamen Regelentwicklung"
  ],
  "groom": [
    "klicksafe · Cybergrooming",
    "https://www.klicksafe.de/cybergrooming",
    "Präventionswissen und Hilfeangebote"
  ],
  "violence": [
    "Polizeiliche Kriminalprävention · Handygewalt",
    "https://www.polizei-beratung.de/themen-und-tipps/jugendkriminalitaet/handygewalt/",
    "Präventionsinformation; aktuelle Rechtsfragen gesondert prüfen"
  ],
  "communication": [
    "Schulz von Thun Institut · Kommunikationsquadrat",
    "https://www.schulz-von-thun.de/die-modelle/das-kommunikationsquadrat",
    "Vier Seiten: Sachinhalt, Selbstkundgabe, Beziehung, Appell"
  ],
  "sensors": [
    "RWTH Aachen · phyphox-Experimente",
    "https://phyphox.org/experiments/",
    "Werkzeug und Versuchsanregungen"
  ],
  "museum": [
    "Staatliche Schlösser und Gärten Hessen · Kloster Konradsdorf",
    "https://www.schloesser-hessen.de/de/kloster-konradsdorf",
    "Historischer Ausgangspunkt; Foto- und Besuchsregeln vor Ort klären"
  ],
  "kmk": [
    "KMK · Bildung in der digitalen Welt",
    "https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildung-in-der-digitalen-welt.html",
    "Fächerübergreifender Kompetenzrahmen"
  ],
  "law": [
    "Hessen · Schulrecht",
    "https://kultus.hessen.de/schulsystem/schulrecht",
    "Ausgangspunkt für aktuelle Schulform- und Bewertungsregeln; andere Länder gesondert prüfen"
  ],
  "games-attention": [
    "Bediou et al. · Actionspiele und Aufmerksamkeit",
    "https://pubmed.ncbi.nlm.nih.gov/29172564/",
    "Metaanalyse, 2018; genrespezifische Effekte und Publikationsverzerrung"
  ],
  "games-transfer": [
    "Sala et al. · Gaming und allgemeine kognitive Fähigkeiten",
    "https://pubmed.ncbi.nlm.nih.gov/29239631/",
    "Metaanalyse, 2018; Grenzen des Transfers"
  ],
  "games-current": [
    "Zhao et al. · Gaming und kognitive Fähigkeiten",
    "https://pubmed.ncbi.nlm.nih.gov/42184801/",
    "Systematischer Review und Metaanalyse, 2026; kleine Effekte und unterschiedliche Studiendesigns"
  ]
};
const projectLibrary = [
  {
    "id": "bildschirmzeit",
    "area": "general",
    "subject": "Klassenstunde",
    "title": "Bildschirmzeit: Was steckt in der Zahl?",
    "question": "Wann bereichert digitale Zeit unseren Alltag – und wann verdrängt sie etwas Wichtiges?",
    "brief": "Unterhaltung, Erholung, Lernen und Kontakt stehen neben Schlaf, Bewegung, Stress und Kontrollverlust. Gemeinsam entsteht eine begründete Vereinbarung.",
    "product": "Nutzungslandkarte und Klassenvereinbarung mit Überprüfungstermin",
    "tool": "Private Geräteanzeige, anonymes Klassendiagramm, Quellenkarten",
    "analog": "Papier-Zeitbudget und Gespräch ohne Geräte",
    "everyday": "Eine selbst gewählte kleine Veränderung erproben, ohne persönliche Nutzungsdaten abzugeben.",
    "steps": [
      "ICH: Nur für dich notieren, wofür du Medien nutzt und wie du dich davor und danach fühlst. Bildschirmzeit des Smartphones ist nicht die gesamte Medienzeit; Hintergrundmusik und parallele Geräte erschweren den Vergleich.",
      "WIR und JIM: Anonyme Aggregate lesen. Altersgruppe, Erhebungsmethode und Zeitraum nennen; die Klasse steht nicht für ganz Deutschland. Niemand muss seinen persönlichen ICH-Wert zeigen.",
      "Quellenwerkstatt: AWMF-Empfehlungen und WHO-Gaming-Kriterien lesen; medizinische Evidenz von Eltern- und Schülerpositionen unterscheiden. Nutzen und Belastung an fiktiven Alltagssituationen diskutieren.",
      "Konsens: Zwei bis vier konkrete Regeln für Schlaf, Pausen und Erreichbarkeit aushandeln. Unterschiedliche Bedürfnisse zulassen und nach zwei Wochen gemeinsam überprüfen."
    ],
    "evidence": "Minuten allein ergeben keine Diagnose. Die WHO beschreibt bei Gaming unter anderem Kontrollverlust, Vorrang vor anderen Aktivitäten und Fortsetzen trotz negativer Folgen mit erheblicher Beeinträchtigung, normalerweise über mindestens zwölf Monate. Das gilt speziell für Gaming, nicht als pauschaler Test für jede App. Bei anhaltender Belastung vertraulich Unterstützung anbieten.",
    "sources": [
      "jim",
      "health",
      "who",
      "parents",
      "students"
    ],
    "years": "7–10",
    "duration": "3 × 45 Minuten + Rückblick",
    "curriculum": "An das schulinterne Curriculum und die Lerngruppe anpassen."
  },
  {
    "id": "apps-datenspuren",
    "area": "general",
    "subject": "Klassenstunde",
    "title": "Apps, Vorteile und Datenspuren",
    "question": "Was gewinnen wir mit einer App – und welche Informationen geben wir dafür preis?",
    "brief": "Die anonym häufigsten Apps der Klasse werden nach Nutzen, Geschäftsmodell, Aufmerksamkeit, Privatsphäre und Bildrechten verglichen.",
    "product": "App-Steckbriefe und Entscheidungsraster",
    "tool": "Öffentliche Hilfeseiten, Datenschutztexte und vorbereitete Beispieldaten",
    "analog": "Informationskarten und gedruckte Berechtigungslisten",
    "everyday": "Vor einer Installation gezielt Berechtigungen, Kontoeinstellungen und Veröffentlichung prüfen.",
    "steps": [
      "Auswahl: Zwei bis drei Apps anhand der freigegebenen WIR-Rangliste wählen. Unterschiede zur JIM-Gruppe besprechen; keine Rangliste guter oder schlechter Menschen erstellen.",
      "Recherche: Pro App je einen Nutzenfall, einen Nachteil und konkrete Angaben zu Daten, Berechtigungen, Altersvorgaben und Kontrollmöglichkeiten mit Datum belegen. Keine privaten Profile vorführen.",
      "Datenspuren: Metadaten eines vorbereiteten Fotos und eine fiktive Standortspur untersuchen. Der dokumentierte FTC-Fall X-Mode zeigt, warum scheinbar unscheinbare Standortdaten sensibel sein können.",
      "Abwägen: Bildrechte, Einwilligung und Weiterleiten mit Fallkarten besprechen. Eine sinnvolle Einstellung oder Alternative begründen. Interviews ehemaliger Geheimdienstmitarbeiter können als zu prüfende Behauptung dienen; Identität, Datum, Belege und Interessen prüfen, nicht als alleinige Quelle."
    ],
    "evidence": "Öffentliche Datenschutzerklärungen beschreiben Anbieterangaben, nicht automatisch die vollständige tatsächliche Datenpraxis. Ein US-Verfahren belegt einen konkreten Fall und lässt sich nicht ungeprüft auf jede App übertragen. Keine echten Personen deanonymisieren oder Standortdaten kaufen.",
    "sources": [
      "jim",
      "privacy",
      "data",
      "parents",
      "students"
    ],
    "years": "7–10",
    "duration": "3 × 45 Minuten",
    "curriculum": "An das schulinterne Curriculum und die Lerngruppe anpassen."
  },
  {
    "id": "sieben-perspektiven",
    "area": "general",
    "subject": "Klassenrat / Tutorenstunde",
    "title": "Sieben Fragen. Sieben Gespräche.",
    "question": "Welche Bedürfnisse, Gewohnheiten und Handlungsmöglichkeiten stecken hinter unseren Antworten?",
    "brief": "Jede der sieben Abschlussfragen wird in einer eigenen Stunde aus persönlicher, gesellschaftlicher und fachlicher Perspektive besprochen.",
    "product": "Sieben Gesprächskarten und eine freiwillige persönliche Handlungsoption",
    "tool": "Anonyme WIR-Verteilungen, JIM-Vergleich und Quellenkarten",
    "analog": "Stuhlkreis, Positionskarten und Gesprächsprotokoll",
    "everyday": "Wahrnehmen, was hilft, was belastet und welche Unterstützung erreichbar ist.",
    "steps": [
      "Einstieg (5 Min.): Eine fiktive Situation statt persönlicher Offenlegung. Jede Person darf passen.",
      "Einordnen (10 Min.): ICH bleibt privat; WIR-Verteilung und JIM-Vergleich anschauen. Auch Minderheitsantworten und Unterschiede der Stichproben beachten.",
      "Perspektiven (15 Min.): Gruppen trennen Forschung / medizinische Empfehlungen, Elternposition, Schülerposition und Alltagserfahrungen. Aussage, Beleg, Reichweite und offene Frage notieren.",
      "Diskussion (10 Min.): Argumente austauschen, Nutzen und Belastung anerkennen. Konsens über einen hilfreichen Handlungsschritt suchen; begründeten Dissens festhalten.",
      "Abschluss (5 Min.): Eine freiwillige, realistische Idee und einen Rückblicktermin festlegen. Kein öffentliches Sucht-Ranking und keine Bewertung persönlicher Antworten."
    ],
    "evidence": "Zu jedem Thema passende Fachquellen auswählen. AWMF dient der Prävention; Eltern- und Schülerverbände vertreten Interessen und sind keine medizinischen Gutachten. Die JIM-Antworten sind deskriptive Vergleichsdaten und belegen keine Ursache.",
    "sources": [
      "jim",
      "health",
      "parents",
      "students"
    ],
    "years": "7–10",
    "duration": "7 × 45 Minuten",
    "curriculum": "An das schulinterne Curriculum und die Lerngruppe anpassen."
  },
  {
    "id": "klassenchat",
    "area": "general",
    "subject": "Prävention / Klassenrat",
    "title": "Klassenchat: Verbinden statt verletzen",
    "question": "Wie bleibt unser digitaler Austausch hilfreich, respektvoll und sicher?",
    "brief": "Cybermobbing, Cybergrooming und Gewaltprävention werden mit fachkundigen Partnern und einem klaren Hilfeweg verbunden.",
    "product": "Chatvereinbarung, Hilfeweg-Karte und Präventionsplan",
    "tool": "Fiktive Chats und Materialien von klicksafe / Polizei",
    "analog": "Moderiertes Rollengespräch ohne Täter-Opfer-Inszenierung",
    "everyday": "Grenzen erkennen, Hilfe holen, Konflikte deeskalieren und nicht unbedacht weiterleiten.",
    "steps": [
      "Mit anonymen, erfundenen Chatfällen zwischen Missverständnis, Streit und gezielter Ausgrenzung unterscheiden. Betroffene werden nicht aufgefordert, Erlebnisse vor der Klasse zu erzählen.",
      "Reaktionswege entwickeln: Grenzen benennen, Unterstützung bei einer vertrauten erwachsenen Person holen, Plattform-Meldung kennen. Problematische oder intime Inhalte nicht weiterverbreiten.",
      "Cybergrooming altersgerecht mit klicksafe-Material und geschulten Fachkräften bearbeiten. Keine Kontaktaufnahme zu Tätern und keine realen Lockprofile als Schulprojekt.",
      "Gemeinsam Regeln für Einladungen, Bilder, Ruhezeiten, Moderation und Konflikte vereinbaren. Polizei-Präventionsangebot zu Handygewalt und Schulsozialarbeit einbinden; örtliches Angebot und Schutzkonzept abstimmen."
    ],
    "evidence": "Prävention braucht sichere Gesprächsräume und erreichbare Hilfe. Bei konkreten Gefährdungen greift der schulische Schutz- und Interventionsweg; eine Unterrichtsdiskussion ersetzt keine professionelle Unterstützung.",
    "sources": [
      "chat",
      "groom",
      "violence"
    ],
    "years": "5–10, altersgerecht",
    "duration": "2–4 × 45 Minuten + Fachpartner",
    "curriculum": "An das schulinterne Curriculum und die Lerngruppe anpassen."
  },
  {
    "id": "mathematik",
    "area": "subject",
    "subject": "Mathematik",
    "title": "Eine Zahl, mehrere Geschichten",
    "question": "Wie verändern Mittelwert, Median und Diagrammwahl unsere Interpretation?",
    "brief": "Anonymisierte oder erfundene Wochenwerte auswerten und eine faire Darstellung entwickeln.",
    "product": "Statistikposter mit zwei Diagrammen und begründeter Interpretation",
    "tool": "Tabellenkalkulation",
    "analog": "Handrechnung und Diagramm auf Papier",
    "everyday": "Statistiken in Nachrichten, Fitness-Apps und Verbrauchsanzeigen kritisch lesen.",
    "steps": [
      "Datenbasis und fehlende Werte dokumentieren.",
      "Mittelwert, Median und zwei Darstellungen berechnen.",
      "Eine irreführende Grafik verbessern und deren Wirkung erklären."
    ],
    "evidence": "Korrelation ist keine Ursache; Klassenwerte sind keine repräsentative Deutschland-Stichprobe.",
    "sources": [
      "jim"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Daten und Zufall; beschreibende Statistik"
  },
  {
    "id": "sport",
    "area": "subject",
    "subject": "Sport",
    "title": "Bewegung sichtbar verbessern",
    "question": "Welches Bewegungsdetail lässt sich durch Zeitlupe besser erkennen?",
    "brief": "Eine Tanzfolge oder sportliche Technik filmen, anhand fachlicher Kriterien vergleichen und verbessern.",
    "product": "Lokales Kurzvideo mit kommentierten Vorher-Nachher-Bildern",
    "tool": "Kamera und Zeitlupe",
    "analog": "Partnerbeobachtung mit Kriterienbogen",
    "everyday": "Bewegungsabläufe beim Training selbstständig prüfen.",
    "steps": [
      "Bewegung und zwei technische Kriterien mit der Lehrkraft wählen.",
      "Nur mit Zustimmung aufnehmen; Kamera ohne fremde Personen ausrichten.",
      "Zeitlupe auswerten, Feedback umsetzen und analoge Beobachtung vergleichen."
    ],
    "evidence": "Kein TikTok-Konto und keine Veröffentlichung nötig. Gleichwertige Aufgabe ohne Personenaufnahme anbieten.",
    "sources": [
      "privacy"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Bewegung gestalten; Technik und Feedback"
  },
  {
    "id": "kunst",
    "area": "subject",
    "subject": "Kunst",
    "title": "Ein Motiv, zwei Wirkungen",
    "question": "Wie verändern Perspektive, Licht und Schnitt eine Bildaussage?",
    "brief": "Dasselbe eigene Motiv neutral und dramatisch gestalten und die Wirkung begründen.",
    "product": "Bildpaar oder kurzer Film mit gestalterischem Kommentar",
    "tool": "Kamera, Bildbearbeitung und Schnitt",
    "analog": "Skizze, Storyboard und Papiercollage",
    "everyday": "Werbung und Social-Media-Bilder verstehen; eigene Bilder bewusster gestalten.",
    "steps": [
      "Eigene Motive und Bildrechte klären.",
      "Zwei Fassungen mit bewusster Perspektive, Farbigkeit und Schnitt produzieren.",
      "Wirkung anhand der Gestaltungsentscheidungen erläutern."
    ],
    "evidence": "Bearbeitung kennzeichnen; Rechte von Personen, Musik und Bildmaterial klären.",
    "sources": [
      "privacy"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Bildsprache; Gestaltung und Rezeption"
  },
  {
    "id": "politik",
    "area": "subject",
    "subject": "Politik / Gesellschaftslehre",
    "title": "Was ein Clip mit uns macht",
    "question": "Wie lenken Kurz- und Langvideos Aufmerksamkeit und politische Deutung?",
    "brief": "Einen freigegebenen Kurzclip mit einem längeren Beitrag zum selben Thema vergleichen.",
    "product": "Analysekarte und sachlich neu gestalteter 60-Sekunden-Beitrag",
    "tool": "Videoanalyse, Transkript und lokaler Schnitt",
    "analog": "Zeitungsartikel und schriftlicher Kommentar",
    "everyday": "Emotionale Aufmerksamkeitsreize erkennen und Nachrichten vor dem Teilen prüfen.",
    "steps": [
      "Quelle, Datum, Schnitt und fehlenden Kontext prüfen.",
      "Emotionen, Appell und Behauptungen im Clip markieren.",
      "Eine überprüfbare Fassung mit Quellen und Gegenargument erstellen."
    ],
    "evidence": "Schulz von Thuns Kommunikationsquadrat hat vier Seiten. Länge allein sagt nichts über Wahrheit oder Qualität aus.",
    "sources": [
      "communication",
      "privacy"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Urteilsbildung; Medien und Demokratie"
  },
  {
    "id": "biologie",
    "area": "subject",
    "subject": "Biologie",
    "title": "Schlaf, Augen und digitale Gewohnheiten",
    "question": "Was zeigen Studien – und was bleibt bei Gaming und Bildschirmlicht offen?",
    "brief": "Behauptungen über Konzentration, Schlaf und Blaufilter mit Forschungsbefunden vergleichen.",
    "product": "Evidenzposter: Behauptung, Befund, Unsicherheit, Alltagsschluss",
    "tool": "Quellenrecherche und Vergleichstabelle",
    "analog": "Gedruckte Studienkarten",
    "everyday": "Gesundheitswerbung prüfen und eigene Schlaf- und Pausenroutinen überdenken.",
    "steps": [
      "Werbeaussagen und Alltagserfahrungen sammeln, ohne sie als Beweis zu behandeln.",
      "Stichprobe, Studiendesign und Ergebnisse vergleichen: Befunde zu spezifischen Aufmerksamkeitsaufgaben nach Actionspielen der Frage nach allgemeiner Konzentration und Alltagstransfer gegenüberstellen.",
      "Nutzen, Grenzen und offene Fragen zum Alltagstransfer festhalten."
    ],
    "evidence": "Cochrane findet keinen klaren kurzfristigen Vorteil von Blaufilter-Brillen gegen Augenbelastung; Schlafbefunde sind unsicher. Die untersuchten Erwachsenen sind nicht automatisch auf Jugendliche übertragbar. Netzhautschutz wurde in den eingeschlossenen Studien nicht geprüft. Keine Schlafentzugs- oder Überlastungsversuche. Metaanalysen berichten teils Vorteile in spezifischen Aufmerksamkeitsaufgaben nach Actionspielen; daraus folgt keine allgemeine Verbesserung von Konzentration, Schulleistung oder Gesundheit. Studienauswahl, Kontrollgruppen und Publikationsverzerrung mitprüfen. Eine neuere Metaanalyse (2026) berichtet kleine positive Zusammenhänge beziehungsweise Effekte bei verschiedenen kognitiven Aufgaben. Beobachtungsstudien und kontrollierte Versuche getrennt betrachten; daraus folgt keine Empfehlung für längere Spielzeiten.",
    "sources": [
      "eyes",
      "health",
      "who",
      "games-attention",
      "games-transfer",
      "games-current"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Nervensystem; Sinnesorgane; Gesundheit"
  },
  {
    "id": "geschichte",
    "area": "subject",
    "subject": "Geschichte",
    "title": "Ein Ort erzählt Geschichte",
    "question": "Wie wird aus einem historischen Ort ein quellenkritischer Rundgang?",
    "brief": "Für Kloster Konradsdorf oder einen anderen lokalen Ort einen digitalen Rundgang mit belegten Stationen planen.",
    "product": "Virtueller Rundgang mit fünf Stationen und Quellenverzeichnis",
    "tool": "Eigene Fotos, Audio und offline nutzbare Präsentation",
    "analog": "Gedruckter Rundgang oder Ausstellungstafel",
    "everyday": "Museen und Erinnerungsorte kritisch und selbstständig erschließen.",
    "steps": [
      "Quellen und fachliche Leitfrage zum Ort auswählen.",
      "Stationen gestalten; gesicherte Information von Rekonstruktion trennen.",
      "Eine Testperson den Rundgang prüfen lassen und Barrieren verbessern."
    ],
    "evidence": "Besuchs-, Aufnahme- und Nutzungsrechte klären; keine fremden Personen fotografieren.",
    "sources": [
      "museum"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Historische Quellen; lokale Geschichte und Erinnerung"
  },
  {
    "id": "informatik",
    "area": "subject",
    "subject": "Informatik",
    "title": "Vom Touch zum Bild",
    "question": "Wie wird eine Berührung zu einer sichtbaren Reaktion?",
    "brief": "Eingabe, Verarbeitung und Ausgabe am Smartphone modellieren und einen lokalen Prototyp bauen.",
    "product": "EVA-Modell und klickbarer Prototyp",
    "tool": "Lokales Programm oder schulisch freigegebenes Werkzeug",
    "analog": "Papierprototyp und Rollenspiel der Verarbeitung",
    "everyday": "Technik verstehen und Fehler systematisch eingrenzen.",
    "steps": [
      "Touch, Tastatur und Maus als Eingaben vergleichen.",
      "Verarbeitung und Ausgabe im Modell beschreiben.",
      "Prototyp testen und eine fehlerhafte Eingabe erklären."
    ],
    "evidence": "Kapazitiver Touch und Softwareverarbeitung unterscheiden; keine privaten Geräte öffnen.",
    "sources": [
      "kmk"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Informatiksysteme; EVA und Algorithmen"
  },
  {
    "id": "physik",
    "area": "subject",
    "subject": "Physik",
    "title": "Das Handy als Messgerät",
    "question": "Wie genau misst ein Smartphone Bewegung und Zeit?",
    "brief": "Ein sicheres Experiment mit Zeitlupe oder Beschleunigungssensor planen und Messunsicherheit auswerten.",
    "product": "Messprotokoll mit Diagramm und Fehlerbetrachtung",
    "tool": "phyphox oder Zeitlupenkamera",
    "analog": "Stoppuhr, Maßband und manuelle Messreihe",
    "everyday": "Geschwindigkeitsanzeigen und Sensordaten mit ihren Grenzen verstehen.",
    "steps": [
      "Messfrage, Einheiten und Kalibrierung klären.",
      "Sichere Bewegung auf festgelegter Strecke wiederholt messen.",
      "Digitale und analoge Werte mit Fehlerquellen vergleichen."
    ],
    "evidence": "Beschleunigung inklusive Schwerkraft ist nicht automatisch Geschwindigkeit. Geräte sichern; keine Messungen im Straßenverkehr.",
    "sources": [
      "sensors"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Kinematik; Messunsicherheit und Sensorik"
  },
  {
    "id": "physik-display",
    "area": "subject",
    "subject": "Physik",
    "title": "Wie wird ein Pixel bunt?",
    "question": "Wie erzeugen Displays Farben und wie reagiert ein Touchscreen?",
    "brief": "RGB-Farbmischung modellieren und Anzeige von Eingabetechnik unterscheiden.",
    "product": "Erklärmodell mit Farbexperiment",
    "tool": "RGB-Simulation und Makroaufnahme eines freigegebenen Displays",
    "analog": "Farbkarten und additive Lichtmischung mit geeignetem Unterrichtsmaterial",
    "everyday": "Displaywerbung und technische Begriffe einordnen.",
    "steps": [
      "RGB-Mischung mit drei Grundfarben untersuchen.",
      "Pixelstruktur skizzieren und LCD / OLED recherchieren.",
      "Touch-Eingabe und Bildausgabe in einer Erklärung auseinanderhalten."
    ],
    "evidence": "Keine Geräte zerlegen, keine direkte Betrachtung starker Lichtquellen.",
    "sources": [
      "kmk"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Optik; Licht und elektrische Systeme"
  },
  {
    "id": "chemie",
    "area": "subject",
    "subject": "Chemie",
    "title": "Ein Experiment verständlich erklären",
    "question": "Welche Darstellung macht einen chemischen Vorgang fachlich nachvollziehbar?",
    "brief": "Ein freigegebenes Unterrichtsexperiment als Film und als Bildfolge erklären.",
    "product": "Erklärvideo plus fachliches Versuchsprotokoll",
    "tool": "Kamera, Schnitt und Sprechertext",
    "analog": "Gezeichnete Bildfolge",
    "everyday": "Anleitungen und wissenschaftliche Erklärungen auf Genauigkeit prüfen.",
    "steps": [
      "Experiment und Schutzmaßnahmen durch die Lehrkraft freigeben.",
      "Beobachtung, Deutung und Teilchenmodell getrennt darstellen.",
      "Film mit Bildfolge vergleichen und fachliche Fehler korrigieren."
    ],
    "evidence": "Nur zugelassene Schulversuche unter Aufsicht; das Filmen darf Schutz und Konzentration nicht beeinträchtigen.",
    "sources": [
      "kmk"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Experimentieren; Stoffumwandlung und Modelle"
  },
  {
    "id": "deutsch",
    "area": "subject",
    "subject": "Deutsch",
    "title": "Vier Seiten einer Nachricht",
    "question": "Wie verändert das Medium die Wirkung derselben Botschaft?",
    "brief": "Eine eigene Nachricht als Text, Audio und Kurzvideo gestalten.",
    "product": "Medienvergleich mit Kommunikationsanalyse",
    "tool": "Tonaufnahme und lokales Video",
    "analog": "Dialog oder szenische Lesung",
    "everyday": "Missverständnisse in Chats erkennen und präziser kommunizieren.",
    "steps": [
      "Botschaft mit Sachinhalt, Selbstkundgabe, Beziehung und Appell analysieren.",
      "Drei Fassungen mit bewusst unterschiedlichen Gestaltungsmitteln erstellen.",
      "Wirkung mit neutralem Feedback vergleichen."
    ],
    "evidence": "Vier-Seiten-Modell als Analysehilfe, nicht als sichere Aussage über fremde Gedanken verwenden.",
    "sources": [
      "communication"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Kommunikation; Sprache und Medien"
  },
  {
    "id": "fremdsprachen",
    "area": "subject",
    "subject": "Fremdsprachen",
    "title": "Ein Audioguide für echte Begegnungen",
    "question": "Wie erklären wir einen Ort verständlich in einer anderen Sprache?",
    "brief": "Einen zweisprachigen Audioguide oder Alltagserklärfilm entwickeln.",
    "product": "Audioguide mit Transkript und Wortschatzhilfe",
    "tool": "Aufnahme, Aussprachehilfe und Schnitt",
    "analog": "Dialog, Broschüre oder Führung",
    "everyday": "Reisen, Begegnungen und Sprachenlernen selbstständig unterstützen.",
    "steps": [
      "Adressaten und Sprachniveau festlegen.",
      "Text selbst schreiben; Hilfsmittel dokumentieren.",
      "Verständlichkeit testen und Aufnahme verbessern."
    ],
    "evidence": "Übersetzungswerkzeuge prüfen; eigene Sprachleistung und Hilfsmittel transparent machen.",
    "sources": [
      "museum",
      "kmk"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Sprechen; Sprachmittlung und interkulturelles Lernen"
  },
  {
    "id": "musik",
    "area": "subject",
    "subject": "Musik",
    "title": "Klang gestalten statt nur streamen",
    "question": "Wie verändern Tempo, Rhythmus und Sound eine Szene?",
    "brief": "Eigene Klänge aufnehmen und dieselbe Szene unterschiedlich vertonen.",
    "product": "Zwei Soundfassungen mit musikalischer Begründung",
    "tool": "Aufnahme und Audiobearbeitung",
    "analog": "Instrumente und Live-Vertonung",
    "everyday": "Audio bewusst hören, bearbeiten und rechtssicher verwenden.",
    "steps": [
      "Eigene oder freigegebene Klänge auswählen.",
      "Rhythmus und Wirkung in zwei Fassungen gestalten.",
      "Digitalen und live gespielten Weg vergleichen."
    ],
    "evidence": "Keine ungeklärten Musikrechte; Gehör schützen und Lautstärke passend halten.",
    "sources": [
      "privacy"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Musik gestalten; Klang und Wirkung"
  },
  {
    "id": "geografie",
    "area": "subject",
    "subject": "Geografie",
    "title": "Karten führen uns – aber wohin?",
    "question": "Wie unterscheiden sich digitale Routenvorschläge und unsere Ortskenntnis?",
    "brief": "Eine sichere öffentliche Route mit Karte und Navigation planen und kritisch vergleichen.",
    "product": "Routenkarte mit Kriterien und Fehleranalyse",
    "tool": "Schulisch freigegebene Kartenanwendung",
    "analog": "Papierkarte und Kompass",
    "everyday": "Wege bewusster planen und Standortfreigaben prüfen.",
    "steps": [
      "Route anhand Entfernung, Zugänglichkeit und Sicherheit bewerten.",
      "GPS-Ortung, Kartendaten und Routenberechnung als verschiedene Prozesse beschreiben.",
      "Mit Papierkarte vergleichen und Abweichungen begründen."
    ],
    "evidence": "Keine Wohnadressen oder privaten Bewegungsprofile teilen; Karten sind keine Sicherheitsgarantie.",
    "sources": [
      "privacy",
      "data"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Orientierung; Geodaten und Mobilität"
  },
  {
    "id": "ethik",
    "area": "subject",
    "subject": "Ethik / Religion",
    "title": "Erreichbar sein – verantwortlich handeln",
    "question": "Was schulden wir einander im digitalen Raum?",
    "brief": "Dilemmata zu Erreichbarkeit, Anerkennung und dem Weiterleiten von Bildern diskutieren.",
    "product": "Begründetes Urteil und gemeinsam ausgehandelte Leitlinien",
    "tool": "Fiktive Chatkarten und Quellenrecherche",
    "analog": "Dilemmagespräch im Stuhlkreis",
    "everyday": "Grenzen respektieren und Entscheidungen begründen.",
    "steps": [
      "Interessen und Rechte verschiedener Beteiligter herausarbeiten.",
      "Eine Handlung aus mehreren ethischen Perspektiven abwägen.",
      "Einen praktikablen Grundsatz mit begründeten Ausnahmen formulieren."
    ],
    "evidence": "Keine persönlichen Glaubens- oder Konfliktgeschichten verlangen.",
    "sources": [
      "chat",
      "parents",
      "students"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Verantwortung; Würde und Gemeinschaft"
  },
  {
    "id": "wirtschaft",
    "area": "subject",
    "subject": "Wirtschaft / Arbeitslehre",
    "title": "Wenn Aufmerksamkeit zum Geschäftsmodell wird",
    "question": "Wie finanzieren sich kostenlose Angebote?",
    "brief": "Werbung, Abonnements und In-App-Käufe anhand fiktiver Nutzerprofile vergleichen.",
    "product": "Geschäftsmodellkarte und begründete Verbraucherentscheidung",
    "tool": "Öffentliche Preis- und Hilfeseiten, Tabellenkalkulation",
    "analog": "Budgetplan auf Papier",
    "everyday": "Kosten, Werbung und Datenfreigaben vor einer Nutzung abwägen.",
    "steps": [
      "Drei Finanzierungsmodelle erklären.",
      "Kosten und Datenwege an fiktiven Beispielen vergleichen.",
      "Eine Entscheidung für ein konkretes Budget begründen."
    ],
    "evidence": "Keine Käufe, Accounts oder echten Zahlungsdaten für das Projekt. Preise mit Datum belegen.",
    "sources": [
      "privacy",
      "data"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Konsum; Unternehmen und Verbraucherbildung"
  },
  {
    "id": "technik",
    "area": "subject",
    "subject": "Technik / Werken",
    "title": "Ein Hilfsmittel für den Alltag",
    "question": "Welches Problem lässt sich mit einem einfachen digitalen Prototyp lösen?",
    "brief": "Eine Erinnerung, Bedienhilfe oder Orientierungshilfe entwickeln und mit einer analogen Lösung vergleichen.",
    "product": "Funktionsfähiger oder simulierter Prototyp mit Testprotokoll",
    "tool": "Lokales Programm oder schulischer Mikrocontroller",
    "analog": "Mechanische oder papierbasierte Lösung",
    "everyday": "Technik zielgerichtet entwickeln statt nur konsumieren.",
    "steps": [
      "Bedarf und nutzende Personen beschreiben.",
      "Prototyp ohne sensible Daten bauen.",
      "Bedienbarkeit, Aufwand und Nutzen testen."
    ],
    "evidence": "Keine sicherheitskritische Anwendung; Konstruktionen durch die Lehrkraft prüfen lassen.",
    "sources": [
      "kmk"
    ],
    "years": "7–13, anpassbar",
    "duration": "3–4 Unterrichtsstunden",
    "curriculum": "Technisches Problemlösen; Konstruktion und Evaluation"
  }
];
const reflectionQuestions = [
  [
    "Selbststeuerung",
    "Mehr Zeit als geplant",
    "Welche Funktionen helfen beim Aufhören, welche erschweren es?",
    "Belohnung, Gewohnheit und Kontrollmöglichkeiten; Gaming-Kriterien nicht pauschal auf alle Medien übertragen."
  ],
  [
    "Offline-Zeit",
    "Zeit ohne Handy genießen",
    "Welche digitalen und analogen Aktivitäten tun uns gut?",
    "Erholung und soziale Teilhabe vergleichen; keine allgemeine Pflicht zur digitalen Abstinenz."
  ],
  [
    "Nachrichtenüberfluss",
    "Zu viele Nachrichten",
    "Welche Erreichbarkeit wünschen wir – und welche brauchen wir wirklich?",
    "Gruppendruck, Kommunikation und Benachrichtigungseinstellungen; Klassenchat-Regeln aushandeln."
  ],
  [
    "FOMO",
    "Angst, etwas zu verpassen",
    "Was schafft Zugehörigkeit auch ohne ständige Kontrolle?",
    "Bedürfnisse, soziale Erwartungen und alternative Kontaktwege; keine Diagnose aus einer Antwort."
  ],
  [
    "Bewusste Regulation",
    "Das Handy bewusst ausschalten",
    "Welche Pause passt zu welchem Alltag?",
    "Konkrete Handlungsoptionen, familiäre Regeln und Notfallerreichbarkeit gegeneinander abwägen."
  ],
  [
    "Überforderung",
    "Viele Möglichkeiten von Social Media",
    "Was ist hilfreich, was zu viel – und wo bekommen wir Unterstützung?",
    "Informationsmenge, Vergleiche und Wohlbefinden; Perspektiven ernst nehmen, ohne Probleme öffentlich zuzuschreiben."
  ],
  [
    "Schlaf",
    "Nachts zu lange am Handy",
    "Wie schützen wir Schlaf und bleiben trotzdem verbunden?",
    "Schlafroutine, Erreichbarkeit und medizinische Empfehlungen; keine Schlafentzugsexperimente."
  ]
];
