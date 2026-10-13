#!/usr/bin/env python3
"""Normal Onyx consolidation report from ticket-level CSV/Excel.

Expected columns (names matched case-insensitively, aliases allowed):
  Client, Sub-Contractor|Subcontractor|Sub Contractor,
  Job Type|JobType, Staff Requested|Requested,
  Staff Sent|Sent, Saved|Total Saved, GSF Sent|AFAD Sent

Usage:
  python3 onyx_consolidate.py input.csv [output.xlsx]
"""
import sys, csv, re
from collections import defaultdict
from pathlib import Path

ALIASES = {
    'client': ['client'],
    'sub': ['sub-contractor','subcontractor','sub contractor','sub'],
    'job_type': ['job type','jobtype','job_type'],
    'req': ['staff requested','requested','total staff requested'],
    'sent': ['staff sent','sent','total staff sent'],
    'saved': ['saved','total saved'],
    'gsf': ['gsf sent','afad sent','gsf'],
}

def norm(s): return re.sub(r'\s+', ' ', (s or '').strip().lower())

def map_headers(fieldnames):
    mapped = {}
    for key, aliases in ALIASES.items():
        for f in fieldnames:
            if norm(f) in aliases:
                mapped[key] = f
                break
    missing = [k for k in ALIASES if k not in mapped]
    if missing:
        raise SystemExit(f'Missing columns for {missing}. Found: {fieldnames}')
    return mapped

def to_int(v):
    try: return int(float(str(v).replace(',','').strip() or 0))
    except: return 0

def consolidate(rows, col):
    groups = defaultdict(list)
    for r in rows:
        client = (r[col['client']] or '').strip()
        sub = (r[col['sub']] or '').strip()
        if sub.lower() == client.lower():
            sub = ''
        groups[(client, sub)].append(r)
    out = []
    for (client, sub), items in sorted(groups.items(), key=lambda x: (x[0][0].lower(), x[0][1].lower())):
        jt = defaultdict(int)
        for r in items:
            jt[(r[col['job_type']] or '').strip() or '(blank)'] += 1
        job_type = '; '.join(f'{n} {name}' for name,n in sorted(jt.items(), key=lambda x: (-x[1], x[0])))
        out.append({
            'Client': f'{len(items)} {client}',
            'Sub-Contractor': f'{len(items)} {sub}' if sub else '',
            'Job Type': job_type,
            'Staff Requested': sum(to_int(r[col['req']]) for r in items),
            'Staff Sent': sum(to_int(r[col['sent']]) for r in items),
            'Saved': sum(to_int(r[col['saved']]) for r in items),
            'GSF Sent': sum(to_int(r[col['gsf']]) for r in items),
        })
    return out

def main():
    if len(sys.argv) < 2:
        print(__doc__); return
    src = Path(sys.argv[1])
    dest = Path(sys.argv[2]) if len(sys.argv)>2 else src.with_name(src.stem + '_consolidated.xlsx')
    with src.open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        col = map_headers(reader.fieldnames)
        rows = list(reader)
    consol = consolidate(rows, col)
    try:
        from openpyxl import Workbook
        from openpyxl.styles import Font, PatternFill, Border, Side
        wb = Workbook(); ws = wb.active; ws.title = 'Consolidation Report'
        headers = list(consol[0].keys()) if consol else ['Client','Sub-Contractor','Job Type','Staff Requested','Staff Sent','Saved','GSF Sent']
        ws.append(headers)
        for row in consol: ws.append([row[h] for h in headers])
        totals = ['Totals','','', sum(r['Staff Requested'] for r in consol), sum(r['Staff Sent'] for r in consol),
                  sum(r['Saved'] for r in consol), sum(r['GSF Sent'] for r in consol)]
        ws.append(totals)
        wb.save(dest)
        print('Wrote', dest)
    except ImportError:
        dest = dest.with_suffix('.csv')
        with dest.open('w', newline='', encoding='utf-8') as f:
            w = csv.DictWriter(f, fieldnames=list(consol[0].keys()))
            w.writeheader(); w.writerows(consol)
        print('Wrote', dest)

if __name__ == '__main__':
    main()
