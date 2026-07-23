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

| 競合の強み | 自社のギャップ（改善前） | 優先度 |
|-----------|-------------------------|--------|
| KW一致のH1（地域×サービス） | 多くのKW LPでH1が「早急に解決！特急便」汎用 | **High** |
| 悩み別・メニュー別の料金が一目 | 料金表がページ下部、ACはオプション表記のみ | **High** |
| エアコン工法・工程のLP完結 | `car-ac-cleaning` / `ac-nioi` の独自本文が薄い | **High** |
| 通常清掃の階層メニュー | 緊急深層洗浄前提の訴求が強く、軽度意図とズレ | Med |
| Before/After写真密度 | 事例は文章中心、LP埋め込み写真が弱い | Med |
| 効果の限界・保証の明文化 | 「完全消臭」と成功率の両立が弱い箇所あり | Med |
| 第三者口コミ・資格の前面配置 | アンケート評価はあるが外部検証が薄い | Low |

---

## slug別 QS（地域横断）ワースト

| slug | 平均QS | Below LPE | 本PRでのLP対応 |
|------|--------|-----------|----------------|
| `kuruma-nioitori` | 2.1 | 9/9 | H1・deepTroubles・QuickFacts・AIO強化 |
| `ac-nioi` | 2.3 | 9/9 | 同上＋AC専用共感アイコン |
| `kuruma-nioi-keshi` | 2.8 | 17/19 | QuickFacts・FAQ・限界明記 |
| `car-ac-cleaning` | 2.9 | 9/9 | H1・料金・工程FAQ・事例 |
| `shanai-shoshu` | 4.0 | 11/20 | H1・テーマ共感・QuickFacts |
| `evaporator-senjo` | 4.3 | 6/6 | QuickFacts・FAQ |
| `seat-senjo` / `seat-cleaning` | 〜4.6–5.5 | 高 | H1・QuickFacts |
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

1. **KW一致H1 (`mainTitle`)**  
   `kuruma-nioitori` / `ac-nioi` / `car-ac-cleaning` / `shanai-shoshu` / `seat-cleaning` / `kareisyu` 等に追加
2. **`AdLpQuickFacts`**  
   料金・所要時間・エリア・電話/LINEをAnswer直後に表示（LPEの「必要な情報の見つけやすさ」）
3. **`TroubleSympathy` のテーマ分岐**  
   odor / ac / seat / tobacco / aging-odor でアイコンを切替（嘔吐テンプレの意図ズレ解消）
4. **`aioKeywordContent` 強化**  
   AC・匂い取りの定義・料金FAQ・限界説明・事例
5. **料金セクションをKW LPで早期配置**（Problem直後）
6. **`CAR_PRICING.acInternalWash`** を定数化し料金表と整合

---

## 期待効果と計測

- LPE「Below → Average」への改善には、広告流入後の滞在・直帰・CVも影響するため、**修正URLをAdsで再紐付け後 2〜4週間**でQS再確認
- 優先モニタリングKW: `車の匂い取り` / `車 消臭` / `車 エアコン臭い` / `車 エアコンクリーニング`
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
- [ ] （任意）Before/After写真のLP埋め込み増加
- [ ] （任意）通常清掃プランの明示階層化
