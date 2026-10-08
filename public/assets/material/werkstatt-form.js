'use strict';
const sheetEsc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sheetForm=document.querySelector('#worksheet-form');
let sheetProject=new URLSearchParams(location.search).get('project')||'';
if(sheetForm.dataset.format==='project'){
 const project=projectLibrary.find(p=>p.id===sheetProject);
 if(project){
  document.title=project.title+' · Medienblick';document.querySelector('#sheet-title').textContent=project.title;document.querySelector('#sheet-intro').textContent=project.brief;
  document.querySelector('#project-title').value=project.title;document.querySelector('#project-subject').value=project.subject;document.querySelector('#question').value=project.question;document.querySelector('#analog').value=project.analog;
  const brief=document.querySelector('#project-brief');brief.hidden=false;
  brief.innerHTML=`<details class="sheet-brief" open><summary>Projektauftrag & Quellen</summary><p><strong>Jahrgang:</strong> ${sheetEsc(project.years)} · <strong>Planungszeit:</strong> ${sheetEsc(project.duration)}</p><p><strong>Lernprodukt:</strong> ${sheetEsc(project.product)}</p><p><strong>Curriculum:</strong> ${sheetEsc(project.curriculum)}</p><h3>Vorgehen</h3><ol>${project.steps.map(s=>`<li>${sheetEsc(s)}</li>`).join('')}</ol><p><strong>Digitales Werkzeug:</strong> ${sheetEsc(project.tool)}</p><p><strong>Alltagstransfer:</strong> ${sheetEsc(project.everyday)}</p><h3>Einordnung</h3><p>${sheetEsc(project.evidence)}</p>${project.id==='sieben-perspektiven'?`<h3>Sieben Gesprächsanlässe</h3><ol>${reflectionQuestions.map(([dimension,theme,question,lens])=>`<li><strong>${sheetEsc(dimension)}:</strong> ${sheetEsc(question)}<br>${sheetEsc(lens)}</li>`).join('')}</ol>`:''}<h3>Quellen zum Einstieg</h3><ul>${project.sources.map(id=>{const [title,url,note]=projectSources[id];return `<li><a href="${sheetEsc(url)}" target="_blank" rel="noopener noreferrer">${sheetEsc(title)} ↗</a><br><small>${sheetEsc(note)}</small></li>`;}).join('')}</ul><p class="help">Der Projektauftrag bleibt hier einsehbar. Für dein Ergebnis dokumentierst du verwendete Quellen und vereinbarte Kriterien im Protokoll. Quellenstand: 08.10.2026.</p></details>`;
 }else if(sheetProject){document.querySelector('#sheet-status').textContent='Diese Projektkennung ist unbekannt. Du kannst das leere Protokoll für deine eigene Idee nutzen.';sheetProject='';}
}
sheetForm.addEventListener('submit',e=>e.preventDefault());
const sheetFields=()=>[...sheetForm.querySelectorAll('input[name],textarea[name]')];
function sheetPrintValues(){sheetFields().forEach(field=>{let output=field.nextElementSibling;if(!output?.classList.contains('print-value')){output=document.createElement('div');output.className='print-value';field.after(output);}output.textContent=field.value||' ';});}
window.addEventListener('beforeprint',sheetPrintValues);
document.querySelector('#sheet-print').onclick=()=>{sheetPrintValues();window.print();};
document.querySelector('#sheet-export').onclick=()=>{
 const values=Object.fromEntries(sheetFields().map(f=>[f.name,f.value]));const data={format:'medienblick-'+sheetForm.dataset.format,version:1,project:sheetProject,values};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='medienblick-'+sheetForm.dataset.format+'-entwurf.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#sheet-status').textContent='Entwurf als Datei heruntergeladen. Bewahre ihn passend zu deinen Inhalten auf.';
};
document.querySelector('#sheet-import').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 try{if(file.size>500000)throw Error('Die Datei ist zu groß.');const data=JSON.parse(await file.text());if(data.format!=='medienblick-'+sheetForm.dataset.format||data.version!==1||!data.values||typeof data.values!=='object')throw Error('Die Datei passt nicht zu diesem Bogen.');
 const fields=sheetFields();for(const field of fields){const v=data.values[field.name];if(v!==undefined&&(typeof v!=='string'||v.length>50000))throw Error('Ein Feld hat ein ungültiges Format.');}
 if(fields.some(f=>f.value.trim())&&!confirm('Den geöffneten Bogen durch diesen Entwurf ersetzen? Ungesicherte Eingaben gehen dabei verloren.'))return;
 for(const field of fields)field.value=data.values[field.name]||'';
 if(sheetForm.dataset.format==='project'){sheetProject=typeof data.project==='string'?data.project:'';document.querySelector('#sheet-title').textContent=document.querySelector('#project-title').value||'Eure Idee. Euer Lernprodukt.';document.querySelector('#project-brief').hidden=true;document.querySelector('#sheet-intro').textContent='Geöffneter Entwurf. Prüfe Projektauftrag und Quellen passend zu deinen Eingaben.';}
 document.querySelector('#sheet-status').textContent='Entwurf geöffnet. Die Eingaben bleiben lokal in dieser Seite.';
 }catch(error){document.querySelector('#sheet-status').textContent=error.message||'Der Entwurf konnte nicht geöffnet werden.';}finally{e.target.value='';}
};
