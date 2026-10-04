<?php
declare(strict_types=1);
function summary(array $v,int $minimum=5): ?array {
    $v=array_values(array_filter($v,fn($x)=>$x!==null));
    if(count($v)<$minimum) return null;
    sort($v,SORT_NUMERIC); $n=count($v);
    return ['n'=>$n,'mean'=>round(array_sum($v)/$n,2),'median'=>round(($v[(int)floor(($n-1)/2)]+$v[(int)floor($n/2)])/2,2)];
}
function aggregate(array $c): array {
    // IDs are used internally to join weekly values; no individual rows or IDs leave aggregation.
    $weeks=classWeeks((int)$c['id']); $weekCount=count($weeks);
    $cols=['id'];
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
    $screens=[];foreach($rows as $r)$screens[$r['id']]=initialScreen($r,$weekCount);
    if(flexibleWeeks()) foreach(query("SELECT w.response_id,w.week_number,w.minutes FROM response_screen_weeks w JOIN responses r ON r.id=w.response_id WHERE r.class_id=? AND r.status='submitted'",[$c['id']])->fetchAll() as $w) {
        $i=(int)$w['week_number']-1;
        if($i>=0&&$i<$weekCount)$screens[$w['response_id']][$i]=$w['minutes']===null?null:(float)$w['minutes'];
    }
    $weekly=[]; for($i=0;$i<$weekCount;$i++) $weekly[]=summary(array_column($screens,$i));
    $means=[];
    foreach($rows as $r) {
        $v=array_values(array_filter($screens[$r['id']],fn($x)=>$x!==null));
        if(count($v)) $means[]=array_sum($v)/count($v);
    }
    $contexts=[];
    $names=['ferien'=>'Ferien','schule'=>'Schule','praktikum'=>'Praktikum','sonstiges'=>'Sonstiges'];
    foreach($weeks as $w) $contexts[$names[$w['context_type']]][]=(int)$w['week_number'];
    $contextStats=[];
    foreach($contexts as $label=>$weeks) {
        $v=[]; foreach($rows as $r) {
            $p=[];foreach($weeks as $w)if($screens[$r['id']][$w-1]!==null)$p[]=$screens[$r['id']][$w-1];
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
    $values=[]; $context=null;
    if($dataset && $dataset['verified']) {
        $rows=query("SELECT age_group,metric_type,item_id,response_value,percentage,numeric_value,source,source_version FROM jim_reference WHERE dataset_id=? AND age_group IN (?, '12-19')",[$c['jim_dataset_id'],$c['jim_age_group']])->fetchAll();
        // Prefer the selected age for a whole metric, never blend its distribution with overall values.
        $specific=[];
        foreach($rows as $r) if($r['age_group']===$c['jim_age_group']) $specific[$r['item_id']]=true;
        foreach($rows as $r) if($r['age_group']===$c['jim_age_group'] || !isset($specific[$r['item_id']])) $values[]=$r;
        // Only a reviewed, version-pinned supplement; never an arbitrary database path.
        $catalog=['jim-2025-jimplus-2026-v1'=>'jim-2025-jimplus-2026-v1.json'];
        if(isset($catalog[$dataset['source_version']])) {
            $bundle=json_decode(file_get_contents(dirname(__DIR__).'/data/references/'.$catalog[$dataset['source_version']]),true,32,JSON_THROW_ON_ERROR);
            $context=$bundle['context_study'];
        }
    }
    return ['dataset'=>$dataset,'age_group'=>$c['jim_age_group'],'values'=>$values,'context_study'=>$context];
}
