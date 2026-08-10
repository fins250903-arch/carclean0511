# Google Ads キーワード ↔ LP ミスマッチ監査

**対象:** `ads-editor-full-2026-08-11.tsv`  
**形式:** フルアカウント（Keyword列あり） / 広告行 705 / キーワード行(URL付き) 1223  
**監査日:** 2026-08-10  
**再実行:** `npm run audit:ads-kw-lp -- <export.tsv|csv>`

---

## 結論（CTR低下の候補）

### ご心配の「嘔吐 → タバコLP」について

**該当なし（0件）。** 嘔吐系キーワードがタバコ系LP（`tabako-yani` / `chuko-tabako`）に直接紐づいているケースは検出されませんでした。

### ただし CRITICAL な取り違えは残存

1. **キーワード単位の Final URL が誤っている**（広告URLより**キーワードURLが優先**される）
   - 典型: **「車内 灯油 こぼし」→ `pet-ke`（ペット毛）** … 8件
   - 広告側は `touyu-kobosi` に直っていても、**キーワードに `pet-ke` が残っていると着地はペット毛LPのまま**
2. **同一AG内で KW URL ≠ 広告 URL** … 9件（詳細CSV参照）
3. Path 2 テーマ不一致 … 0件（前回より改善していれば 0 に近い）

| 指標 | 件数 |
|------|------|
| キーワード×URL 一致 | 808 |
| CRITICAL（異系統テーマ取り違え） | 8 |
| MEDIUM（近いテーマのずれ） | 75 |
| テーマ判定不能KW | 332 |
| KW↔広告URLコンフリクト | 9 |
| Path2不一致 | 0（うち嘔吐パス誤用広告行 0） |

---

## 1. CRITICAL — キーワードテーマ ≠ Final URL

| # | キャンペーン | 広告グループ | キーワード | 期待 | 実際LP | 修正先 |
|---|-------------|-------------|-----------|------|--------|--------|
| 1 | 大阪府＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/osaka/touyu-kobosi/ |
| 2 | 宮城県＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/miyagi/touyu-kobosi/ |
| 3 | 愛知県＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/aichi/touyu-kobosi/ |
| 4 | 千葉県＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/chiba/touyu-kobosi/ |
| 5 | 兵庫県＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/hyogo/touyu-kobosi/ |
| 6 | 福岡県＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/fukuoka/touyu-kobosi/ |
| 7 | 群馬県＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/gunma/touyu-kobosi/ |
| 8 | 栃木県＿車内クリーニング | 車内 灯油 こぼし | 車内 灯油 こぼし | 灯油 | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/tochigi/touyu-kobosi/ |

### CRITICAL パターン集計

| パターン | 件数 |
|---------|------|
| 灯油 → ペット毛 | 8 |

**最優先:** 灯油キーワードの Final URL を全地域 `/regions/{region}/touyu-kobosi/` に修正（キーワード行）。広告側だけ直しても着地は変わりません。

---

## 2. HIGH — 同一AG内 KW URL ≠ 広告 URL

Google Ads では **キーワードの Final URL が広告より優先**されます。

| キャンペーン | 広告グループ | KW側 | 広告側 | サンプルKW |
|-------------|-------------|------|--------|-----------|
| 大阪府＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |
| 宮城県＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |
| 愛知県＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |
| 千葉県＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |
| 兵庫県＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |
| 福岡県＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |
| 群馬県＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |
| 栃木県＿車内クリーニング | 車内 灯油 こぼし | ペット毛 (`pet-ke`) | 灯油 (`touyu-kobosi`) | 車内 灯油 こぼし |

全件: `kw-lp-kw-vs-ad-url-conflict.csv`（9行）

---

## 3. MEDIUM — 近接テーマのずれ（参考）

完全な異系統ではないが、1KW1LP方針からずれる例（上位）:

