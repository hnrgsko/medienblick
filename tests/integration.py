"""Run only against a disposable local test database. Uses standard Python 3.
HANDY_TEST_URL=http://127.0.0.1:8087 HANDY_PHP=php HANDY_CONFIG=... python3 tests/integration.py
"""
import os,json,urllib.request,urllib.error,http.cookiejar,subprocess,hashlib,concurrent.futures
from pathlib import Path
BASE=os.environ.get('HANDY_TEST_URL','http://127.0.0.1:8087')
ROOT=Path(__file__).resolve().parents[1]
PHP=os.environ.get('HANDY_PHP','php')
checks=[]
def ok(cond,label):
 assert cond,label
 checks.append(label);print('PASS',label,flush=True)
def sql(statement):
 script='<?php require '+json.dumps(str(ROOT/'app/bootstrap.php'))+'; $q=db()->query('+json.dumps(statement)+'); echo json_encode($q->columnCount()?$q->fetchAll():[]);'
 return json.loads(subprocess.check_output([PHP],input=script.encode(),env=os.environ))
class Client:
 def __init__(self):
  self.op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
  self.csrf=self.req('bootstrap')[1]['csrf']
 def req(self,r,data=None,token=None,code=None,csrf=True):
  url=BASE+'/api.php?r='+r+('&code='+code if code else '')
  headers={}
  if token:headers['Authorization']='Bearer '+token
  if data is not None:
   headers['Content-Type']='application/json'
   if csrf:headers['X-CSRF-Token']=self.csrf
  req=urllib.request.Request(url,headers=headers,data=json.dumps(data).encode() if data is not None else None)
  try:
   with self.op.open(req) as res:
    raw=res.read()
    try:return res.status,json.loads(raw)
    except Exception:raise RuntimeError('Expected JSON response; check test server logs')
  except urllib.error.HTTPError as e:return e.code,json.load(e)
assert str(sql("SELECT DATABASE() AS db")[0]["db"]).endswith("_test"), "Refusing to mutate a non-test database"
a=Client()
create={'label':'TEST 9b','age_group':'14-15','expected':24,'weeks':[{'label':x} for x in ['Ferien','Ferien','Schule','Praktikum','Praktikum','Schule']]}
status,c=a.req('classes',create,csrf=False);ok(status==403,'CSRF blocks class creation')
status,c=a.req('classes',create);ok(status==200,'Class creation with six weeks')
code=c['class']['code'];admin=c['admin_token']
from datetime import datetime
parse=lambda x:datetime.fromisoformat(x.replace('Z','+00:00'))
ok((parse(c['class']['expires_at'])-parse(c['class']['created_at'])).total_seconds()==16200,'Initial duration exactly 270 minutes')
ok(len(admin)==64 and len(code)==6,'Separate random admin token and short class code')
ok(len(c['class']['weeks'])==6,'Configurable weeks persisted')
ok(a.req('public',code=code)[0]==403,'Public class requires teacher release')
ok(a.req('admin',code=code)[0]==401,'Class code cannot access admin')
tokens=[];clients=[];data=[]
for i in range(6):
 s=Client();st,started=s.req('start',{},code=code);assert st==200,started
 t=started['token'];tokens.append(t);clients.append(s)
 payload={'items':[1+(i%4)]*7,'screen':[100+i*10,200,None,180,120,60] if i<4 else [100+i*10,200,300,180,120,60],'apps':['Insta','IG','WA'] if i<5 else ['<img src=x onerror=alert(1)>','Unbekannte App'],'reflection':'PRIVATE NEVER IN ADMIN '+str(i)}
 data.append(payload)
 ok(s.req('results',token=t)[0]==403,f'No comparison before submit {i+1}')
 ok(s.req('draft',payload,token=t)[0]==200,f'Draft saved {i+1}')
 ok(s.req('response',token=t)[1]['response']['items']==payload['items'],f'Draft resume {i+1}')
 if i==0:
  ok(s.req('submit',dict(payload,items=[None]*7),token=t)[0]==422,'Incomplete submission rejected')
  ok(s.req('draft',dict(payload,screen=[1441]*6),token=t)[0]==422,'Out-of-range time rejected')
  ok(s.req('draft',dict(payload,daily_values=[1,2]),token=t)[0]==422,'Daily raw-data payload rejected')
  ok(s.req('admin',token=t)[0]==410,'Response token cannot open admin')
  ok(s.req('results',token=admin)[0]==410,'Admin token cannot open individual response')
  ok(a.req('admin',token=admin)[1]['wir']['n']==0,'Drafts never count')
 ok(s.req('submit',payload,token=t)[0]==200,f'Submission {i+1}')
 result=a.req('admin',token=admin)[1]
 ok(result['wir']['available']==(i>=4),f'Privacy gate at n={i+1}')
 if i==3:ok(set(result['wir'])=={'n','available'},'No hidden aggregates under n=5')
 if i==4:before=clients[0].req('results',token=tokens[0])[1]
