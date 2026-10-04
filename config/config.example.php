<?php
return [
    'dsn' => 'mysql:host=127.0.0.1;dbname=handy_experiment;charset=utf8mb4',
    'user' => 'handy_app',
    'password' => 'CHANGE_ME',
    'base_url' => 'https://medienblick.harzenetter.eu', // no trailing slash; subdirectory supported
    'secure_cookies' => true, // false ONLY for localhost HTTP tests
    'contact_email' => '', // Betreiber-E-Mail für Lehrkräfteschlüssel
    'legal_notice' => 'Betreiberangaben müssen vor öffentlicher Inbetriebnahme ergänzt werden.',
    'session_path' => null, // optional private writable folder outside public/
];
