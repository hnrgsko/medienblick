<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/app/bootstrap.php';
// Operator-only import; published datasets are append-only. No web upload endpoint.
try {
 if(($argv[2]??'')!=='--verified')throw new RuntimeException('Erst offizielle Quelle, Alter, Basis, Item und Metrik prüfen. Aufruf: php bin/import-jim.php datei.json --verified');
 $d=json_decode(file_get_contents($argv[1]??''),true,32,JSON_THROW_ON_ERROR);
 $year=$d['study_year']??null;if(!is_int($year)||$year<1998||$year>2100)throw new RuntimeException('Ungültiger Jahrgang.');
 $version=shortText($d['source_version']??'',100,'Version');if(!$version)throw new RuntimeException('Version fehlt.');
 $source=shortText($d['source']??'',1000,'Quelle');
 if(!filter_var($source,FILTER_VALIDATE_URL)||parse_url($source,PHP_URL_SCHEME)!=='https'||!in_array(parse_url($source,PHP_URL_HOST),['mpfs.de','www.mpfs.de'],true))throw new RuntimeException('Offizielle HTTPS-Quelle auf mpfs.de erforderlich.');
 $population=shortText($d['population']??'',4000,'Erhebungsbasis');if(!$population)throw new RuntimeException('Erhebungsbasis fehlt.');
 $values=$d['values']??null;if(!is_array($values)||!count($values))throw new RuntimeException('Keine Werte.');
 $groups=[];$seen=[];
 foreach($values as $r){
  if(!in_array($r['age_group']??'', ['12-13','14-15','16-17','18-19','12-19'],true))throw new RuntimeException('Alter fehlt.');
  if(isset($r['source'])&&(!filter_var($r['source'],FILTER_VALIDATE_URL)||parse_url($r['source'],PHP_URL_SCHEME)!=='https'||!in_array(parse_url($r['source'],PHP_URL_HOST),['mpfs.de','www.mpfs.de'],true)))throw new RuntimeException('Ungültige Fundstelle.');
  $type=$r['metric_type']??'';$item=shortText($r['item_id']??'',80,'Metrik');$rv=$r['response_value']??0;
  if(!in_array($type,['item_distribution','item_agreement','screen_mean','app_percentage'],true))throw new RuntimeException('Unbekannte Metrik.');
  if(!is_int($rv)||($type==='item_distribution'?($rv<1||$rv>4):$rv!==0))throw new RuntimeException('Antwortwert ungültig.');
  if(str_starts_with($type,'item_')&&!preg_match('/^jim_0[1-7]$/D',$item))throw new RuntimeException('Unbekanntes Item.');
  if($type==='screen_mean'&&$item!=='smartphone_minutes')throw new RuntimeException('Nur Smartphone-Bildschirmzeit in Minuten; keine allgemeine Onlinezeit.');
  $v=$type==='screen_mean'?($r['numeric_value']??null):($r['percentage']??null);
  if((!is_int($v)&&!is_float($v))||!is_finite((float)$v)||$v<0||$v>($type==='screen_mean'?1440:100))throw new RuntimeException('Ungültiger Zahlenwert.');
  $key=$r['age_group'].'|'.$type.'|'.$item.'|'.$rv;if(isset($seen[$key]))throw new RuntimeException('Doppelter Referenzwert.');$seen[$key]=true;
  if($type==='item_distribution')$groups[$r['age_group'].'|'.$item][$rv]=$v;
 }
 foreach($groups as $g)if(count($g)!==4||abs(array_sum($g)-100)>1.1)throw new RuntimeException('Viererverteilung muss vollständig sein und gerundet etwa 100 Prozent ergeben.');
 db()->beginTransaction();
 query('INSERT INTO jim_datasets(study_year,source_version,source,population,verified) VALUES (?,?,?,?,1)',[$year,$version,$source,$population]);$id=(int)db()->lastInsertId();
 foreach($values as $r)query('INSERT INTO jim_reference(dataset_id,study_year,age_group,metric_type,item_id,response_value,percentage,numeric_value,source,source_version) VALUES (?,?,?,?,?,?,?,?,?,?)',[$id,$year,$r['age_group'],$r['metric_type'],$r['item_id'],$r['response_value']??0,$r['metric_type']==='screen_mean'?null:$r['percentage'],$r['metric_type']==='screen_mean'?$r['numeric_value']:null,$r['source']??$source,$version]);
 db()->commit();echo "Neue Referenzversion importiert. Bestehende Klassen behalten ihre bisherige Version.\n";
}catch(Throwable $e){try{if(db()->inTransaction())db()->rollBack();}catch(Throwable){}fwrite(STDERR,"Kein Import: ".$e->getMessage()."\n");exit(1);}
