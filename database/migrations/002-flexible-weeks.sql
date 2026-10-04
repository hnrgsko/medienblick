-- Medienblick: flexible Beobachtungsdauer (1 bis 52 Wochen).
-- In phpMyAdmin die BESTEHENDE Medienblick-Datenbank auswählen und importieren.
-- Keine Tabellen/Antworten werden gelöscht. Wiederholter Import ist möglich.
-- MySQL 8 / MariaDB 10.6+. Vorhandene sechs Wochenmittel bleiben lesbar.
SET NAMES utf8mb4;
SET @context_missing = (SELECT COUNT(*)=0 FROM information_schema.COLUMNS
 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='class_weeks' AND COLUMN_NAME='context_type');
SET @sql = IF(@context_missing,
 "ALTER TABLE class_weeks ADD COLUMN context_type ENUM('ferien','schule','praktikum','sonstiges') NOT NULL DEFAULT 'sonstiges' AFTER label", 'SELECT 1');
PREPARE mb_update FROM @sql;
EXECUTE mb_update;
DEALLOCATE PREPARE mb_update;
UPDATE class_weeks SET context_type=CASE
 WHEN label LIKE 'Ferien%' THEN 'ferien'
 WHEN label LIKE 'Schule%' THEN 'schule'
 WHEN label LIKE 'Praktikum%' THEN 'praktikum'
 ELSE 'sonstiges' END WHERE @context_missing=1;

-- Den automatisch benannten alten CHECK für week_number portabel ermitteln.
SET @range_name = (SELECT tc.CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS tc
 JOIN information_schema.CHECK_CONSTRAINTS cc
 ON cc.CONSTRAINT_SCHEMA=tc.CONSTRAINT_SCHEMA AND cc.CONSTRAINT_NAME=tc.CONSTRAINT_NAME
 WHERE tc.CONSTRAINT_SCHEMA=DATABASE() AND tc.TABLE_NAME='class_weeks'
 AND tc.CONSTRAINT_TYPE='CHECK' AND cc.CHECK_CLAUSE LIKE '%week_number%' LIMIT 1);
SET @sql = IF(@range_name IS NULL,'SELECT 1',CONCAT('ALTER TABLE class_weeks DROP ',
 IF(VERSION() LIKE '%MariaDB%','CONSTRAINT ','CHECK '),'`',REPLACE(@range_name,'`','``'),'`'));
PREPARE mb_update FROM @sql;
EXECUTE mb_update;
DEALLOCATE PREPARE mb_update;
ALTER TABLE class_weeks ADD CONSTRAINT class_weeks_number_range CHECK (week_number BETWEEN 1 AND 52);

-- Zuletzt anlegen: Die App erkennt an dieser Tabelle das fertige Update.
CREATE TABLE IF NOT EXISTS response_screen_weeks (
 response_id BIGINT UNSIGNED NOT NULL,
 week_number TINYINT UNSIGNED NOT NULL,
 minutes DECIMAL(7,2) NULL,
 PRIMARY KEY (response_id,week_number),
 FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE,
 CHECK (week_number BETWEEN 1 AND 52),
 CHECK (minutes IS NULL OR minutes BETWEEN 0 AND 1440)
) ENGINE=InnoDB;
