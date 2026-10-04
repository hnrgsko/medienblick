<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/app/bootstrap.php';
$command=$argv[1]??'';
try {
 if($command==='create'){
  $label=shortText($argv[2]??'Lehrkraft',100,'Label');
  $days=$argv[3]??'365';if(!ctype_digit($days)||(int)$days<1||(int)$days>3650)throw new RuntimeException('Tage: 1 bis 3650.');
  $t=token();query('INSERT INTO teacher_keys(key_hash,label,created_at,expires_at) VALUES (?,?,?,?)',[digest($t),$label,utc(),utc(time()+(int)$days*86400)]);
  echo "ID: ".db()->lastInsertId()."\nSchlüssel (nur jetzt sichtbar, privat weitergeben):\n$t\n";
 }elseif($command==='disable'){
  $id=$argv[2]??'';if(!ctype_digit($id))throw new RuntimeException('Numerische ID erwartet.');
  query('UPDATE teacher_keys SET active=0 WHERE id=?',[(int)$id]);echo "Schlüssel deaktiviert.\n";
 }elseif($command==='list'){
  foreach(query('SELECT id,label,active,created_at,expires_at FROM teacher_keys ORDER BY id')->fetchAll() as $r)echo json_encode($r,JSON_UNESCAPED_UNICODE)."\n";
 }else{echo "Verwendung:\nphp bin/teacher-key.php create 'internes Label' [Gültigkeitstage=365]\nphp bin/teacher-key.php list\nphp bin/teacher-key.php disable ID\n";exit(1);}
}catch(Throwable $e){fwrite(STDERR,"Aktion fehlgeschlagen: ".$e->getMessage()."\n");exit(1);}
