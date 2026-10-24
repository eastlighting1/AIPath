"""Offline translation build. Checkpoint public lesson text; never send audit sources."""
import concurrent.futures, hashlib, json, pathlib, re, time, urllib.request, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'content/learning/english';BASE.mkdir(exist_ok=True)
MEM=BASE/'memory.jsonl'
HANGUL=re.compile('[가-힣]')
CODE=re.compile(r'"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\'|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|#[^\n]*|//[^\n]*')
def code_parts(code):
    for m in CODE.finditer(code):
        if HANGUL.search(m.group()):
            s=m.group();q=3 if s.startswith(('"""',"'''")) else 1 if s[0] in '\"\'' else 2 if s.startswith('//') else 1
            end=q if s[0] in '\"\'' else 0
            value=s[q:len(s)-end if end else len(s)]
            for part in value.split('\n'):
                if HANGUL.search(part):yield part
def masked_terms(screen):
    d=screen['data'];items=d.get('marks',[]) if screen['ui']=='highlight' else d.get('terms',[])
    terms=[x.get('span',x.get('term')) for x in items]
    text=d['text']
    text=re.sub('|'.join(re.escape(t) for t in sorted(terms,key=len,reverse=True)),lambda m:'ZXQTERM%04dQXZ'%terms.index(m[0]),text)
    return text,terms
def collect(v,key=''):
    if isinstance(v,str):
        if key=='code':yield from code_parts(v)
        elif HANGUL.search(v):yield v
    elif isinstance(v,list):
        for x in v:yield from collect(x,key)
    elif isinstance(v,dict):
        for k,x in v.items():yield from collect(x,k)
lessons={p.name:json.loads(p.read_text(encoding='utf-8')) for p in sorted((ROOT/'public/learning').glob('*.json'))}
texts=dict.fromkeys(s for d in lessons.values() for s in collect(d))
for d in lessons.values():
    for screen in d['screens']:
        if screen['ui'] in ('hover','highlight'):
            s,_=masked_terms(screen)
            if HANGUL.search(s):texts[s]=None
# Additional display-only prompt lines, YAML values and SQL comments.
for d in lessons.values():
    for screen in d['screens']:
        if screen['ui']!='code':continue
        code=screen['data']['code'];language=screen['data']['language'].lower()
        for line in code.split('\n'):
            value=None
            if language in ('text','plaintext','markdown'):value=line.strip()
            elif language in ('sql',):
                m=re.match(r'\s*--(.*)',line)
                if m:value=m[1]
            elif language in ('yaml','yml'):
                m=re.match(r'\s*(?:- )?[a-zA-Z_]+:\s*(.*)',line)
                if m and HANGUL.search(m[1]) and not m[1].startswith(('\"',"'")):value=m[1].split(' #')[0]
            if value and HANGUL.search(value):texts[value]=None
memory={}
if MEM.exists():
    for line in MEM.read_text(encoding='utf-8').splitlines():
        row=json.loads(line)
        if not HANGUL.search(row['english']):memory[row['source']]=row['english']
manual={'문제제시':'Problem','활성화':'Activate','시연':'Demonstration','적용':'Application','통합':'Synthesis','전체':'All','토큰':'token','토큰화':'tokenization','어휘':'vocabulary','어림':'estimate','맞습니다.':'Correct.','다시 생각해 보세요.':'Try again.'}
for k,v in manual.items():memory[k]=v
if (BASE/'overrides.json').exists():memory.update(json.loads((BASE/'overrides.json').read_text(encoding='utf-8')))
PROTECT=re.compile(r'`[^`]+`|https?://[^\s)<>]+|ZXQTERM\d+QXZ|\\[nrt]|\{[a-zA-Z_][a-zA-Z0-9_]*\}')
def protect(s):
    saved=[]
    def sub(m):
        if HANGUL.search(m.group()):return m.group()
        saved.append(m.group());return 'ZXQLIT%04dQXZ'%(len(saved)-1)
    return PROTECT.sub(sub,s),saved
