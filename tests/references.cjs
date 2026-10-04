const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const bundle=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/references/jim-2025-jimplus-2026-v1.json')));
const ctx={document:{querySelector(){},querySelectorAll(){return[]},addEventListener(){}},window:{addEventListener(){}},location:{search:'',hash:''},URLSearchParams,Intl,Date};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../public/assets/app.js'),'utf8').replace(/init\(\);\s*$/,''),ctx);
ctx.bundle=bundle;vm.runInContext("boot={items:Array.from({length:7},()=>['id','Aussage'])}",ctx);
assert.equal(bundle.values.length,31);
for(const [age,minutes] of [['12-13',166],['14-15',217],['16-17',249],['18-19',278]]){
 ctx.age=age;
 vm.runInContext("data={jim:{dataset:bundle,age_group:age,values:bundle.values.filter(r=>r.age_group===age||r.age_group==='12-19'),context_study:bundle.context_study},wir:{n:0,available:false},class:{weeks:[{week_number:1,label:'Schule'}]},as_of:'2026-10-04T12:00:00Z'}",ctx);
 const html=vm.runInContext('resultsContent(data)',ctx);
 assert.match(html,/12-19 Jahre · Gesamtgruppe/);assert.match(html,/keine eigene Altersauswertung/);
 assert(html.includes(minutes+' Min.'));assert.match(html,/JIMplus 2026/);assert.match(html,/14–17 Jahre/);
 assert.match(html,/Noch nicht genügend Ergebnisse/);assert.match(html,/vollständige JIM-Viererverteilung/);
 assert.equal(vm.runInContext('refItem(data.jim,0).agreement',ctx),68);
 assert.equal(vm.runInContext('refItem(data.jim,0).dist',ctx),null);
}
vm.runInContext('data.jim.context_study=null;data.jim.values=[]',ctx);
assert(!vm.runInContext('plusCard(data.jim)',ctx));assert.match(vm.runInContext('itemCard(0,data)',ctx),/Kein Referenzwert/);
ctx.bundle.context_study.cards[0].text='<img src=x onerror=alert(1)>';
assert(vm.runInContext('plusCard({context_study:bundle.context_study})',ctx).includes('&lt;img'));
console.log('PASS: 31 references, four age groups, overall-item labels, no fabricated distribution, missing values, JIMplus separation, HTML escaping.');
