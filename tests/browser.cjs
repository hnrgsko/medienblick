/* Development-only browser acceptance test. npm install --no-save playwright */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert'),cp=require('child_process');
const root=path.resolve(__dirname,'..'),base=process.env.HANDY_TEST_URL||'http://127.0.0.1:8087';
const shots=path.join(root,'docs','screenshots');fs.mkdirSync(shots,{recursive:true});
const checks=[],errors=[];function ok(value,label){assert(value,label);checks.push(label);console.log('PASS',label);}
async function api(context,route,data,token,code){const b=await context.request.get(base+'/api.php?r=bootstrap');const csrf=(await b.json()).csrf;const r=await context.request.fetch(base+'/api.php?r='+route+(code?'&code='+code:''),{method:data===undefined?'GET':'POST',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(data===undefined?{}:{'X-CSRF-Token':csrf})},...(data===undefined?{}:{data})});assert(r.ok(),await r.text());return r.json();}
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.HANDY_CHROME?{executablePath:process.env.HANDY_CHROME}:{}),args:['--no-sandbox']});
 const teacher=await browser.newContext({viewport:{width:1440,height:1000}}),p=await teacher.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base);await p.getByRole('button',{name:'Zur Klasse',exact:true}).waitFor();
 await p.screenshot({path:path.join(shots,'01-start-desktop.png'),fullPage:true});
 ok(await p.locator('#code-input').isVisible(),'Home exposes class entry immediately');
 await p.getByRole('link',{name:'Neue Klasse erstellen',exact:true}).click();
 await p.locator('#class-label').fill('9b');await p.locator('#expected').fill('24');
 await p.getByRole('button',{name:'Klasse erstellen',exact:true}).click();await p.locator('#qr svg').waitFor();
 const code=new URL(p.url()).searchParams.get('code'),admin=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('handy-admin')).token);
 ok((await p.locator('#qr svg').getAttribute('aria-label')).includes('QR-Code'),'Locally generated QR code rendered');
 await p.screenshot({path:path.join(shots,'02-cockpit-desktop.png'),fullPage:true});
 const student=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1}),s=await student.newPage();s.on('pageerror',e=>errors.push(e.message));
 const requests=[];s.on('request',r=>{if(r.method()==='POST'&&r.url().includes('api.php'))requests.push(r.postDataJSON());});
 await s.goto(base+'/?view=join&code='+code);await s.getByRole('button',{name:'Auswertung starten'}).click();await s.locator('[data-answer]').first().waitFor();
 for(let i=0;i<7;i++){
  await s.locator('[data-answer="3"]').click();
  if(i===2)await s.screenshot({path:path.join(shots,'03-frage-mobile.png'),fullPage:true});
  await s.locator('#next').click();
  if(i<6)await s.getByText('Frage '+(i+2)+' von 7',{exact:true}).waitFor();
 }
 await s.locator('#screen-0').waitFor();
 await s.locator('.calculator').first().locator('summary').click();
 await s.locator('#day-0-0').fill('100');await s.locator('#day-0-1').fill('200');
 await s.locator('[data-use-average="0"]').click();
 ok(await s.locator('#screen-0').inputValue()==='150','Local calculator ignores missing days and returns 150 minutes');
 for(let i=1;i<6;i++)await s.locator('#screen-'+i).fill(String(100+i*20));
 await s.screenshot({path:path.join(shots,'04-bildschirmzeit-mobile.png'),fullPage:true});
 await s.locator('#next').click();await s.locator('#app-0').fill('Insta');await s.locator('#app-1').fill('WA');await s.locator('#next').click();
 await s.locator('#reflection').fill('<img src=x onerror=alert(1)> Mein privater Gedanke');
 await s.locator('#next').click();await s.getByText('Passt das für dich?',{exact:true}).waitFor();
 await s.reload();await s.getByText('Passt das für dich?',{exact:true}).waitFor();
 ok(await s.getByText('<img src=x onerror=alert(1)> Mein privater Gedanke',{exact:true}).isVisible(),'Draft resumes after reload; reflection safely rendered as text');
 await s.locator('#next').click();await s.getByRole('heading',{name:'ICH – WIR – JIM',exact:true}).waitFor();
 ok(await s.getByRole('heading',{name:'Noch nicht genügend Ergebnisse.'}).isVisible(),'First submitted student sees ICH and WIR waiting gate');
 ok(!requests.some(x=>JSON.stringify(x).includes('daily_values')||Object.keys(x).some(k=>k.includes('day'))),'Browser never sends local daily input fields');
 const draft=requests.filter(x=>x.screen).at(-1);ok(draft.screen[0]===150,'Only computed weekly average sent to API');
 // Four additional participants through isolated browser contexts.
 for(let i=0;i<4;i++){
  const ctx=await browser.newContext();const start=await api(ctx,'start',{},null,code);
  await api(ctx,'submit',{items:[4,3,2,1,4,3,2],screen:[180+i*10,160,200,150,110,190],apps:['WhatsApp','YouTube','Instagram'],reflection:''},start.token);
  await ctx.close();
 }
 await s.locator('.live-stamp').filter({hasText:'5 vollständige Abgaben'}).waitFor({timeout:15000});
 ok(await s.getByRole('heading',{name:'Noch nicht genügend Ergebnisse.'}).count()===0,'Open result view receives fifth submission automatically');
 await s.locator('[data-detail="1"]').click();await s.locator('[data-app-mode="bars"]').click();
 ok(await s.locator('#app-chart .bar-row').count()===3,'App bars show canonical names');
 ok(await s.locator('.detail-view').first().isVisible(),'Full four-category detail view available');
 ok(await s.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile result view has no horizontal overflow');
 await s.screenshot({path:path.join(shots,'05-ergebnis-mobile.png'),fullPage:true});
 await s.emulateMedia({media:'print'});await s.pdf({path:path.join(shots,'persoenlicher-testdruck.pdf'),format:'A4',printBackground:true});await s.emulateMedia({media:'screen'});
 await p.locator('#publish').click();await p.getByRole('button',{name:'Klassenansicht schließen'}).waitFor();
 const pub=await browser.newContext({viewport:{width:1440,height:1000}}),q=await pub.newPage();q.on('pageerror',e=>errors.push(e.message));
 await q.goto(base+'/?view=class&code='+code);await q.getByRole('heading',{name:'WIR – JIM',exact:true}).waitFor();
 ok(!(await q.locator('body').innerText()).includes('Mein privater Gedanke'),'Public view never displays private reflection');
 await q.screenshot({path:path.join(shots,'06-klassenansicht-desktop.png'),fullPage:true});
 await q.locator('#present').click();ok(await q.locator('.site-header').isHidden(),'Presentation mode hides navigation');await q.keyboard.press('Escape');ok(await q.locator('.site-header').isVisible(),'Escape exits presentation mode');
 await q.emulateMedia({media:'print'});await q.pdf({path:path.join(shots,'klassen-testdruck.pdf'),format:'A4',printBackground:true});await q.emulateMedia({media:'screen'});
 // The supplied private link is accepted and its fragment removed immediately.
 const privateContext=await browser.newContext();const ap=await privateContext.newPage();await ap.goto(base+'/?view=admin&code='+code+'#admin='+admin);await ap.locator('#qr svg').waitFor();ok(!ap.url().includes('#'),'Admin secret removed from address bar');
 // Deletion revokes all views, including an already-open student page.
 await api(teacher,'delete',{},admin);await s.getByRole('heading',{name:'Diese Runde ist beendet.'}).waitFor({timeout:15000});
 ok(await s.evaluate(c=>localStorage.getItem('handy:'+c)===null,code),'Live deletion clears personal token on open device');
 ok(errors.length===0,'No JavaScript runtime errors');
 fs.writeFileSync(path.join(root,'tests/browser-result.json'),JSON.stringify({checks:checks.length,passed:checks,errors},null,2));
 console.log('SUCCESS',checks.length,'browser checks');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