| パターン | 件数 |
|---------|------|
| シート洗浄 → 通常清掃 | 10 |
| ペットうんち → おしっこ | 9 |
| シート洗浄 → 車内臭い | 9 |
| 消臭脱臭 → 中古車タバコ | 9 |
| 嘔吐 → 消臭脱臭 | 8 |
| 嘔吐 → 通常清掃 | 5 |
| シートクリーニング → 通常清掃 | 5 |
| 汗 → 通常清掃 | 4 |
| ゲロ → 通常清掃 | 4 |
| 匂い取り → 通常清掃 | 3 |
| タバコ → 通常清掃 | 2 |
| カビ/湿気 → エアコン臭い | 1 |
| うんこ → 通常清掃 | 1 |
| 灯油 → 通常清掃 | 1 |
| おしっこ → 通常清掃 | 1 |
| 匂い消し → 通常清掃 | 1 |
| エアコン臭い → 通常清掃 | 1 |
| 保険嘔吐 → 車内臭い | 1 |

代表例:

- [大阪府＿車内クリーニング] 「車 シート 嘔吐 臭い」(嘔吐) → `shanai-shoshu`（消臭脱臭）
- [大阪府＿車内クリーニング] 「ペット 粗相 車 消臭」(ペットうんち) → `oshikko`（おしっこ）
- [大阪府＿車内クリーニング] 「車 湿気 臭い シート 洗浄」(シート洗浄) → `shanai-nioi`（車内臭い）
- [大阪府＿車内クリーニング] 「消臭 中古車」(消臭脱臭) → `chuko-tabako`（中古車タバコ）
- [沖縄県＿車内クリーニング] 「車 エアコン カビ」(カビ/湿気) → `ac-nioi`（エアコン臭い）
- [沖縄県＿車内クリーニング] 「嘔吐 臭い 消し 車」(嘔吐) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 シート 洗浄」(シート洗浄) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 の シート 犬 の うんち」(うんこ) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「シート 洗浄 業者 腐敗臭」(シート洗浄) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「タント 車内 汗 臭い 消 臭」(汗) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 の シート 洗浄」(シート洗浄) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 灯油 こぼした 臭い 消す」(灯油) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 シート 清掃 料金」(シートクリーニング) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 の シート に 嘔吐」(嘔吐) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「シート クリーニング」(シートクリーニング) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 の シート 洗浄 沖縄」(シート洗浄) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 シート 洗浄 業者」(シート洗浄) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「ヴェルファイア 車内 シート 洗浄」(シート洗浄) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 の シート 尿 臭」(おしっこ) → `interior-cleaning`（通常清掃）
- [沖縄県＿車内クリーニング] 「車 タバコ 消 臭」(タバコ) → `interior-cleaning`（通常清掃）

---

## 4. Path 2（表示URL）

不一致ユニーク: **0** / 嘔吐パス誤用広告行: **0**

今回のエクスポートでは Path 2 のテーマ汚染はほぼ解消されています。

---

## 修正チェックリスト（Google Ads Editor）

1. [ ] `kw-lp-mismatch-hard.csv` の CRITICAL 行で、**キーワードの Final URL** を `suggested_url` に変更
2. [ ] 灯油: KW・広告とも `touyu-kobosi` に揃える（KW側 `pet-ke` 残存に注意）
3. [ ] `kw-lp-kw-vs-ad-url-conflict.csv` で同一AGのURL二重設定を解消
4. [ ] 「車 シート 嘔吐 臭い」等、嘔吐を含むKWは `kyuto-cleaning` / `vomit-cleaning` へ
5. [ ] 「沖縄 レンタカー 嘔吐」は `hoken-kyuto` または `kyuto-cleaning` へ

---

## 期待される正しい対応（抜粋）

| テーマ | 正しい slug |
|--------|------------|
| 嘔吐 | `kyuto-cleaning` / `vomit-cleaning` |
| 灯油 | `touyu-kobosi` |
| ペット毛 | `pet-ke` |
| タバコヤニ | `tabako-yani` / `tobacco-odor` |
| 中古車タバコ | `chuko-tabako` |

サイト定義: `src/data/adKeywordPages.ts` / `src/data/lpAdPages.ts`  
Ads設計: `docs/google-ads/campaign-structure.md`
