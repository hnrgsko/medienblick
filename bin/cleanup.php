<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/app/bootstrap.php';
try { $n=cleanup(); echo utc()." UTC: $n abgelaufene Klassen gelöscht.\n"; }
catch(Throwable){fwrite(STDERR,"Cleanup fehlgeschlagen. Verbindung und DB-Rechte prüfen.\n");exit(1);}
