from pathlib import Path
import json, hashlib, html, math, random

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT/'assets'/'images'/'archive'
IMG.mkdir(parents=True, exist_ok=True)

PALETTES = {
 'characters': [('#ef233c','#6d329a'),('#e14b5a','#47276a'),('#bd3154','#2c3b73'),('#8c2e4e','#53317d')],
 'maps': [('#ef233c','#6d329a'),('#d75a38','#43265f'),('#7758b7','#1d3957'),('#ba3652','#382347'),('#b88a45','#4a2e53')],
 'skins': [('#d95367','#7645a5'),('#d79b45','#613c89'),('#4d8cb0','#733f83')],
 'abilities': [('#ef4358','#713ca0'),('#a34fbd','#375fa2'),('#d85a83','#6e3c9d')],
 'items': [('#d9a25b','#77419a'),('#db5861','#384f83')],
 'effects': [('#eb465d','#763ea0'),('#7e70c7','#3d4d83')],
 'emotes': [('#e95e80','#7651a7'),('#cf9048','#66428e')],
 'lore': [('#be3c55','#45336f'),('#d59b50','#54366d')],
 'badges': [('#e3ae59','#8e3e69'),('#e35464','#60418f')],
 'events': [('#ef4358','#6e3a9b'),('#dba452','#62366f')],
 'updates': [('#ce4b58','#554090'),('#d0a055','#493b7d')],
 'guides': [('#bd4864','#56449a'),('#d8a254','#4e3878')],
 'tierlists': [('#de5262','#51459c'),('#d39a51','#703c7c')],
}


def choose_palette(category, key):
    arr = PALETTES.get(category, PALETTES['abilities'])
    digest = hashlib.sha256(key.encode('utf-8')).digest()
    return arr[digest[0] % len(arr)]

def text_svg(txt):
    return html.escape(str(txt or ''), quote=True)

