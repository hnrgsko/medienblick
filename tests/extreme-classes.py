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

import statistics
classes=[]
scenarios=[('Minimum',1,5,'zero'),('Unter Schwelle',6,4,'max'),('Gespalten',6,24,'split'),('Luecken',8,5,'missing'),('Ausreisser',52,5,'outlier'),('Parallel',4,10,'mixed')]
for label,weeks,n,mode in scenarios:
 admin_client=Client()
 st,c=admin_client.req('classes',{'label':'TEST '+label,'age_group':'14-15','expected':n,'weeks':[{'label':'Woche '+str(i+1),'context_type':['ferien','schule','praktikum','sonstiges'][i%4]} for i in range(weeks)]})
 ok(st==200,label+' erstellt');code=c['class']['code'];admin=c['admin_token'];people=[]
 for i in range(n):
  client=Client();st,r=client.req('start',{},code=code);assert st==200,r
  token=r['token']
  minutes=0 if mode=='zero' else 1440 if mode=='max' else (0 if i<n/2 else 1440) if mode=='split' else (1440 if i==4 else 60) if mode=='outlier' else 100+i
  screen=[minutes]*weeks
  if mode=='missing':screen=[None]*weeks;screen[0]=100;screen[1]=200 if i<4 else None
  data={'items':[1 if i%2==0 else 4]*7,'screen':screen,'apps':['WA','WhatsApp','YT'],'reflection':'PRIVAT-'+label+'-'+str(i)}
  ok(client.req('results',token=token)[0]==403,label+' keine Ergebnisse vor Abgabe')
  people.append((client,token,data))
 if mode=='mixed':
  with concurrent.futures.ThreadPoolExecutor(10) as pool:
   submitted=list(pool.map(lambda t:t[0].req('submit',t[2],token=t[1]),people))
  ok(all(x[0]==200 for x in submitted),'10 gleichzeitige Abgaben')
 else:
  for client,token,data in people:assert client.req('submit',data,token=token)[0]==200
 r=admin_client.req('admin',token=admin)[1];w=r['wir']
 ok(w['n']==n,label+' korrekte isolierte Teilnehmerzahl')
 ok(w['available']==(n>=5),label+' Datenschutzschwelle')
 ok('PRIVAT-' not in json.dumps(r),label+' private Reflexionen nicht im Cockpit')
 if n>=5:
  means=[statistics.mean([v for v in t[2]['screen'] if v is not None]) for t in people]
  ok(abs(w['screen']['overall']['mean']-statistics.mean(means))<.011,label+' Mittelwert korrekt')
  ok(abs(w['screen']['overall']['median']-statistics.median(means))<.011,label+' Median korrekt')
  ok(w['items'][0]['agreement']==round(100*(n//2)/n,1),label+' extreme Antwortverteilung korrekt')
  if mode=='missing':ok(w['screen']['weeks'][1] is None and w['screen']['weeks'][2] is None,'Wochen mit vier/keinen Werten bleiben verborgen')
  app=next(a for a in w['apps'] if a['name']=='WhatsApp');ok(app['count']==n,'App-Aliase pro Person nur einmal gezählt')
 first=people[0];own=first[0].req('response',token=first[1])[1]['response']
 ok(first[0].req('draft',dict(first[2],items=[2]*7),token=first[1])[0]==409,label+' endgültige Abgabe gesperrt')
 ok(first[0].req('response',token=first[1])[1]['response']==own,label+' ICH unverändert')
 classes.append((admin_client,c,people))
# All classes still coexist. A submitted token from another class cannot become an admin.
for client,c,people in classes:
 ok(client.req('admin',token=classes[0][2][0][1])[0]==410,'Fremder Antworttoken ist kein Adminzugang')
 ok(client.req('admin',token=c['admin_token'])[1]['wir']['n']==len(people),'Klassen bleiben unabhängig')
# Invalid data and draft-only participants do not change aggregates.
a,c,_=classes[0];new=Client();token=new.req('start',{},code=c['class']['code'])[1]['token'];valid={'items':[3]*7,'screen':[60],'apps':[],'reflection':''}
for bad in [dict(valid,screen=[-1]),dict(valid,screen=[1441]),dict(valid,items=[5]*7),dict(valid,items=[True]*7),dict(valid,screen=[1,2]),dict(valid,daily_values=[1]*7)]:
 ok(new.req('submit',bad,token=token)[0]==422,'Unzulässige Eingabe abgewiesen')
ok(new.req('draft',valid,token=token)[0]==200,'Entwurf gespeichert')
ok(a.req('admin',token=c['admin_token'])[1]['wir']['n']==5,'Entwurf und fehlerhafte Versuche zählen nicht')
# Expire one instance, prove others remain and all children of the expired class disappear.
class_id=sql("SELECT id FROM classes WHERE class_code='"+c['class']['code']+"'")[0]['id']
sql("UPDATE classes SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 SECOND) WHERE id="+str(class_id))
ok(a.req('admin',token=c['admin_token'])[0]==410,'Abgelaufene Klasse gesperrt')
ok(sql('SELECT COUNT(*) n FROM responses WHERE class_id='+str(class_id))[0]['n']==0,'Antworten und Entwurf der abgelaufenen Klasse gelöscht')
for client,other,people in classes[1:]:ok(client.req('admin',token=other['admin_token'])[1]['wir']['n']==len(people),'Ablauf berührt andere Klassen nicht')
report={'classes':len(classes),'submitted':sum(x[2] for x in scenarios),'checks':len(checks),'scenarios':scenarios,'passed':checks}
(ROOT/'tests/extreme-classes-result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('SUCCESS',len(checks),'checks across',len(classes),'classes')
