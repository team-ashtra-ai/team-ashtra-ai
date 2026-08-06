from pathlib import Path
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[2]
missing=[]
for f in root.rglob('*.html'):
 s=BeautifulSoup(f.read_text(encoding='utf-8'),'html.parser')
 for tag,attr in [('a','href'),('img','src'),('script','src'),('link','href')]:
  for n in s.find_all(tag):
   v=n.get(attr,'')
   if not v or v.startswith(('http:','https:','mailto:','tel:','#','data:')): continue
   v=v.split('#')[0].split('?')[0]
   target=(root/v.lstrip('/')) if v.startswith('/') else (f.parent/v)
   if v.endswith('/'):
    target=target/'index.html'
   if not target.exists(): missing.append((str(f.relative_to(root)),v))
print(f'HTML files: {len(list(root.rglob("*.html")))}')
if missing:
 print('Missing references:')
 for x in missing: print(x)
 raise SystemExit(1)
print('All local links and assets resolve.')
