<?php
declare(strict_types=1);
final class ApiError extends RuntimeException {
    public function __construct(public int $http, string $message) { parent::__construct($message); }
}
function config(): array {
    static $c;
    if ($c === null) {
        $path = getenv('HANDY_CONFIG') ?: dirname(__DIR__).'/config/config.php';
        if (!is_file($path)) throw new ApiError(503,'Die Anwendung ist noch nicht eingerichtet. Bitte die Lehrkraft informieren.');
        $c = require $path;
    }
    return $c;
}
function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $c=config();
        $pdo=new PDO($c['dsn'],$c['user'],$c['password'],[
            PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES=>false,
        ]);
        $pdo->exec("SET time_zone = '+00:00'");
    }
    return $pdo;
}
function query(string $sql, array $params=[]): PDOStatement {
    $q=db()->prepare($sql); $q->execute($params); return $q;
}
function token(): string { return bin2hex(random_bytes(32)); }
function digest(string $s): string { return hash('sha256',$s); }
function utc(?int $t=null): string { return gmdate('Y-m-d H:i:s',$t ?? time()); }
function iso(string $s): string { return str_replace(' ','T',$s).'Z'; }
function fail(int $code,string $msg): never { throw new ApiError($code,$msg); }
function cleanup(): int {
    $n=query('DELETE FROM classes WHERE expires_at <= UTC_TIMESTAMP()')->rowCount();
    query('DELETE FROM rate_limits WHERE expires_at <= UTC_TIMESTAMP()'); return $n;
}
function rate(string $bucket,int $max,int $seconds=60): void {
    $slot=(int)floor(time()/$seconds);
    $key=digest($bucket.':'.$slot);
    query('INSERT INTO rate_limits (bucket_hash,hits,expires_at) VALUES (?,1,?) ON DUPLICATE KEY UPDATE hits=hits+1',[$key,utc(($slot+1)*$seconds)]);
    if ((int)query('SELECT hits FROM rate_limits WHERE bucket_hash=?',[$key])->fetchColumn()>$max) {
        header('Retry-After: '.$seconds); fail(429,'Zu viele Anfragen. Bitte kurz warten und erneut versuchen.');
    }
}
function beginSession(): void {
    $c=config();
    ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1');
    ini_set('session.gc_maxlifetime','1800'); ini_set('session.gc_probability','1'); ini_set('session.gc_divisor','100');
    if (!empty($c['session_path'])) session_save_path($c['session_path']);
    session_name('handy_session');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$c['secure_cookies'],'httponly'=>true,'samesite'=>'Strict']);
    if(!@session_start())fail(503,'Sitzung konnte nicht gestartet werden. Bitte den Betreiber informieren.');
    $_SESSION['csrf'] ??= token();
    $_SESSION['rate'] ??= token();
}
function bearer(): string {
    $a=$_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer ([a-f0-9]{64})$/D',$a,$m)) fail(401,'Zugangsschlüssel fehlt oder ist ungültig.');
    return digest($m[1]);
}
function shortText(mixed $v,int $max,string $name): string {
    if (!is_string($v) || mb_strlen($v)>$max || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u',$v)) fail(422,$name.' ist ungültig.');
    return trim($v);
}
function validCode(): string {
    $s=strtoupper(trim((string)($_GET['code']??'')));
    if (!preg_match('/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/D',$s)) fail(404,'Klassencode nicht gefunden oder bereits abgelaufen.');
    return $s;
}
function classBy(string $field,string|int $value,bool $lock=false): array {
    if (!in_array($field,['id','class_code','admin_token_hash'],true)) throw new LogicException('Bad lookup');
    $c=query("SELECT * FROM classes WHERE $field=?".($lock?' FOR UPDATE':''),[$value])->fetch();
    if (!$c) fail(410,'Diese Klasse ist nicht verfügbar oder bereits gelöscht.');
    if (strtotime($c['expires_at'].' UTC') <= time()) fail(410,'Diese Klasse ist abgelaufen. Die Daten werden gelöscht.');
    return $c;
}
function responseAccess(bool $lock=false): array {
    $h=bearer();
    $id=query('SELECT class_id FROM responses WHERE resume_token_hash=?',[$h])->fetchColumn();
    if (!$id) fail(410,'Deine Teilnahme ist nicht verfügbar oder bereits gelöscht.');
    $c=classBy('id',(int)$id,$lock);
    $r=query('SELECT * FROM responses WHERE resume_token_hash=?'.($lock?' FOR UPDATE':''),[$h])->fetch();
    if (!$r) fail(410,'Deine Teilnahme ist nicht mehr verfügbar.');
    return [$c,$r];
}
function meta(array $c): array {
    return ['code'=>$c['class_code'],'label'=>$c['class_label'],'age_group'=>$c['jim_age_group'],
        'expected'=>$c['expected_participants'],'created_at'=>iso($c['created_at']),
        'expires_at'=>iso($c['expires_at']),'max_expires_at'=>iso($c['max_expires_at']),
        'public'=>(bool)$c['results_public'],'extension_count'=>(int)$c['extension_count'],
        'n'=>(int)query("SELECT COUNT(*) FROM responses WHERE class_id=? AND status='submitted'",[$c['id']])->fetchColumn(),
        'weeks'=>query('SELECT week_number,label,start_date,end_date FROM class_weeks WHERE class_id=? ORDER BY week_number',[$c['id']])->fetchAll()];
}
function own(array $r): array {
    $o=['status'=>$r['status'],'items'=>[],'screen'=>[],'apps'=>[],'reflection'=>$r['reflection']];
    for($i=1;$i<=7;$i++) $o['items'][]=$r[sprintf('jim_%02d',$i)]===null?null:(int)$r[sprintf('jim_%02d',$i)];
    for($i=1;$i<=6;$i++) $o['screen'][]=$r['screen_week_'.$i]===null?null:(float)$r['screen_week_'.$i];
    for($i=1;$i<=3;$i++) if($r['app_'.$i.'_original']!==null) $o['apps'][]=$r['app_'.$i.'_original'];
    return $o;
}