after=clients[0].req('results',token=tokens[0])[1]
ok(before['response']==after['response'],'ICH unchanged after later submissions')
ok(before['wir']['n']==5 and after['wir']['n']==6,'WIR changes dynamically')
ok(before['wir']['screen']['weeks'][0]['mean']==120 and after['wir']['screen']['weeks'][0]['mean']==125,'Live mean recomputed from raw weekly averages')
ok(after['wir']['screen']['weeks'][2] is None,'Week n<5 hidden even when class n>=5')
ok(after['wir']['screen']['overall']['median'] is not None,'Overall median provided')
ok(len(after['wir']['screen']['contexts'])==3,'Context grouping combines equal labels')
ok(clients[0].req('draft',dict(data[0],items=[4]*7),token=tokens[0])[0]==409,'Submitted response immutable')
ok(clients[0].req('submit',dict(data[0],items=[4]*7),token=tokens[0])[0]==200,'Repeated final submit idempotent')
ok(clients[0].req('response',token=tokens[0])[1]['response']['items']==data[0]['items'],'Idempotent retry does not overwrite ICH')
adminres=a.req('admin',token=admin)[1]
ok('PRIVATE NEVER IN ADMIN' not in json.dumps(adminres),'Admin never receives reflection or individual row')
ok('resume_token_hash' not in json.dumps(adminres),'Admin never receives response identifiers')
ok(next(x for x in adminres['wir']['apps'] if x['name']=='Instagram')['count']==5,'Aliases deduplicated per person')
ok(not any('img' in x['name'] for x in adminres['wir']['apps']),'Unknown unsafe app text withheld before moderation')
ok(len(adminres['terms'])==2,'Moderation exposes only unlinked terms')
term=next(t for t in adminres['terms'] if t['normalized']=='unbekannte app')
ok(a.req('moderate',{'id':term['id'],'status':'approved'},token=admin)[0]==200,'Teacher can approve an unknown app')
ok(a.req('publish',{'public':True},token=admin)[0]==200,'Teacher releases public view')
public=a.req('public',code=code)[1]
ok('response' not in public and 'terms' not in public,'Public view has no ICH and no pending terms')
ok(any(x['name']=='unbekannte app' for x in public['wir']['apps']),'Approved app visible')
ok(public['jim']['values']==[],'No invented JIM values')
# Test keys are local-only fixtures, never added to deliverable configuration.
key='a'*64;sql("INSERT INTO teacher_keys(key_hash,label,created_at) VALUES ('"+hashlib.sha256(key.encode()).hexdigest()+"','TEST',UTC_TIMESTAMP())")
ok(a.req('extend',{'key':'b'*64},token=admin)[0]==403,'Invalid teacher key rejected')
ok(a.req('extend',{'key':key},token=tokens[0])[0]==410,'Teacher key alone does not replace class admin permission')
for i in range(4):ok(a.req('extend',{'key':key},token=admin)[0]==200,f'Bounded extension {i+1}')
cl=a.req('admin',token=admin)[1]['class']
ok(cl['expires_at']==cl['max_expires_at'],'Hard cap exactly 28 days')
ok(a.req('extend',{'key':key},token=admin)[0]==409,'No extension beyond cap')
# Reference import is append-only and never changes an existing class's pinned dataset.
fixture={'study_year':2099,'source_version':'TEST-only-not-real-jim','source':'https://mpfs.de/mediencheck/','population':'SYNTHETIC TEST FIXTURE, NOT RESEARCH','values':[{'age_group':'14-15','metric_type':'item_distribution','item_id':'jim_01','response_value':v,'percentage':25} for v in range(1,5)]}
f=Path('/tmp/handy-test-reference.json');f.write_text(json.dumps(fixture))
cmd=[PHP,str(ROOT/'bin/import-jim.php'),str(f),'--verified']
ok(subprocess.run(cmd,capture_output=True).returncode==0,'Versioned JIM import validates and persists a new version')
ok(subprocess.run(cmd,capture_output=True).returncode!=0,'Existing reference version cannot be overwritten')
ok(a.req('admin',token=admin)[1]['jim']['values']==[],'Existing class retains pinned reference version')
b=Client();st,c2=b.req('classes',create);ok(st==200,'Second class isolated')
admin2=c2['admin_token'];code2=c2['class']['code']
ok(b.req('admin',token=admin2)[1]['jim']['values'][0]['percentage']=='25.00','New class uses new verified reference')
sql('UPDATE teacher_keys SET active=0')
ok(b.req('extend',{'key':key},token=admin2)[0]==403,'Revoked teacher key rejected')
# Expired class is removed on access, with foreign-key cascades.
sql("UPDATE classes SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 SECOND) WHERE class_code='"+code+"'")
ok(a.req('admin',token=admin)[0]==410,'Expired admin denied and cleanup triggered')
ok(clients[0].req('response',token=tokens[0])[0]==410,'Expired personal token denied')
ok(sql('SELECT COUNT(*) n FROM responses')[0]['n']==0,'All responses deleted after expiry')
ok(sql('SELECT COUNT(*) n FROM class_app_terms')[0]['n']==0,'Temporary moderation data deleted after expiry')
ok(b.req('delete',{},token=admin2)[0]==200,'Early class deletion')
ok(sql('SELECT COUNT(*) n FROM class_weeks')[0]['n']==0,'All child weeks cascaded on deletion')
# Real concurrency: independent sessions submit the same response simultaneously.
x=Client();status,c3=x.req('classes',create);assert status==200,c3
adm3=c3['admin_token'];cod3=c3['class']['code'];t3=x.req('start',{},code=cod3)[1]['token']
parallel=[Client(),Client()]
with concurrent.futures.ThreadPoolExecutor(2) as pool:
 results=list(pool.map(lambda i:parallel[i].req('submit',dict(data[0],items=[1 if i==0 else 4]*7),token=t3),range(2)))
