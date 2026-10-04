-- MySQL 8 / MariaDB 10.6+, UTC. Import into an empty database.
SET NAMES utf8mb4;
CREATE TABLE jim_datasets (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 study_year SMALLINT UNSIGNED NOT NULL,
 source_version VARCHAR(100) NOT NULL UNIQUE,
 source VARCHAR(1000) NOT NULL,
 population TEXT NOT NULL,
 verified BOOLEAN NOT NULL DEFAULT 0,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE jim_reference (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 dataset_id BIGINT UNSIGNED NOT NULL,
 study_year SMALLINT UNSIGNED NOT NULL,
 age_group ENUM('12-13','14-15','16-17','18-19') NOT NULL,
 metric_type ENUM('item_distribution','item_agreement','screen_mean','app_percentage') NOT NULL,
 item_id VARCHAR(80) NOT NULL,
 response_value TINYINT UNSIGNED NOT NULL DEFAULT 0,
 percentage DECIMAL(6,2) NULL,
 numeric_value DECIMAL(8,2) NULL,
 source VARCHAR(1000) NOT NULL,
 source_version VARCHAR(100) NOT NULL,
 UNIQUE KEY reference_metric (dataset_id,age_group,metric_type,item_id,response_value),
 FOREIGN KEY (dataset_id) REFERENCES jim_datasets(id),
 CHECK (percentage IS NULL OR percentage BETWEEN 0 AND 100)
) ENGINE=InnoDB;
CREATE TABLE classes (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 class_code CHAR(6) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
 admin_token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
 class_label VARCHAR(40) NOT NULL DEFAULT '',
 jim_age_group ENUM('12-13','14-15','16-17','18-19') NOT NULL,
 jim_dataset_id BIGINT UNSIGNED NOT NULL,
 expected_participants SMALLINT UNSIGNED NULL,
 created_at DATETIME NOT NULL,
 expires_at DATETIME NOT NULL,
 max_expires_at DATETIME NOT NULL,
 extension_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
 status ENUM('active') NOT NULL DEFAULT 'active',
 results_public BOOLEAN NOT NULL DEFAULT 0,
 INDEX (expires_at),
 FOREIGN KEY (jim_dataset_id) REFERENCES jim_datasets(id),
 CHECK (expires_at <= max_expires_at)
) ENGINE=InnoDB;
CREATE TABLE class_weeks (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 class_id BIGINT UNSIGNED NOT NULL,
 week_number TINYINT UNSIGNED NOT NULL,
 label VARCHAR(60) NOT NULL,
 start_date DATE NULL,
 end_date DATE NULL,
 UNIQUE KEY class_week (class_id,week_number),
 FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
 CHECK (week_number BETWEEN 1 AND 6),
 CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
) ENGINE=InnoDB;
CREATE TABLE responses (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 class_id BIGINT UNSIGNED NOT NULL,
 resume_token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
 status ENUM('draft','submitted') NOT NULL DEFAULT 'draft',
 jim_01 TINYINT UNSIGNED NULL CHECK (jim_01 BETWEEN 1 AND 4),
 jim_02 TINYINT UNSIGNED NULL CHECK (jim_02 BETWEEN 1 AND 4),
 jim_03 TINYINT UNSIGNED NULL CHECK (jim_03 BETWEEN 1 AND 4),
 jim_04 TINYINT UNSIGNED NULL CHECK (jim_04 BETWEEN 1 AND 4),
 jim_05 TINYINT UNSIGNED NULL CHECK (jim_05 BETWEEN 1 AND 4),
 jim_06 TINYINT UNSIGNED NULL CHECK (jim_06 BETWEEN 1 AND 4),
 jim_07 TINYINT UNSIGNED NULL CHECK (jim_07 BETWEEN 1 AND 4),
 screen_week_1 DECIMAL(7,2) NULL CHECK (screen_week_1 BETWEEN 0 AND 1440),
 screen_week_2 DECIMAL(7,2) NULL CHECK (screen_week_2 BETWEEN 0 AND 1440),
 screen_week_3 DECIMAL(7,2) NULL CHECK (screen_week_3 BETWEEN 0 AND 1440),
 screen_week_4 DECIMAL(7,2) NULL CHECK (screen_week_4 BETWEEN 0 AND 1440),
 screen_week_5 DECIMAL(7,2) NULL CHECK (screen_week_5 BETWEEN 0 AND 1440),
 screen_week_6 DECIMAL(7,2) NULL CHECK (screen_week_6 BETWEEN 0 AND 1440),
 app_1_original VARCHAR(60) NULL,
 app_1_normalized VARCHAR(60) NULL,
 app_2_original VARCHAR(60) NULL,
 app_2_normalized VARCHAR(60) NULL,
 app_3_original VARCHAR(60) NULL,
 app_3_normalized VARCHAR(60) NULL,
 reflection VARCHAR(2000) NOT NULL DEFAULT '',
 created_at DATETIME NOT NULL,
 submitted_at DATETIME NULL,
 INDEX class_status (class_id,status),
 FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE teacher_keys (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 key_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
 label VARCHAR(100) NOT NULL,
 active BOOLEAN NOT NULL DEFAULT 1,
 created_at DATETIME NOT NULL,
 expires_at DATETIME NULL
) ENGINE=InnoDB;
CREATE TABLE app_aliases (
 alias VARCHAR(60) PRIMARY KEY,
 canonical_name VARCHAR(60) NOT NULL
) ENGINE=InnoDB;
CREATE TABLE class_app_terms (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 class_id BIGINT UNSIGNED NOT NULL,
 normalized VARCHAR(60) NOT NULL,
 status ENUM('pending','approved','blocked') NOT NULL DEFAULT 'pending',
 UNIQUE KEY class_term (class_id,normalized),
 FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE rate_limits (
 bucket_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 hits INT UNSIGNED NOT NULL,
 expires_at DATETIME NOT NULL,
 INDEX (expires_at)
) ENGINE=InnoDB;
INSERT INTO jim_datasets (study_year,source_version,source,population,verified) VALUES
 (2025,'jim-2025-pending','https://mpfs.de/mediencheck/','12–19 Jahre. Noch keine verifizierten altersbezogenen Zahlen importiert.',0);
INSERT INTO app_aliases VALUES ('whatsapp','WhatsApp');
INSERT INTO app_aliases VALUES ('wa','WhatsApp');
INSERT INTO app_aliases VALUES ('whats app','WhatsApp');
INSERT INTO app_aliases VALUES ('instagram','Instagram');
INSERT INTO app_aliases VALUES ('insta','Instagram');
INSERT INTO app_aliases VALUES ('ig','Instagram');
INSERT INTO app_aliases VALUES ('youtube','YouTube');
INSERT INTO app_aliases VALUES ('yt','YouTube');
INSERT INTO app_aliases VALUES ('tiktok','TikTok');
INSERT INTO app_aliases VALUES ('tik tok','TikTok');
INSERT INTO app_aliases VALUES ('snapchat','Snapchat');
INSERT INTO app_aliases VALUES ('snap','Snapchat');
INSERT INTO app_aliases VALUES ('spotify','Spotify');
INSERT INTO app_aliases VALUES ('discord','Discord');
INSERT INTO app_aliases VALUES ('games','Games');
INSERT INTO app_aliases VALUES ('spiele','Games');
INSERT INTO app_aliases VALUES ('google/browser','Google/Browser');
INSERT INTO app_aliases VALUES ('google','Google/Browser');
INSERT INTO app_aliases VALUES ('browser','Google/Browser');
INSERT INTO app_aliases VALUES ('chatgpt/ki','ChatGPT/KI');
INSERT INTO app_aliases VALUES ('chatgpt','ChatGPT/KI');
INSERT INTO app_aliases VALUES ('ki','ChatGPT/KI');
INSERT INTO app_aliases VALUES ('schule/lernen','Schule/Lernen');
INSERT INTO app_aliases VALUES ('kamera/fotos','Kamera/Fotos');
INSERT INTO app_aliases VALUES ('telefon','Telefon');
INSERT INTO app_aliases VALUES ('signal','Signal');
INSERT INTO app_aliases VALUES ('sonstige','Sonstige');
