# Google Ads キーワード／広告グループ ↔ LP ミスマッチ監査

**対象:** Ads Editor RSAエクスポート（`ads-editor-rsa-2026-07-23.tsv`）  
**件数:** 広告行 720 / 監査日: 2026-07-23  
**再実行:** `node scripts/audit-ads-kw-lp-mismatch.mjs <export.tsv>`

---

## 結論（CTR低下の候補）

1. **CRITICAL: Final URLの取り違え**が 12 件（広告グループ単位・ユニーク）
   - 典型: **「灯油」AG → `pet-ke`（ペット毛）LP** — 検索意図とLPが完全不一致
   - 典型: **「嘔吐」AG → `shutchou-senmon` / `kuruma-nioi-keshi`** — 嘔吐検索者に別テーマLP
2. **HIGH: 表示パス Path 2 のテーマ不一致**が 343 件
   - 特に Path 2「**嘔吐ニオイ清掃**」が嘔吐以外のLP（タバコ・汗・シート等）に大量流用
   - 広告プレビュー上の関連性が崩れ、**CTR低下の直接要因**になりやすい
3. **MEDIUM: 説明文のコピペ汚染**（他テーマ「ペット毛」文言）が 88 件
4. **MEDIUM: LOCATIONピンとキャンペーン地域の不一致**が 14 件

> 注: 本CSVは**キーワード行ではなくRSA広告行**です。1KW1LP運用でも、Ads側は「1テーマ1AG・複数KW→同一テーマLP」構成（`docs/google-ads/campaign-structure.md`）のため、**Ad Group名 ≒ キーワードテーマ**として検証しています。

---

## 1. CRITICAL — Ad Group テーマ ≠ Final URL

| # | キャンペーン | 広告グループ | 期待テーマ | 実際のLP | 修正先URL例 |
|---|-------------|-------------|-----------|---------|------------|
| 1 | 大阪府＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/osaka/touyu-kobosi/ |
| 2 | 宮城県＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/miyagi/touyu-kobosi/ |
| 3 | 宮城県＿車内クリーニング | AG_緊急_嘔吐 | 嘔吐/ゲロ (`kyuto-cleaning|vomit-cleaning|gero-cleaning`) | 出張専門 (`shutchou-senmon`) | https://carinteriorcleaning.jp/regions/miyagi/kyuto-cleaning/ |
| 4 | 愛知県＿車内クリーニング | int愛知_通常清掃 | 通常清掃 (`interior-cleaning`) | 出張専門 (`shutchou-senmon`) | https://carinteriorcleaning.jp/regions/aichi/interior-cleaning/ |
| 5 | 愛知県＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/aichi/touyu-kobosi/ |
| 6 | 千葉県＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/chiba/touyu-kobosi/ |
| 7 | 兵庫県＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/hyogo/touyu-kobosi/ |
| 8 | 福岡県＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/fukuoka/touyu-kobosi/ |
| 9 | 群馬県＿車内クリーニング | int群馬_通常清掃 | 通常清掃 (`interior-cleaning`) | 匂い消し (`kuruma-nioi-keshi`) | https://carinteriorcleaning.jp/regions/gunma/interior-cleaning/ |
| 10 | 群馬県＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/gunma/touyu-kobosi/ |
| 11 | 群馬県＿車内クリーニング | AG_緊急_嘔吐 | 嘔吐/ゲロ (`kyuto-cleaning|vomit-cleaning|gero-cleaning`) | 匂い消し (`kuruma-nioi-keshi`) | https://carinteriorcleaning.jp/regions/gunma/kyuto-cleaning/ |
| 12 | 栃木県＿車内クリーニング | 車内 灯油 こぼし | 灯油 (`touyu-kobosi`) | ペット毛 (`pet-ke`) | https://carinteriorcleaning.jp/regions/tochigi/touyu-kobosi/ |

### パターン集計

