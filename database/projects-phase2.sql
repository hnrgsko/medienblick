-- Optionales SEPARATES Schema / eigene Datenbank. Nicht vom MVP verwendet.
-- Keine Fremdschlüssel, Codes, Response-IDs oder Tokens aus der Befragung.
CREATE TABLE project_ideas (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 subject VARCHAR(80) NOT NULL,
 title VARCHAR(160) NOT NULL,
 description TEXT NOT NULL,
 curriculum TEXT NOT NULL,
 learning_product TEXT NOT NULL,
 media_use TEXT NOT NULL,
 participant_limit SMALLINT UNSIGNED NULL,
 lesson_integration TEXT NOT NULL,
 assessment TEXT NOT NULL,
 substitute_performance TEXT NOT NULL,
 open_questions TEXT NOT NULL,
 technology TEXT NOT NULL,
 material TEXT NOT NULL,
 notes TEXT NOT NULL,
 status ENUM('ENTWURF','ABSTIMMUNG','SCHULLEITUNGSPLANUNG','FREIGEGEBEN','VERÖFFENTLICHT') NOT NULL DEFAULT 'ENTWURF',
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX(status,subject)
) ENGINE=InnoDB;
-- Künftige Redaktion benötigt eigene Authentifizierung und protokollierte Freigaben.
-- Schülerabfrage ausschließlich WHERE status='VERÖFFENTLICHT'.