ok(all(r[0]==200 for r in results),'Concurrent submissions succeed idempotently')
ok(x.req('admin',token=adm3)[1]['wir']['n']==1,'Concurrent submissions count exactly once')
# Two independently authenticated sessions extending simultaneously must not lose an update.
sql('UPDATE teacher_keys SET active=1')
with concurrent.futures.ThreadPoolExecutor(2) as pool:
 results=list(pool.map(lambda i:parallel[i].req('extend',{'key':key},token=adm3),range(2)))
ok(all(r[0]==200 for r in results),'Concurrent extensions serialize successfully')
c3after=x.req('admin',token=adm3)[1]['class']
ok((parse(c3after['expires_at'])-parse(c3['class']['expires_at'])).total_seconds()==14*86400,'Concurrent extensions preserve both seven-day increments')
# Failed key attempts count, even though their application transaction rolls back.
limiter=Client()
for i in range(10):assert limiter.req('extend',{'key':'b'*64},token=adm3)[0]==403
ok(limiter.req('extend',{'key':'b'*64},token=adm3)[0]==429,'Failed key attempts are rate limited persistently')
x.req('delete',{},token=adm3)
# Remove synthetic reference and operator fixture before UI tests.
sql('DELETE FROM jim_reference WHERE study_year=2099');sql('DELETE FROM jim_datasets WHERE study_year=2099');sql('DELETE FROM teacher_keys');sql('DELETE FROM rate_limits')
report={'checks':len(checks),'passed':checks,'runtime':'PHP 8.3 / MariaDB 10.11, actual HTTP requests'}
(ROOT/'tests/integration-result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('SUCCESS',len(checks),'checks')
