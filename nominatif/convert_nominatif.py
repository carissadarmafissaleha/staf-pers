import zipfile
import xml.etree.ElementTree as ET
import json
import csv
import re

xlsx_path = 'NOMINATIF_YONIF_735_BULAN_JULI_2026.FIXXX - TERBARU.xlsx'

def clean_val(v):
    if v is None:
        return ""
    v = str(v).strip()
    if v.endswith('.0') and v[:-2].isdigit():
        return v[:-2]
    return v

def clean_nrp(val):
    if not val:
        return ""
    val = str(val).strip()
    if 'E' in val or 'e' in val:
        try:
            return str(int(float(val)))
        except:
            return val
    if val.endswith('.0') and val[:-2].isdigit():
        return val[:-2]
    return val

with zipfile.ZipFile(xlsx_path) as z:
    # 1. Shared Strings
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root:
            texts = [t.text or '' for t in si.iter() if t.tag.endswith('}t')]
            ss.append(''.join(texts))

    # 2. Workbook & Sheets
    wb_root = ET.fromstring(z.read('xl/workbook.xml'))
    sheets_info = []
    for s in wb_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet'):
        sheets_info.append((s.get('name'), s.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')))

    rels_root = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rel_map = {r.get('Id'): r.get('Target') for r in rels_root.iter() if r.tag.endswith('}Relationship')}

    # List of kompi sheets to process
    kompi_sheets = ['POKPIM', 'KOMPI MARKAS', 'KIPAN A', 'KIPAN B', 'KIPAN C', 'KIBAN']

    all_positions = []
    personnel_list = []

    for sheet_name in kompi_sheets:
        target_id = [rId for name, rId in sheets_info if name == sheet_name]
        if not target_id:
            continue
        sheet_target = 'xl/' + rel_map[target_id[0]]
        s_root = ET.fromstring(z.read(sheet_target))

        # Detect headers dynamically
        # Row 7 is main header
        col_map = {}
        for r in s_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            r_idx = int(r.get('r'))
            if r_idx == 7:
                for c in r.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    ref = c.get('r')
                    col_letter = ''.join([ch for ch in ref if ch.isalpha()])
                    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    val = ''
                    if v is not None and v.text is not None:
                        val = ss[int(v.text)] if c.get('t') == 's' and v.text.isdigit() else v.text
                    col_map[col_letter] = val.strip()

        cur_peleton = ""
        cur_regu = ""

        for r in s_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            r_idx = int(r.get('r'))
            if r_idx < 10:
                continue

            cells = {}
            for c in r.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                ref = c.get('r')
                col_letter = ''.join([ch for ch in ref if ch.isalpha()])
                v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = ''
                if v is not None and v.text is not None:
                    val = ss[int(v.text)] if c.get('t') == 's' and v.text.isdigit() else v.text
                cells[col_letter] = val.strip()

            col_a = clean_val(cells.get('A', ''))
            col_e = cells.get('E', '').strip()

            # Heading detection
            if not col_a.isdigit() and col_e:
                # Check if it's a section header
                # If it's pure Roman numeral or Peleton / Si / Pokkoki
                if any(x in col_e.upper() for x in ['TON', 'POKKOKI', 'SIMAYON', 'SIINTEL', 'SIOPS', 'SIPERS', 'SILOG', 'RUPROV', 'KIMA', 'KIPAN', 'KIBAN', 'POKPIM', 'UNSUR']):
                    cur_peleton = col_e
                    cur_regu = ""
                elif any(x in col_e.upper() for x in ['RU', 'UNIT', 'POKKO', 'RURAD', 'RUMOR', 'RUSMR', 'RUTAN']):
                    cur_regu = col_e
                else:
                    cur_peleton = col_e
                continue

            # If it's a valid position row
            if col_a.isdigit() and col_e:
                name = cells.get('I', '').strip()
                status_ket = cells.get('W', '') or cells.get('V', '')
                is_filled = bool(name and name.upper() != 'NAMA' and name.upper() != 'KOSONG')

                # Column mapping:
                # A: URT, B: KI, C: TON, D: BAG
                # E: Jabatan TOP, F: Pkt TOP, G: Korps TOP, H: Kompi TOP
                # I: Nama, J: Pkt Nyata, K: Korps Nyata, L: NRP, M: TMT TNI, N: No Kep Jab, O: TMT Jab
                # P: No Kep Pkt, Q: TMT Pkt, R: Tempat Lahir, S: Tgl Lahir, T: Agama, U: Status Marital
                # V/W: No HP / Ket
                
                # Check if this sheet has NO HP in col V
                has_hp = ('NO HP' in col_map.get('V', '').upper())
                no_hp = cells.get('V', '').strip() if has_hp else ""
                ket = cells.get('W', '').strip() if has_hp else cells.get('V', '').strip()

                record = {
                    "kompi": sheet_name,
                    "peleton": cur_peleton,
                    "regu_atau_seksi": cur_regu,
                    "no_urut_batalyon": int(col_a),
                    "no_urut_kompi": int(clean_val(cells.get('B', '0')) or 0),
                    "no_urut_peleton": int(clean_val(cells.get('C', '0')) or 0),
                    "no_urut_bagian": int(clean_val(cells.get('D', '0')) or 0),
                    "jabatan_dsp": col_e,
                    "pangkat_dsp": cells.get('F', '').strip(),
                    "korps_dsp": cells.get('G', '').strip(),
                    "kompi_dsp": cells.get('H', '').strip(),
                    "status_jabatan": "Terisi" if is_filled else "Kosong",
                    "nama": name if is_filled else "",
                    "pangkat_nyata": cells.get('J', '').strip() if is_filled else "",
                    "korps_nyata": cells.get('K', '').strip() if is_filled else "",
                    "nrp": clean_nrp(cells.get('L', '')) if is_filled else "",
                    "tmt_tni": cells.get('M', '').strip() if is_filled else "",
                    "no_kep_jabatan": cells.get('N', '').strip() if is_filled else "",
                    "tmt_jabatan": cells.get('O', '').strip() if is_filled else "",
                    "no_kep_pangkat": cells.get('P', '').strip() if is_filled else "",
                    "tmt_pangkat": cells.get('Q', '').strip() if is_filled else "",
                    "tempat_lahir": cells.get('R', '').strip() if is_filled else "",
                    "tanggal_lahir": cells.get('S', '').strip() if is_filled else "",
                    "agama": cells.get('T', '').strip() if is_filled else "",
                    "status_pernikahan": cells.get('U', '').strip() if is_filled else "",
                    "no_hp": no_hp if is_filled else "",
                    "keterangan": ket
                }

                all_positions.append(record)
                if is_filled:
                    personnel_list.append(record)

    print(f"Total Formasi/Jabatan: {len(all_positions)}")
    print(f"Total Personil Terisi: {len(personnel_list)}")
    print(f"Total Jabatan Kosong: {len(all_positions) - len(personnel_list)}")

    # Write nominatif_personil.jsonl (Filled personnel only)
    with open('nominatif_personil.jsonl', 'w', encoding='utf-8') as f:
        for p in personnel_list:
            f.write(json.dumps(p, ensure_ascii=False) + '\n')

    # Write peta_jabatan_lengkap.jsonl (All positions, both filled and empty)
    with open('peta_jabatan_lengkap.jsonl', 'w', encoding='utf-8') as f:
        for p in all_positions:
            f.write(json.dumps(p, ensure_ascii=False) + '\n')

    # Write JSON array
    with open('nominatif_personil.json', 'w', encoding='utf-8') as f:
        json.dump(personnel_list, f, ensure_ascii=False, indent=2)

    # Write CSV
    if personnel_list:
        keys = list(personnel_list[0].keys())
        with open('nominatif_personil.csv', 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(personnel_list)

    print("Successfully exported all files!")