| パターン | 件数 |
|---------|------|
| 灯油 → ペット毛 | 8 |
| 嘔吐/ゲロ → 出張専門 | 1 |
| 通常清掃 → 出張専門 | 1 |
| 通常清掃 → 匂い消し | 1 |
| 嘔吐/ゲロ → 匂い消し | 1 |

**最優先修正:** 「車内 灯油 こぼし」→ Final URL を `/regions/{region}/touyu-kobosi/` に統一（現状 `pet-ke` になっている地域が複数）。

---

## 2. HIGH — Path 2（表示URL）テーマ不一致

広告の表示パスがLPテーマと食い違うと、検索結果上で「意図と違うサービス」に見えCTRが落ちます。

### 頻出パターン

| パターン | 件数 |
|---------|------|
| Path2「嘔吐ニオイ清掃」→ LP「匂い消し」 | 28 |
| Path2「嘔吐ニオイ清掃」→ LP「車内臭い」 | 27 |
| Path2「嘔吐ニオイ清掃」→ LP「おしっこ」 | 27 |
| Path2「嘔吐ニオイ清掃」→ LP「エバポ」 | 27 |
| Path2「嘔吐ニオイ清掃」→ LP「出張専門」 | 20 |
| Path2「嘔吐ニオイ清掃」→ LP「中古車タバコ」 | 19 |
| Path2「嘔吐ニオイ清掃」→ LP「ペット毛」 | 17 |
| Path2「嘔吐ニオイ清掃」→ LP「灯油」 | 16 |
| Path2「嘔吐ニオイ清掃」→ LP「汗」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「中古車加齢臭」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「おもらし」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「エアコン臭い」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「加齢臭」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「ペット臭」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「シート洗浄」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「シートクリーニング」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「うんこ」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「タバコヤニ」 | 9 |
| Path2「ペットうんち」→ LP「匂い消し」 | 9 |
| Path2「嘔吐ニオイ清掃」→ LP「匂い取り」 | 8 |

**推奨:** Path 2 を LP / AG テーマに合わせる（例: タバコAGなら `タバコ消臭`、灯油なら `灯油こぼし`、シートなら `シート洗浄`）。汎用の「嘔吐ニオイ清掃」の横断流用をやめる。

詳細: `kw-lp-mismatch-path2.csv`（343 行）  
うち Path2 に「嘔吐」を含む不一致広告行: **461**

---

## 3. MEDIUM — 説明文のテーマ汚染

説明文に「ペット毛」が残ったまま、別テーマAG/LPに紐づいている例: **88** AG

代表例:

- [大阪府＿車内クリーニング] AG「車 嘔吐 クリーニング」→ `kyuto-cleaning` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「車内 消臭・脱臭洗浄」→ `shanai-shoshu` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「車 匂い 消し・消臭洗浄」→ `kuruma-nioi-keshi` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「車 エアコンクリーニング」→ `car-ac-cleaning` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「AG_緊急_子供嘔吐」→ `kodomo-kyuto` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「AG_消臭_湿気カビ」→ `shanai-nioi` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「AG_条件_電源不要」→ `dengen-fuyou` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「AG_バス_トラック」→ `bus-senmon` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「緊急_灯油」→ `touyu-kobosi` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「緊急_ペット」→ `oshikko` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [大阪府＿車内クリーニング] AG「エアコン_エバポレーター」→ `evaporator-senjo` … 大阪府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [宮城県＿車内クリーニング] AG「車 嘔吐 クリーニング」→ `kyuto-cleaning` … 宮城府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [宮城県＿車内クリーニング] AG「車内 消臭・脱臭洗浄」→ `shanai-shoshu` … 宮城府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [宮城県＿車内クリーニング] AG「車 匂い 消し・消臭洗浄」→ `kuruma-nioi-keshi` … 宮城府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…
- [宮城県＿車内クリーニング] AG「車 エアコンクリーニング」→ `car-ac-cleaning` … 宮城府で車ペット毛の臭いや汚れにお困りなら。専用洗剤とプロの技術で徹底除去。 車内の車ペット毛は放置すると悪化します。今…

---

## 4. MEDIUM — LOCATION ピン不一致

