<?php
declare(strict_types=1);
function summary(array $v,int $minimum=5): ?array {
    $v=array_values(array_filter($v,fn($x)=>$x!==null));
    if(count($v)<$minimum) return null;
    sort($v,SORT_NUMERIC); $n=count($v);
    return ['n'=>$n,'mean'=>round(array_sum($v)/$n,2),'median'=>round(($v[(int)floor(($n-1)/2)]+$v[(int)floor($n/2)])/2,2)];
}
function aggregate(array $c): array {
    // Explicit projection excludes response identifiers, tokens, timestamps and reflections.
    $cols=[];
    for($i=1;$i<=7;$i++) $cols[]=sprintf('jim_%02d',$i);
    for($i=1;$i<=6;$i++) $cols[]='screen_week_'.$i;
    for($i=1;$i<=3;$i++) $cols[]='app_'.$i.'_normalized';
    $rows=query('SELECT '.implode(',',$cols)." FROM responses WHERE class_id=? AND status='submitted'",[$c['id']])->fetchAll();
    $n=count($rows);
    if($n<5) return ['n'=>$n,'available'=>false];
    $items=[];
    for($i=1;$i<=7;$i++) {
        $counts=[1=>0,2=>0,3=>0,4=>0];
        foreach($rows as $r) $counts[(int)$r[sprintf('jim_%02d',$i)]]++;
        $items[]=['counts'=>$counts,'percent'=>array_map(fn($v)=>round($v/$n*100,2),$counts),'agreement'=>round(($counts[3]+$counts[4])/$n*100,1)];
    }
    $weekly=[]; for($i=1;$i<=6;$i++) $weekly[]=summary(array_map(fn($r)=>$r['screen_week_'.$i]===null?null:(float)$r['screen_week_'.$i],$rows));
    $means=[];
    foreach($rows as $r) {
        $v=[];for($i=1;$i<=6;$i++)if($r['screen_week_'.$i]!==null)$v[]=(float)$r['screen_week_'.$i];
        if(count($v)) $means[]=array_sum($v)/count($v);
    }
    $contexts=[];
    foreach(query('SELECT week_number,label FROM class_weeks WHERE class_id=? ORDER BY week_number',[$c['id']])->fetchAll() as $w) $contexts[$w['label']][]=(int)$w['week_number'];
    $contextStats=[];
    foreach($contexts as $label=>$weeks) {
        $v=[]; foreach($rows as $r) {
            $p=[];foreach($weeks as $w)if($r['screen_week_'.$w]!==null)$p[]=(float)$r['screen_week_'.$w];
            if(count($p))$v[]=array_sum($p)/count($p);
        }
        $contextStats[]=['label'=>$label,'weeks'=>$weeks,'stats'=>summary($v)];
    }
    $allowed=query("SELECT normalized FROM class_app_terms WHERE class_id=? AND status='approved'",[$c['id']])->fetchAll(PDO::FETCH_COLUMN);
    $freq=[]; foreach($rows as $r) {
        $apps=[];for($i=1;$i<=3;$i++)if($r['app_'.$i.'_normalized']!==null)$apps[]=$r['app_'.$i.'_normalized'];
        foreach(array_unique($apps) as $a)if(in_array($a,$allowed,true))$freq[$a]=($freq[$a]??0)+1;
    }
    arsort($freq);$apps=[];foreach($freq as $a=>$count)$apps[]=['name'=>(string)$a,'count'=>$count,'percentage'=>round(100*$count/$n,1)];
    return ['available'=>true,'n'=>$n,'items'=>$items,'screen'=>['weeks'=>$weekly,'overall'=>summary($means),'contexts'=>$contextStats],'apps'=>$apps];
}
function references(array $c): array {
    $dataset=query('SELECT study_year,source_version,source,population,verified FROM jim_datasets WHERE id=?',[$c['jim_dataset_id']])->fetch();
    $rows=query('SELECT metric_type,item_id,response_value,percentage,numeric_value,source,source_version FROM jim_reference WHERE dataset_id=? AND age_group=?',[$c['jim_dataset_id'],$c['jim_age_group']])->fetchAll();
    return ['dataset'=>$dataset,'age_group'=>$c['jim_age_group'],'values'=>$dataset['verified']?$rows:[]];
}
