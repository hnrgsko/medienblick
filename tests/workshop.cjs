const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../public/assets/project-data.js'),'utf8'),ctx);
const projects=vm.runInContext('projectLibrary',ctx),sources=vm.runInContext('projectSources',ctx),questions=vm.runInContext('reflectionQuestions',ctx);
assert.equal(projects.filter(p=>p.area==='general').length,4);assert.equal(projects.filter(p=>p.area==='subject').length,17);assert.equal(questions.length,7);
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);
for(const p of projects){for(const key of ['question','product','tool','analog','everyday','evidence','curriculum'])assert(p[key].length>15,`${p.id}: incomplete ${key}`);assert(p.steps.length>=3);assert(p.sources.length);for(const id of p.sources){assert(sources[id],`${p.id}: unknown source`);assert(new URL(sources[id][1]).protocol==='https:');}}
assert(projects.find(p=>p.id==='sport').evidence.includes('keine Veröffentlichung'));
assert(projects.find(p=>p.id==='biologie').evidence.includes('Erwachsenen'));
assert(projects.find(p=>p.id==='politik').evidence.includes('vier Seiten'));
console.log('PASS: 21 complete project briefs, unique links, seven reflection prompts, valid source references, key factual distinctions.');
