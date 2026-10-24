import ast, json, pathlib
counts={'python':0,'json':0}; errors=[]
for file in pathlib.Path('public/learning/en').glob('*.json'):
 en=json.loads(file.read_text(encoding='utf-8'));ko=json.loads((file.parent.parent/file.name).read_text(encoding='utf-8'))
 for i,s in enumerate(ko['screens']):
  if s['ui']!='code':continue
  lang=s['data']['language'].lower();a=s['data']['code'];b=en['screens'][i]['data']['code']
  if lang in ('python','py'):
   try:aa=ast.parse(a)
   except SyntaxError:continue
   try:bb=ast.parse(b)
   except SyntaxError as e:errors.append((file.name,i,str(e)));continue
   for tree in (aa,bb):
    for n in ast.walk(tree):
     if isinstance(n,ast.JoinedStr):n.values=[v for v in n.values if not isinstance(v,ast.Constant)]
     if isinstance(n,ast.Constant) and isinstance(n.value,str):n.value='TEXT'
   if ast.dump(aa)!=ast.dump(bb):errors.append((file.name,i,'Python structure changed'))
   counts['python']+=1
  if lang=='json':
   try:json.loads(a)
   except:continue
   try:json.loads(b);counts['json']+=1
   except Exception as e:errors.append((file.name,i,str(e)))
print(counts);print(json.dumps(errors,ensure_ascii=False));assert not errors
