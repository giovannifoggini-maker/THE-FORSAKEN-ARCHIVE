"""Regenerate data/local-data.js from the editable JSON datasets."""
import json
from pathlib import Path
base=Path(__file__).resolve().parents[1]
manifest=json.loads((base/'data/manifest.json').read_text(encoding='utf-8'))
out={}
for name in manifest['meta']['datasets']:
    p=base/'data'/f'{name}.json'
    if p.exists(): out[name]=json.loads(p.read_text(encoding='utf-8'))
(base/'data/local-data.js').write_text('window.FA_LOCAL_DATA = '+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(f"Bundle locale aggiornato: {len(out)} dataset")
