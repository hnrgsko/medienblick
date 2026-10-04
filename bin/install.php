<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/app/bootstrap.php';
if(query('SHOW TABLES')->fetch()) {fwrite(STDERR,"Installation abgebrochen: Datenbank ist nicht leer.\n");exit(1);}
$sql=file_get_contents(dirname(__DIR__).'/database/schema.sql');
db()->exec($sql);
echo "Schema installiert. Bitte Betreiberangaben und HTTPS konfigurieren.\n";
