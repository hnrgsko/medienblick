<?php
declare(strict_types=1);
require_once __DIR__.'/statistics.php';
function normalizedAnswers(array $d,bool $final,int $weekCount=6): array {
    $allowed=['items','screen','apps','reflection'];
    if(array_diff(array_keys($d),$allowed)) fail(422,'Nicht unterstützte Daten. Tageswerte dürfen nicht übertragen werden.');
    $items=$d['items']??array_fill(0,7,null); $screen=$d['screen']??array_fill(0,$weekCount,null); $apps=$d['apps']??[];
    if(!is_array($items)||!array_is_list($items)||count($items)!==7)fail(422,'Sieben Abschlussantworten erwartet.');
    if(!is_array($screen)||!array_is_list($screen)||count($screen)!==$weekCount)fail(422,'Bitte für jede konfigurierte Woche einen Wochenmittelwert oder null übertragen.');
    if(!is_array($apps)||!array_is_list($apps)||count($apps)>3)fail(422,'Bitte höchstens drei Apps nennen.');
    $v=[];
    foreach($items as $i=>$x) {
        if(($x===null && $final)||($x!==null && (!is_int($x)||$x<1||$x>4)))fail(422,'Bitte alle sieben Aussagen beantworten.');
        $v[sprintf('jim_%02d',$i+1)]=$x;
    }
    foreach($screen as $i=>$x) {
        if($x!==null && ((!is_int($x)&&!is_float($x))||!is_finite((float)$x)||$x<0||$x>1440))fail(422,'Bildschirmzeit muss zwischen 0 und 1440 Minuten liegen.');
        if($i<6) $v['screen_week_'.($i+1)]=$x===null?null:round($x,2);
    }
    $seen=[];$clean=[];
    foreach($apps as $a) {
        $a=shortText($a,60,'App-Name');if($a==='')continue;
        $lower=mb_strtolower(preg_replace('/\s+/u',' ',$a));
        $canon=query('SELECT canonical_name FROM app_aliases WHERE alias=?',[$lower])->fetchColumn();
        $canon=$canon?:$lower;
        if(!isset($seen[$canon])) {$seen[$canon]=true;$clean[]=[$a,$canon];}
    }
    for($i=1;$i<=3;$i++) {$v['app_'.$i.'_original']=$clean[$i-1][0]??null;$v['app_'.$i.'_normalized']=$clean[$i-1][1]??null;}
    $v['reflection']=shortText($d['reflection']??'',2000,'Reflexion');return $v;
}
function dispatch(string $route,array $d): array {
    switch($route) {
    case 'bootstrap':
        return ['home_insights'=>json_decode(file_get_contents(dirname(__DIR__).'/data/references/home-studies-2026-10-04-v2.json'),true,32,JSON_THROW_ON_ERROR),'csrf'=>$_SESSION['csrf'],'flexible_weeks'=>flexibleWeeks(),'max_weeks'=>flexibleWeeks()?52:6,'items'=>require __DIR__.'/items.php','base_url'=>config()['base_url'],
            'contact_email'=>config()['contact_email'],'legal_notice'=>config()['legal_notice'],
            'apps'=>query('SELECT DISTINCT canonical_name FROM app_aliases ORDER BY canonical_name')->fetchAll(PDO::FETCH_COLUMN)];
    case 'classes':
        rate('global:create',20); rate('session:create:'.$_SESSION['rate'],6,600);
        $label=shortText($d['label']??'',40,'Klassenbezeichnung');
        $age=$d['age_group']??'';if(!in_array($age,['12-13','14-15','16-17','18-19'],true))fail(422,'Bitte eine Vergleichsaltersgruppe wählen.');
        $expected=$d['expected']??null;if($expected!==null&&(!is_int($expected)||$expected<1||$expected>500))fail(422,'Erwartete Teilnehmerzahl: 1 bis 500.');
        $weeks=$d['weeks']??[];if(!is_array($weeks)||!array_is_list($weeks)||count($weeks)<1||count($weeks)>52)fail(422,'Bitte 1 bis 52 Beobachtungswochen anlegen.');
        if(!flexibleWeeks()&&count($weeks)!==6)fail(503,'Die flexible Beobachtungsdauer benötigt zuerst das Datenbankupdate.');
        $clean=[];
        foreach($weeks as $w){
            if(!is_array($w))fail(422,'Wochenkontext ungültig.');
            $l=shortText($w['label']??'',60,'Wochenkontext');if(!$l)fail(422,'Jede Woche braucht einen Kontext.');
            $type=$w['context_type']??(str_starts_with($l,'Ferien')?'ferien':(str_starts_with($l,'Schule')?'schule':(str_starts_with($l,'Praktikum')?'praktikum':'sonstiges')));
            if(!in_array($type,['ferien','schule','praktikum','sonstiges'],true))fail(422,'Ungültige Wochenart.');
            $dates=[];foreach(['start_date','end_date'] as $k){
                $v=$w[$k]??null;if($v==='')$v=null;
                if($v!==null&&(!is_string($v)||!preg_match('/^\d{4}-\d{2}-\d{2}$/D',$v)||!($dt=DateTimeImmutable::createFromFormat('!Y-m-d',$v))||$dt->format('Y-m-d')!==$v))fail(422,'Ungültiges Datum.');
                $dates[]=$v;
            }
            if($dates[0]&&$dates[1]&&$dates[1]<$dates[0])fail(422,'Das Ende liegt vor dem Beginn.');
            $clean[]=[$l,...$dates,$type];
        }
        $alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        do{$code='';for($i=0;$i<6;$i++)$code.=$alphabet[random_int(0,strlen($alphabet)-1)];}while(query('SELECT id FROM classes WHERE class_code=?',[$code])->fetchColumn());
        $admin=token();$now=time();
        $dataset=(int)query('SELECT id FROM jim_datasets ORDER BY verified DESC,study_year DESC,id DESC LIMIT 1')->fetchColumn();
        query('INSERT INTO classes(class_code,admin_token_hash,class_label,jim_age_group,jim_dataset_id,expected_participants,created_at,expires_at,max_expires_at) VALUES (?,?,?,?,?,?,?,?,?)',[$code,digest($admin),$label,$age,$dataset,$expected,utc($now),utc($now+270*60),utc($now+28*86400)]);
        $id=(int)db()->lastInsertId();
        foreach($clean as $i=>$w) {
            if(flexibleWeeks()) query('INSERT INTO class_weeks(class_id,week_number,label,start_date,end_date,context_type) VALUES (?,?,?,?,?,?)',[$id,$i+1,...$w]);
            else query('INSERT INTO class_weeks(class_id,week_number,label,start_date,end_date) VALUES (?,?,?,?,?)',[$id,$i+1,...array_slice($w,0,3)]);
        }
        return ['class'=>meta(classBy('id',$id)),'admin_token'=>$admin];
    case 'class': return ['class'=>meta(classBy('class_code',validCode()))];
    case 'start':
        rate('global:start',600);rate('session:start:'.$_SESSION['rate'],12,600);
        $c=classBy('class_code',validCode(),true);
        if((int)query('SELECT COUNT(*) FROM responses WHERE class_id=?',[$c['id']])->fetchColumn()>=1000)fail(429,'Die maximale Zahl von Teilnahmen ist erreicht.');
        $t=token();query('INSERT INTO responses(class_id,resume_token_hash,created_at) VALUES (?,?,?)',[$c['id'],digest($t),utc()]);
        return ['token'=>$t,'class'=>meta($c)];
    case 'response':
        [$c,$r]=responseAccess(); return ['class'=>meta($c),'response'=>own($r)];
    case 'draft':case 'submit':
        [$c,$r]=responseAccess(true);
        if($r['status']==='submitted') {
            if($route==='submit')return ['status'=>'submitted'];
            fail(409,'Die Abgabe ist endgültig und kann nicht verändert werden.');
        }
        $weekCount=count(classWeeks((int)$c['id']));
        $v=normalizedAnswers($d,$route==='submit',$weekCount);
        $set=implode(',',array_map(fn($k)=>$k.'=?',array_keys($v)));
        query("UPDATE responses SET $set WHERE id=? AND status='draft'",[...array_values($v),$r['id']]);
        if(flexibleWeeks()) foreach(($d['screen']??array_fill(0,$weekCount,null)) as $i=>$minutes) {
            query('INSERT INTO response_screen_weeks(response_id,week_number,minutes) VALUES (?,?,?) ON DUPLICATE KEY UPDATE minutes=VALUES(minutes)',[$r['id'],$i+1,$minutes===null?null:round($minutes,2)]);
        }
        if($route==='submit') {
            for($i=1;$i<=3;$i++)if($a=$v['app_'.$i.'_normalized']){
                $known=(bool)query('SELECT 1 FROM app_aliases WHERE canonical_name=? LIMIT 1',[$a])->fetchColumn();
                query('INSERT IGNORE INTO class_app_terms(class_id,normalized,status) VALUES (?,?,?)',[$c['id'],$a,$known?'approved':'pending']);
            }
            query("UPDATE responses SET status='submitted',submitted_at=? WHERE id=?",[utc(),$r['id']]);
        }
        return ['status'=>$route==='submit'?'submitted':'draft'];
    case 'results':
        [$c,$r]=responseAccess();if($r['status']!=='submitted')fail(403,'Vergleichswerte erscheinen erst nach deiner Abgabe.');
        return ['class'=>meta($c),'response'=>own($r),'wir'=>aggregate($c),'jim'=>references($c),'as_of'=>iso(utc())];
    case 'public':
        $c=classBy('class_code',validCode());if(!$c['results_public'])fail(403,'Die Lehrkraft hat die Klassenansicht noch nicht freigegeben.');
        return ['class'=>meta($c),'wir'=>aggregate($c),'jim'=>references($c),'as_of'=>iso(utc())];
    case 'admin':
        $c=classBy('admin_token_hash',bearer());$m=meta($c);
        return ['class'=>$m,'wir'=>aggregate($c),'jim'=>references($c),'as_of'=>iso(utc()),
            'terms'=>$m['n']>=5?query("SELECT id,normalized,status FROM class_app_terms WHERE class_id=? AND status<>'approved' ORDER BY normalized",[$c['id']])->fetchAll():[]];
    case 'publish':
        $c=classBy('admin_token_hash',bearer(),true);
        if(!is_bool($d['public']??null))fail(422,'Ungültige Freigabe.');
        query('UPDATE classes SET results_public=? WHERE id=?',[(int)$d['public'],$c['id']]);return ['ok'=>true];
    case 'extend':
        $c=classBy('admin_token_hash',bearer(),true);
        $key=$d['key']??'';if(!is_string($key)||!preg_match('/^[a-f0-9]{64}$/D',$key))fail(403,'Lehrkräfteschlüssel ungültig oder nicht aktiv.');
        $k=query('SELECT id FROM teacher_keys WHERE key_hash=? AND active=1 AND (expires_at IS NULL OR expires_at>UTC_TIMESTAMP()) FOR UPDATE',[digest($key)])->fetch();
        if(!$k)fail(403,'Lehrkräfteschlüssel ungültig oder nicht aktiv.');
        $new=min(strtotime($c['expires_at'].' UTC')+7*86400,strtotime($c['max_expires_at'].' UTC'));
        if($new<=strtotime($c['expires_at'].' UTC'))fail(409,'Die maximale Laufzeit von 28 Tagen ist erreicht.');
        query('UPDATE classes SET expires_at=?,extension_count=extension_count+1 WHERE id=?',[utc($new),$c['id']]);
        return ['class'=>meta(classBy('id',(int)$c['id']))];
    case 'moderate':
        $c=classBy('admin_token_hash',bearer(),true);
        if(meta($c)['n']<5)fail(403,'Moderation ist erst ab fünf Abgaben verfügbar.');
        if(!is_int($d['id']??null)||!in_array($d['status']??'', ['approved','blocked'],true))fail(422,'Ungültige Moderationsentscheidung.');
        query('UPDATE class_app_terms SET status=? WHERE id=? AND class_id=?',[$d['status'],$d['id'],$c['id']]);return ['ok'=>true];
    case 'delete':
        $c=classBy('admin_token_hash',bearer(),true);query('DELETE FROM classes WHERE id=?',[$c['id']]);return ['deleted'=>true];
    default: fail(404,'Endpunkt nicht gefunden.');
    }
}
