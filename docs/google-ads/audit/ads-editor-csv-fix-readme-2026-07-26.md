# Ads Editor CSV 修正パッケージ（2026-07-26 / 回答反映・最終版）

## ユーザー回答
| Q | 回答 | 反映 |
|---|------|------|
| Q1 Paused空URL | A) 触らない | ✅ |
| Q2 おもらしAG | A) URLのみ | ✅ |
| Q3 壊れたネガティブ | B) 分割 | ✅ 32件Removed → 48ネガティブ追加 |
| Q4 群馬「…嘔吐 大阪」 | B) 群馬に修正 | ✅ ＋同キャンペーン内の誤地名も修正 |
| Q5 Path2 | おしっこ消臭でOK | ✅ |
| Q6 インポート | A) フルCSV | ✅ 推奨 |

## インポートファイル
**`docs/google-ads/exports/ads-editor-fixed-full-2026-07-26.csv`**

形式: タブ区切り / UTF-8 BOM / CRLF

付属:
- `ads-editor-fixed-changes-only-2026-07-26.csv`（確認用）
- `ads-editor-fix-log-2026-07-26.csv`（変更ログ）
- `ads-editor-source-2026-07-26-c4eb.tsv`（元データ）

## 修正サマリー
1. Path2横断をslug別に置換（おしっこ=`おしっこ消臭`）
2. 通常清掃ハブ → `interior-cleaning`
3. おもらしKW → `omorashi`
4. Enabled 空 Final URL 補完（Pausedは未変更）
5. ペット毛説明汚染除去
6. 通常清掃の嘔吐KW → Removed + `車 嘔吐 クリーニング` 追加
7. `嘔吐""灯油""エアコン` → `嘔吐` / `灯油` / `エアコン`
8. キャンペーンと不一致の地名トークンを都道府県名へ修正（群馬の大阪など）

### Path2
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
| `oshikko` | おしっこ消臭 |
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

## 手順
1. Ads Editorで最新取得＋バックアップ
2. フルCSVをインポート
3. Removed / 新規KW / Path2 / Final URL / ネガティブ分割を確認
4. 投稿