def translate_batch(batch,attempt=0):
    if len(batch)==1 and len(urllib.parse.quote(batch[0]))>11000:
        parts=re.split(r'(?<=[.!?])\s+|\n+',batch[0]);segments=[]
        for part in parts:
            while len(urllib.parse.quote(part))>10000:
                cut=part.rfind(' ',0,900)
                if cut<100:cut=900
                segments.append(part[:cut]);part=part[cut:].lstrip()
            if part:segments.append(part)
        return [(batch[0],' '.join(translate_batch([part])[0][1] for part in segments))]
    protected=[protect(s) for s in batch]
    q='\n\n'.join('[[[S%05d]]]\n'%i+p[0] for i,p in enumerate(protected))
    url='https://translate.googleapis.com/translate_a/single?'+urllib.parse.urlencode(dict(client='gtx',sl='ko',tl='en',dt='t',q=q))
    try:
        with urllib.request.urlopen(url,timeout=60) as r:raw=json.load(r)
        out=''.join(x[0] or '' for x in raw[0]);marks=list(re.finditer(r'\[\[\[S\s*(\d+)\]\]\]',out))
        if len(marks)!=len(batch):raise ValueError('segment boundary mismatch')
        results=[]
        for i,m in enumerate(marks):
            if int(m[1])!=i:raise ValueError('segment order mismatch')
            value=out[m.end():marks[i+1].start() if i+1<len(marks) else len(out)].strip()
            for n,original in enumerate(protected[i][1]):
                pattern=r'ZXQ\s*LIT\s*%04d\s*QXZ'%n
                if not re.search(pattern,value,re.I):raise ValueError('literal missing')
                value=re.sub(pattern,lambda _:original,value,flags=re.I)
            if not value:raise ValueError('empty translation')
            if HANGUL.search(value):raise ValueError('untranslated Korean')
            results.append((batch[i],value))
        time.sleep(.25)
        return results
    except Exception as e:
        if getattr(e,'code',0)==429:raise RuntimeError('Translation service rate limit; checkpoint retained') from e
        if not isinstance(e,ValueError) and getattr(e,'code',0)!=400 and attempt<3:
            time.sleep(3*(attempt+1));return translate_batch(batch,attempt+1)
        if len(batch)>1:
            half=len(batch)//2;return translate_batch(batch[:half])+translate_batch(batch[half:])
        if isinstance(e,ValueError):
            p,saved=protect(batch[0]);url='https://translate.googleapis.com/translate_a/single?'+urllib.parse.urlencode(dict(client='gtx',sl='ko',tl='en',dt='t',q=p))
            with urllib.request.urlopen(url,timeout=60) as r:raw=json.load(r)
            value=''.join(x[0] or '' for x in raw[0])
            for n,original in enumerate(saved):value=value.replace('ZXQLIT%04dQXZ'%n,original)
            if value and not HANGUL.search(value) and not re.search(r'ZXQLIT\d+QXZ',value):return [(batch[0],value)]
        raise RuntimeError(str(e)+' source: '+batch[0][:100])
if __name__=='__main__':
    pending=[s for s in texts if s not in memory]
    batches=[];batch=[];size=0
    for s in pending:
        if batch and size+len(urllib.parse.quote(s))+50>11000:batches.append(batch);batch=[];size=0
        batch.append(s);size+=len(urllib.parse.quote(s))+50
    if batch:batches.append(batch)
    print(json.dumps(dict(total=len(texts),cached=len(texts)-len(pending),batches=len(batches))),flush=True)
    done=0
    with MEM.open('a',encoding='utf-8') as file,concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        futures={pool.submit(translate_batch,b):b for b in batches}
        for future in concurrent.futures.as_completed(futures):
            try:result=future.result()
            except Exception as error:
                if 'rate limit' in str(error):
                    for job in futures:job.cancel()
                    raise SystemExit('Translation service rate limit; saved checkpoint retained')
                print('RETRY LATER: '+str(error)[:160],flush=True);continue
            for source,english in result:
                file.write(json.dumps(dict(source=source,english=english),ensure_ascii=False)+'\n');memory[source]=english
            file.flush();done+=1
            if done%20==0:print('Batches %d/%d; translated strings %d'%(done,len(batches),len(memory)),flush=True)
    for k,v in manual.items():
        with MEM.open('a',encoding='utf-8') as file:file.write(json.dumps(dict(source=k,english=v),ensure_ascii=False)+'\n')
    missing=sum(s not in memory for s in texts)
    print('Remaining strings: '+str(missing),flush=True)
    if missing:raise SystemExit(1)
    print('TRANSLATION COMPLETE',flush=True)

