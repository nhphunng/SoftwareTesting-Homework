#!/usr/bin/env python3
import base64, json, os, time, urllib.request, urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('FR16_BASE_URL','http://localhost:3000').rstrip('/')
SID='23127194'
ADMIN_TOKEN=os.environ.get('FR16_ADMIN_TOKEN','')
NONADMIN_TOKEN=os.environ.get('FR16_NONADMIN_TOKEN','')
if not ADMIN_TOKEN or not NONADMIN_TOKEN:
    raise SystemExit('Set FR16_ADMIN_TOKEN and FR16_NONADMIN_TOKEN at runtime. Do not store secrets in this script.')

def call(method,path,body=None,token=None):
    data=None if body is None else json.dumps(body).encode()
    headers={'X-Student-Id':SID}
    if body is not None: headers['Content-Type']='application/json'
    if token: headers['Authorization']='Bearer '+token
    req=urllib.request.Request(BASE+path,data=data,headers=headers,method=method)
    try:
        with urllib.request.urlopen(req,timeout=5) as r:
            raw=r.read().decode(); return r.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        raw=e.read().decode()
        try: payload=json.loads(raw) if raw else None
        except Exception: payload=raw
        return e.code,payload

def b64url(data): return base64.urlsafe_b64encode(data).decode().rstrip('=')
def tamper_signature(token):
    a,b,c=token.split('.')
    c2=c[:-1]+('A' if not c.endswith('A') else 'B')
    return f'{a}.{b}.{c2}'
def forge_admin(token):
    a,b,c=token.split('.')
    payload=json.loads(base64.urlsafe_b64decode(b+'='*(-len(b)%4)))
    payload['role']='admin'
    return f"{a}.{b64url(json.dumps(payload,separators=(',',':')).encode())}.{c}"

sa,admin=call('GET','/api/users/me',token=ADMIN_TOKEN)
su,user=call('GET','/api/users/me',token=NONADMIN_TOKEN)
if sa//100!=2 or not isinstance(admin,dict) or admin.get('role')!='admin': raise SystemExit('admin token verification failed')
if su//100!=2 or not isinstance(user,dict) or user.get('role')=='admin': raise SystemExit('non-admin token verification failed')
sc,cats=call('GET','/api/categories')
if sc//100!=2 or not isinstance(cats,list) or not cats: raise SystemExit('category list unavailable')
category_id=int(cats[0]['id']); absent=2147483647
if any(int(c.get('id',-1))==absent for c in cats): raise SystemExit('absentCategoryId is not absent')
name=f'HW06_FR16_STALE_{int(time.time())}'
sn,newcat=call('POST','/api/categories',{'name':name},ADMIN_TOKEN)
if sn//100!=2 or not isinstance(newcat,dict) or not newcat.get('id'): raise SystemExit(f'disposable category create failed: HTTP {sn}')
human_cat=int(newcat['id'])
sv,cats2=call('GET','/api/categories')
if sv//100!=2 or not any(int(c.get('id',-1))==human_cat for c in cats2): raise SystemExit('disposable category verification failed')

pub=ROOT/'postman/environment/HW06-FR16-Local.postman_environment.json'
priv=ROOT/'postman/environment/HW06-FR16-Local.private.postman_environment.json'
env=json.loads(pub.read_text()); vals={v['key']:v for v in env['values']}
updates={'baseUrl':BASE,'studentId':SID,'adminToken':ADMIN_TOKEN,'nonAdminToken':NONADMIN_TOKEN,
         'tamperedJwt':tamper_signature(ADMIN_TOKEN),'forgedAdminJwt':forge_admin(NONADMIN_TOKEN),
         'categoryId':str(category_id),'absentCategoryId':str(absent),'humanStaleCategoryId':str(human_cat),
         'staleToken':'','superAdminToken':'','roleTargetUserId':''}
for k,v in updates.items(): vals[k]['value']=v
priv.write_text(json.dumps(env,ensure_ascii=False,indent=2)+'\n')
run_id=f'FR16-{int(time.time())}'
(ROOT/'postman/data/FR16-runtime-data.json').write_text(json.dumps({'feature':'FR16','studentId':SID,'baseUrl':BASE,'iterations':[{'runId':run_id}]},indent=2)+'\n')
manifest={'runId':run_id,'baseUrl':BASE,'studentId':SID,'categoryId':category_id,'absentCategoryId':absent,
          'disposableCategory':{'id':human_cat,'name':name},
          'actors':{'admin':{'id':admin.get('id'),'email':admin.get('email'),'role':admin.get('role')},
                    'nonAdmin':{'id':user.get('id'),'email':user.get('email'),'role':user.get('role')}},
          'secretsStoredInManifest':False}
(ROOT/'PoolC-FR-16-ImportProducts/postman/runtime-fixture-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('FR16 Step J runtime prepared')
print('admin role verified: yes')
print('non-admin role verified: yes')
print('categoryId:',category_id)
print('absentCategoryId verified absent:',absent)
print('disposable category prepared:',human_cat)
print('private environment written: yes')
print('Newman execution: not started')
