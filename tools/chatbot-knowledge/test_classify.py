#!/usr/bin/env python3
"""Privacy and classification tests. Fixtures are synthetic."""

from __future__ import annotations

import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

sys.path.insert(0, str(Path(__file__).resolve().parent))
import classify_orders as kb  # noqa: E402


SECRET_NAME = "山田太郎"
SECRET_PHONE = "090-1234-5678"
SECRET_EMAIL = "taro@example.com"
SECRET_STREET = "中区栄1-2-3"


def order(**overrides):
    row = {
        "sheet": "2601",
        "segment": "orders",
        "request": "後部座席・２連席",
        "vehicle": "アルファード",
        "hearing": "",
        "note": "",
        "quote": "22000+7000",
        "revenue": 29000,
        "address": "愛知県名古屋市中区栄1-2-3",
        "power": "OK",
        "order_date": "2026-01-01",
        "hope_date": "2026-01-02",
    }
    row.update(overrides)
    return row


class ClassifyTests(unittest.TestCase):
    def test_vomit_minivan_rear_seat_and_price_sum(self):
        result = kb.classify_row(
            order(
                hearing=f"{SECRET_NAME} 友人の嘔吐。連絡は{SECRET_PHONE} {SECRET_EMAIL}。個人賠償保険利用。",
                note="オゾン消臭",
            )
        )
        self.assertEqual(result["model"], "アルファード")
        self.assertEqual(result["vehicle_class"], "minivan")
        self.assertEqual(result["primary_stain"], "嘔吐")
        self.assertEqual(result["scope"], "rear_seat")
        self.assertEqual(result["quote"], 29000)
        self.assertTrue(result["insurance"])
        self.assertTrue(result["third_party"])
        self.assertTrue(result["ozone"])
        self.assertEqual(result["prefecture"], "愛知県")
        blob = json.dumps(result, ensure_ascii=False)
        self.assertNotIn(SECRET_NAME, blob)
        self.assertNotIn("090", blob)
        self.assertNotIn(SECRET_EMAIL, blob)
        self.assertNotIn("栄", blob)
        self.assertNotIn(SECRET_STREET, blob)

    def test_phone_number_is_not_a_price(self):
        self.assertEqual(kb.parse_money(SECRET_PHONE), ("none", None))
        self.assertEqual(kb.parse_money("09012345678"), ("none", None))

    def test_fleet_quote_is_not_a_typical_price(self):
        self.assertEqual(kb.parse_money(1_000_000), ("large", 1_000_000))
        self.assertEqual(kb.parse_money("18000+4000+5000"), ("ok", 27000))

    def test_city_without_prefecture(self):
        self.assertEqual(kb.prefecture_of("春日井市牛山"), "愛知県")
        self.assertEqual(kb.prefecture_of("大阪府大阪市北区"), "大阪府")
        self.assertIsNone(kb.prefecture_of("港区"))

    def test_inuyama_is_not_a_pet_stain(self):
        result = kb.classify_row(order(address="犬山市", hearing="犬山市で子供が嘔吐", vehicle="タント", request="軽四車内全清掃"))
        self.assertEqual(result["prefecture"], "愛知県")
        self.assertEqual(result["primary_stain"], "嘔吐")
        self.assertNotIn("ペット", result["stains"])
        self.assertEqual(result["vehicle_class"], "kei")
        self.assertTrue(result["child"])

    def test_deadening_is_not_a_cleaning_stain(self):
        result = kb.classify_row(order(request="デッドニング", vehicle="オデッセイ", hearing="静音", quote=100000))
        self.assertEqual(result["service"], "deadening")
        self.assertEqual(result["scope"], "deadening")
        self.assertEqual(result["primary_stain"], "none")

    def test_kerosene_seat_price(self):
        result = kb.classify_row(order(request="独立1シートのみ", vehicle="ハリアー", hearing="灯油がシートに染みた", quote=30000))
        self.assertEqual(result["primary_stain"], "灯油")
        self.assertEqual(result["scope"], "single_seat")
        self.assertIn("30,000", kb.menu_hint("single_seat", "灯油") or "")

    def test_knowledge_omits_identity_and_guides_patterns(self):
        rows = []
        for index in range(4):
            rows.append(
                kb.classify_row(
                    order(
                        hearing=f"{SECRET_NAME} {SECRET_PHONE} 嘔吐 保険利用",
                        order_date=f"2026-01-0{index + 1}",
                        sheet="2601",
                    )
                )
            )
        payload = kb.build_knowledge(rows, ["2601", "加盟一覧"])
        text = json.dumps(payload, ensure_ascii=False)
        self.assertNotIn(SECRET_NAME, text)
        self.assertNotIn(SECRET_PHONE, text)
        self.assertNotIn("@", text)
        self.assertNotIn("栄", text)
        self.assertGreaterEqual(payload["orders"]["jobs"], 3)
        self.assertTrue(payload["answer_guides"])
        self.assertIn("都道府県", payload["answer_guides"][0])
        kb.assert_safe_tree(payload)

    def test_duplicate_rows_collapse_inside_a_sheet(self):
        classified = [kb.classify_row(order()) for _ in range(3)]
        kept, removed = kb.dedupe(classified)
        self.assertEqual(removed, 2)
        self.assertEqual(len(kept), 1)

    def test_refuses_public_directories(self):
        root = Path(__file__).resolve().parents[2]
        with self.assertRaises(ValueError):
            kb.assert_internal_output(root / "src" / "data" / "knowledge.json", root)
        with self.assertRaises(ValueError):
            kb.assert_internal_output(root / "public" / "knowledge.json", root)

    def test_xlsx_reader_drops_contact_columns(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "orders.xlsx"
            _write_fixture_xlsx(path)
            present, records = kb.load_workbook(path)
            self.assertIn("2601", present)
            self.assertIn("加盟一覧", present)
            self.assertEqual(len(records), 1)
            self.assertNotIn("顧客名", records[0])
            blob = json.dumps(records[0], ensure_ascii=False)
            self.assertNotIn(SECRET_NAME, blob)
            self.assertNotIn(SECRET_PHONE, blob)
            classified = kb.classify_row(records[0])
            self.assertEqual(classified["model"], "プリウス")
            self.assertEqual(classified["primary_stain"], "尿")
            self.assertEqual(classified["prefecture"], "大阪府")


def _sheet_xml(rows: list[list[str]]) -> str:
    body = []
    for row_index, values in enumerate(rows, start=1):
        cells = []
        for col_index, value in enumerate(values):
            letters = chr(ord("A") + col_index)
            cells.append(
                f'<c r="{letters}{row_index}" t="inlineStr"><is><t>{escape(value)}</t></is></c>'
            )
        body.append(f'<row r="{row_index}">{"".join(cells)}</row>')
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        f"<sheetData>{''.join(body)}</sheetData></worksheet>"
    )