| キャンペーン | 広告グループ | ピン | URL |
|-------------|-------------|------|-----|
| 大阪府＿車内クリーニング | 車 嘔吐 クリーニング | 愛知 | https://carinteriorcleaning.jp/regions/osaka/kyuto-cleaning/ |
| 大阪府＿車内クリーニング | 車 エアコンクリーニング | 愛知 | https://carinteriorcleaning.jp/regions/osaka/car-ac-cleaning/ |
| 宮城県＿車内クリーニング | 車 嘔吐 クリーニング | 愛知 | https://carinteriorcleaning.jp/regions/miyagi/kyuto-cleaning/ |
| 宮城県＿車内クリーニング | 車 エアコンクリーニング | 愛知 | https://carinteriorcleaning.jp/regions/miyagi/car-ac-cleaning/ |
| 千葉県＿車内クリーニング | 車 嘔吐 クリーニング | 愛知 | https://carinteriorcleaning.jp/regions/chiba/kyuto-cleaning/ |
| 千葉県＿車内クリーニング | 車 エアコンクリーニング | 愛知 | https://carinteriorcleaning.jp/regions/chiba/car-ac-cleaning/ |
| 兵庫県＿車内クリーニング | 車 嘔吐 クリーニング | 愛知 | https://carinteriorcleaning.jp/regions/hyogo/kyuto-cleaning/ |
| 兵庫県＿車内クリーニング | 車 エアコンクリーニング | 愛知 | https://carinteriorcleaning.jp/regions/hyogo/car-ac-cleaning/ |
| 福岡県＿車内クリーニング | 車 嘔吐 クリーニング | 愛知 | https://carinteriorcleaning.jp/regions/fukuoka/kyuto-cleaning/ |
| 福岡県＿車内クリーニング | 車 エアコンクリーニング | 愛知 | https://carinteriorcleaning.jp/regions/fukuoka/car-ac-cleaning/ |
| 群馬県＿車内クリーニング | 車 嘔吐 クリーニング | 愛知 | https://carinteriorcleaning.jp/regions/gunma/kyuto-cleaning/ |
| 群馬県＿車内クリーニング | 車 エアコンクリーニング | 愛知 | https://carinteriorcleaning.jp/regions/gunma/car-ac-cleaning/ |
| 栃木県＿車内クリーニング | 車 嘔吐 クリーニング | 愛知 | https://carinteriorcleaning.jp/regions/tochigi/kyuto-cleaning/ |
| 栃木県＿車内クリーニング | 車 エアコンクリーニング | 愛知 | https://carinteriorcleaning.jp/regions/tochigi/car-ac-cleaning/ |

---

## 修正チェックリスト（Google Ads Editor）

1. [ ] `kw-lp-mismatch-hard.csv` の `suggested_url` で Final URL を一括修正
2. [ ] 灯油AGは全地域で `touyu-kobosi` になっているか再確認
3. [ ] 嘔吐AG（`AG_緊急_嘔吐` / `車 嘔吐 クリーニング`）は `kyuto-cleaning` または `vomit-cleaning` のみ
4. [ ] Path 2 をテーマ別に書き換え（嘔吐パスの横断流用を停止）
5. [ ] 説明文の「ペット毛」「中古車タバコ」等のコピペ残骸をAGテーマに合わせて差し替え
6. [ ] LOCATION(City) ピンがキャンペーン都道府県と一致しているか確認

---

## 期待される正しい対応（抜粋）

| テーマ | 正しい slug |
|--------|------------|
| 嘔吐 | `kyuto-cleaning` / `vomit-cleaning` |
| 灯油 | `touyu-kobosi` |
| ペット毛 | `pet-ke` |
| タバコヤニ | `tabako-yani` / `tobacco-odor` |
| 中古車タバコ | `chuko-tabako` |
| 匂い消し | `kuruma-nioi-keshi` / `odor-removal` |

サイト定義: `src/data/adKeywordPages.ts` / `src/data/lpAdPages.ts`  
Ads設計: `docs/google-ads/campaign-structure.md`