def create_svg(category, item):
    name = item.get('name') or item.get('title') or item.get('version') or category.title()
    ident = item.get('id', 'record')
    a,b = choose_palette(category, ident)
    h = int(hashlib.sha256(ident.encode()).hexdigest()[:8],16)
    r = random.Random(h)
    # repeatable architectural silhouettes
    skyline=[]
    x=0
    while x < 760:
        w=r.randint(42,105); hh=r.randint(55,190); y=310-hh
        skyline.append(f'<path d="M{x} 310 V{y} h{w} v{hh}Z" fill="#090911" opacity="{r.uniform(.36,.82):.2f}"/>')
        if r.random()>.45:
            skyline.append(f'<path d="M{x+8} {y+15} h{w-16} v5 h-{w-16}Z" fill="{a}" opacity=".32"/>')
        x+=w+r.randint(5,19)
    stars=''.join(f'<circle cx="{r.randint(20,700)}" cy="{r.randint(20,220)}" r="{r.choice([1,1.5,2])}" fill="#fff" opacity="{r.uniform(.18,.65):.2f}"/>' for _ in range(42))
    title=text_svg(name)
    label = category.replace('tierlists','tier list').replace('effects','STATUS').replace('characters','CHARACTER').upper()
    subtitle='FOGLABS ARCHIVE ART · NON-OFFICIAL ILLUSTRATION'

    if category in ('characters','skins'):
        side = item.get('side','')
        # no weapons/attack props: blocky generic avatar silhouette
        accent = a if side == 'Killer' else b
        silhouette = f'''
        <ellipse cx="360" cy="394" rx="112" ry="13" fill="#05050a" opacity=".55" filter="url(#shadow)"/>
        <g transform="translate(0,8)">
          <path d="M277 308 Q292 267 320 254 L345 236 L375 236 L400 254 Q428 267 443 308Z" fill="#090910" stroke="{accent}" stroke-opacity=".56" stroke-width="4"/>
          <rect x="322" y="125" width="76" height="87" rx="8" fill="#11111a" stroke="{accent}" stroke-width="4"/>
          <path d="M322 150 H398" stroke="#fff" opacity=".15" stroke-width="4"/>
          <rect x="297" y="218" width="126" height="103" rx="10" fill="#11111a" stroke="{accent}" stroke-width="4"/>
          <path d="M298 245 L266 291 L280 302 L322 268 M422 245 L454 291 L440 302 L398 268" fill="#101018" stroke="{accent}" stroke-width="4"/>
          <path d="M338 321 L332 385 H357 L366 328 M383 321 L389 385 H414 L405 328" fill="#0b0a12" stroke="{accent}" stroke-width="4"/>
          <path d="M344 164 h8 M367 164 h8" stroke="#f4eff7" stroke-width="5" stroke-linecap="round"/>
          <path d="M344 184 Q360 194 376 184" fill="none" stroke="{accent}" stroke-width="3"/>
        </g>'''
        if category=='skins':
            overlay=f'<path d="M292 226 L360 250 L428 226 L414 302 L306 302Z" fill="{b}" opacity=".35"/><path d="M322 130 L360 108 L398 130" stroke="{b}" stroke-width="8" fill="none"/>'
        else: overlay=''
        center=f'''<circle cx="360" cy="142" r="126" fill="{accent}" opacity=".12"/><path d="M120 330 Q360 280 600 330" stroke="{accent}" stroke-width="2" opacity=".28" fill="none"/>{silhouette}{overlay}'''
    elif category=='maps':
        # atmospheric landscape / structures, explicitly illustrative not a real map screenshot
        buildings=''.join(skyline)
        center=f'''<circle cx="565" cy="110" r="60" fill="{a}" opacity=".28"/><circle cx="565" cy="110" r="82" fill="none" stroke="{a}" opacity=".25" stroke-width="2"/>{buildings}
        <path d="M0 310 Q170 274 350 316 T720 306 V420 H0Z" fill="#090911" opacity=".86"/>
        <path d="M0 355 Q160 310 360 355 T720 350" stroke="{b}" stroke-width="3" fill="none" opacity=".5"/>
        <path d="M0 390 H720" stroke="{a}" opacity=".35" stroke-width="2"/>
        <g fill="{b}" opacity=".48"><rect x="80" y="270" width="12" height="12"/><rect x="112" y="284" width="10" height="10"/><rect x="575" y="255" width="12" height="12"/></g>'''
    elif category in ('abilities','effects'):
        n=6+(h%5); rays=[]
        for i in range(n):
            ang=2*math.pi*i/n
            x1=360+math.cos(ang)*75; y1=205+math.sin(ang)*75
            x2=360+math.cos(ang)*145; y2=205+math.sin(ang)*145
            rays.append(f'<path d="M{x1:.1f} {y1:.1f} L{x2:.1f} {y2:.1f}" stroke="{a if i%2 else b}" stroke-width="7" stroke-linecap="round" opacity=".7"/>')
        center=f'''<circle cx="360" cy="205" r="153" stroke="{a}" stroke-width="3" fill="none" opacity=".35"/><circle cx="360" cy="205" r="111" stroke="{b}" stroke-width="2" fill="none" opacity=".55" stroke-dasharray="8 12"/>{''.join(rays)}<path d="M360 126 L394 184 L360 205 L326 184Z" fill="{a}"/><path d="M360 284 L326 226 L360 205 L394 226Z" fill="{b}"/><circle cx="360" cy="205" r="32" fill="#0a0a12" stroke="#f4eff7" stroke-opacity=".65" stroke-width="3"/><circle cx="360" cy="205" r="10" fill="{a}"/>'''
    elif category=='items':
        center=f'''<ellipse cx="360" cy="310" rx="180" ry="28" fill="#05050a" opacity=".5"/><path d="M260 135 L360 87 L460 135 L360 184Z" fill="{a}" stroke="#f3e9f5" stroke-opacity=".5" stroke-width="3"/><path d="M260 135 V265 L360 324 V184Z" fill="#171321" stroke="{b}" stroke-width="4"/><path d="M460 135 V265 L360 324 V184Z" fill="#0e0c17" stroke="{a}" stroke-width="4"/><path d="M360 184 V324" stroke="#f4eff7" opacity=".24" stroke-width="3"/><circle cx="360" cy="207" r="24" fill="{b}"/>'''
    elif category=='emotes':
        center=f'''<path d="M200 265 Q360 40 520 265" fill="none" stroke="{a}" stroke-width="5" stroke-dasharray="10 13" opacity=".7"/><path d="M232 296 Q360 108 488 296" fill="none" stroke="{b}" stroke-width="3" opacity=".6"/><g fill="#10101a" stroke="{a}" stroke-width="5"><rect x="329" y="115" width="62" height="70" rx="8"/><rect x="296" y="192" width="128" height="105" rx="14"/><path d="M300 220 L252 175 L240 188 L281 252 M420 220 L468 175 L480 188 L439 252" fill="none" stroke-linecap="round"/><path d="M325 297 L310 365 M395 297 L410 365" fill="none" stroke-width="12" stroke-linecap="round"/></g><path d="M215 116 l22 -24 M495 116 l-22 -24 M355 65 v-26" stroke="{b}" stroke-width="5" stroke-linecap="round"/>'''
    elif category=='badges':
        center=f'''<path d="M360 80 L520 155 L490 310 L360 374 L230 310 L200 155Z" fill="#0b0b13" stroke="{a}" stroke-width="8"/><path d="M360 115 L467 170 L445 278 L360 328 L275 278 L253 170Z" fill="{b}" opacity=".4" stroke="#f4eff7" stroke-opacity=".55" stroke-width="3"/><path d="M360 150 L391 205 L452 212 L406 252 L417 312 L360 282 L303 312 L314 252 L268 212 L329 205Z" fill="{a}" stroke="#f4eff7" stroke-width="3"/>'''
    elif category=='events':
        center=f'''<circle cx="360" cy="200" r="145" fill="none" stroke="{a}" stroke-width="4" opacity=".55"/><circle cx="360" cy="200" r="108" fill="{b}" opacity=".18"/><path d="M360 83 L380 163 L463 140 L398 197 L471 247 L389 235 L360 322 L331 235 L249 247 L322 197 L257 140 L340 163Z" fill="{a}" opacity=".82" stroke="#f4eff7" stroke-opacity=".5" stroke-width="3"/><circle cx="360" cy="202" r="26" fill="#10101a" stroke="{b}" stroke-width="4"/>'''
    elif category=='lore':
        center=f'''<path d="M170 123 Q270 82 360 132 Q450 82 550 123 V315 Q450 276 360 326 Q270 276 170 315Z" fill="#11101a" stroke="{a}" stroke-width="6"/><path d="M360 132 V326" stroke="{b}" stroke-width="5"/><g stroke="#f4eff7" opacity=".45" stroke-width="4"><path d="M210 170 h110 M210 194 h110 M210 218 h94 M410 170 h100 M410 194 h100 M410 218 h85"/></g><path d="M360 100 Q390 65 424 92" stroke="{a}" stroke-width="5" fill="none"/>'''
    elif category=='updates':
        center=f'''<path d="M245 78 H430 L490 138 V340 H245Z" fill="#12111b" stroke="{a}" stroke-width="6"/><path d="M430 78 V138 H490" fill="none" stroke="{b}" stroke-width="6"/><path d="M280 178 H450 M280 215 H450 M280 252 H420 M280 289 H390" stroke="#f4eff7" stroke-opacity=".5" stroke-width="8" stroke-linecap="round"/><circle cx="360" cy="118" r="27" fill="{b}" opacity=".85"/>'''
    elif category=='guides':
        center=f'''<path d="M175 128 Q270 90 360 134 Q450 90 545 128 V316 Q450 278 360 324 Q270 278 175 316Z" fill="#11101a" stroke="{a}" stroke-width="6"/><path d="M360 134 V324" stroke="{b}" stroke-width="5"/><path d="M215 180 h100 M215 210 h100 M405 180 h100 M405 210 h100 M215 242 h78 M405 242 h78" stroke="#f4eff7" opacity=".45" stroke-width="6" stroke-linecap="round"/><path d="M338 96 l22 -22 22 22" fill="none" stroke="{a}" stroke-width="6"/>'''
    elif category=='tierlists':
        center=f'''<path d="M180 330 H540" stroke="#f4eff7" opacity=".3" stroke-width="4"/><rect x="220" y="240" width="85" height="90" rx="7" fill="{b}" stroke="#f4eff7" stroke-opacity=".4" stroke-width="3"/><rect x="317" y="160" width="85" height="170" rx="7" fill="{a}" stroke="#f4eff7" stroke-opacity=".45" stroke-width="3"/><rect x="414" y="205" width="85" height="125" rx="7" fill="{b}" opacity=".65" stroke="#f4eff7" stroke-opacity=".4" stroke-width="3"/><path d="M360 76 L374 110 L411 114 L383 138 L391 174 L360 155 L329 174 L337 138 L309 114 L346 110Z" fill="{a}" stroke="#f4eff7" stroke-width="3"/>'''
    else:
        center=f'<circle cx="360" cy="205" r="120" fill="none" stroke="{a}" stroke-width="5"/>'

    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420" role="img" aria-label="{title} — illustrazione originale FogLabs, non ufficiale">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b0912"/><stop offset=".52" stop-color="{b}" stop-opacity=".75"/><stop offset="1" stop-color="#0b0810"/></linearGradient>
        <radialGradient id="glow"><stop stop-color="{a}" stop-opacity=".42"/><stop offset="1" stop-color="{a}" stop-opacity="0"/></radialGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="720" height="420" fill="url(#bg)"/><ellipse cx="360" cy="205" rx="340" ry="260" fill="url(#glow)"/>
      {stars}
      <path d="M0 0 H720 V22 Q540 42 360 22 T0 22Z" fill="{a}" opacity=".38"/>
      {center}
      <rect y="358" width="720" height="62" fill="#07070d" opacity=".88"/>
      <path d="M0 358 H720" stroke="{a}" stroke-width="2" opacity=".85"/>
      <text x="25" y="385" fill="#f7f2f8" font-size="21" font-family="Arial,sans-serif" font-weight="700" letter-spacing="1">{title[:34]}</text>
      <text x="25" y="405" fill="#c6b7cf" font-size="9" font-family="Arial,sans-serif" letter-spacing="1.6">{subtitle}</text>
      <text x="688" y="405" fill="{a}" font-size="9" font-family="Arial,sans-serif" text-anchor="end">FL / {label}</text>
    </svg>'''
    return svg

# Canonical dataset -> media category mapping. All actual images are locally bundled SVG illustrations.
files = ['characters','skins','abilities','maps','items','effects','emotes','lore','badges','events','updates','guides','tierlists']
created=[]
for ds in files:
    p=ROOT/'data'/f'{ds}.json'
    obj=json.loads(p.read_text(encoding='utf-8'))
    cat=ds
    for item in obj.get('items',[]):
        # stable local file path; no external asset hotlinks are retained.
        name=f"{ds}-{item.get('id','record')}.svg"
        rel=f"assets/images/archive/{name}"
        (IMG/name).write_text(create_svg(cat,item),encoding='utf-8')
        item['image']=rel
        item['imageCredit']='Illustrazione originale FogLabs in SVG; non è un render o screenshot ufficiale del gioco.'
        item['imageType']='original-archive-illustration'
        created.append(rel)
    obj.setdefault('meta',{})['imageCoverage']='all-items-have-local-original-illustration'
    p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Reuse generated assets in the category subsets so survivor/killer datasets stay in sync.
base=json.loads((ROOT/'data'/'characters.json').read_text(encoding='utf-8'))
byid={x['id']:x for x in base['items']}
for ds in ('survivors','killers'):
    p=ROOT/'data'/f'{ds}.json'; obj=json.loads(p.read_text(encoding='utf-8'))
    for item in obj.get('items',[]):
        canonical=byid.get(item['id'])
        if canonical:
            item['image']=canonical['image']
            item['imageCredit']=canonical['imageCredit']
            item['imageType']=canonical['imageType']
    obj.setdefault('meta',{})['imageCoverage']='all-items-have-local-original-illustration'
    p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Build the local fallback bundle.
import subprocess
subprocess.run(['python',str(ROOT/'tools'/'generate-local-bundle.py')],check=True)
print('Generated',len(created),'original local SVG illustrations')
