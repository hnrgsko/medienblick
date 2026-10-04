<?php
// Run only against a disposable database. Creates schema and imports migration twice.
declare(strict_types=1);
require dirname(__DIR__).'/app/bootstrap.php';
require dirname(__DIR__).'/app/statistics.php';
function check(bool $ok,string $what):void {if(!$ok)throw new RuntimeException($what);echo "PASS: $what\n";}
$root=dirname(__DIR__);
db()->exec(file_get_contents($root.'/database/schema.sql'));
foreach([1,2] as $pass)db()->exec(file_get_contents($root.'/database/migrations/003-jim-references.sql'));
check((int)query('SELECT COUNT(*) FROM jim_reference')->fetchColumn()===31,'repeatable SQL import without duplicates');
$id=query("SELECT id FROM jim_datasets WHERE verified=1")->fetchColumn();
foreach(['12-13'=>166,'14-15'=>217,'16-17'=>249,'18-19'=>278] as $age=>$minutes){
 $r=references(['jim_dataset_id'=>$id,'jim_age_group'=>$age]);
 check(count($r['values'])===13,"$age seven overall, one screen, five apps");
 foreach($r['values'] as $v){
  if($v['metric_type']==='item_agreement')check($v['age_group']==='12-19','overall age retained');
  if($v['metric_type']==='screen_mean')check((int)$v['numeric_value']===$minutes,'correct screen minutes');
 }
 check(count($r['context_study']['cards'])===4,'version-pinned JIMplus supplement');
}
$pending=query("SELECT id FROM jim_datasets WHERE verified=0")->fetchColumn();
$r=references(['jim_dataset_id'=>$pending,'jim_age_group'=>'14-15']);
check($r['values']===[] && $r['context_study']===null,'old pending version remains unchanged');
query("INSERT INTO jim_reference(dataset_id,study_year,age_group,metric_type,item_id,response_value,percentage,source,source_version) VALUES (?,2025,'14-15','item_agreement','jim_01',0,50,'https://mpfs.de/','test')",[$id]);
$r=references(['jim_dataset_id'=>$id,'jim_age_group'=>'14-15']);
$first=array_values(array_filter($r['values'],fn($v)=>$v['item_id']==='jim_01'));
check(count($first)===1 && $first[0]['age_group']==='14-15','age-specific metric supersedes whole overall metric');
