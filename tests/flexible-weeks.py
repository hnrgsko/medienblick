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

assert Client().req('bootstrap')[1]['flexible_weeks'] is True
for count in [1,4,8,52]:
 a=Client()
 weeks=[{'label':'Eigene Woche '+str(i+1),'context_type':['ferien','schule','praktikum','sonstiges'][i%4]} for i in range(count)]
 st,c=a.req('classes',{'label':'TEST variable','age_group':'14-15','weeks':weeks})
 ok(st==200,f'Create {count} weeks')
 adm=c['admin_token'];code=c['class']['code']
 ok(len(c['class']['weeks'])==count,f'Persist {count} week plan')
 ok(c['class']['weeks'][-1]['context_type']==weeks[-1]['context_type'],'Persist explicit category independently of label')
 records=[]
 for i in range(5 if count==8 else 1):
  client=Client();st,started=client.req('start',{},code=code);assert st==200
  token=started['token']
  ok(client.req('response',token=token)[1]['response']['screen']==[None]*count,'Empty response has class-specific length')
  payload={'items':[3]*7,'screen':[0]+[100+i]*(count-1),'apps':[],'reflection':''}
  if count==8 and i<4:payload['screen'][-1]=None
  ok(client.req('draft',dict(payload,screen=[1]*(count+1)),token=token)[0]==422,'Wrong screen length rejected')
  ok(client.req('draft',dict(payload,screen=[1441]*count),token=token)[0]==422,'Invalid minutes rejected')
  ok(client.req('draft',payload,token=token)[0]==200,'Save variable draft')
  ok(client.req('response',token=token)[1]['response']['screen']==payload['screen'],'Resume preserves all weeks and nulls')
  ok(client.req('submit',payload,token=token)[0]==200,'Submit variable response')
  records.append((client,token,payload))
 result=records[0][0].req('results',token=records[0][1])[1]
 ok(result['response']['screen']==records[0][2]['screen'],'Own values immutable after other submissions')
 ok(records[0][0].req('draft',records[0][2],token=records[0][1])[0]==409,'Submitted draft remains locked')
 if count==8:
  w=result['wir'];ok(w['available'] and len(w['screen']['weeks'])==8,'WIR uses all eight weeks')
  ok(w['screen']['weeks'][0]['mean']==0,'Zero retained')
  ok(w['screen']['weeks'][6]['mean']==102,'Weeks beyond six aggregated')
  ok(w['screen']['weeks'][7] is None,'Privacy gate per week')
  ok(len(w['screen']['contexts'])==4,'Group by four types despite eight custom labels')
  assert a.req('publish',{'public':True},token=adm)[0]==200
  public=a.req('public',code=code)[1]
  ok('response' not in public and len(public['wir']['screen']['weeks'])==8,'Public response only aggregates')
 ok(a.req('delete',{},token=adm)[0]==200,'Delete class')
 ok(sql('SELECT COUNT(*) AS n FROM response_screen_weeks')[0]['n']==0,'Delete cascades weekly records')
for weeks in [[],[{'label':'Schule'}]*53,[{'label':'Schule','context_type':'invalid'}]]:
 a=Client();ok(a.req('classes',{'age_group':'14-15','weeks':weeks})[0]==422,'Reject invalid plan')
sql('DELETE FROM rate_limits')
print('SUCCESS',len(checks),'flexible-week checks')
