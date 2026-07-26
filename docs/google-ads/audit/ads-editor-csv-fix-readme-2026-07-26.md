# Ads Editor CSV 修正パッケージ（2026-07-26）

## 成果物

| ファイル | 用途 |
|---------|------|
| `docs/google-ads/exports/ads-editor-fixed-full-2026-07-26.csv` | **完全版**（全行＋嘔吐KWの新規追加行） |
| `docs/google-ads/exports/ads-editor-fixed-changes-only-2026-07-26.csv` | 変更行のみ（確認・部分インポート用） |
| `docs/google-ads/audit/ads-editor-fix-log-2026-07-26.csv` | 変更ログ（フィールド単位） |
| `docs/google-ads/exports/ads-editor-source-2026-07-26-c4eb.tsv` | 元CSVのコピー |

形式は元ファイルと同じ **タブ区切り・UTF-8 BOM・CRLF** です（拡張子は `.csv`）。

## 修正内容（自動適用済み）

1. **Path 2** — 「嘔吐ニオイ清掃」「ペットうんち」「嘔吐クリニング」を着地slug別に置換（嘔吐系slugは維持/適正化）
2. **通常清掃5県** — RSA/KWの地域ハブURL → `/regions/{pref}/interior-cleaning/`
3. **おもらしKW** — Final URL → `/regions/{pref}/omorashi/`
4. **Enabled 空 Final URL** — 同一AGのRSA Final URLで補完
5. **ペット毛説明文** — 非 `pet-ke` の残5件をテーマ文言へ
6. **通常清掃内の嘔吐KW** — 元行を `Removed`、`車 嘔吐 クリーニング` へ **新規追加**（Final URL=`kyuto-cleaning`）

### Path2 対応表

| slug | Path 2 |
|------|--------|
| `ac-kusai` | エアコン臭い |
| `ac-nioi` | エアコン臭い |
| `ase` | 汗ニオイ清掃 |
| `bus-senmon` | バス清掃 |
| `car-ac-cleaning` | エアコン清掃 |
| `chuko-kareisyu` | 加齢臭消臭 |
| `chuko-tabako` | タバコ臭清掃 |
| `dengen-fuyou` | 電源持込不要 |
| `evaporator-senjo` | エバポ洗浄 |
| `hoken-kyuto` | 保険嘔吐清掃 |
| `interior-cleaning` | 車内清掃 |
| `kareisyu` | 加齢臭消臭 |
| `kodomo-kyuto` | 子供嘔吐清掃 |
| `kuruma-nioi-keshi` | 匂い消し |
| `kuruma-nioitori` | 匂い取り |
| `kyuto-cleaning` | 嘔吐ニオイ清掃 |
| `mobile-cleaning` | 出張清掃 |
| `omorashi` | おもらし清掃 |
| `oshikko` | おしっこ清掃 |
| `pet-ke` | ペット毛清掃 |
| `pet-nioi` | ペット臭消臭 |
| `pet-unko` | ペットうんち |
| `seat-cleaning` | シート清掃 |
| `seat-senjo` | シート洗浄 |
| `shanai-nioi` | 車内臭い |
| `shanai-shoshu` | 消臭脱臭洗浄 |
| `shutchou-senmon` | 出張専門 |
| `specialist-cleaning` | 専門店 |
| `tabako-yani` | タバコヤニ清掃 |
| `touyu-kobosi` | 灯油清掃 |
| `unko` | うんこ清掃 |
| `vomit-cleaning` | 嘔吐ニオイ清掃 |

## Ads Editor への入れ方（推奨）

1. Google Ads Editor で対象アカウントを取得（最新）
2. **アカウント全体のインポート前にバックアップ**（ファイル > エクスポート）
3. `ads-editor-fixed-full-2026-07-26.csv` をインポート  
   - または変更確認しやすい場合は `changes-only` を先に目視
4. インポート後、Editor の「インポートされた変更」で件数を確認
5. 特に確認:
   - Path 2 変更
   - Final URL 変更
   - キーワード Status=`Removed`（通常清掃の嘔吐KW）
   - キーワード新規（`車 嘔吐 クリーニング` / Comment=`ADDED_FROM_通常清掃`）
6. 問題なければ **投稿**

### 注意（KW移動）

Ads Editor は「Ad Group列を書き換えただけ」では移動が不安定なため、  
**旧KWを Removed + 新AGへ新規追加** にしています。  
投稿後、通常清掃側の嘔吐KWは Removed、嘔吐AG側に Enabled/Paused が追加されます。

## 検証結果（スクリプト）

- Path2横断残り: **0**
- 通常清掃ハブURL残り: **0**
- おもらしKW誤着地: **0**
- Enabled 空Final URL: **0**
- 通常清掃に残る嘔吐KW（Removed除く）: **0**
- ペット毛説明汚染: **0**
