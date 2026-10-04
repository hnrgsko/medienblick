<?php
// Disposable legacy-schema database only. Run each mode in a fresh PHP process.
require dirname(__DIR__).'/app/bootstrap.php';
require dirname(__DIR__).'/app/statistics.php';
if(!str_ends_with((string)query('SELECT DATABASE()')->fetchColumn(),'_test'))throw new RuntimeException('Test database required');
function check(bool $ok,string $msg): void {if(!$ok)throw new RuntimeException($msg);echo "PASS $msg\n";}
$mode=$argv[1]??'';
if($mode==='before') {
 check(!flexibleWeeks(),'Legacy schema remains supported');
 query("INSERT INTO classes(class_code,admin_token_hash,class_label,jim_age_group,jim_dataset_id,created_at,expires_at,max_expires_at) VALUES ('ABCD23',?,'TEST','14-15',1,UTC_TIMESTAMP(),DATE_ADD(UTC_TIMESTAMP(),INTERVAL 1 DAY),DATE_ADD(UTC_TIMESTAMP(),INTERVAL 28 DAY))",[digest('test-admin')]);
 $id=(int)db()->lastInsertId();
 for($w=1;$w<=6;$w++)query('INSERT INTO class_weeks(class_id,week_number,label) VALUES (?,?,?)',[$id,$w,$w<3?'Ferien':'Schule '.$w]);
 for($i=0;$i<5;$i++)query("INSERT INTO responses(class_id,resume_token_hash,status,jim_01,jim_02,jim_03,jim_04,jim_05,jim_06,jim_07,screen_week_1,screen_week_6,created_at) VALUES (?,?,'submitted',3,3,3,3,3,3,3,0,600,UTC_TIMESTAMP())",[$id,digest('test-'.$i)]);
 $c=classBy('id',$id);$a=aggregate($c);
 check(count($a['screen']['weeks'])===6&&$a['screen']['weeks'][5]['mean']==600,'Legacy aggregates before migration');
 check(count(own(query('SELECT * FROM responses LIMIT 1')->fetch())['screen'])===6,'Legacy response before migration');
} elseif($mode==='migrate') {
 db()->exec(file_get_contents(dirname(__DIR__).'/database/migrations/002-flexible-weeks.sql'));
 echo "PASS Migration SQL executed\n";
} elseif($mode==='after') {
 check(flexibleWeeks(),'Feature available after migration');
 $c=query('SELECT * FROM classes LIMIT 1')->fetch();$r=query('SELECT * FROM responses LIMIT 1')->fetch();
 check(own($r)['screen']===[0.0,null,null,null,null,600.0],'Legacy values including missing weeks retained');
 $a=aggregate($c);check($a['screen']['overall']['mean']==300,'Legacy means retained');
 check(classWeeks((int)$c['id'])[0]['context_type']==='ferien','Old labels receive correct type');
 query("UPDATE class_weeks SET context_type='sonstiges' WHERE week_number=1");
 db()->exec(file_get_contents(dirname(__DIR__).'/database/migrations/002-flexible-weeks.sql'));
 check(classWeeks((int)$c['id'])[0]['context_type']==='sonstiges','Repeated migration preserves explicit types');
 query("INSERT INTO class_weeks(class_id,week_number,label,context_type) VALUES (?,52,'Woche 52','schule')",[$c['id']]);
 query('INSERT INTO response_screen_weeks(response_id,week_number,minutes) VALUES (?,52,100)',[$r['id']]);
 check((int)query('SELECT COUNT(*) FROM responses')->fetchColumn()===5,'Responses survive repeated import');
 query('DELETE FROM classes WHERE id=?',[$c['id']]);
 check((int)query('SELECT COUNT(*) FROM response_screen_weeks')->fetchColumn()===0,'Cascade deletion covers normalized values');
}
