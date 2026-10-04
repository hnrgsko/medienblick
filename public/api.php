<?php
declare(strict_types=1);
ini_set('display_errors','0');
require dirname(__DIR__).'/app/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
try {
    beginSession(); cleanup();
    rate('global:all',12000);rate('session:all:'.$_SESSION['rate'],360);
    $route=$_GET['r']??'';
    $writes=['classes','start','draft','submit','publish','extend','moderate','delete'];
    $method=$_SERVER['REQUEST_METHOD']??'GET';
    if($method!==(in_array($route,$writes,true)?'POST':'GET'))fail(405,'HTTP-Methode nicht erlaubt.');
    if($route==='extend'){rate('extension:'.$_SESSION['rate'],10,600);rate('global:extension',100,600);}
    $d=[];
    if($method==='POST') {
        if(!hash_equals($_SESSION['csrf'],$_SERVER['HTTP_X_CSRF_TOKEN']??''))fail(403,'Sicherheitsprüfung fehlgeschlagen. Bitte Seite neu laden.');
        if(!str_starts_with($_SERVER['CONTENT_TYPE']??'','application/json'))fail(415,'JSON erwartet.');
        $raw=file_get_contents('php://input',false,null,0,16385);
        if(strlen($raw)>16384)fail(413,'Anfrage ist zu groß.');
        try{$d=json_decode($raw,true,32,JSON_THROW_ON_ERROR);}catch(JsonException){fail(400,'Ungültiges JSON.');}
        if(!is_array($d)||($d!==[]&&array_is_list($d)))fail(400,'JSON-Objekt erwartet.');
    }
    require dirname(__DIR__).'/app/service.php';
    // All result reads use a consistent DB snapshot. Writes lock class first.
    db()->beginTransaction();
    $out=dispatch($route,$d);
    db()->commit();
    session_write_close();
    echo json_encode($out,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
} catch(Throwable $e) {
    if(function_exists('db')) {try{if(db()->inTransaction())db()->rollBack();}catch(Throwable){}}
    $http=$e instanceof ApiError?$e->http:500;
    http_response_code($http);
    // Only diagnostic categories/codes: never exception messages, SQL, credentials,
    // request bodies, headers, tokens or stack traces (which may contain arguments).
    if($http===500) {
        $type = $e instanceof PDOException ? 'PDOException' :
            ($e instanceof ParseError ? 'ParseError' :
            ($e instanceof TypeError ? 'TypeError' : ($e instanceof Error ? 'Error' : 'Exception')));
        $code = preg_replace('/[^A-Za-z0-9_-]/', '', substr((string)$e->getCode(), 0, 16));
        $driver = $e instanceof PDOException && isset($e->errorInfo[1]) ? (int)$e->errorInfo[1] : 0;
        error_log(sprintf('Medienblick: internal error; type=%s; code=%s; driver=%d; source=%s:%d',
            $type, $code, $driver, basename($e->getFile()), $e->getLine()));
    }
    echo json_encode(['error'=>$e instanceof ApiError?$e->getMessage():'Die Anfrage konnte nicht verarbeitet werden. Bitte erneut versuchen.'],JSON_UNESCAPED_UNICODE);
}
