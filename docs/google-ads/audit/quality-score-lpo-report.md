# Google Ads 品質スコア監査 & LP改善レポート

**対象データ:** Ads Editor 全エクスポート（`docs/google-ads/exports/ads-editor-full-2026-07-23.tsv`）  
**監査日:** 2026-07-23  
**関連:** `kw-lp-mismatch-report.md`（Final URL / Path2 / RSAコピペ汚染）

---

## 結論（品質スコアが低い主因）

品質スコア付きキーワード **187件**のうち、**145件（約78%）が QS≤5**。

| 構成要素 | Below average | Average | Above average |
|---------|---------------|---------|---------------|
| **Landing page experience** | **131** | 56 | 0 |
| Expected CTR | 92 | 73 | 22 |
| Ad relevance | 33 | 61 | 93 |

**最大のボトルネックはランディングページ体験（LPE）**。広告関連性は相対的に良好（Above average が最多）で、Ad strength も Excellent/Good が多い。  
→ **Ads側の文言改善だけでは足りず、LPの意図一致・料金早期提示・テーマ別コンテンツが必須。**

最頻コンボ（41件）: `LPE=Below` × `CTR=Below` × `AdRel=Above`  
＝「広告は合っているが、着地LPの体験・関連性が弱い」典型パターン。

---

## 競合比較で足りないもの

調査対象例: INS出張車内清掃 / カーピカ / 煌・ドラゴン / ピカらく / キーパーラボ 等

| 競合の強み | 自社のギャップ（改善前） | 優先度 | 本PRでの対応 |
|-----------|-------------------------|--------|-------------|
| KW一致のH1（地域×サービス） | 多くのKW LPでH1が汎用 | **High** | 主要slugに `mainTitle` 追加 |
| 悩み別・メニュー別の料金が一目 | 料金表がページ下部、ACはオプションのみ | **High** | QuickFacts + ProcessGuide料金3段 |
| エアコン工法・工程のLP完結 | AC系の独自工程が薄い | **High** | `AdLpProcessGuide`（AC工程） |
| 消臭系の事例・限界明記 | 匂い3slugに事例が薄い | **High** | nicheCaseStudy + 限界FAQ |
| 通常清掃の階層メニュー | 緊急訴求が強く軽度意図とズレ | Med | `troubleType: light` + 基本/消臭の明示 |
| Before/After写真密度 | 事例は文章中心 | Med | （次パス任意） |
| 第三者口コミ・資格の前面配置 | 外部検証が薄い | Low | 未着手 |

---

## slug別 QS（地域横断）ワースト

| slug | 平均QS | Below LPE | 本PRでのLP対応 |
|------|--------|-----------|----------------|
| `kareisyu` / `chuko-kareisyu` | 1.0 / 3.0 | 各1 | H1・QF・AIO・ProcessGuide・事例 |
| `kuruma-nioitori` | 2.1 | 9/9 | H1・QF・ProcessGuide・事例・限界 |
| `ac-nioi` | 2.3 | 9/9 | 同上＋AC工程・料金3段 |
| `kuruma-nioi-keshi` | 2.8 | 17/19 | ProcessGuide・事例・FAQ |
| `car-ac-cleaning` | 2.9 | 9/9 | AC工程・含む/含まない明示 |
| `shanai-shoshu` | 4.0 | 11/20 | ProcessGuide・事例・緊急トーン抑制 |
| `evaporator-senjo` | 4.3 | 6/6 | 用語説明・工程・事例 |
| `seat-senjo` / `seat-cleaning` | 〜4.6–5.5 | 高 | 席数料金・素材FAQ・工程 |
| `pet-nioi` | 4.3 | 1/3 | QF・pet-odor共感・工程 |
| `interior-cleaning` | 6.7 | 1/3 | lightテーマ・基本/消臭階層 |
| `(Final URLなし)` | 4.5 | 31/50 | **Ads Editor側でURL必須** |

---

## Ads Editor側の必須修正（LP外・最優先）

詳細は `kw-lp-mismatch-report.md`。QS以前にCTR/関連性を削る。

1. **Final URL取り違え 12件**（例: 灯油AG → `pet-ke` LP）をテーマ一致URLへ
2. **Path 2「嘔吐ニオイ清掃」の横断流用 343件**をテーマ別パスへ
3. **説明文の「ペット毛」コピペ汚染 88件**をAGテーマ文言へ
4. **キーワード行に Final URL が空**のQS付きKW（50件）へテーマLPを設定
5. LOCATIONピンがキャンペーン都道府県と不一致の行を修正

---

## 本リポジトリで実施したLP修正

### Pass 1（臭気・ACの土台）
1. KW一致H1（`mainTitle`）をワーストslugへ追加
2. `AdLpQuickFacts`（料金・時間・エリアをAnswer直後）
3. `TroubleSympathy` のテーマ分岐（odor / ac / seat / tobacco / aging-odor）
4. `aioKeywordContent` のAC・匂い強化
5. 料金セクションをKW LPで早期配置

### Pass 2（競合ギャップの残課題）
1. **`AdLpProcessGuide`** — AC/消臭/シート/通常清掃の工程＋料金3段＋限界注記
2. **加齢臭・中古車加齢臭** — H1 / QuickFacts / FAQ / 事例
3. **シート系** — 席数料金FAQ・素材説明・事例
4. **ペット臭** — QuickFacts・`pet-odor`共感・工程
5. **通常清掃** — `troubleType: light`、基本洗浄≠消臭セットの明示
6. **緊急バッジ抑制** — 非緊急テーマは「緊急対応エリア拡大中」を出さない

---

## 期待効果と計測

- LPE「Below → Average」への改善には、広告流入後の滞在・直帰・CVも影響するため、**修正URLをAdsで再紐付け後 2〜4週間**でQS再確認
- 優先モニタリングKW: `車の匂い取り` / `車 消臭` / `車 エアコン臭い` / `車 エアコンクリーニング` / `車シート 洗浄` / `車 加齢臭`
- Ads側Mismatch修正後でないと、正しいテーマLPに着地せずLP改善効果が薄れる点に注意

---

## チェックリスト

### Google Ads Editor
- [ ] `kw-lp-mismatch-hard.csv` の suggested_url を適用
- [ ] Path2 をテーマ別に書き換え
- [ ] RSA説明文のテーマ汚染を除去
- [ ] QS付きKWの Final URL 空欄を埋める

### LP（本PR）
- [x] ワーストslugのH1・QuickFacts・テーマ共感
- [x] AC / 匂い取りの独自コンテンツ強化
- [x] 料金の早期表示
- [x] AC・消臭・シートの工程ガイド＋テーマ別料金3段
- [x] 加齢臭 / シート / ペット臭 / 通常清掃の残ギャップ対応
- [x] 非緊急テーマの緊急トーン抑制
- [ ] （任意）Before/After写真のLP埋め込み増加
- [ ] （任意）トラック hub の消臭意図強化
