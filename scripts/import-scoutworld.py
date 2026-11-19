#!/usr/bin/env python3
"""Import only L2 location facts from a pinned local Scoutworld checkout.
Usage: python scripts/import-scoutworld.py SCOUTWORLD FLAG_ICONS_DIR
FLAG_ICONS_DIR is the flag-icons npm package directory (contains flags/4x3).
"""
import json, math, re, shutil, sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
source, flags = map(Path, sys.argv[1:])
out_dir = ROOT / 'public/static/flags-v1'
aliases = {'HK': 'hong-kong', 'JP': 'japan', 'CA': 'canada'}

def projected(lon, lat):
    angle = math.asin(math.sqrt(3) / 2 * math.sin(math.radians(lat)))
    a2, a6 = angle**2, angle**6
    x = math.radians(lon) * math.cos(angle) / ((math.sqrt(3) / 2) * (1.340264 + 3 * -.081106 * a2 + a6 * (7 * .000893 + 9 * .003796 * a2)))
    y = angle * (1.340264 - .081106 * a2 + a6 * (.000893 + .003796 * a2))
    return [round(480 + 168 * x, 2), round(232 - 168 * y, 2)]

# Official WOSM thumbnail references are optional, outbound links only. A
# directory image is an emblem reference, not an association flag or a licence.
def emblem_ref(value):
    if not value or not re.fullmatch(r'https://www\.scout\.org/sites/default/files/styles/thumbnail/public/organizations/logos/\d+/[A-Za-z0-9._~%()!+,\-]+\.(?:png|jpe?g|webp)(?:\?itok=[A-Za-z0-9_-]+)?', value, re.I):
        return ''
    parts = urlsplit(value)
    if parts.netloc != 'www.scout.org':
        return ''
    return parts.path + ('?' + parts.query if parts.query else '')

listings = []
seen = set()
for area in ('africa', 'americas', 'arab', 'asia-pacific', 'europe'):
    for record in json.loads((source / 'data' / area / 'region.json').read_text(encoding='utf-8')):
        code = record['id']
        assert re.fullmatch('[A-Z]{2}', code) and code not in seen, code
        seen.add(code)
        lon, lat = record['lng'], record['lat']
        assert -180 <= lon <= 180 and -90 <= lat <= 90
        assert all(isinstance(record[key], str) and record[key].strip() for key in ('country','countryEn','org','orgFull','flag'))
        flag_code = ''.join(chr(ord(c) - 0x1F1E6 + 97) for c in record['flag'] if 0x1F1E6 <= ord(c) <= 0x1F1FF)
        assert re.fullmatch('[a-z]{2}', flag_code)
        assert (flags / 'flags/4x3' / f'{flag_code}.svg').is_file(), flag_code
        listings.append([aliases.get(code, code.lower()), code, record['country'], record['countryEn'], area, lon, lat, record['orgFull'], flag_code, projected(lon, lat), record['org'], emblem_ref(record.get('logoUrl'))])
assert len(listings) == 176, 'Unexpected snapshot size; review upstream changes before updating expected count'
out_dir.mkdir(parents=True, exist_ok=True)
for code in sorted({row[8] for row in listings}):
    shutil.copyfile(flags / 'flags/4x3' / f'{code}.svg', out_dir / f'{code}.svg')
shutil.copyfile(flags / 'LICENSE', ROOT / 'public/static/licenses/LICENSE-flag-icons.txt')
version = json.loads((ROOT / 'package.json').read_text())['version']
(ROOT / f'public/scout-regions-v{version}.js').write_text(f'// BadgeHouse v{version} · Minimal Scoutworld L2 snapshot. See CREDITS.md.\nexport const scoutRows=' + json.dumps(listings, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
