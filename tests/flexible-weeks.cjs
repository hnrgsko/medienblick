// No browser/dependencies required: exercise rendered views and chart geometry.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const nodes=new Map();
const node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',value:s==='#week-count'?'6':'',focus(){}});return nodes.get(s);};
const context={document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},location:{search:'',hash:'',href:'http://localhost/'},URL,URLSearchParams,Intl,Date,console,setTimeout,clearTimeout,sessionStorage:{getItem(){return null},setItem(){}},localStorage:{getItem(){return null},setItem(){}}};
vm.createContext(context);
const src=fs.readFileSync(require('node:path').join(__dirname,'../public/assets/app.js'),'utf8').replace(/init\(\);\s*$/,'');
vm.runInContext(src,context);
const run=s=>vm.runInContext(s,context);
run("boot={flexible_weeks:true,items:Array.from({length:7},()=>['id','Aussage']),apps:[]};createPage();");
assert.equal((node('#week-editors').innerHTML.match(/class="week-edit"/g)||[]).length,6);
assert.match(node('#main').innerHTML,/value="6"/);
for(const count of [1,4,8,52]){
 node('#week-count').value=String(count);node('#week-count').onchange();
 assert.equal((node('#week-editors').innerHTML.match(/class="week-edit"/g)||[]).length,count);
 assert.equal((node('#week-editors').innerHTML.match(/value="sonstiges"/g)||[]).length,count);
 const svg=run(`lineChart(Array(${count}).fill(100),Array.from({length:${count}},()=>({mean:200})))`);
 assert(!svg.includes('NaN')&&!svg.includes('Infinity'));
 assert.equal((svg.match(/<circle /g)||[]).length,count*2);
 assert.equal((svg.match(/stroke-width="3"/g)||[]).length,(count-1)*2);
 assert.match(svg,new RegExp('>W'+count+'</text>'));
 run(`currentClass={weeks:Array.from({length:${count}},(_,i)=>({label:'Schule',week_number:i+1})),expires_at:'2099-01-01'};currentResponse={items:Array(7).fill(3),screen:Array(${count}).fill(null),apps:[],reflection:''};step=0;showStep();`);
 assert.match(node('#main').innerHTML,new RegExp(count+' Beobachtungswochen'));
 run('step=7;showStep();');assert.equal((node('#main').innerHTML.match(/class="week-row"/g)||[]).length,count);
 run('step=10;showStep();');assert.match(node('#main').innerHTML,new RegExp('von '+count+' Wochen vorhanden'));
}
const gaps=run('lineChart([100,null,200],[null,null,null])');assert(!gaps.includes('stroke-width="3"'));
run('boot.flexible_weeks=false;createPage();');assert.match(node('#main').innerHTML,/value="6" required disabled/);
console.log('PASS: default, 1/4/8/52-week forms, categories, reflection/screen/review, chart geometry, missing weeks, migration gate');
