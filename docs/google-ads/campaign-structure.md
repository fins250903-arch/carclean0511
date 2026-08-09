# Google Ads キャンペーン・広告グループ設計書（v2）

**対象:** 車内清掃「特急便」  
**重点6地域:** 千葉・愛知・大阪・兵庫・福岡・**沖縄**  
**更新:** 2026-06-12（地域別キャンペーン + テーマ別AG へ再設計）

---

## 設計方針（LPと広告の役割分担）

| レイヤー | 構成 | 目的 |
|---------|------|------|
| **LP（サイト）** | 1キーワード = 1URL（29 slug × 23地域） | SEO・Quality Score・検索意図への完全一致 |
| **広告（Google Ads）** | **1地域 = 1キャンペーン**、**1テーマ = 1広告グループ**、**複数KW → 同一テーマLP** | Smart Bidding の学習データ集約 |

詳細判断は [strategy-lp-vs-ads.md](./strategy-lp-vs-ads.md) を参照。

---

## キャンペーン一覧（6本）

| キャンペーン | 予算比率 | 地域ターゲット |
|-------------|---------|---------------|
| 千葉_車内清掃 | 16% | 千葉県 |
| 愛知_車内清掃 | 16% | 愛知県 |
| 大阪_車内清掃 | 18% | 大阪府 |
| 兵庫_車内清掃 | 16% | 兵庫県 |
| 福岡_車内清掃 | 16% | 福岡県 |
| **沖縄_車内清掃** | **18%** | 沖縄県（本島） |

---

## 広告グループ（地域キャンペーン共通・最大11AG）

| Ad Group | テーマ | 最終URL（例: 沖縄） | 入札上限 | 備考 |
|----------|--------|-------------------|---------|------|
| AG_緊急_嘔吐 | 嘔吐・ゲロ | `/regions/okinawa/kyuto-cleaning/` | 350円 | 全地域 |
| AG_緊急_子供嘔吐 | 子供車酔い | `/regions/okinawa/kodomo-kyuto/` | 350円 | 全地域 |
| AG_緊急_灯油 | 灯油こぼし | `/regions/chiba/touyu-kobosi/` 等 | 350円 | **沖縄は除外**（需要低） |
| AG_緊急_ペット | 尿・粗相 | `/regions/okinawa/oshikko/` | 320円 | 全地域 |
| AG_消臭_口語 | 匂い消し・スプレー効かない | `/regions/okinawa/kuruma-nioi-keshi/` | 280円 | 全地域 |
| AG_消臭_中古車 | タバコ・加齢臭 | `/regions/okinawa/chuko-tabako/` | 300円 | 全地域 |
| AG_消臭_湿気カビ | カビ・湿気臭 | `/regions/okinawa/shanai-nioi/` | 300円 | **沖縄は厚く** |
| AG_エアコン_エバポレーター | エアコン・エバポレーター | `/regions/okinawa/evaporator-senjo/` | 400円 | **沖縄は通年+50%** |
| AG_条件_出張 | 即日・料金・おすすめ | `/regions/okinawa/shutchou-senmon/` | 280円 | 全地域 |
| AG_条件_電源不要 | 電源・水道不要 | `/regions/chiba/dengen-fuyou/` 等 | 280円 | **沖縄は除外**（電源お借り要） |
| AG_保険_B2B | 保険・レンタカー | `/regions/okinawa/hoken-kyuto/` | 250円 | 全地域 |
| AG_バス_トラック | 商用車 | `/regions/okinawa/bus-senmon/` | 200円 | 沖縄・千葉・大阪・福岡 |

---

## 沖縄キャンペーン特記事項

1. **訴求:** 高湿度・カビ臭・エアコン臭（通年冷房）を前面に
2. **除外AG:** `AG_緊急_灯油`, `AG_条件_電源不要`（沖縄は電源・水道をお借りする表記）
3. **追加KW:** 那覇・沖縄本島・レンタカー嘔吐（`keywords-longtail.csv` 参照）
4. **広告文:** 「電源不要」見出しは使わず「那覇・本島全域即日」「湿気・カビ臭専門」を使用

---

## キーワードCSV

- [keywords-longtail.csv](./keywords-longtail.csv) — 335行（6地域 × テーマ別KW）
- 再生成: `npm run export:google-ads-keywords`

---

## 入札・最適化

- Phase 1: 手動CPC（[bidding-rules.md](./bidding-rules.md) 参照）
- 1AGあたり週15クリック以上を目安（データが溜まってから tCPA へ）
- 除外KW: [negative-keywords.csv](./negative-keywords.csv)

---

## 関連ファイル

- 戦略判断: [strategy-lp-vs-ads.md](./strategy-lp-vs-ads.md)
- 広告文: [ad-copy-rsa.md](./ad-copy-rsa.md)
- CV計測: [conversion-tracking-setup.md](./conversion-tracking-setup.md)
- **KW/AG ↔ LP ミスマッチ監査:** [audit/kw-lp-mismatch-report.md](./audit/kw-lp-mismatch-report.md)（再実行: `npm run audit:ads-kw-lp -- docs/google-ads/exports/<file>.tsv`）