def _write_fixture_xlsx(path: Path):
    files = {
        "[Content_Types].xml": """<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>""",
        "_rels/.rels": """<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>""",
        "xl/workbook.xml": """<?xml version="1.0" encoding="UTF-8"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>
<sheet name="2601" sheetId="1" r:id="rId1"/>
<sheet name="加盟一覧" sheetId="2" r:id="rId2"/>
</sheets></workbook>""",
        "xl/_rels/workbook.xml.rels": """<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
</Relationships>""",
        "xl/worksheets/sheet1.xml": _sheet_xml(
            [
                ["受注日", "顧客名", "連絡先", "郵便番号", "住所", "要望", "車種", "概算", "聞取り内容", "受注金額", "電源と水", "備考"],
                ["2026-01-03", SECRET_NAME, SECRET_PHONE, "530-0001", "大阪府大阪市北区", "独立1シートのみ", "プリウス", "18000", "高齢者のおもらし", "18000", "NO", ""],
            ]
        ),
        "xl/worksheets/sheet2.xml": _sheet_xml(
            [
                ["名称", "代表者", "連絡先", "メール", "住所"],
                ["サンプル店", SECRET_NAME, SECRET_PHONE, SECRET_EMAIL, "福岡県"],
            ]
        ),
    }
    with zipfile.ZipFile(path, "w") as archive:
        for name, content in files.items():
            archive.writestr(name, content)


if __name__ == "__main__":
    unittest.main()
